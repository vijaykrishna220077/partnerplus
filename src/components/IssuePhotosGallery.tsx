import React, { useState } from 'react';
import { JobIssuePhoto } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Camera, 
  Eye, 
  X, 
  Trash2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Maximize2
} from 'lucide-react';

interface IssuePhotosGalleryProps {
  photos: JobIssuePhoto[];
  bookingId: string;
  isCustomer?: boolean;
  isWorker?: boolean;
  onOpenUploader?: () => void;
  onDeletePhoto?: (photoId: string) => void;
  compact?: boolean;
}

export const IssuePhotosGallery: React.FC<IssuePhotosGalleryProps> = ({
  photos,
  bookingId,
  isCustomer = false,
  isWorker = false,
  onOpenUploader,
  onDeletePhoto,
  compact = false
}) => {
  const { t } = useApp();
  const [selectedPhotoForZoom, setSelectedPhotoForZoom] = useState<JobIssuePhoto | null>(null);

  if (!photos || photos.length === 0) {
    if (compact) return null;
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
          <Camera className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">
            {t("issuePhotos.noPhotosYet") || "No issue photos shared yet"}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
            {isCustomer 
              ? "Attach photos of the leaking pipe, broken appliance, or area to help your assigned worker come prepared." 
              : "Customer has not shared any issue photos for this booking yet."}
          </p>
        </div>
        {isCustomer && onOpenUploader && (
          <button
            type="button"
            onClick={onOpenUploader}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>{t("issuePhotos.addPhoto") || "Add Issue Photo"}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span>{t("issuePhotos.issuePhotosTitle") || "Customer Issue Photos"}</span>
              {isWorker && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {t("issuePhotos.photoReceivedBadge") || "Photo Received"}
                </span>
              )}
              <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {photos.length}/5
              </span>
            </h4>
          </div>
        </div>

        {isCustomer && onOpenUploader && photos.length < 5 && (
          <button
            type="button"
            onClick={onOpenUploader}
            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>+ {t("issuePhotos.addPhoto") || "Add Photo"}</span>
          </button>
        )}
      </div>

      {/* Grid Thumbnail Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <div 
            key={photo.id || index}
            className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
              <img
                src={photo.publicUrl}
                alt={photo.description || photo.fileName || 'Issue photo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => setSelectedPhotoForZoom(photo)}
              />

              {/* Lightbox Trigger Overlay */}
              <button
                type="button"
                onClick={() => setSelectedPhotoForZoom(photo)}
                className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                title={t("issuePhotos.zoomPhoto") || "Click to Zoom / View Fullscreen"}
              >
                <div className="p-2 rounded-full bg-slate-900/80 backdrop-blur-xs text-white border border-white/20">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </button>

              {/* Number Badge */}
              <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-black px-2 py-0.5 rounded-md border border-white/10">
                #{index + 1}
              </span>

              {/* Delete Button for Customer */}
              {isCustomer && onDeletePhoto && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePhoto(photo.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                  title={t("issuePhotos.removePhoto") || "Remove Photo"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Description & Time Footer */}
            <div className="p-2.5 bg-white border-t border-slate-100 space-y-1">
              <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight">
                {photo.description || photo.fileName}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {photo.createdAt ? new Date(photo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                </span>
                <span className="text-emerald-700 font-bold">✓ Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhotoForZoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  {t("issuePhotos.sharedByCustomer") || "Shared by Customer"}
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-md">
                  {selectedPhotoForZoom.description || selectedPhotoForZoom.fileName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhotoForZoom(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Preview Container */}
            <div className="p-4 flex-1 flex items-center justify-center overflow-auto bg-slate-950">
              <img
                src={selectedPhotoForZoom.publicUrl}
                alt={selectedPhotoForZoom.description || selectedPhotoForZoom.fileName}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl border border-slate-800 shadow-2xl"
              />
            </div>

            {/* Lightbox Footer Details */}
            <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div>
                <p className="font-medium text-slate-200 text-sm">
                  {selectedPhotoForZoom.description || "No description provided by customer."}
                </p>
                <span className="text-slate-500 text-xs block mt-0.5">
                  File: {selectedPhotoForZoom.fileName} • Uploaded {new Date(selectedPhotoForZoom.createdAt).toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPhotoForZoom(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer self-end sm:self-auto"
              >
                {t("common.close") || "Close Fullscreen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
