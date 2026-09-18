import { NotificationRecord } from '../types';
import { db, realtimeHub } from './db';
import { whatsappService, WhatsAppTemplateType } from './whatsappService';

export type SystemEventType = 
  | 'CUSTOMER_WORKER_ASSIGNED'
  | 'WORKER_NEW_JOB'
  | 'BOOKING_CREATED'
  | 'BOOKING_CONFIRMED'
  | 'WORKER_ASSIGNED'
  | 'WORKER_ACCEPTED'
  | 'WORKER_EN_ROUTE'
  | 'WORKER_ARRIVED'
  | 'SERVICE_STARTED'
  | 'JOB_COMPLETED'
  | 'INVOICE_GENERATED'
  | 'PAYMENT_SUCCESSFUL'
  | 'NEW_JOB_WORKER'
  | 'JOB_CANCELLED'
  | 'EMERGENCY_DISPATCH'
  | 'ORGANIZATION_JOB_CREATED'
  | 'WORKFORCE_ALERT';

export interface SystemNotificationEventPayload {
  event: SystemEventType;
  recipientId: string;
  recipientType: 'customer' | 'worker' | 'cooperative' | 'organization';
  recipientName: string;
  recipientPhone?: string;
  language?: 'en' | 'ta' | 'hi' | 'kn' | 'te';
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
  idempotencyKey?: string;
  channels?: ('in_app' | 'whatsapp' | 'sms' | 'push')[];
}

export const notificationService = {
  /**
    * Primary entry point for triggering multi-channel transactional notifications across PartnerPlus
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
      bookingCode,
      channels = ['in_app', 'whatsapp']
    } = payload;

    // 1. Generate human-readable title & message for In-App record
    const { title, message, whatsappTemplate } = this.formatEventMessage(payload);

    // 2. Insert In-App Notification Record into Storage/DB
    const inAppRecord: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientId,
      recipientType: recipientType === 'organization' ? 'customer' : recipientType,
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

    // 3. Dispatch Transactional WhatsApp Notification via Backend Endpoint
    if (channels.includes('whatsapp') && recipientPhone && whatsappTemplate) {
      const bookingRef = bookingCode || bookingId || 'BK-100';
      const defaultIdempotencyKey = payload.idempotencyKey || `${whatsappTemplate.toLowerCase()}_${bookingRef}`;

      try {
        await whatsappService.sendTemplateNotification({
          template: whatsappTemplate,
          recipientPhone,
          recipientName,
          recipientRole: recipientType,
          language,
          idempotencyKey: defaultIdempotencyKey,
          parameters: {
            bookingId: bookingRef,
            bookingCode: bookingRef,
            serviceName: payload.serviceName || 'Service',
            customerName: payload.recipientType === 'customer' ? recipientName : (payload.recipientName || 'Customer'),
            customerAddress: payload.customerAddress,
            customerInstructions: payload.customerInstructions,
            bookingDate: payload.bookingDate || 'Today',
            bookingTime: payload.bookingTime || 'Immediate',
            workerName: payload.workerName,
            workerPhone: payload.workerPhone,
            workerExperience: payload.workerExperience || '5+ yrs verified artisan',
            workerRating: payload.workerRating || 4.9,
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
    * Trigger two-way WhatsApp notifications (Worker + Customer) after DB booking transaction succeeds
    */
  async dispatchTwoWayBookingNotifications(params: {
    bookingId: string;
    bookingCode: string;
    serviceName: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerInstructions?: string;
    bookingDate?: string;
    bookingTime?: string;
    workerId: string;
    workerName: string;
    workerPhone: string;
    workerExperience?: string;
    workerRating?: number | string;
    totalAmount?: number;
  }): Promise<void> {
    const {
      bookingId,
      bookingCode,
      serviceName,
      customerName,
      customerPhone,
      customerAddress,
      customerInstructions,
      bookingDate = 'Today',
      bookingTime = 'Immediate',
      workerId,
      workerName,
      workerPhone,
      workerExperience = '5+ yrs verified artisan',
      workerRating = 4.9,
      totalAmount
    } = params;

    const bookingRef = bookingCode || bookingId;

    // 1. Send Worker Transactional Notification (`worker_new_job_${bookingRef}`)
    if (workerPhone) {
      await this.dispatchNotification({
        event: 'WORKER_NEW_JOB',
        recipientId: workerId,
        recipientType: 'worker',
        recipientName: workerName,
        recipientPhone: workerPhone,
        bookingId,
        bookingCode: bookingRef,
        serviceName,
        customerName,
        customerAddress,
        customerInstructions: customerInstructions || 'Standard service request',
        bookingDate,
        bookingTime,
        idempotencyKey: `worker_new_job_${bookingRef}`,
        totalAmount
      }).catch(err => console.warn('Worker WhatsApp dispatch notice:', err));
    }

    // 2. Send Customer Transactional Notification (`customer_worker_assigned_${bookingRef}`)
    if (customerPhone) {
      await this.dispatchNotification({
        event: 'CUSTOMER_WORKER_ASSIGNED',
        recipientId: `cust-${bookingRef}`,
        recipientType: 'customer',
        recipientName: customerName,
        recipientPhone: customerPhone,
        bookingId,
        bookingCode: bookingRef,
        serviceName,
        workerName,
        workerPhone,
        workerExperience,
        workerRating,
        bookingDate,
        bookingTime,
        idempotencyKey: `customer_worker_assigned_${bookingRef}`,
        totalAmount
      }).catch(err => console.warn('Customer WhatsApp dispatch notice:', err));
    }
  },

  /**
    * Format notification title, message, and select appropriate WhatsApp template
    */
  formatEventMessage(payload: SystemNotificationEventPayload): { title: string; message: string; whatsappTemplate?: WhatsAppTemplateType } {
    const { event, bookingCode, serviceName, workerName, etaMinutes, totalAmount, invoiceNumber } = payload;

    switch (event) {
      case 'WORKER_NEW_JOB':
        return {
          title: 'New Job Assigned',
          message: `New job assigned: ${serviceName} for ${payload.customerName}. Booking ID: ${bookingCode || payload.bookingId}`,
          whatsappTemplate: 'WORKER_NEW_JOB'
        };

      case 'CUSTOMER_WORKER_ASSIGNED':
      case 'WORKER_ASSIGNED':
        return {
          title: 'Worker Assigned',
          message: `Worker ${workerName || 'Artisan'} has been assigned to your booking #${bookingCode || ''}.`,
          whatsappTemplate: 'CUSTOMER_WORKER_ASSIGNED'
        };

      case 'BOOKING_CREATED':
      case 'BOOKING_CONFIRMED':
        return {
          title: 'Booking Request Received',
          message: `Your booking #${bookingCode || ''} for ${serviceName || 'service'} has been registered. Matching certified technicians...`,
          whatsappTemplate: 'BOOKING_CONFIRMED'
        };

      case 'WORKER_ACCEPTED':
        return {
          title: 'Worker Accepted Job',
          message: `Technician ${workerName || 'Artisan'} accepted booking #${bookingCode || ''} and is preparing to travel.`,
          whatsappTemplate: 'CUSTOMER_WORKER_ASSIGNED'
        };

      case 'WORKER_EN_ROUTE':
        return {
          title: 'Technician En-Route',
          message: `${workerName || 'Worker'} is on the way to your location. ETA ~${etaMinutes || 15} mins.`,
          whatsappTemplate: 'WORKER_ON_THE_WAY'
        };

      case 'JOB_COMPLETED':
        return {
          title: 'Service Completed',
          message: `Service for booking #${bookingCode || ''} is completed. Total Amount: ₹${totalAmount || 0}.`,
          whatsappTemplate: 'JOB_COMPLETED'
        };

      case 'INVOICE_GENERATED':
        return {
          title: 'Invoice Issued',
          message: `Official GST Invoice #${invoiceNumber || 'INV-100'} generated for ₹${totalAmount || 0}.`,
          whatsappTemplate: 'INVOICE_CREATED'
        };

      case 'PAYMENT_SUCCESSFUL':
        return {
          title: 'Payment Successful',
          message: `Payment of ₹${totalAmount || 0} for booking #${bookingCode || ''} was successfully verified.`,
          whatsappTemplate: 'PAYMENT_SUCCESSFUL'
        };

      case 'NEW_JOB_WORKER':
        return {
          title: 'New Service Job Available',
          message: `New job alert: ${serviceName || 'Service'} in your operational zone. Open app to accept!`,
          whatsappTemplate: 'WORKER_NEW_JOB'
        };

      case 'JOB_CANCELLED':
        return {
          title: 'Booking Cancelled',
          message: `Booking #${bookingCode || ''} has been cancelled.`,
          whatsappTemplate: 'JOB_CANCELLED'
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
    if (event === 'PAYMENT_SUCCESSFUL' || event === 'INVOICE_GENERATED') return 'payment';
    if (event === 'EMERGENCY_DISPATCH' || event === 'WORKFORCE_ALERT') return 'emergency';
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
