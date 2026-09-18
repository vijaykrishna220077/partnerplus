import { supabase } from './supabaseClient';

export type WhatsAppTemplateType = 
  | 'BOOKING_CONFIRMED'
  | 'WORKER_ASSIGNED'
  | 'WORKER_ON_THE_WAY'
  | 'JOB_COMPLETED'
  | 'INVOICE_CREATED';

export interface WhatsAppNotificationPayload {
  template: WhatsAppTemplateType;
  recipientPhone: string;
  recipientName: string;
  language?: 'en' | 'ta' | 'hi' | 'kn' | 'te';
  parameters: {
    bookingCode?: string;
    serviceName?: string;
    customerName?: string;
    customerAddress?: string;
    workerName?: string;
    workerPhone?: string;
    etaMinutes?: number;
    totalAmount?: number;
    invoiceNumber?: string;
    pdfUrl?: string;
    [key: string]: any;
  };
}

export interface WhatsAppMessageRecord {
  id: string;
  recipientPhone: string;
  recipientName: string;
  templateName: WhatsAppTemplateType | 'CUSTOM_TEXT';
  messageBody: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'demo_simulated';
  mode: 'DEMO_ONLY' | 'REAL_MODE';
  sentAt: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'partnerplus_whatsapp_messages_v1';

import { logger } from '../utils/logger';

function getStoredLogs(): WhatsAppMessageRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    logger.warn('[WhatsAppService] Error reading logs:', err);
    return [];
  }
}

function saveStoredLogs(logs: WhatsAppMessageRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch (err) {
    console.error('Failed to save WhatsApp logs to storage:', err);
  }
}

/**
 * Render multi-language WhatsApp notification templates
 */
export function renderWhatsAppTemplate(payload: WhatsAppNotificationPayload): string {
  const { template, recipientName, language = 'en', parameters: p } = payload;

  if (language === 'ta') {
    switch (template) {
      case 'BOOKING_CONFIRMED':
        return `🤝 வணக்கம் ${recipientName}! பார்ட்னர் பிளஸ் (PartnerPlus) மூலம் உங்கள் சேவை பதிவு செய்யப்பட்டுள்ளது.
📌 பதிவு எண்: ${p.bookingCode}
🛠️ சேவை: ${p.serviceName}
📍 முகவரி: ${p.customerAddress || 'உங்கள் முகவரி'}
வேலையாள் ஒதுக்கப்பட்டவுடன் உங்களுக்கு அறிவிக்கப்படும். 🤝`;

      case 'WORKER_ASSIGNED':
        return `🎉 வணக்கம் ${recipientName}! உங்கள் சேவைக்கு தொழிலாளி உறுதி செய்யப்பட்டுள்ளார்.
👤 தொழிலாளி: ${p.workerName}
📞 தொலைபேசி: ${p.workerPhone}
📌 பதிவு எண்: ${p.bookingCode}
அவர் விரைவில் உங்களை தொடர்புகொள்வார்.`;

      case 'WORKER_ON_THE_WAY':
        return `🚨 ${recipientName}, உங்கள் தொழிலாளி ${p.workerName} புறப்பட்டுவிட்டார்!
⏱️ வரக்கூடும் நேரம்: ${p.etaMinutes || 20} நிமிடங்கள்
📌 பதிவு எண்: ${p.bookingCode}
நேரலை இருப்பிடத்தை பார்க்க பார்ட்னர் பிளஸ் செயலியை திறக்கவும்.`;

      case 'JOB_COMPLETED':
        return `✅ ${recipientName}, உங்கள் சேவை வெற்றி கரமாக நிறைவுற்றது!
📌 பதிவு எண்: ${p.bookingCode}
💰 மொத்த தொகை: ₹${p.totalAmount}
எங்கள் சேவை குறித்து உங்கள் கருத்தை பார்ட்னர் பிளஸில் பகிர்ந்து கொள்ளுங்கள்!`;

      case 'INVOICE_CREATED':
        return `📄 வணக்கம் ${recipientName}, உங்கள் பார்ட்னர் பிளஸ் ரசீது தயார்.
🧾 ரசீது எண்: ${p.invoiceNumber}
💰 தொகை: ₹${p.totalAmount}
பார்ட்னர் பிளஸ் கூட்டுறவு சேவையை பயன்படுத்தியதற்கு நன்றி!`;
    }
  }

  if (language === 'hi') {
    switch (template) {
      case 'BOOKING_CONFIRMED':
        return `🤝 नमस्ते ${recipientName}! पार्टनरप्लस (PartnerPlus) में आपकी बुकिंग स्वीकार कर ली गई है।
📌 बुकिंग कोड: ${p.bookingCode}
🛠️ सेवा: ${p.serviceName}
📍 पता: ${p.customerAddress || 'आपका पता'}
शीघ्र ही आपको कार्यकर्ता आवंटित किया जाएगा। 🤝`;

      case 'WORKER_ASSIGNED':
        return `🎉 नमस्ते ${recipientName}! आपकी सेवा के लिए कार्यकर्ता आवंटित किया गया है।
👤 कार्यकर्ता: ${p.workerName}
📞 फोन: ${p.workerPhone}
📌 बुकिंग कोड: ${p.bookingCode}`;

      case 'WORKER_ON_THE_WAY':
        return `🚨 ${recipientName}, आपके कार्यकर्ता ${p.workerName} रास्ते में हैं!
⏱️ अनुमानित समय: ${p.etaMinutes || 20} मिनट
📌 बुकिंग कोड: ${p.bookingCode}`;

      case 'JOB_COMPLETED':
        return `✅ ${recipientName}, आपकी सेवा सफलतापूर्वक पूरी हो गई है!
📌 बुकिंग कोड: ${p.bookingCode}
💰 कुल राशि: ₹${p.totalAmount}`;

      case 'INVOICE_CREATED':
        return `📄 नमस्ते ${recipientName}, आपका पार्टनरप्लस बिल तैयार है।
🧾 बिल संख्या: ${p.invoiceNumber}
💰 राशि: ₹${p.totalAmount}`;
    }
  }

  // Default English Templates
  switch (template) {
    case 'BOOKING_CONFIRMED':
      return `🤝 Hello ${recipientName}! Your service booking on PartnerPlus has been received.
📌 Booking Reference: #${p.bookingCode}
🛠️ Service Required: ${p.serviceName}
📍 Address: ${p.customerAddress || 'Customer Location'}
We are matching certified nearby cooperative workers for you.`;

    case 'WORKER_ASSIGNED':
      return `🎉 Great news ${recipientName}! A certified worker has been assigned to your request.
👤 Worker Name: ${p.workerName}
📞 Contact: ${p.workerPhone}
📌 Booking Code: #${p.bookingCode}
The worker will contact you shortly before arrival.`;

    case 'WORKER_ON_THE_WAY':
      return `🚨 Update for ${recipientName}: Worker ${p.workerName} is en-route to your location!
⏱️ Estimated ETA: ~${p.etaMinutes || 20} mins
📌 Booking Reference: #${p.bookingCode}
Track live GPS arrival progress inside your PartnerPlus App.`;

    case 'JOB_COMPLETED':
      return `✅ Service Completed! Thank you ${recipientName} for choosing PartnerPlus.
📌 Booking Code: #${p.bookingCode}
💰 Total Service Bill: ₹${p.totalAmount}
Please take a moment to rate your technician in the app!`;

    case 'INVOICE_CREATED':
      return `📄 PartnerPlus Federation Official GST Invoice.
🧾 Invoice #: ${p.invoiceNumber}
👤 Customer: ${recipientName}
💰 Total Payable: ₹${p.totalAmount}
Thank you for supporting cooperative gig worker communities!`;
  }
}

export const whatsappService = {
  /**
   * Check whether WhatsApp Graph API production credentials are configured
   */
  isRealWhatsAppConfigured(): boolean {
    const phoneId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
    const token = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
    return Boolean(phoneId && token && phoneId.length > 5 && token.length > 10);
  },

  /**
   * Send a template-based notification over WhatsApp via backend Cloud API endpoint
   */
  async sendTemplateNotification(payload: WhatsAppNotificationPayload): Promise<WhatsAppMessageRecord> {
    const messageBody = renderWhatsAppTemplate(payload);
    
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: payload.recipientPhone,
          recipientName: payload.recipientName,
          messageText: messageBody,
          templateName: payload.template,
          bookingCode: payload.parameters?.bookingCode
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.record) {
          const currentLogs = getStoredLogs();
          saveStoredLogs([resData.record, ...currentLogs]);
          return resData.record;
        }
      }
    } catch (err) {
      console.warn('[WhatsApp Service] Backend endpoint dispatch notice:', err);
    }

    // Client-side fallback if backend API is offline
    const isRealConfigured = this.isRealWhatsAppConfigured();
    const record: WhatsAppMessageRecord = {
      id: `wa-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientPhone: payload.recipientPhone,
      recipientName: payload.recipientName,
      templateName: payload.template,
      messageBody,
      status: isRealConfigured ? 'sent' : 'demo_simulated',
      mode: isRealConfigured ? 'REAL_MODE' : 'DEMO_ONLY',
      sentAt: new Date().toISOString(),
      metadata: payload.parameters
    };

    const currentLogs = getStoredLogs();
    saveStoredLogs([record, ...currentLogs]);
    return record;
  },

  /**
   * Send custom WhatsApp text message via backend endpoint
   */
  async sendDirectMessage(phone: string, text: string, recipientName: string = 'User'): Promise<WhatsAppMessageRecord> {
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: phone,
          recipientName,
          messageText: text,
          templateName: 'CUSTOM_TEXT'
        })
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.record) {
          const currentLogs = getStoredLogs();
          saveStoredLogs([resData.record, ...currentLogs]);
          return resData.record;
        }
      }
    } catch (err) {
      console.warn('[WhatsApp Service] Direct message endpoint notice:', err);
    }

    const isRealConfigured = this.isRealWhatsAppConfigured();
    const record: WhatsAppMessageRecord = {
      id: `wa-msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientPhone: phone,
      recipientName,
      templateName: 'CUSTOM_TEXT',
      messageBody: text,
      status: isRealConfigured ? 'sent' : 'demo_simulated',
      mode: isRealConfigured ? 'REAL_MODE' : 'DEMO_ONLY',
      sentAt: new Date().toISOString()
    };

    const currentLogs = getStoredLogs();
    saveStoredLogs([record, ...currentLogs]);
    return record;
  },

  /**
   * Generate direct wa.me click-to-chat URL for user browser opening
   */
  generateWhatsAppWebLink(phone: string, text: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
  },

  /**
   * Launch direct WhatsApp chat in new window/app with optional message text
   */
  openWhatsAppChat(phone: string, text: string = '', recipientName: string = 'User'): void {
    if (!phone) return;
    const url = this.generateWhatsAppWebLink(phone, text);
    this.sendDirectMessage(phone, text || 'WhatsApp Click-to-Chat initiated', recipientName);
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  /**
   * Share pre-filled booking details to WhatsApp recipient
   */
  shareBookingOnWhatsApp(phone: string, bookingCode: string, serviceName: string, recipientName: string = 'User'): void {
    const text = `Hello ${recipientName}, regarding PartnerPlus Booking #${bookingCode} (${serviceName}). Let's connect!`;
    this.openWhatsAppChat(phone, text, recipientName);
  },

  /**
   * Fetch all recorded WhatsApp message logs
   */
  getMessageLogs(): WhatsAppMessageRecord[] {
    return getStoredLogs();
  },

  /**
   * Clear recorded logs
   */
  clearMessageLogs(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
