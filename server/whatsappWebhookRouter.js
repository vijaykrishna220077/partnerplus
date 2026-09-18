import express from 'express';
import { createClient } from '@supabase/supabase-js';

export const whatsappWebhookRouter = express.Router();

// Initialize Supabase admin client if environment keys exist
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Format raw phone number into clean E.164 format for India
 */
function formatE164Phone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return digits;
  return digits;
}

/**
 * 1. GET /api/whatsapp/webhook — Meta Webhook Verification Handshake
 */
whatsappWebhookRouter.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'partnerplus_whatsapp_webhook_secret_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[Meta WhatsApp Webhook] Handshake verified successfully!');
    return res.status(200).send(challenge);
  }

  console.warn('[Meta WhatsApp Webhook] Verification token mismatch:', { received: token, expected: expectedToken });
  return res.status(403).json({ error: 'Verification token mismatch' });
});

/**
 * 2. POST /api/whatsapp/webhook — Meta Incoming Webhook Events Receiver
 * Ingests incoming status receipts (sent, delivered, read, failed) & inbound user messages into Supabase whatsapp_notifications
 */
whatsappWebhookRouter.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (!body || body.object !== 'whatsapp_business_account') {
      return res.status(404).json({ error: 'Not a WhatsApp Business Account event' });
    }

    // Acknowledge Meta immediately (200 OK)
    res.status(200).send('EVENT_RECEIVED');

    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field === 'messages') {
          const value = change.value || {};
          const messages = value.messages || [];
          const statuses = value.statuses || [];

          // A. Process Inbound Messages from User's Real WhatsApp
          for (const msg of messages) {
            const fromPhone = formatE164Phone(msg.from);
            const wamid = msg.id;
            const timestamp = new Date(parseInt(msg.timestamp) * 1000).toISOString();
            let textBody = '';

            if (msg.type === 'text') {
              textBody = msg.text?.body || '';
            } else if (msg.type === 'image') {
              textBody = `📷 [Image received]: ${msg.image?.caption || 'Image attached'}`;
            } else if (msg.type === 'location') {
              textBody = `📍 [Location shared]: ${msg.location?.latitude}, ${msg.location?.longitude}`;
            } else {
              textBody = `[Interactive message: ${msg.type}]`;
            }

            console.log(`[Meta Webhook] Inbound message from +${fromPhone}: ${textBody}`);

            if (supabase) {
              await supabase.from('whatsapp_webhook_events').insert({
                event_type: 'incoming_message',
                wamid,
                phone_number: fromPhone,
                raw_event: body
              }).catch(err => console.warn('Webhook event audit log err:', err));
            }
          }

          // B. Process Outbound Status Receipts (sent, delivered, read, failed)
          for (const statusObj of statuses) {
            const wamid = statusObj.id;
            const newStatus = statusObj.status; // 'sent' | 'delivered' | 'read' | 'failed'
            const timestamp = new Date(parseInt(statusObj.timestamp) * 1000).toISOString();

            console.log(`[Meta Webhook] Status receipt for ${wamid}: ${newStatus}`);

            if (supabase) {
              const updatePayload = { status: newStatus };
              if (newStatus === 'sent') updatePayload.sent_at = timestamp;
              if (newStatus === 'delivered') updatePayload.delivered_at = timestamp;
              if (newStatus === 'read') updatePayload.read_at = timestamp;
              if (newStatus === 'failed') updatePayload.failed_at = timestamp;

              await supabase
                .from('whatsapp_notifications')
                .update(updatePayload)
                .eq('whatsapp_message_id', wamid)
                .catch(err => console.warn('Notification status update err:', err));
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[Meta Webhook Error]:', err);
  }
});

/**
 * 3. POST /api/notifications/dispatch — Transactional Event Notification Dispatcher
 * Checks idempotency_key, sends via Meta Cloud API, logs to whatsapp_notifications
 */
whatsappWebhookRouter.post('/dispatch', async (req, res) => {
  try {
    const { 
      eventType, 
      recipientPhone, 
      recipientName = 'User', 
      recipientRole = 'customer', 
      bookingId, 
      messageText, 
      templateName = 'CUSTOM_TEXT',
      userId,
      parameters = {} 
    } = req.body;

    if (!recipientPhone || !eventType) {
      return res.status(400).json({ error: 'recipientPhone and eventType are required' });
    }

    const cleanPhone = formatE164Phone(recipientPhone);
    const idempotencyKey = `${eventType}_${bookingId || 'global'}_${cleanPhone}`;

    // 1. Idempotency check in Supabase
    if (supabase) {
      const { data: existing } = await supabase
        .from('whatsapp_notifications')
        .select('*')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      if (existing) {
        console.log(`[Idempotency Safeguard] Notification ${idempotencyKey} already dispatched. Skipping duplicate.`);
        return res.status(200).json({ 
          success: true, 
          skipped: true, 
          message: 'Duplicate event notification skipped by idempotency key.',
          notification: existing 
        });
      }
    }

    // 2. Prepare WhatsApp Cloud API credentials
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const isRealConfigured = Boolean(phoneId && token && phoneId.length > 5 && token.length > 10);

    const record = {
      user_id: userId || null,
      booking_id: bookingId || null,
      recipient_phone: `+${cleanPhone}`,
      recipient_name: recipientName,
      recipient_role: recipientRole,
      notification_type: eventType,
      whatsapp_message_id: null,
      idempotency_key: idempotencyKey,
      status: isRealConfigured ? 'pending' : 'simulated',
      payload_json: { messageText, templateName, parameters },
      created_at: new Date().toISOString()
    };

    // 3. Dispatch to Meta WhatsApp Graph API if configured
    if (isRealConfigured) {
      try {
        const metaRes = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: cleanPhone,
            type: 'text',
            text: { body: messageText }
          })
        });

        const metaData = await metaRes.json();
        if (metaRes.ok && metaData.messages?.[0]?.id) {
          record.whatsapp_message_id = metaData.messages[0].id;
          record.status = 'sent';
          record.sent_at = new Date().toISOString();
        } else {
          console.warn('[Meta Graph API Error]:', metaData);
          record.status = 'failed';
          record.error_message = metaData.error?.message || 'Meta API delivery error';
          record.failed_at = new Date().toISOString();
        }
      } catch (graphErr) {
        console.error('[Meta Graph API Fetch Exception]:', graphErr);
        record.status = 'failed';
        record.error_message = graphErr.message || 'Fetch failed';
        record.failed_at = new Date().toISOString();
      }
    }

    // 4. Save record into Supabase whatsapp_notifications table
    let savedRecord = record;
    if (supabase) {
      const { data, error } = await supabase
        .from('whatsapp_notifications')
        .insert(record)
        .select()
        .single();

      if (!error && data) {
        savedRecord = data;
      } else if (error) {
        console.warn('DB whatsapp_notifications insert warning:', error);
      }
    }

    return res.status(200).json({ success: true, notification: savedRecord });
  } catch (err) {
    console.error('[Notification Dispatch Exception]:', err);
    return res.status(500).json({ error: err.message || 'Internal notification dispatch error' });
  }
});

/**
 * 4. POST /api/whatsapp/send — Backward compatibility alias to /dispatch
 */
whatsappWebhookRouter.post('/send', async (req, res, next) => {
  req.url = '/dispatch';
  return whatsappWebhookRouter.handle(req, res, next);
});
