import { 
  Booking, 
  BookingStatus, 
  BookingStatusHistory, 
  BookingPart, 
  InvoiceRecord, 
  PaymentRecord, 
  CooperativeRule, 
  NotificationRecord, 
  Worker, 
  ServiceItem, 
  Cooperative,
  ChatMessage
} from '../types';
import { mockServices, mockWorkers, mockBookings, mockCooperatives } from '../data/mockData';

// Local storage tables
const DB_KEYS = {
  BOOKINGS: 'sahakari_db_bookings_v2',
  STATUS_HISTORY: 'sahakari_db_status_history_v2',
  PARTS: 'sahakari_db_parts_v2',
  PAYMENTS: 'sahakari_db_payments_v2',
  INVOICES: 'sahakari_db_invoices_v2',
  COOP_RULES: 'sahakari_db_coop_rules_v2',
  NOTIFICATIONS: 'sahakari_db_notifications_v2',
  WORKERS: 'sahakari_db_workers_v2',
  SERVICES: 'sahakari_db_services_v2',
  COOPERATIVES: 'sahakari_db_cooperatives_v2',
  MESSAGES: 'sahakari_db_messages_v2'
};

// Default Cooperative Rules (95% to worker, 5% to welfare, ₹49 emergency fee, max 25 mins ETA)
export const defaultCooperativeRules: CooperativeRule[] = [
  {
    id: 'rule-coop-1',
    cooperativeId: 'coop-1',
    workerSharePercentage: 95,
    welfareSharePercentage: 5,
    emergencyPriorityFee: 49,
    maxEmergencyEtaMins: 25
  },
  {
    id: 'rule-coop-2',
    cooperativeId: 'coop-2',
    workerSharePercentage: 95,
    welfareSharePercentage: 5,
    emergencyPriorityFee: 49,
    maxEmergencyEtaMins: 25
  },
  {
    id: 'rule-coop-3',
    cooperativeId: 'coop-3',
    workerSharePercentage: 95,
    welfareSharePercentage: 5,
    emergencyPriorityFee: 49,
    maxEmergencyEtaMins: 25
  }
];

// In-memory event bus for real-time reactive updates
type EventCallback = (data: any) => void;
const eventListeners: Record<string, EventCallback[]> = {};

export const realtimeHub = {
  subscribe(event: string, callback: EventCallback): () => void {
    if (!eventListeners[event]) {
      eventListeners[event] = [];
    }
    eventListeners[event].push(callback);
    return () => {
      eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
    };
  },
  emit(event: string, data: any) {
    if (eventListeners[event]) {
      eventListeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in subscriber for ${event}:`, e);
        }
      });
    }
  }
};

import { logger } from '../utils/logger';

function readTable<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    logger.warn('[DB Service] Error reading table key:', key, err);
    return fallback;
  }
}

function writeTable<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error for', key, err);
  }
}

export function initializeDatabase() {
  if (!localStorage.getItem(DB_KEYS.SERVICES)) {
    writeTable(DB_KEYS.SERVICES, mockServices);
  }
  if (!localStorage.getItem(DB_KEYS.WORKERS)) {
    writeTable(DB_KEYS.WORKERS, mockWorkers);
  }
  if (!localStorage.getItem(DB_KEYS.COOPERATIVES)) {
    writeTable(DB_KEYS.COOPERATIVES, mockCooperatives);
  }
  if (!localStorage.getItem(DB_KEYS.COOP_RULES)) {
    writeTable(DB_KEYS.COOP_RULES, defaultCooperativeRules);
  }
  if (!localStorage.getItem(DB_KEYS.BOOKINGS)) {
    writeTable(DB_KEYS.BOOKINGS, mockBookings);
  }
  if (!localStorage.getItem(DB_KEYS.STATUS_HISTORY)) {
    // Generate initial history for mock bookings
    const initialHistory: BookingStatusHistory[] = mockBookings.map(b => ({
      id: `hist-${b.id}-1`,
      bookingId: b.id,
      previousStatus: null,
      newStatus: b.status,
      changedBy: 'system',
      notes: 'Initial booking record loaded',
      timestamp: b.statusTimestamps.confirmedAt || new Date().toISOString()
    }));
    writeTable(DB_KEYS.STATUS_HISTORY, initialHistory);
  }
  if (!localStorage.getItem(DB_KEYS.PAYMENTS)) {
    writeTable(DB_KEYS.PAYMENTS, []);
  }
  if (!localStorage.getItem(DB_KEYS.PARTS)) {
    writeTable(DB_KEYS.PARTS, []);
  }
  if (!localStorage.getItem(DB_KEYS.INVOICES)) {
    writeTable(DB_KEYS.INVOICES, []);
  }
  if (!localStorage.getItem(DB_KEYS.NOTIFICATIONS)) {
    writeTable(DB_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        recipientId: 'cust-demo-1',
        recipientType: 'customer',
        title: 'Welcome to PartnerPlus',
        message: '100% Transparent Cooperative Gig Platform with ₹0 corporate commissions.',
        type: 'booking',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ]);
  }
  if (!localStorage.getItem(DB_KEYS.MESSAGES)) {
    const seedMessages: ChatMessage[] = [
      {
        id: 'msg-seed-1',
        bookingId: 'booking-1',
        senderId: 'worker-1',
        senderName: 'Ramesh Murugan',
        senderRole: 'worker',
        text: 'Vanakkam! I am Ramesh, your cooperative electrician. I have packed the replacement MCB switches and tools for your AC wiring work.',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        read: true,
        quickReplyType: 'general'
      },
      {
        id: 'msg-seed-2',
        bookingId: 'booking-1',
        senderId: 'cust-demo-1',
        senderName: 'Priya Sundaram',
        senderRole: 'customer',
        text: 'Hello Ramesh! Thank you. When you reach the complex gate, please tell security you are visiting Flat 3B.',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        read: true,
        quickReplyType: 'direction'
      },
      {
        id: 'msg-seed-3',
        bookingId: 'booking-1',
        senderId: 'worker-1',
        senderName: 'Ramesh Murugan',
        senderRole: 'worker',
        text: 'Noted! I have started from Gandhipuram. ETA is approximately 15 minutes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        read: false,
        quickReplyType: 'eta'
      }
    ];
    writeTable(DB_KEYS.MESSAGES, seedMessages);
  }
}

// Ensure database is ready immediately upon import
initializeDatabase();

// Relational Operations
export const db = {
  // Cooperative Rules
  getCooperativeRules(coopId?: string): CooperativeRule {
    const rules = readTable<CooperativeRule[]>(DB_KEYS.COOP_RULES, defaultCooperativeRules);
    if (coopId) {
      const match = rules.find(r => r.cooperativeId === coopId);
      if (match) return match;
    }
    return rules[0] || defaultCooperativeRules[0];
  },

  // Workers
  getWorkers(): Worker[] {
    return readTable<Worker[]>(DB_KEYS.WORKERS, mockWorkers);
  },
  getWorkerById(id: string): Worker | null {
    const list = this.getWorkers();
    return list.find(w => w.id === id) || null;
  },
  updateWorker(worker: Worker): void {
    const list = this.getWorkers();
    const idx = list.findIndex(w => w.id === worker.id);
    if (idx !== -1) {
      list[idx] = worker;
    } else {
      list.push(worker);
    }
    writeTable(DB_KEYS.WORKERS, list);
    realtimeHub.emit('sahakari:worker_updated', worker);
  },

  // Bookings
  getBookings(customerId?: string): Booking[] {
    const list = readTable<Booking[]>(DB_KEYS.BOOKINGS, mockBookings);
    if (customerId) {
      return list.filter(b => b.customerId === customerId);
    }
    return list;
  },
  getBookingById(id: string): Booking | null {
    const list = this.getBookings();
    return list.find(b => b.id === id) || null;
  },
  getBookingByCode(code: string): Booking | null {
    const list = this.getBookings();
    return list.find(b => b.bookingCode === code) || null;
  },
  insertBooking(booking: Booking): Booking {
    const list = this.getBookings();
    const updated = [booking, ...list];
    writeTable(DB_KEYS.BOOKINGS, updated);
    
    // Log history
    this.insertStatusHistory({
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bookingId: booking.id,
      previousStatus: null,
      newStatus: booking.status,
      changedBy: 'customer',
      notes: 'Booking requested via Cooperative Calculator',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
    });

    realtimeHub.emit('sahakari:booking_created', booking);
    return booking;
  },
  updateBooking(booking: Booking): void {
    const list = this.getBookings();
    const idx = list.findIndex(b => b.id === booking.id);
    if (idx !== -1) {
      list[idx] = booking;
      writeTable(DB_KEYS.BOOKINGS, list);
      realtimeHub.emit('sahakari:booking_updated', booking);
    }
  },

  // Status History
  getStatusHistory(bookingId: string): BookingStatusHistory[] {
    const all = readTable<BookingStatusHistory[]>(DB_KEYS.STATUS_HISTORY, []);
    return all.filter(h => h.bookingId === bookingId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },
  insertStatusHistory(entry: BookingStatusHistory): void {
    const all = readTable<BookingStatusHistory[]>(DB_KEYS.STATUS_HISTORY, []);
    all.push(entry);
    writeTable(DB_KEYS.STATUS_HISTORY, all);
    realtimeHub.emit('sahakari:status_history_added', entry);
  },

  // Parts / Materials
  getBookingParts(bookingId: string): BookingPart[] {
    const parts = readTable<BookingPart[]>(DB_KEYS.PARTS, []);
    return parts.filter(p => p.bookingId === bookingId);
  },
  insertBookingPart(part: BookingPart): BookingPart {
    const parts = readTable<BookingPart[]>(DB_KEYS.PARTS, []);
    parts.push(part);
    writeTable(DB_KEYS.PARTS, parts);

    // Update booking parts total
    const booking = this.getBookingById(part.bookingId);
    if (booking) {
      const allBookingParts = this.getBookingParts(part.bookingId);
      const partsTotal = allBookingParts.reduce((sum, p) => sum + p.totalPrice, 0);
      booking.partsAmount = partsTotal;
      booking.pricing.totalAmount = booking.pricing.serviceCharge + (booking.priorityFee || 0) + partsTotal;
      this.updateBooking(booking);
    }

    realtimeHub.emit('sahakari:part_added', part);
    return part;
  },

  // Payments
  getPayments(bookingId?: string): PaymentRecord[] {
    const payments = readTable<PaymentRecord[]>(DB_KEYS.PAYMENTS, []);
    if (bookingId) {
      return payments.filter(p => p.bookingId === bookingId);
    }
    return payments;
  },
  insertPayment(payment: PaymentRecord): PaymentRecord {
    const payments = readTable<PaymentRecord[]>(DB_KEYS.PAYMENTS, []);
    payments.unshift(payment);
    writeTable(DB_KEYS.PAYMENTS, payments);

    // Update booking payment status
    const booking = this.getBookingById(payment.bookingId);
    if (booking) {
      booking.payment.status = payment.paymentStatus === 'completed' ? 'completed' : 'pending';
      booking.payment.method = payment.paymentMethod;
      booking.payment.transactionId = payment.transactionId;
      booking.payment.paidAt = payment.createdAt;
      this.updateBooking(booking);
    }

    realtimeHub.emit('sahakari:payment_recorded', payment);
    return payment;
  },

  // Invoices
  getInvoices(bookingId?: string): InvoiceRecord[] {
    const invoices = readTable<InvoiceRecord[]>(DB_KEYS.INVOICES, []);
    if (bookingId) {
      return invoices.filter(i => i.bookingId === bookingId);
    }
    return invoices;
  },
  getInvoiceByBookingId(bookingId: string): InvoiceRecord | null {
    const list = this.getInvoices(bookingId);
    return list[0] || null;
  },
  insertInvoice(invoice: InvoiceRecord): InvoiceRecord {
    const invoices = readTable<InvoiceRecord[]>(DB_KEYS.INVOICES, []);
    const filtered = invoices.filter(i => i.bookingId !== invoice.bookingId);
    filtered.unshift(invoice);
    writeTable(DB_KEYS.INVOICES, filtered);
    realtimeHub.emit('sahakari:invoice_generated', invoice);
    return invoice;
  },

  // Notifications
  getNotifications(recipientId?: string): NotificationRecord[] {
    const list = readTable<NotificationRecord[]>(DB_KEYS.NOTIFICATIONS, []);
    if (recipientId) {
      return list.filter(n => n.recipientId === recipientId);
    }
    return list;
  },
  insertNotification(notif: NotificationRecord): NotificationRecord {
    const list = readTable<NotificationRecord[]>(DB_KEYS.NOTIFICATIONS, []);
    list.unshift(notif);
    writeTable(DB_KEYS.NOTIFICATIONS, list);
    realtimeHub.emit('sahakari:notification_created', notif);
    return notif;
  },
  markNotificationRead(id: string): void {
    const list = readTable<NotificationRecord[]>(DB_KEYS.NOTIFICATIONS, []);
    const match = list.find(n => n.id === id);
    if (match) {
      match.isRead = true;
      writeTable(DB_KEYS.NOTIFICATIONS, list);
    }
  },

  // Real-time Job Coordination Messaging
  getMessages(bookingId?: string): ChatMessage[] {
    const list = readTable<ChatMessage[]>(DB_KEYS.MESSAGES, []);
    if (bookingId) {
      const booking = this.getBookingById(bookingId);
      const filtered = list
        .filter(m => m.bookingId === bookingId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      if (booking && filtered.length > 0) {
        return filtered.map(msg => {
          if (msg.senderRole === 'worker' && booking.workerName) {
            return { ...msg, senderName: booking.workerName };
          }
          if (msg.senderRole === 'customer' && booking.customerName) {
            return { ...msg, senderName: booking.customerName };
          }
          return msg;
        });
      }
      return filtered;
    }
    return list;
  },

  insertMessage(msg: ChatMessage): ChatMessage {
    const list = readTable<ChatMessage[]>(DB_KEYS.MESSAGES, []);
    list.push(msg);
    writeTable(DB_KEYS.MESSAGES, list);
    realtimeHub.emit('sahakari:message_sent', msg);
    
    // Broadcast across browser tabs if supported
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('sahakari_chat_channel');
        channel.postMessage({ type: 'NEW_MESSAGE', payload: msg });
        channel.close();
      }
    } catch {
      // Fallback to localStorage event
    }

    return msg;
  },

  markMessagesRead(bookingId: string, forRole: 'customer' | 'worker'): void {
    const list = readTable<ChatMessage[]>(DB_KEYS.MESSAGES, []);
    let modified = false;
    list.forEach(m => {
      // If customer is reading, mark worker messages as read; and vice versa
      if (m.bookingId === bookingId && m.senderRole !== forRole && !m.read) {
        m.read = true;
        modified = true;
      }
    });
    if (modified) {
      writeTable(DB_KEYS.MESSAGES, list);
      realtimeHub.emit('sahakari:messages_read', { bookingId, forRole });
    }
  },

  getUnreadMessagesCount(bookingId: string, forRole: 'customer' | 'worker'): number {
    const list = readTable<ChatMessage[]>(DB_KEYS.MESSAGES, []);
    return list.filter(m => m.bookingId === bookingId && m.senderRole !== forRole && !m.read).length;
  }
};
