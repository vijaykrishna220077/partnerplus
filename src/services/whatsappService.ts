export type WhatsAppTemplateType = 
  | 'BOOKING_CONFIRMED'
  | 'WORKER_ASSIGNED'
  | 'WORKER_ON_THE_WAY'
  | 'JOB_COMPLETED'
  | 'INVOICE_CREATED'
  | 'PAYMENT_SUCCESSFUL'
  | 'NEW_JOB_WORKER'
  | 'JOB_CANCELLED';

export interface WhatsAppNotificationPayload {
  template: WhatsAppTemplateType;
  recipientPhone: string;
  recipientName: string;
  recipientRole?: 'customer' | 'worker' | 'organization' | 'cooperative';
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

/**
  * Render multi-language WhatsApp notification template texts for client preview/debug if needed
  */
export function renderWhatsAppTemplate(payload: WhatsAppNotificationPayload): string {
  const { template, recipientName, language = 'en', parameters: p } = payload;

  if (language === 'ta') {
    switch (template) {
      case 'BOOKING_CONFIRMED':
        return `🤝 வணக்கம் ${recipientName}! பார்ட்னர் பிளஸ் (PartnerPlus) மூலம் உங்கள் சேவை பதிவு செய்யப்பட்டுள்ளது.
📌 பதிவு எண்: #${p.bookingCode}
🛠️ சேவை: ${p.serviceName}
📍 முகவரி: ${p.customerAddress || 'உங்கள் முகவரி'}
வேலையாள் ஒதுக்கப்பட்டவுடன் உங்களுக்கு அறிவிக்கப்படும். 🤝`;

      case 'WORKER_ASSIGNED':
        return `🎉 வணக்கம் ${recipientName}! உங்கள் சேவைக்கு தொழிலாளி உறுதி செய்யப்பட்டுள்ளார்.
👤 தொழிலாளி: ${p.workerName}
📞 தொலைபேசி: ${p.workerPhone}
📌 பதிவு எண்: #${p.bookingCode}
அவர் விரைவில் உங்களை தொடர்புகொள்வார்.`;

      case 'WORKER_ON_THE_WAY':
        return `🚨 ${recipientName}, உங்கள் தொழிலாளி ${p.workerName} புறப்பட்டுவிட்டார்!
⏱️ வரக்கூடும் நேரம்: ${p.etaMinutes || 20} நிமிடங்கள்
📌 பதிவு எண்: #${p.bookingCode}`;

      case 'JOB_COMPLETED':
        return `✅ ${recipientName}, உங்கள் சேவை வெற்றிகரமாக நிறைவுற்றது!
📌 பதிவு எண்: #${p.bookingCode}
💰 மொத்த தொகை: ₹${p.totalAmount}`;

      case 'INVOICE_CREATED':
        return `📄 வணக்கம் ${recipientName}, உங்கள் பார்ட்னர் பிளஸ் ரசீது தயார்.
🧾 ரசீது எண்: ${p.invoiceNumber}
💰 தொகை: ₹${p.totalAmount}`;
    }
  }

  if (language === 'hi') {
    switch (template) {
      case 'BOOKING_CONFIRMED':
        return `🤝 नमस्ते ${recipientName}! पार्टनरप्लस (PartnerPlus) में आपकी बुकिंग स्वीकार कर ली गई है।
📌 बुकिंग कोड: #${p.bookingCode}
🛠️ सेवा: ${p.serviceName}
📍 पता: ${p.customerAddress || 'आपका पता'}`;

      case 'WORKER_ASSIGNED':
        return `🎉 नमस्ते ${recipientName}! आपकी सेवा के लिए कार्यकर्ता आवंटित किया गया है।
👤 कार्यकर्ता: ${p.workerName}
📞 फोन: ${p.workerPhone}
📌 बुकिंग कोड: #${p.bookingCode}`;

      case 'WORKER_ON_THE_WAY':
        return `🚨 ${recipientName}, आपके कार्यकर्ता ${p.workerName} रास्ते में हैं!
⏱️ अनुमानित समय: ${p.etaMinutes || 20} मिनट
📌 बुकिंग कोड: #${p.bookingCode}`;

      case 'JOB_COMPLETED':
        return `✅ ${recipientName}, आपकी सेवा सफलतापूर्वक पूरी हो गई है!
📌 बुकिंग कोड: #${p.bookingCode}
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
📌 Booking Reference: #${p.bookingCode}`;

    case 'JOB_COMPLETED':
      return `✅ Service Completed! Thank you ${recipientName} for choosing PartnerPlus.
📌 Booking Code: #${p.bookingCode}
💰 Total Service Bill: ₹${p.totalAmount}`;

    case 'INVOICE_CREATED':
      return `📄 PartnerPlus Official GST Invoice.
🧾 Invoice #: ${p.invoiceNumber}
👤 Customer: ${recipientName}
💰 Total Payable: ₹${p.totalAmount}`;

    case 'PAYMENT_SUCCESSFUL':
      return `💳 Payment Successful! Thank you ${recipientName}.
📌 Booking Reference: #${p.bookingCode}
💰 Amount Received: ₹${p.totalAmount}`;

    case 'NEW_JOB_WORKER':
      return `🚨 New PartnerPlus Job Alert for ${recipientName}!
🛠️ Service: ${p.serviceName}
📍 Area: ${p.customerAddress || 'Nearby area'}
Please check your Worker Portal to view & accept this job.`;

    case 'JOB_CANCELLED':
      return `ℹ️ Booking #${p.bookingCode} update: The service booking has been cancelled.`;
  }
}

export const whatsappService = {
  /**
    * Clean phone number format for India E.164 (+91XXXXXXXXXX)
    */
  formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    if (digits.startsWith('91') && digits.length === 12) return digits;
    return digits;
  },

  /**
    * Generate direct wa.me click-to-chat URL for user browser/app opening
    */
  generateWhatsAppWebLink(phone: string, text: string): string {
    const formattedPhone = this.formatPhoneNumber(phone);
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  },

  /**
    * Launch direct WhatsApp chat in real external WhatsApp application
    */
  openWhatsAppChat(phone: string, text: string = '', recipientName: string = 'User'): void {
    if (!phone) return;
    const url = this.generateWhatsAppWebLink(phone, text);
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
    * Dispatch transactional WhatsApp notification through backend API endpoint
    */
  async sendTemplateNotification(payload: WhatsAppNotificationPayload): Promise<{ success: boolean; notificationId?: string }> {
    const messageBody = renderWhatsAppTemplate(payload);
    
    try {
      const response = await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: payload.template,
          recipientPhone: payload.recipientPhone,
          recipientName: payload.recipientName,
          recipientRole: payload.recipientRole || 'customer',
          bookingId: payload.parameters?.bookingCode,
          messageText: messageBody,
          templateName: payload.template,
          parameters: payload.parameters
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, notificationId: data.notificationId };
      }
    } catch (err) {
      console.warn('[WhatsApp Service] Backend dispatch error notice:', err);
    }

    return { success: false };
  }
};
