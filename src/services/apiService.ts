import { 
  ServiceItem, 
  Worker, 
  Booking, 
  BookingStatus, 
  DemandForecastItem, 
  Cooperative,
  ServiceCategory,
  InvoiceRecord,
  PaymentRecord,
  BookingStatusHistory,
  BookingPart,
  WorkerMatchResult,
  ChatMessage
} from '../types';
import { 
  mockServices, 
  mockWorkers, 
  mockBookings, 
  mockDemandForecast, 
  mockCooperatives 
} from '../data/mockData';
import { db, initializeDatabase } from './db';
import { matchingService } from './matchingService';
import { bookingService } from './bookingService';
import { supabase } from './supabaseClient';

export function initDatabase() {
  initializeDatabase();
}

export const apiService = {
  // GET /api/services
  async getServices(): Promise<ServiceItem[]> {
    initializeDatabase();
    try {
      const { data, error } = await supabase.from('services').select('*').eq('active', true);
      if (data && data.length > 0 && !error) {
        return data.map((s: any) => ({
          id: s.id,
          category: s.category as ServiceCategory,
          name: s.service_name,
          nameTa: s.name_ta || s.service_name,
          nameHi: s.name_hi || s.service_name,
          icon: s.icon || 'Wrench',
          description: s.description || '',
          descriptionTa: s.description || '',
          descriptionHi: s.description || '',
          startingPrice: Number(s.starting_price) || 299,
          unit: s.unit || 'per issue',
          estimatedDuration: s.estimated_duration || '30-45 mins',
          popularProblems: ['General repair', 'Maintenance'],
          cooperativeRateGuideline: 'Standard fair wage fixed rate',
          isEmergencyEligible: s.is_emergency_eligible ?? true
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch error, fallback to local storage', e);
    }
    return mockServices;
  },

  // GET /api/workers/nearby
  async getWorkers(filters?: {
    category?: ServiceCategory | 'all';
    location?: string;
    onlyVerified?: boolean;
    onlyAvailable?: boolean;
    emergencyOnly?: boolean;
    searchQuery?: string;
  }): Promise<Worker[]> {
    initializeDatabase();
    let workers = db.getWorkers();

    if (!filters) return workers;

    if (filters.category && filters.category !== 'all') {
      workers = workers.filter(
        w => w.primarySkill === filters.category || w.otherSkills.includes(filters.category as ServiceCategory)
      );
    }

    if (filters.onlyVerified) {
      workers = workers.filter(w => w.isVerified);
    }

    if (filters.onlyAvailable) {
      workers = workers.filter(w => w.isAvailableToday);
    }

    if (filters.emergencyOnly) {
      workers = workers.filter(w => w.isEmergencyReady && w.isAvailableToday);
    }

    if (filters.location && filters.location !== 'all') {
      const locLower = filters.location.toLowerCase();
      workers = workers.filter(
        w => w.locationArea.toLowerCase().includes(locLower) || w.city.toLowerCase().includes(locLower)
      );
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      workers = workers.filter(
        w =>
          w.name.toLowerCase().includes(q) ||
          w.primarySkillLabel.toLowerCase().includes(q) ||
          w.cooperativeName.toLowerCase().includes(q) ||
          w.locationArea.toLowerCase().includes(q)
      );
    }

    return workers;
  },

  // GET /api/workers/:id
  async getWorkerById(id: string): Promise<Worker | null> {
    initializeDatabase();
    return db.getWorkerById(id);
  },

  // POST /api/matching/recommend
  async getMatchingRecommendations(params: {
    category: ServiceCategory;
    taskId?: string;
    isEmergency?: boolean;
    customerLat?: number;
    customerLng?: number;
    customerArea?: string;
  }): Promise<WorkerMatchResult[]> {
    initializeDatabase();
    return matchingService.rankWorkers(params);
  },

  // POST /api/bookings
  async createBooking(payload: Omit<Booking, 'id' | 'bookingCode' | 'statusTimestamps'>): Promise<Booking> {
    initializeDatabase();
    const newId = `bk-${Date.now().toString().slice(-4)}`;
    const randomCode = `COOP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      ...payload,
      id: newId,
      bookingCode: randomCode,
      statusTimestamps: {
        confirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
      }
    };

    db.insertBooking(newBooking);

    try {
      await supabase.from('bookings').insert([{
        booking_number: randomCode,
        customer_name: newBooking.customerName,
        customer_phone: newBooking.customerPhone,
        service_category: newBooking.serviceCategory,
        service_name: newBooking.serviceName,
        worker_name: newBooking.workerName,
        worker_phone: newBooking.workerPhone,
        cooperative_name: newBooking.cooperativeName,
        scheduled_date: newBooking.scheduledDate || new Date().toISOString().split('T')[0],
        start_time: newBooking.scheduledTimeSlot || '10:00 AM',
        problem_description: newBooking.problemDescription,
        street_address: newBooking.address.street,
        area: newBooking.address.area,
        city: newBooking.address.city || 'Chennai',
        pincode: newBooking.address.pincode,
        is_emergency: newBooking.isEmergency,
        status: 'REQUESTED',
        service_charge: newBooking.pricing.serviceCharge,
        worker_expected_earning: newBooking.pricing.workerEarnings,
        cooperative_welfare_fund: newBooking.pricing.cooperativeWelfareFund,
        tax_gst: newBooking.pricing.taxGST,
        total_amount: newBooking.pricing.totalAmount,
        payment_method: newBooking.payment.method,
        payment_status: newBooking.payment.status
      }]);
    } catch (e) {
      console.warn('Supabase booking insert warning:', e);
    }

    return newBooking;
  },

  // GET /api/bookings
  async getBookings(customerId?: string): Promise<Booking[]> {
    initializeDatabase();
    return db.getBookings(customerId);
  },

  // GET /api/bookings/:id
  async getBookingById(id: string): Promise<Booking | null> {
    initializeDatabase();
    return db.getBookingById(id);
  },

  // GET /api/bookings/history/:id
  async getBookingStatusHistory(bookingId: string): Promise<BookingStatusHistory[]> {
    initializeDatabase();
    return db.getStatusHistory(bookingId);
  },

  // PATCH /api/bookings/:id/status
  async updateBookingStatus(id: string, status: BookingStatus, changedBy: string = 'system', notes?: string): Promise<Booking | null> {
    initializeDatabase();
    return bookingService.updateStatus(id, status, changedBy, notes);
  },

  // POST /api/bookings/:id/cancel
  async cancelBooking(id: string, reason: string, cancelledBy: string = 'customer'): Promise<Booking | null> {
    initializeDatabase();
    return bookingService.cancelBooking(id, reason, cancelledBy);
  },

  // POST /api/payments
  async recordPayment(bookingId: string, method: 'upi' | 'card' | 'netbanking' | 'cash', amount: number): Promise<PaymentRecord | null> {
    initializeDatabase();
    return bookingService.recordPayment(bookingId, method, amount);
  },

  // GET /api/invoices/:bookingId
  async getInvoiceByBookingId(bookingId: string): Promise<InvoiceRecord | null> {
    initializeDatabase();
    return db.getInvoiceByBookingId(bookingId);
  },

  // POST /api/bookings/:id/parts
  async addBookingPart(part: BookingPart): Promise<BookingPart> {
    initializeDatabase();
    return db.insertBookingPart(part);
  },

  // GET /api/bookings/:id/parts
  async getBookingParts(bookingId: string): Promise<BookingPart[]> {
    initializeDatabase();
    return db.getBookingParts(bookingId);
  },

  // POST /api/worker/jobs/:id/respond
  async respondToWorkerJob(workerId: string, bookingId: string, accept: boolean): Promise<Booking | null> {
    initializeDatabase();
    return bookingService.workerJobResponse(workerId, bookingId, accept);
  },

  // POST /api/reviews
  async submitReview(bookingId: string, rating: number, tags: string[], comment: string): Promise<Booking | null> {
    initializeDatabase();
    const booking = db.getBookingById(bookingId);
    if (!booking) return null;

    const reviewedAt = new Date().toISOString().split('T')[0];
    booking.review = {
      rating,
      tags,
      comment,
      reviewedAt
    };
    db.updateBooking(booking);

    // Update worker reviews & rating
    const worker = db.getWorkerById(booking.workerId);
    if (worker) {
      const newReview = {
        id: `rev-${Date.now()}`,
        customerName: booking.customerName,
        rating,
        date: reviewedAt,
        comment: comment || 'Service delivered professionally with cooperative care.',
        tags,
        serviceName: booking.serviceName
      };
      worker.reviews = [newReview, ...(worker.reviews || [])];
      const totalStars = worker.reviews.reduce((sum, r) => sum + r.rating, 0);
      worker.rating = worker.reviews.length > 0 ? Number((totalStars / worker.reviews.length).toFixed(2)) : 5.0;
      worker.jobsCompleted += 1;
      db.updateWorker(worker);
    }

    return booking;
  },

  // Worker toggle availability
  async toggleWorkerAvailability(workerId: string, isAvailable: boolean): Promise<Worker | null> {
    initializeDatabase();
    const worker = db.getWorkerById(workerId);
    if (!worker) return null;
    worker.isAvailableToday = isAvailable;
    db.updateWorker(worker);
    return worker;
  },

  // Register a new worker (Self-Enrollment flow)
  async registerWorker(data: Partial<Worker>): Promise<Worker> {
    initializeDatabase();
    const newWorker: Worker = {
      id: `wrk-${Date.now().toString().slice(-4)}`,
      name: data.name || 'New Cooperative Worker',
      phone: data.phone || '+91 98000 00000',
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      primarySkill: data.primarySkill || 'electrical',
      primarySkillLabel: data.primarySkillLabel || 'General Technician',
      otherSkills: data.otherSkills || [],
      experienceYears: data.experienceYears || 2,
      rating: 5.0,
      jobsCompleted: 0,
      distanceKm: 1.5,
      isVerified: false,
      verificationStatus: 'under_review',
      isAvailableToday: true,
      isEmergencyReady: false,
      startingPrice: data.startingPrice || 299,
      cooperativeId: data.cooperativeId || 'coop-1',
      cooperativeName: data.cooperativeName || 'Chennai Central Labour Cooperative Society',
      cooperativeRegNo: 'TN-LCS-442/2014',
      locationArea: data.locationArea || 'Anna Nagar',
      city: data.city || 'Chennai',
      languages: data.languages || ['Tamil', 'English'],
      bio: data.bio || 'New verified cooperative member.',
      certifications: [],
      skillsList: [],
      reviews: [],
      welfareSchemeId: 'PMSBY-2026-PENDING',
      isIdentityChecked: true,
      isPoliceClearanceVerified: false,
      bankAccountLinked: true
    };
    db.updateWorker(newWorker);
    return newWorker;
  },

  // Verify / Suspend Worker (Cooperative Admin action)
  async updateWorkerStatus(workerId: string, status: 'verified' | 'rejected' | 'under_review'): Promise<Worker | null> {
    initializeDatabase();
    const worker = db.getWorkerById(workerId);
    if (!worker) return null;
    worker.verificationStatus = status;
    worker.isVerified = status === 'verified';
    if (status === 'verified') {
      worker.isPoliceClearanceVerified = true;
    }
    db.updateWorker(worker);
    return worker;
  },

  async verifyWorker(workerId: string): Promise<Worker | null> {
    return this.updateWorkerStatus(workerId, 'verified');
  },

  // GET /api/forecast/demand
  async getDemandForecast(): Promise<DemandForecastItem[]> {
    initializeDatabase();
    return mockDemandForecast;
  },

  // Deploy recommendation roster
  async deployForecastRoster(forecastId: string, areaName: string, count: number): Promise<boolean> {
    initializeDatabase();
    return true;
  },

  // GET /api/admin/dashboard
  async getAdminDashboardData() {
    initializeDatabase();
    const workers = db.getWorkers();
    const bookings = db.getBookings();
    const cooperatives = mockCooperatives;
    const forecasts = mockDemandForecast;

    const totalWorkers = workers.length;
    const verifiedWorkers = workers.filter(w => w.isVerified).length;
    const activeJobs = bookings.filter(b => b.status !== 'service_completed' && b.status !== 'cancelled').length;
    const completedJobs = bookings.filter(b => b.status === 'service_completed').length;
    const totalEarnings = bookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0) + 148500;
    const totalWelfareFund = bookings.reduce((sum, b) => sum + (b.pricing?.cooperativeWelfareFund || 0), 0) + 420000;

    return {
      cooperative: cooperatives[0],
      totalWorkers,
      verifiedWorkers,
      pendingVerification: totalWorkers - verifiedWorkers,
      activeJobs,
      completedJobs,
      totalEarnings,
      totalWelfareFund,
      workerUtilizationRate: '86.4%',
      recentBookings: bookings.slice(0, 10),
      workersList: workers,
      demandForecasts: forecasts
    };
  },

  // Real-time Chat & Job Coordination Methods
  async getMessages(bookingId?: string): Promise<ChatMessage[]> {
    initializeDatabase();
    return db.getMessages(bookingId);
  },

  async sendMessage(data: {
    bookingId: string;
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'worker' | 'cooperative';
    text: string;
    quickReplyType?: 'eta' | 'arrival' | 'direction' | 'materials' | 'general';
    isAudioTranscription?: boolean;
  }): Promise<ChatMessage> {
    initializeDatabase();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bookingId: data.bookingId,
      senderId: data.senderId,
      senderName: data.senderName,
      senderRole: data.senderRole,
      text: data.text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      quickReplyType: data.quickReplyType,
      isAudioTranscription: data.isAudioTranscription
    };
    return db.insertMessage(newMsg);
  },

  async markMessagesAsRead(bookingId: string, forRole: 'customer' | 'worker'): Promise<void> {
    initializeDatabase();
    db.markMessagesRead(bookingId, forRole);
  },

  getUnreadCount(bookingId: string, forRole: 'customer' | 'worker'): number {
    initializeDatabase();
    return db.getUnreadMessagesCount(bookingId, forRole);
  }
};
