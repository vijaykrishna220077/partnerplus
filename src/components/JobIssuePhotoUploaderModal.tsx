import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { issuePhotoService, UploadPhotoItem } from '../services/issuePhotoService';
import { 
  X, 
  Camera, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Booking } from '../types';

interface JobIssuePhotoUploaderModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface LocalPreviewItem {
  id: string;
  file: File;
  previewUrl: string;
  description: string;
}

export const JobIssuePhotoUploaderModal: React.FC<JobIssuePhotoUploaderModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addToast, refreshData, t } = useApp();
  const [selectedItems, setSelectedItems] = useState<LocalPreviewItem[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live Camera state & refs
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsLiveCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  if (!isOpen) return null;

  const existingCount = booking.issuePhotos?.length || 0;
  const remainingSlots = 5 - existingCount - selectedItems.length;

  const openCamera = async (targetFacing: 'environment' | 'user' = cameraFacingMode) => {
    setErrorMessage(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        streamRef.current = stream;
        setIsLiveCameraActive(true);
        setCameraFacingMode(targetFacing);

        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.warn('Camera video play error:', err));
          }
        }, 150);
        return;
      } catch (err: any) {
        console.warn('getUserMedia stream error, falling back to input:', err);
      }
    }
    // Fallback to native camera file input
    cameraInputRef.current?.click();
  };

  const capturePhotoSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File(
            [blob], 
            `issue-photo-${Date.now()}.jpg`, 
            { type: 'image/jpeg' }
          );
          const dt = new DataTransfer();
          dt.items.add(file);
          handleFilesAdded(dt.files);
        }
        stopCameraStream();
      }, 'image/jpeg', 0.92);
    }
  };

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    const fileArray = Array.from(files);

    if (existingCount + selectedItems.length + fileArray.length > 5) {
      setErrorMessage(`Maximum 5 issue photos allowed per booking. You can add up to ${Math.max(0, 5 - existingCount - selectedItems.length)} more.`);
      return;
    }

    const newPreviews: LocalPreviewItem[] = [];

    for (const file of fileArray) {
      const validation = issuePhotoService.validateFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.error || 'Invalid file selection');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      newPreviews.push({
        id: `prev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl,
        description: ''
      });
    }

    setSelectedItems(prev => [...prev, ...newPreviews]);
  };

  const handleRemovePreview = (id: string) => {
    setSelectedItems(prev => {
      const target = prev.find(item => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const handleDescriptionChange = (id: string, text: string) => {
    setSelectedItems(prev => prev.map(item => item.id === id ? { ...item, description: text } : item));
  };

  const handleUploadSubmit = async () => {
    if (selectedItems.length === 0) {
      setErrorMessage('Please select or capture at least one photo to send.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);
    setErrorMessage(null);

    try {
      const itemsToUpload: UploadPhotoItem[] = selectedItems.map(item => ({
        file: item.file,
        description: item.description
      }));

      setUploadProgress(45);

      await issuePhotoService.uploadIssuePhotos({
        bookingId: booking.id,
        customerId: booking.customerId || 'cust-1',
        workerId: booking.workerId,
        items: itemsToUpload
      });

      setUploadProgress(100);

      // Clean up object URLs
      selectedItems.forEach(item => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });

      await refreshData();

      addToast({
        type: 'success',
        title: t("issuePhotos.uploadSuccess") || 'Issue Photos Sent!',
        message: `Uploaded ${itemsToUpload.length} issue photo(s) to assigned worker ${booking.workerName || ''}.`
      });

      setIsUploading(false);
      setSelectedItems([]);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setIsUploading(false);
      setUploadProgress(0);
      setErrorMessage(err.message || 'Failed to upload issue photos. Please try again.');
    }
  };

  // Live Viewfinder Overlay
  if (isLiveCameraActive) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden flex flex-col space-y-4 p-4 border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between text-white px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Camera Viewfinder
            </span>
            <button
              type="button"
              onClick={stopCameraStream}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border border-slate-800">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />

            {/* Flip Camera Button */}
            <button
              type="button"
              onClick={() => openCamera(cameraFacingMode === 'environment' ? 'user' : 'environment')}
              className="absolute top-3 right-3 p-2.5 bg-black/60 hover:bg-black text-white backdrop-blur-md rounded-full transition cursor-pointer border border-white/20"
              title="Flip Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={stopCameraStream}
              className="px-4 py-2.5 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={capturePhotoSnapshot}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-full font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>Capture Snap</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                Booking #{booking.bookingCode}
              </span>
              <h3 className="text-base font-bold text-white leading-tight">
                {t("issuePhotos.addPhoto") || "Add Issue Photos for Worker"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Instructions Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Share clear photos of the leaking pipe, broken switch, or area.</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Photos are stored securely and sent directly to {booking.workerName || 'your assigned worker'} so they come prepared with exact tools.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons: Camera & Gallery */}
          {remainingSlots > 0 && !isUploading && (
            <div className="grid grid-cols-2 gap-3">
              {/* Take Photo Button */}
              <button
                type="button"
                onClick={() => openCamera('environment')}
                className="p-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-500 transition cursor-pointer flex flex-col items-center justify-center text-center space-y-1.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-blue-900">
                  {t("issuePhotos.takePhoto") || "Take Photo (Camera)"}
                </span>
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFilesAdded(e.target.files)}
                className="hidden"
              />

              {/* Choose Gallery Button */}
              <label className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition cursor-pointer flex flex-col items-center justify-center text-center space-y-1.5 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-slate-800">
                  {t("issuePhotos.chooseFromGallery") || "Select from Gallery"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={(e) => handleFilesAdded(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Previews List */}
          {selectedItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{t("issuePhotos.previewTitle") || "Selected Photos"} ({selectedItems.length})</span>
                <span className="text-[11px] text-slate-500 font-normal">Max 5 MB per photo</span>
              </div>

              <div className="space-y-3">
                {selectedItems.map((item, idx) => (
                  <div 
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 relative group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                      <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          Photo #{idx + 1} ({item.file.name})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePreview(item.id)}
                          disabled={isUploading}
                          className="text-red-600 hover:text-red-800 text-xs font-bold p-1 rounded hover:bg-red-50 transition cursor-pointer"
                          title={t("issuePhotos.removePhoto") || "Remove Photo"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                        disabled={isUploading}
                        placeholder={t("issuePhotos.addDescription") || "Add short description (e.g. Pipe leak under sink)"}
                        className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:border-blue-600 outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar when uploading */}
          {isUploading && (
            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>{t("issuePhotos.uploading") || "Uploading issue photo(s)..."}</span>
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            {t("common.cancel") || "Cancel"}
          </button>

          <button
            type="button"
            onClick={handleUploadSubmit}
            disabled={isUploading || selectedItems.length === 0}
            className={`px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md ${
              selectedItems.length > 0 && !isUploading
                ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>{t("issuePhotos.sendIssuePhoto") || "Send Issue Photos"} ({selectedItems.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
