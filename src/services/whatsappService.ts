export type WhatsAppTemplateType = 
  | 'CUSTOMER_WORKER_ASSIGNED'
  | 'WORKER_NEW_JOB'
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
  idempotencyKey?: string;
  parameters: {
    bookingId?: string;
    bookingCode?: string;
    serviceName?: string;
    customerName?: string;
    customerAddress?: string;
    customerInstructions?: string;
    bookingDate?: string;
    bookingTime?: string;
    workerName?: string;
    workerPhone?: string;
    workerExperience?: string;
    workerRating?: number | string;
    etaMinutes?: number;
    totalAmount?: number;
    invoiceNumber?: string;
    pdfUrl?: string;
    [key: string]: any;
  };
}

/**
  * Render multi-language WhatsApp notification template texts
  */
export function renderWhatsAppTemplate(payload: WhatsAppNotificationPayload): string {
  const { template, recipientName, language = 'en', parameters: p } = payload;
  const bookingRef = p.bookingCode || p.bookingId || 'BK-100';

  if (language === 'ta') {
    switch (template) {
      case 'WORKER_NEW_JOB':
        return `PARTNER PLUS
புதிய சேவை பணி ஒதுக்கப்பட்டுள்ளது

வாடிக்கையாளர்: ${p.customerName || 'வாடிக்கையாளர்'}
சேவை: ${p.serviceName || 'சேவை'}
தேதி: ${p.bookingDate || 'இன்று'}
நேரம்: ${p.bookingTime || 'உடனடியாக'}
பதிவு எண் (Booking ID): ${bookingRef}

இருப்பிடம்:
${p.customerAddress || 'சேவை முகவரி'}

கூடுதல் குறிப்புகள்:
${p.customerInstructions || 'எதுவுமில்லை'}

முழு விவரங்களையும் பார்க்க பார்ட்னர் பிளஸ் செயலியை திறக்கவும்.`;

      case 'CUSTOMER_WORKER_ASSIGNED':
        return `PARTNER PLUS
தொழிலாளி ஒதுக்கப்பட்டார்

உங்கள் சேவைக்கான தொழிலாளி உறுதி செய்யப்பட்டுள்ளார்.

தொழிலாளி: ${p.workerName || 'சான்றளிக்கப்பட்ட தொழிலாளி'}
சேவை: ${p.serviceName || 'சேவை'}
அனுபவம்: ${p.workerExperience || '5+ ஆண்டுகள் சான்றளிக்கப்பட்ட தொழிலாளி'}
மதிப்பீடு: ${p.workerRating || 4.9} ★

தேதி: ${p.bookingDate || 'இன்று'}
நேரம்: ${p.bookingTime || 'உடனடியாக'}
பதிவு எண் (Booking ID): ${bookingRef}

முழு தொழிலாளி விவரங்களையும் பார்க்க பார்ட்னர் பிளஸ் செயலியை திறக்கவும்.`;
    }
  }

  if (language === 'hi') {
    switch (template) {
      case 'WORKER_NEW_JOB':
        return `PARTNER PLUS
नया कार्य आवंटित

ग्राहक: ${p.customerName || 'ग्राहक'}
सेवा: ${p.serviceName || 'सेवा'}
दिनांक: ${p.bookingDate || 'आज'}
समय: ${p.bookingTime || 'तुरंत'}
बुकिंग आईडी (Booking ID): ${bookingRef}

स्थान:
${p.customerAddress || 'सेवा पता'}

अतिरिक्त निर्देश:
${p.customerInstructions || 'कोई नहीं'}

पूरा विवरण देखने के लिए कृपया पार्टनरप्लस ऐप खोलें।`;

      case 'CUSTOMER_WORKER_ASSIGNED':
        return `PARTNER PLUS
कार्यकर्ता आवंटित

आपका कार्यकर्ता आवंटित कर दिया गया है।

कार्यकर्ता: ${p.workerName || 'प्रमाणित कार्यकर्ता'}
सेवा: ${p.serviceName || 'सेवा'}
अनुभव: ${p.workerExperience || '5+ वर्ष अनुभवी'}
रेटिंग: ${p.workerRating || 4.9} ★

दिनांक: ${p.bookingDate || 'आज'}
समय: ${p.bookingTime || 'तुरंत'}
बुकिंग आईडी (Booking ID): ${bookingRef}

पूरा विवरण देखने के लिए कृपया पार्टनरप्लस ऐप खोलें।`;
    }
  }

  // Default English Templates
  switch (template) {
    case 'WORKER_NEW_JOB':
      return `PARTNER PLUS
New Job Assigned

Customer: ${p.customerName || 'Valued Customer'}
Service: ${p.serviceName || 'Cooperative Service'}
Date: ${p.bookingDate || 'Today'}
Time: ${p.bookingTime || 'Immediate'}
Booking ID: ${bookingRef}

Location:
${p.customerAddress || 'Customer Address'}

Additional instructions:
${p.customerInstructions || 'Standard service request'}

Please open PartnerPlus to view complete job details.`;

    case 'CUSTOMER_WORKER_ASSIGNED':
      return `PARTNER PLUS
Worker Assigned

Your worker has been assigned.

Worker: ${p.workerName || 'Certified Worker'}
Service: ${p.serviceName || 'Service'}
Experience: ${p.workerExperience || '5+ yrs verified artisan'}
Rating: ${p.workerRating || 4.9} ★

Date: ${p.bookingDate || 'Today'}
Time: ${p.bookingTime || 'Immediate'}
Booking ID: ${bookingRef}

Please open PartnerPlus to view complete worker details.`;

    case 'BOOKING_CONFIRMED':
      return `PARTNER PLUS
Booking Confirmed

Your service booking has been confirmed.

Service: ${p.serviceName}
Date: ${p.bookingDate || 'Today'}
Time: ${p.bookingTime || 'Immediate'}
Booking ID: ${bookingRef}

We are matching certified nearby cooperative workers for you.`;

    case 'WORKER_ASSIGNED':
      return `PARTNER PLUS
Worker Assigned

Worker: ${p.workerName}
Service: ${p.serviceName}
Booking ID: ${bookingRef}

Please open PartnerPlus to view complete worker details.`;

    case 'WORKER_ON_THE_WAY':
      return `PARTNER PLUS
Worker On The Way

Worker ${p.workerName} is en-route to your location.
ETA: ~${p.etaMinutes || 15} mins
Booking ID: ${bookingRef}`;

    case 'JOB_COMPLETED':
      return `PARTNER PLUS
Service Completed

Service for Booking ID ${bookingRef} completed successfully.
Total Amount: ₹${p.totalAmount}`;

    case 'INVOICE_CREATED':
      return `PARTNER PLUS
Invoice Issued

Invoice #: ${p.invoiceNumber}
Booking ID: ${bookingRef}
Total Payable: ₹${p.totalAmount}`;

    case 'PAYMENT_SUCCESSFUL':
      return `PARTNER PLUS
Payment Successful

Payment of ₹${p.totalAmount} verified for Booking ID: ${bookingRef}.`;

    case 'NEW_JOB_WORKER':
      return `PARTNER PLUS
New Job Alert

Service: ${p.serviceName}
Location: ${p.customerAddress || 'Nearby Area'}
Booking ID: ${bookingRef}`;

    case 'JOB_CANCELLED':
      return `PARTNER PLUS
Booking Cancelled

Booking ID #${bookingRef} has been cancelled.`;
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
    const bookingIdRef = payload.parameters?.bookingCode || payload.parameters?.bookingId || 'global';
    const idempotencyKey = payload.idempotencyKey || `${payload.template}_${bookingIdRef}_${this.formatPhoneNumber(payload.recipientPhone)}`;

    try {
      const response = await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: payload.template,
          recipientPhone: payload.recipientPhone,
          recipientName: payload.recipientName,
          recipientRole: payload.recipientRole || 'customer',
          bookingId: bookingIdRef,
          idempotencyKey,
          messageText: messageBody,
          templateName: payload.template,
          parameters: payload.parameters
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, notificationId: data.notification?.id };
      }
    } catch (err) {
      console.warn('[WhatsApp Service] Backend dispatch error notice:', err);
    }

    return { success: false };
  }
};
