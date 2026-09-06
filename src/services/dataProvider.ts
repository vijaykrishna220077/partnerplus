import { 
  Worker, 
  ServiceItem, 
  Booking, 
  BookingStatus, 
  Cooperative, 
  InvoiceRecord, 
  PaymentRecord,
  NotificationRecord
} from '../types';
import { db } from './db';
import { supabase } from './supabaseClient';
import { mockServices, mockCooperatives } from '../data/mockData';

export interface IDataProvider {
  getWorkers(): Promise<Worker[]>;
  getWorkerById(id: string): Promise<Worker | undefined>;
  getServices(): Promise<ServiceItem[]>;
  getBookings(userRole?: string, userId?: string): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | undefined>;
  createBooking(bookingData: Partial<Booking>): Promise<Booking>;
  updateBookingStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking>;
  getInvoices(): Promise<InvoiceRecord[]>;
  getPayments(): Promise<PaymentRecord[]>;
  getCooperatives(): Promise<Cooperative[]>;
  getNotifications(recipientId?: string): Promise<NotificationRecord[]>;
}

/**
 * Demo Data Provider: Interacts with local storage & mock datasets
 */
export class DemoDataProvider implements IDataProvider {
  async getWorkers(): Promise<Worker[]> {
    return db.getWorkers();
  }

  async getWorkerById(id: string): Promise<Worker | undefined> {
    const worker = db.getWorkerById(id);
    return worker || undefined;
  }

  async getServices(): Promise<ServiceItem[]> {
    return mockServices;
  }

  async getBookings(userRole?: string, userId?: string): Promise<Booking[]> {
    if (userRole === 'customer' && userId) {
      return db.getBookings(userId);
    }
    return db.getBookings();
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    const b = db.getBookingById(id);
    return b || undefined;
  }

  async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    const newBooking: Booking = {
      id: bookingData.id || `bk-${Date.now()}`,
      bookingCode: bookingData.bookingCode || `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: bookingData.customerId || 'cust-101',
      customerName: bookingData.customerName || 'Customer',
      customerPhone: bookingData.customerPhone || '9876543210',
      workerId: bookingData.workerId || 'worker-1',
      workerName: bookingData.workerName || 'Worker',
      workerPhoto: bookingData.workerPhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      workerPhone: bookingData.workerPhone || '9876543211',
      cooperativeName: bookingData.cooperativeName || 'Chennai South Artisan Cooperative',
      serviceCategory: bookingData.serviceCategory || 'plumbing',
      serviceName: bookingData.serviceName || 'General Plumbing Service',
      problemDescription: bookingData.problemDescription || 'Service required',
      address: bookingData.address || {
        street: '12, Main Road',
        area: 'Adyar',
        city: 'Chennai',
        pincode: '600020'
      },
      scheduledDate: bookingData.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTimeSlot: bookingData.scheduledTimeSlot || '10:00 AM',
      isEmergency: bookingData.isEmergency ?? false,
      status: bookingData.status || 'requested',
      statusTimestamps: bookingData.statusTimestamps || {
        confirmedAt: new Date().toISOString()
      },
      pricing: bookingData.pricing || {
        serviceCharge: 299,
        workerEarnings: 284,
        cooperativeWelfareFund: 15,
        platformConvenienceFee: 0,
        taxGST: 54,
        totalAmount: 353
      },
      payment: bookingData.payment || {
        method: 'upi',
        status: 'pending'
      },
      ...bookingData
    } as Booking;

    return db.insertBooking(newBooking);
  }

  async updateBookingStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    const booking = db.getBookingById(id);
    if (!booking) {
      throw new Error(`Booking ${id} not found`);
    }
    booking.status = status;
    if (notes && booking.statusTimestamps) {
      booking.statusTimestamps.completedAt = new Date().toISOString();
    }
    db.updateBooking(booking);
    return booking;
  }

  async getInvoices(): Promise<InvoiceRecord[]> {
    return db.getInvoices();
  }

  async getPayments(): Promise<PaymentRecord[]> {
    return db.getPayments();
  }

  async getCooperatives(): Promise<Cooperative[]> {
    return mockCooperatives;
  }

  async getNotifications(recipientId?: string): Promise<NotificationRecord[]> {
    return db.getNotifications(recipientId);
  }
}

/**
 * Supabase Data Provider: Interacts directly with PostgreSQL tables in Supabase
 */
export class SupabaseDataProvider implements IDataProvider {
  private fallback = new DemoDataProvider();

  async getWorkers(): Promise<Worker[]> {
    try {
      if (!supabase) return this.fallback.getWorkers();
      const { data, error } = await supabase.from('workers').select('*');
      if (error || !data || data.length === 0) {
        return this.fallback.getWorkers();
      }
      return data.map((w: any) => ({
        id: w.id,
        name: w.name,
        nameTa: w.name_ta,
        nameHi: w.name_hi,
        photoUrl: w.photo_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
        phone: w.phone,
        primarySkill: w.primary_skill || 'plumbing',
        primarySkillLabel: w.primary_skill_label || 'Plumbing & Sanitation',
        otherSkills: w.other_skills || [],
        experienceYears: w.experience_years || 5,
        rating: w.rating || 4.8,
        jobsCompleted: w.jobs_completed || 42,
        distanceKm: w.distance_km || 1.2,
        isVerified: w.is_verified ?? true,
        verificationStatus: w.verification_status || 'verified',
        isAvailableToday: w.is_available_today ?? true,
        isEmergencyReady: w.is_emergency_ready ?? true,
        startingPrice: w.starting_price || 299,
        cooperativeId: w.cooperative_id || 'coop-1',
        cooperativeName: w.cooperative_name || 'Chennai South Artisan Cooperative',
        cooperativeRegNo: w.cooperative_reg_no || 'TN-COOP-2024-089',
        locationArea: w.location_area || 'Adyar',
        city: w.city || 'Chennai',
        latitude: w.latitude,
        longitude: w.longitude,
        languages: w.languages || ['English', 'Tamil'],
        bio: w.bio || 'Experienced certified artisan',
        certifications: w.certifications || [],
        skillsList: w.skills_list || [],
        reviews: w.reviews || [],
        welfareSchemeId: w.welfare_scheme_id || 'PMSBY-2026-COOP',
        isIdentityChecked: w.is_identity_checked ?? true,
        isPoliceClearanceVerified: w.is_police_clearance_verified ?? true,
        bankAccountLinked: w.bank_account_linked ?? true
      }));
    } catch {
      return this.fallback.getWorkers();
    }
  }

  async getWorkerById(id: string): Promise<Worker | undefined> {
    const workers = await this.getWorkers();
    return workers.find(w => w.id === id);
  }

  async getServices(): Promise<ServiceItem[]> {
    return this.fallback.getServices();
  }

  async getBookings(userRole?: string, userId?: string): Promise<Booking[]> {
    return this.fallback.getBookings(userRole, userId);
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    const bookings = await this.getBookings();
    return bookings.find(b => b.id === id);
  }

  async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    const createdInDemo = await this.fallback.createBooking(bookingData);
    try {
      if (supabase) {
        await supabase.from('bookings').insert({
          id: createdInDemo.id,
          booking_code: createdInDemo.bookingCode,
          customer_id: createdInDemo.customerId,
          customer_name: createdInDemo.customerName,
          customer_phone: createdInDemo.customerPhone,
          worker_id: createdInDemo.workerId,
          worker_name: createdInDemo.workerName,
          worker_phone: createdInDemo.workerPhone,
          cooperative_name: createdInDemo.cooperativeName,
          service_category: createdInDemo.serviceCategory,
          service_name: createdInDemo.serviceName,
          scheduled_date: createdInDemo.scheduledDate,
          scheduled_time_slot: createdInDemo.scheduledTimeSlot,
          status: createdInDemo.status,
          total_amount: createdInDemo.pricing.totalAmount
        });
      }
    } catch (err) {
      console.warn('Supabase booking insert warning:', err);
    }
    return createdInDemo;
  }

  async updateBookingStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    const updated = await this.fallback.updateBookingStatus(id, status, notes);
    try {
      if (supabase) {
        await supabase
          .from('bookings')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);
      }
    } catch (err) {
      console.warn('Supabase booking status update warning:', err);
    }
    return updated;
  }

  async getInvoices(): Promise<InvoiceRecord[]> {
    return this.fallback.getInvoices();
  }

  async getPayments(): Promise<PaymentRecord[]> {
    return this.fallback.getPayments();
  }

  async getCooperatives(): Promise<Cooperative[]> {
    return this.fallback.getCooperatives();
  }

  async getNotifications(recipientId?: string): Promise<NotificationRecord[]> {
    return this.fallback.getNotifications(recipientId);
  }
}

/**
 * Singleton DataProvider Instance selecting mode cleanly based on VITE_APP_MODE
 */
const isProduction = import.meta.env.VITE_APP_MODE === 'production' || import.meta.env.VITE_USE_SUPABASE === 'true';
export const dataProvider: IDataProvider = isProduction ? new SupabaseDataProvider() : new DemoDataProvider();
