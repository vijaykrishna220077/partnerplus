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
 * 1. GET /api/whatsapp/webhook — Meta Webhook Verification Handshake
 * Meta sends hub.mode, hub.verify_token, and hub.challenge
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
 * Receives incoming messages (text, image, location) and status receipts from Meta Graph API
 */
whatsappWebhookRouter.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (!body || body.object !== 'whatsapp_business_account') {
      return res.status(404).json({ error: 'Not a WhatsApp Business Account event' });
    }

    // Acknowledge Meta immediately to avoid retries
    res.status(200).send('EVENT_RECEIVED');

    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field === 'messages') {
          const value = change.value || {};
          const messages = value.messages || [];
          const statuses = value.statuses || [];

          // A. Process Inbound Messages from User's WhatsApp
          for (const msg of messages) {
            const fromPhone = msg.from; // Sender phone number in E.164
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

            // Insert into whatsapp_webhook_events audit log
            if (supabase) {
              await supabase.from('whatsapp_webhook_events').insert({
                event_type: 'incoming_message',
                wamid,
                phone_number: fromPhone,
                raw_event: body
              }).catch(err => console.warn('Audit log insert err:', err));

              // Map contact or user profile
              const { data: contact } = await supabase
                .from('whatsapp_contacts')
                .select('*')
                .eq('phone_number', fromPhone)
                .single();

              const senderName = contact?.display_name || value.contacts?.[0]?.profile?.name || `+${fromPhone}`;
              const senderRole = contact?.user_role || 'customer';

              // Store into whatsapp_messages table
              await supabase.from('whatsapp_messages').insert({
                wamid,
                sender_phone: fromPhone,
                recipient_phone: process.env.WHATSAPP_PHONE_NUMBER_ID || 'SYSTEM_PLATFORM',
                sender_name: senderName,
                recipient_name: 'PartnerPlus System',
                sender_role: senderRole,
                recipient_role: 'cooperative',
                direction: 'INBOUND',
                message_body: textBody,
                status: 'delivered',
                mode: 'REAL_MODE',
                sent_at: timestamp,
                payload_json: msg
              }).catch(err => console.warn('Inbound msg DB insert err:', err));

              // Also mirror to main messages table for real-time UI chat feed
              await supabase.from('messages').insert({
                sender_name: senderName,
                sender_role: senderRole,
                message_type: msg.type === 'image' ? 'image' : msg.type === 'location' ? 'location' : 'text',
                content: `[WhatsApp] ${textBody}`
              }).catch(() => {});
            }
          }

          // B. Process Outbound Status Receipts (sent, delivered, read, failed)
          for (const statusObj of statuses) {
            const wamid = statusObj.id;
            const newStatus = statusObj.status; // 'sent' | 'delivered' | 'read' | 'failed'

            console.log(`[Meta Webhook] Status update for ${wamid}: ${newStatus}`);

            if (supabase) {
              await supabase
                .from('whatsapp_messages')
                .update({ status: newStatus })
                .eq('wamid', wamid)
                .catch(err => console.warn('Status update err:', err));
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
 * 3. POST /api/whatsapp/send — Outbound Meta WhatsApp Graph API Dispatcher
 */
whatsappWebhookRouter.post('/send', async (req, res) => {
  try {
    const { recipientPhone, recipientName, messageText, templateName = 'CUSTOM_TEXT', bookingCode } = req.body;

    if (!recipientPhone || !messageText) {
      return res.status(400).json({ error: 'recipientPhone and messageText are required' });
    }

    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN || process.env.VITE_WHATSAPP_ACCESS_TOKEN;
    const isRealConfigured = Boolean(phoneId && token && phoneId.length > 5 && token.length > 10);

    const formattedPhone = recipientPhone.replace(/\D/g, '');
    const toPhone = formattedPhone.startsWith('91') ? formattedPhone : `91${formattedPhone}`;

    const record = {
      id: `wa-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      wamid: null,
      sender_phone: phoneId || 'SYSTEM_PLATFORM',
      recipient_phone: toPhone,
      sender_name: 'PartnerPlus System',
      recipient_name: recipientName || 'User',
      sender_role: 'system',
      recipient_role: 'user',
      direction: 'OUTBOUND',
      template_name: templateName,
      message_body: messageText,
      status: isRealConfigured ? 'sent' : 'demo_simulated',
      mode: isRealConfigured ? 'REAL_MODE' : 'DEMO_ONLY',
      sent_at: new Date().toISOString()
    };

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
            to: toPhone,
            type: 'text',
            text: { body: messageText }
          })
        });

        const metaData = await metaRes.json();
        if (metaRes.ok && metaData.messages?.[0]?.id) {
          record.wamid = metaData.messages[0].id;
          record.status = 'sent';
        } else {
          console.warn('[Meta Graph API Error]:', metaData);
          record.status = 'demo_simulated';
        }
      } catch (graphErr) {
        console.error('[Meta Graph API Fetch Exception]:', graphErr);
        record.status = 'demo_simulated';
      }
    }

    // Insert into DB if configured
    if (supabase) {
      await supabase.from('whatsapp_messages').insert(record).catch(err => console.warn('Outbound DB log err:', err));
    }

    return res.status(200).json({ success: true, record });
  } catch (err) {
    console.error('[Outbound Send Error]:', err);
    return res.status(500).json({ error: err.message || 'Failed to dispatch WhatsApp message' });
  }
});
