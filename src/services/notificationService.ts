import { NotificationRecord } from '../types';
import { db, realtimeHub } from './db';
import { whatsappService, WhatsAppTemplateType } from './whatsappService';

export type SystemEventType = 
  | 'BOOKING_CREATED'
  | 'WORKER_ASSIGNED'
  | 'WORKER_ACCEPTED'
  | 'WORKER_EN_ROUTE'
  | 'WORKER_ARRIVED'
  | 'SERVICE_STARTED'
  | 'JOB_COMPLETED'
  | 'INVOICE_GENERATED'
  | 'PAYMENT_RECEIVED'
  | 'EMERGENCY_DISPATCH';

export interface SystemNotificationEventPayload {
  event: SystemEventType;
  recipientId: string;
  recipientType: 'customer' | 'worker' | 'cooperative';
  recipientName: string;
  recipientPhone?: string;
  language?: 'en' | 'ta' | 'hi' | 'kn' | 'te';
  bookingId?: string;
  bookingCode?: string;
  serviceName?: string;
  customerAddress?: string;
  workerName?: string;
  workerPhone?: string;
  etaMinutes?: number;
  totalAmount?: number;
  invoiceNumber?: string;
  channels?: ('in_app' | 'whatsapp' | 'sms' | 'push')[];
}

export const notificationService = {
  /**
   * Primary entry point for triggering multi-channel notifications across PartnerPlus
   */
  async dispatchNotification(payload: SystemNotificationEventPayload): Promise<NotificationRecord> {
    const { 
      event, 
      recipientId, 
      recipientType, 
      recipientName, 
      recipientPhone, 
      language = 'en', 
      bookingId,
      channels = ['in_app', 'whatsapp']
    } = payload;

    // 1. Generate human-readable title & message for In-App record
    const { title, message, whatsappTemplate } = this.formatEventMessage(payload);

    // 2. Insert In-App Notification Record into Storage/DB
    const inAppRecord: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientId,
      recipientType,
      title,
      message,
      type: this.mapEventTypeToNotificationType(event),
      bookingId,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    if (channels.includes('in_app')) {
      db.insertNotification(inAppRecord);
    }

    // 3. Dispatch to WhatsApp Service if recipient phone exists & channel included
    if (channels.includes('whatsapp') && recipientPhone && whatsappTemplate) {
      try {
        await whatsappService.sendTemplateNotification({
          template: whatsappTemplate,
          recipientPhone,
          recipientName,
          language,
          parameters: {
            bookingCode: payload.bookingCode || bookingId || 'BK-100',
            serviceName: payload.serviceName || 'Service',
            customerName: payload.recipientType === 'customer' ? recipientName : 'Customer',
            customerAddress: payload.customerAddress,
            workerName: payload.workerName,
            workerPhone: payload.workerPhone,
            etaMinutes: payload.etaMinutes,
            totalAmount: payload.totalAmount,
            invoiceNumber: payload.invoiceNumber
          }
        });
      } catch (waErr) {
        console.warn('Failed to send WhatsApp notification:', waErr);
      }
    }

    // 4. Emit real-time notification event for UI reactive badge updates
    realtimeHub.emit('sahakari:notification_created', inAppRecord);

    return inAppRecord;
  },

  /**
   * Helper to format notification title and text per event
   */
  formatEventMessage(payload: SystemNotificationEventPayload): { title: string; message: string; whatsappTemplate?: WhatsAppTemplateType } {
    const { event, recipientName, bookingCode, serviceName, workerName, etaMinutes, totalAmount, invoiceNumber } = payload;

    switch (event) {
      case 'BOOKING_CREATED':
        return {
          title: 'Booking Request Received',
          message: `Your booking #${bookingCode || 'BK-100'} for ${serviceName || 'service'} has been registered. Matching nearby cooperative technicians...`,
          whatsappTemplate: 'BOOKING_CONFIRMED'
        };

      case 'WORKER_ASSIGNED':
        return {
          title: 'Technician Assigned',
          message: `Worker ${workerName || 'Artisan'} has been assigned to your booking #${bookingCode || 'BK-100'}.`,
          whatsappTemplate: 'WORKER_ASSIGNED'
        };

      case 'WORKER_EN_ROUTE':
        return {
          title: 'Technician En-Route',
          message: `${workerName || 'Worker'} is on the way to your location. ETA ~${etaMinutes || 20} mins.`,
          whatsappTemplate: 'WORKER_ON_THE_WAY'
        };

      case 'JOB_COMPLETED':
        return {
          title: 'Service Completed',
          message: `Service for booking #${bookingCode || 'BK-100'} is completed. Total Amount: ₹${totalAmount || 0}.`,
          whatsappTemplate: 'JOB_COMPLETED'
        };

      case 'INVOICE_GENERATED':
        return {
          title: 'Invoice Issued',
          message: `Official GST Invoice #${invoiceNumber || 'INV-100'} generated for ₹${totalAmount || 0}.`,
          whatsappTemplate: 'INVOICE_CREATED'
        };

      case 'EMERGENCY_DISPATCH':
        return {
          title: '🚨 Emergency SOS Dispatch',
          message: `Emergency response unit dispatched for ${serviceName || 'Emergency Support'}. Technician ${workerName || ''} arriving urgently!`,
          whatsappTemplate: 'WORKER_ON_THE_WAY'
        };

      default:
        return {
          title: 'PartnerPlus Update',
          message: `Update regarding your service request #${bookingCode || ''}.`
        };
    }
  },

  mapEventTypeToNotificationType(event: SystemEventType): NotificationRecord['type'] {
    if (event === 'PAYMENT_RECEIVED' || event === 'INVOICE_GENERATED') return 'payment';
    if (event === 'EMERGENCY_DISPATCH') return 'emergency';
    return 'booking';
  },

  getNotifications(recipientId?: string): NotificationRecord[] {
    return db.getNotifications(recipientId);
  },

  markAsRead(id: string): void {
    db.markNotificationRead(id);
  },

  subscribeToNotifications(callback: (notif: NotificationRecord) => void): () => void {
    return realtimeHub.subscribe('sahakari:notification_created', callback);
  }
};
