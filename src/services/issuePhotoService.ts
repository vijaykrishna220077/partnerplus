import { JobIssuePhoto, Booking } from '../types';
import { supabase } from './supabaseClient';
import { db } from './db';
import { notificationService } from './notificationService';
import { whatsappService } from './whatsappService';

export interface UploadPhotoItem {
  file: File;
  description?: string;
}

export interface UploadIssuePhotosParams {
  bookingId: string;
  customerId: string;
  workerId?: string;
  items: UploadPhotoItem[];
}

export const issuePhotoService = {
  /**
   * Validates image file type and size.
   * Max size: 5MB. Allowed: JPG, JPEG, PNG, WEBP.
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: `Unsupported file type "${file.name}". Please upload JPG, PNG, or WEBP images.`
      };
    }
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File "${file.name}" exceeds the 5MB size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`
      };
    }
    return { valid: true };
  },

  /**
   * Reads a file as Data URL for fallback / preview rendering.
   */
  readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Uploads issue photos to Supabase Storage and records metadata in PostgreSQL & DB.
   */
  async uploadIssuePhotos(params: UploadIssuePhotosParams): Promise<JobIssuePhoto[]> {
    const { bookingId, customerId, workerId, items } = params;

    if (!items || items.length === 0) {
      throw new Error('Please select at least one photo to upload.');
    }

    // Check maximum 5 photos limit for booking
    const existingPhotos = this.getIssuePhotosForBooking(bookingId);
    if (existingPhotos.length + items.length > 5) {
      throw new Error(`Maximum 5 issue photos allowed per booking. You already have ${existingPhotos.length} photo(s).`);
    }

    // Validate all items first
    for (const item of items) {
      const check = this.validateFile(item.file);
      if (!check.valid) {
        throw new Error(check.error);
      }
    }

    const uploadedRecords: JobIssuePhoto[] = [];
    const booking = db.getBookingById(bookingId);

    for (const item of items) {
      const photoId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const cleanFileName = item.file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `bookings/${bookingId}/${photoId}_${cleanFileName}`;

      let publicUrl = '';
      let storageUploaded = false;

      try {
        // Attempt upload to Supabase Storage bucket 'job-issue-photos'
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('job-issue-photos')
          .upload(storagePath, item.file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadError && uploadData) {
          storageUploaded = true;
          const { data: urlData } = supabase.storage
            .from('job-issue-photos')
            .getPublicUrl(storagePath);
          publicUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.warn('Supabase storage upload fallback activated:', err);
      }

      // If Supabase Storage is initializing or unauthenticated in local dev, read Data URL for real preview
      if (!publicUrl) {
        publicUrl = await this.readFileAsDataUrl(item.file);
      }

      const newPhotoRecord: JobIssuePhoto = {
        id: photoId,
        bookingId,
        customerId,
        workerId: workerId || booking?.workerId,
        storagePath,
        fileName: item.file.name,
        publicUrl,
        description: item.description?.trim() || undefined,
        fileSize: item.file.size,
        mimeType: item.file.type,
        createdAt: new Date().toISOString()
      };

      // Save to Supabase PostgreSQL table job_issue_photos
      try {
        await supabase.from('job_issue_photos').insert([{
          id: newPhotoRecord.id,
          booking_id: newPhotoRecord.bookingId,
          customer_id: newPhotoRecord.customerId,
          worker_id: newPhotoRecord.workerId,
          storage_path: newPhotoRecord.storagePath,
          file_name: newPhotoRecord.fileName,
          description: newPhotoRecord.description,
          file_size: newPhotoRecord.fileSize,
          mime_type: newPhotoRecord.mimeType,
          created_at: newPhotoRecord.createdAt
        }]);
      } catch (dbErr) {
        console.warn('Supabase metadata row insert fallback:', dbErr);
      }

      // Save to local DB store for immediate offline/hybrid sync
      db.addIssuePhoto(newPhotoRecord);
      uploadedRecords.push(newPhotoRecord);
    }

    // Trigger Notification for Assigned Worker
    const assignedWorkerId = workerId || booking?.workerId;
    if (assignedWorkerId && booking) {
      db.insertNotification({
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        recipientId: assignedWorkerId,
        recipientType: 'worker',
        title: '📷 New Issue Photos Received',
        message: `Customer ${booking.customerName} shared ${items.length} issue photo(s) for booking #${booking.bookingCode}.`,
        type: 'booking',
        bookingId,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Send secure WhatsApp notification without public image URL
      if (booking.workerPhone) {
        try {
          await whatsappService.sendDirectMessage(
            booking.workerPhone,
            `Customer ${booking.customerName} shared ${items.length} new issue photo(s) for booking #${booking.bookingCode}. Log in to PartnerPlus to inspect detail photos securely.`,
            booking.workerName
          );
        } catch (waErr) {
          console.warn('WhatsApp issue photo dispatch failed:', waErr);
        }
      }
    }

    return uploadedRecords;
  },

  /**
   * Retrieves issue photos linked to a booking.
   */
  getIssuePhotosForBooking(bookingId: string): JobIssuePhoto[] {
    return db.getIssuePhotosByBookingId(bookingId);
  },

  /**
   * Async fetch issue photos from Supabase PostgreSQL & fallback DB.
   */
  async fetchIssuePhotos(bookingId: string): Promise<JobIssuePhoto[]> {
    try {
      const { data, error } = await supabase
        .from('job_issue_photos')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const fetched: JobIssuePhoto[] = data.map(d => ({
          id: d.id,
          bookingId: d.booking_id,
          customerId: d.customer_id,
          workerId: d.worker_id,
          storagePath: d.storage_path,
          fileName: d.file_name,
          publicUrl: supabase.storage.from('job-issue-photos').getPublicUrl(d.storage_path).data.publicUrl,
          description: d.description,
          fileSize: d.file_size,
          mimeType: d.mime_type,
          createdAt: d.created_at
        }));
        return fetched;
      }
    } catch (err) {
      console.warn('Supabase fetch issue photos fallback:', err);
    }

    return this.getIssuePhotosForBooking(bookingId);
  },

  /**
   * Deletes an issue photo.
   */
  async deleteIssuePhoto(photoId: string, bookingId: string): Promise<boolean> {
    try {
      const photos = this.getIssuePhotosForBooking(bookingId);
      const photo = photos.find(p => p.id === photoId);
      if (photo && photo.storagePath) {
        await supabase.storage.from('job-issue-photos').remove([photo.storagePath]);
      }
      await supabase.from('job_issue_photos').delete().eq('id', photoId);
    } catch (err) {
      console.warn('Supabase issue photo delete error:', err);
    }
    return db.deleteIssuePhoto(photoId);
  }
};
