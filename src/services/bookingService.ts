import { 
  Booking, 
  BookingStatus, 
  ServiceCategory, 
  InvoiceRecord, 
  PaymentRecord, 
  WorkerMatchResult, 
  BookingPart 
} from '../types';
import { db, realtimeHub } from './db';
import { matchingService } from './matchingService';
import { pricingService } from './pricingService';

export interface CreateBookingFromCalculatorParams {
  categoryId: string;
  categoryName: string;
  taskId: string;
  taskName: string;
  taskUnit: string;
  basePrice: number;
  quantity: number;
  isEmergency: boolean;
  needMaterials: boolean;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerArea?: string;
  customerLat?: number;
  customerLng?: number;
  selectedSlot: 'immediate' | 'evening' | 'tomorrow';
  paymentMode: 'cash' | 'upi';
  problemDescription?: string;
}

export const bookingService = {
  /**
   * Complete booking workflow triggered by the Cooperative Calculator.
   */
  async createBookingFromCalculator(
    params: CreateBookingFromCalculatorParams
  ): Promise<{ booking: Booking; match: WorkerMatchResult; invoice: InvoiceRecord }> {
    // 1. Validation
    if (!params.customerName.trim()) {
      throw new Error('Customer full name is required');
    }
    const cleanPhone = params.customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }
    if (!params.customerAddress.trim()) {
      throw new Error('Please provide your service address and landmark');
    }

    // 2. Worker Matching
    const serviceCategory = params.categoryId as ServiceCategory;
    const match = matchingService.findBestWorker({
      category: serviceCategory,
      taskId: params.taskId,
      isEmergency: params.isEmergency,
      customerLat: params.customerLat,
      customerLng: params.customerLng,
      customerArea: params.customerArea || params.customerAddress
    });
    const matchedWorker = match.worker;

    // 3. Transparent Pricing Calculation
    const pricing = pricingService.calculate({
      basePrice: params.basePrice,
      quantity: params.quantity,
      isEmergency: params.isEmergency,
      needMaterials: params.needMaterials,
      cooperativeId: matchedWorker.cooperativeId
    });

    // 4. Time Slot Normalization
    let scheduledSlotLabel = '⚡ Right Now (15-25 Mins)';
    const todayStr = new Date().toISOString().split('T')[0];
    let scheduledDateStr = todayStr;

    if (params.selectedSlot === 'evening') {
      scheduledSlotLabel = '4:00 PM - 7:00 PM Today';
    } else if (params.selectedSlot === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      scheduledDateStr = tomorrow.toISOString().split('T')[0];
      scheduledSlotLabel = 'Tomorrow Morning (9:00 AM - 11:00 AM)';
    }

    const bookingId = `bk-${Date.now().toString().slice(-6)}`;
    const randomRefNumber = Math.floor(100000 + Math.random() * 900000);
    const bookingCode = `COOP-${randomRefNumber}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });

    // 5. Construct the full relational Booking record
    const newBooking: Booking = {
      id: bookingId,
      bookingCode,
      customerId: `cust-${cleanPhone.slice(-4)}`,
      customerName: params.customerName.trim(),
      customerPhone: params.customerPhone.trim(),
      workerId: matchedWorker.id,
      workerName: matchedWorker.name,
      workerPhoto: matchedWorker.photoUrl,
      workerPhone: matchedWorker.phone,
      cooperativeName: matchedWorker.cooperativeName,
      serviceCategory,
      serviceName: params.taskName,
      specificTaskId: params.taskId,
      specificTaskName: params.taskName,
      quantity: params.quantity,
      taskUnit: params.taskUnit,
      problemDescription: params.problemDescription || `${params.taskName} - ${params.quantity} ${params.taskUnit}`,
      address: {
        street: params.customerAddress,
        area: params.customerArea || 'Local Cooperative Zone',
        city: matchedWorker.city || 'Chennai',
        pincode: '600001',
        latitude: params.customerLat || 13.0827,
        longitude: params.customerLng || 80.2707
      },
      scheduledDate: scheduledDateStr,
      scheduledTimeSlot: scheduledSlotLabel,
      isEmergency: params.isEmergency,
      requiresParts: params.needMaterials,
      partsEstimatedAmount: 0,
      priorityFee: pricing.emergencyFee,
      status: 'worker_assigned',
      statusTimestamps: {
        confirmedAt: nowTime,
        acceptedAt: nowTime
      },
      pricing: {
        serviceCharge: pricing.baseAmount,
        workerEarnings: pricing.workerEarnings,
        cooperativeWelfareFund: pricing.welfareFund,
        platformConvenienceFee: 0,
        taxGST: pricing.taxGST,
        totalAmount: pricing.totalCustomerAmount
      },
      payment: {
        method: params.paymentMode,
        status: params.paymentMode === 'cash' ? 'cash_on_delivery' : 'pending'
      },
      matchScore: match.matchScore,
      workerDistanceKm: matchedWorker.distanceKm,
      workerRating: matchedWorker.rating,
      etaMinutes: params.isEmergency ? 15 : 25,
      assignedAt: nowTime
    };

    // Save Booking to Database
    db.insertBooking(newBooking);

    // 6. Generate Cooperative Tax Invoice
    const invoiceRecord: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${bookingCode}`,
      bookingId: newBooking.id,
      bookingCode: newBooking.bookingCode,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      customerAddress: newBooking.address.street,
      workerName: matchedWorker.name,
      workerPhone: matchedWorker.phone,
      cooperativeName: matchedWorker.cooperativeName,
      cooperativeRegNo: matchedWorker.cooperativeRegNo || 'TN-COOP-442/2014',
      serviceCategory: params.categoryName,
      serviceName: params.taskName,
      taskName: params.taskName,
      quantity: params.quantity,
      baseAmount: pricing.baseAmount,
      priorityFee: pricing.emergencyFee,
      partsAmount: 0,
      totalAmount: pricing.totalCustomerAmount,
      workerEarnings: pricing.workerEarnings,
      welfareFund: pricing.welfareFund,
      taxGST: pricing.taxGST,
      paymentMethod: params.paymentMode.toUpperCase(),
      paymentStatus: params.paymentMode === 'cash' ? 'Cash on Completion' : 'Pending',
      generatedAt: nowTime
    };
    db.insertInvoice(invoiceRecord);

    // 7. Dispatch Notifications
    db.insertNotification({
      id: `notif-${Date.now()}-1`,
      recipientId: newBooking.customerId,
      recipientType: 'customer',
      title: 'Worker Assigned!',
      message: `${matchedWorker.name} (${matchedWorker.rating} ★, ${matchedWorker.distanceKm} km away) has been assigned to your booking.`,
      type: 'status_update',
      bookingId: newBooking.id,
      isRead: false,
      createdAt: nowTime
    });

    db.insertNotification({
      id: `notif-${Date.now()}-2`,
      recipientId: matchedWorker.id,
      recipientType: 'worker',
      title: params.isEmergency ? '🚨 Urgent 15-Min Booking Dispatch' : 'New Cooperative Booking Request',
      message: `${params.taskName} (${params.quantity} ${params.taskUnit}) for ${params.customerName}. Direct worker payout: ₹${pricing.workerEarnings}.`,
      type: params.isEmergency ? 'emergency' : 'booking',
      bookingId: newBooking.id,
      isRead: false,
      createdAt: nowTime
    });

    return { booking: newBooking, match, invoice: invoiceRecord };
  },

  /**
   * Advance status of a booking along the full lifecycle.
   */
  async updateStatus(
    bookingId: string, 
    newStatus: BookingStatus, 
    changedBy: string = 'system',
    notes?: string
  ): Promise<Booking | null> {
    const booking = db.getBookingById(bookingId);
    if (!booking) return null;

    const prevStatus = booking.status;
    booking.status = newStatus;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });

    if (newStatus === 'worker_accepted') booking.statusTimestamps.acceptedAt = timeStr;
    if (newStatus === 'on_the_way') booking.statusTimestamps.onTheWayAt = timeStr;
    if (newStatus === 'arrived') booking.statusTimestamps.arrivedAt = timeStr;
    if (newStatus === 'service_started') booking.statusTimestamps.startedAt = timeStr;
    if (newStatus === 'service_completed') {
      booking.statusTimestamps.completedAt = timeStr;
      if (booking.payment.method === 'cash') {
        booking.payment.status = 'completed';
      }
    }

    db.updateBooking(booking);

    db.insertStatusHistory({
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bookingId: booking.id,
      previousStatus: prevStatus,
      newStatus,
      changedBy,
      notes: notes || `Status updated from ${prevStatus} to ${newStatus}`,
      timestamp: timeStr
    });

    return booking;
  },

  /**
   * Record sandbox payment.
   */
  async recordPayment(
    bookingId: string, 
    method: 'upi' | 'card' | 'netbanking' | 'cash',
    amount: number
  ): Promise<PaymentRecord | null> {
    const booking = db.getBookingById(bookingId);
    if (!booking) return null;

    const txId = `TXN-COOP-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const nowTime = new Date().toISOString();

    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      bookingId,
      amount,
      paymentMethod: method,
      transactionId: txId,
      paymentStatus: 'completed',
      providerReference: `NPCI-UPI-${Date.now().toString().slice(-8)}`,
      createdAt: nowTime
    };

    db.insertPayment(payment);

    // Update invoice payment status
    const invoice = db.getInvoiceByBookingId(bookingId);
    if (invoice) {
      invoice.paymentStatus = 'Paid';
      invoice.transactionId = txId;
      db.insertInvoice(invoice);
    }

    return payment;
  },

  /**
   * Cancel booking.
   */
  async cancelBooking(bookingId: string, reason: string, cancelledBy: string): Promise<Booking | null> {
    const booking = db.getBookingById(bookingId);
    if (!booking) return null;

    const prev = booking.status;
    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledBy = cancelledBy;
    db.updateBooking(booking);

    db.insertStatusHistory({
      id: `hist-${Date.now()}`,
      bookingId: booking.id,
      previousStatus: prev,
      newStatus: 'cancelled',
      changedBy: cancelledBy || 'customer',
      notes: `Cancelled: ${reason}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
    });

    return booking;
  },

  /**
   * Worker job response (Accept / Reject).
   * If rejected, automatically reassigns to next available worker.
   */
  async workerJobResponse(workerId: string, bookingId: string, accept: boolean): Promise<Booking | null> {
    const booking = db.getBookingById(bookingId);
    if (!booking) return null;

    if (accept) {
      return this.updateStatus(bookingId, 'worker_accepted', `worker-${workerId}`, 'Worker accepted job');
    } else {
      // Reassign to next best worker
      const ranked = matchingService.rankWorkers({
        category: booking.serviceCategory,
        isEmergency: booking.isEmergency
      });
      const nextWorkerMatch = ranked.find(r => r.worker.id !== workerId);

      if (nextWorkerMatch) {
        booking.workerId = nextWorkerMatch.worker.id;
        booking.workerName = nextWorkerMatch.worker.name;
        booking.workerPhone = nextWorkerMatch.worker.phone;
        booking.workerPhoto = nextWorkerMatch.worker.photoUrl;
        booking.cooperativeName = nextWorkerMatch.worker.cooperativeName;
        booking.status = 'worker_assigned';
        db.updateBooking(booking);

        db.insertStatusHistory({
          id: `hist-${Date.now()}`,
          bookingId,
          previousStatus: 'rejected',
          newStatus: 'worker_assigned',
          changedBy: `worker-${workerId}`,
          notes: `Worker declined. Automatically reassigned to ${nextWorkerMatch.worker.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
        });
      }
      return booking;
    }
  }
};
