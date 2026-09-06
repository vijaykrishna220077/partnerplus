import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  X,
  User,
  ShieldCheck,
  SwitchCamera,
  Sparkles
} from 'lucide-react';

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  onPhotoSelected: (photoDataUrl: string, fileBlob?: Blob) => void;
  label?: string;
  required?: boolean;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  currentPhotoUrl,
  onPhotoSelected,
  label = 'Official Profile Photo (Aadhaar/Identity Verified)',
  required = true
}) => {
  const [mode, setMode] = useState<'idle' | 'camera' | 'preview'>('idle');
  const [photoPreview, setPhotoPreview] = useState<string>(currentPhotoUrl || '');
  const [cameraError, setCameraError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sampleFaces = [
    { label: 'Sample Worker 1', url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80' },
    { label: 'Sample Worker 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
    { label: 'Sample Worker 3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' }
  ];

  // Clean up media stream on unmount or mode switch
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  // Ensure stream is bound to video element whenever mode switches to 'camera'
  useEffect(() => {
    if (mode === 'camera' && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.play().catch(e => {
        console.warn('Video playback notice:', e);
      });
    }
  }, [mode]);

  // Check for device camera capabilities
  const checkCameraDevices = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      }
    } catch {
      setHasMultipleCameras(false);
    }
  };

  // Start device camera with constraints and fallback
  const startCamera = async (targetFacingMode: 'user' | 'environment' = 'user') => {
    setCameraError('');
    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Device camera is restricted or not supported in this browser context. You can upload from device or pick a sample photo below.');
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: targetFacingMode,
            width: { ideal: 640 },
            height: { ideal: 640 }
          },
          audio: false
        });
      } catch {
        // Fallback for desktop/laptop webcams without strict facingMode or resolution support
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      setMode('camera');

      // Bind to video element immediately if already attached
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      await checkCameraDevices();
    } catch (err: any) {
      console.warn('Camera permission or availability issue:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. You can easily upload from your device gallery or choose a sample face photo below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No active camera hardware found. Please upload a photo or select a sample photo below.');
      } else {
        setCameraError('Unable to start live camera feed. Please use "Choose From Device" or select a sample photo below.');
      }
      setMode('idle');
    }
  };

  // Toggle front/back camera
  const toggleCamera = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Capture frame from video to canvas
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 640;
    const size = Math.min(width, height) || 480;
    
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop square
    const startX = (width - size) / 2;
    const startY = (height - size) / 2;

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopStream();
    setPhotoPreview(dataUrl);
    setMode('preview');
  };

  // File Picker upload handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCameraError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file format
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      setCameraError('Invalid file format. Please upload JPEG, PNG, or WEBP image.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setCameraError('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setMode('preview');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setCameraError('');
    setPhotoPreview(sampleUrl);
    onPhotoSelected(sampleUrl);
    setMode('idle');
  };

  // Confirm photo usage
  const handleConfirmPhoto = () => {
    if (!photoPreview) return;
    onPhotoSelected(photoPreview);
    setMode('idle');
  };

  // Retake or choose another photo
  const handleRetake = () => {
    setPhotoPreview('');
    setMode('idle');
    setCameraError('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold font-mono uppercase tracking-wide text-slate-700 dark:text-slate-200">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[11px] text-slate-500">Live Camera or Upload</span>
      </div>

      {/* Camera Error / Permission Fallback Notification */}
      {cameraError && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{cameraError}</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
              You can proceed immediately using <strong>&quot;Choose From Device&quot;</strong> or selecting a sample photo below.
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setCameraError('')} 
            className="text-amber-600 hover:text-amber-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. IDLE STATE: Show preview avatar or empty placeholder with action buttons */}
      {mode === 'idle' && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 bg-slate-200 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Worker Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              {photoPreview && (
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {photoPreview ? (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    Photo verified for digital ID badge
                  </span>
                ) : (
                  <span>Clear face photograph required for member ID card &amp; customer dispatch safety.</span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => startCamera('user')}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Take Photo (Camera)</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold font-mono transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose From Device</span>
                </button>

                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-mono transition cursor-pointer"
                    title="Change Photo"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Sample Photos Bar for instant demo/testing */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Instant Sample Face Photo:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {sampleFaces.map((sample, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleSelectSample(sample.url)}
                  className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center gap-1"
                >
                  <img src={sample.url} alt={sample.label} className="w-4 h-4 rounded-full object-cover" />
                  <span>Sample {sIdx + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE CAMERA VIEWFINDER */}
      {mode === 'camera' && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE CAMERA VIEWFINDER
            </span>
            <div className="flex items-center gap-2">
              {hasMultipleCameras && (
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Switch Camera"
                >
                  <SwitchCamera className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  stopStream();
                  setMode('idle');
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Viewfinder circle overlay */}
          <div className="relative w-full max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden bg-black border-2 border-slate-800 flex items-center justify-center shadow-2xl">
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el && streamRef.current && el.srcObject !== streamRef.current) {
                  el.srcObject = streamRef.current;
                  el.play().catch(() => {});
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Circular framing guide */}
            <div className="absolute inset-0 pointer-events-none border-2 border-emerald-400/60 rounded-full m-6 flex items-center justify-center">
              <span className="text-[10px] font-mono text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded-full mb-auto mt-2">
                Center face inside circle
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 transition"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Photo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                stopStream();
                setMode('idle');
              }}
              className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 3. CAPTURED / SELECTED PHOTO PREVIEW */}
      {mode === 'preview' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
          <div className="text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="font-bold text-white">REVIEW PHOTO BEFORE SAVING</span>
            <span className="text-emerald-400 text-[11px]">Ready for profile ID</span>
          </div>

          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-emerald-500 shadow-xl">
            <img 
              src={photoPreview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleConfirmPhoto}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer active:scale-95 transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Use This Photo</span>
            </button>
            <button
              type="button"
              onClick={handleRetake}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake / Change</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for device gallery/files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
