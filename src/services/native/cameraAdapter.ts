import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { capacitorBridge } from './capacitorBridge';

export interface CapturedPhotoResult {
  file: File;
  previewUrl: string;
  format: string;
}

export const cameraAdapter = {
  /**
   * Captures a photo using native Android camera or picks from photo library,
   * falling back to Web HTML5 camera/file picker when running in browser.
   */
  async capturePhoto(source: 'camera' | 'photos' = 'camera'): Promise<CapturedPhotoResult | null> {
    if (capacitorBridge.isNative()) {
      try {
        const options: ImageOptions = {
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
          correctOrientation: true,
          width: 1920,
          height: 1080
        };

        const image = await Camera.getPhoto(options);

        if (!image.webPath) {
          throw new Error('Could not retrieve captured photo path');
        }

        // Fetch local blob and convert to File object
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const fileName = `photo_${Date.now()}.${image.format || 'jpg'}`;
        const file = new File([blob], fileName, { type: `image/${image.format || 'jpeg'}` });

        return {
          file,
          previewUrl: image.webPath,
          format: image.format || 'jpg'
        };
      } catch (err: any) {
        console.warn('Native Capacitor Camera error or cancelled:', err);
        if (err.message && err.message.includes('User cancelled')) {
          return null;
        }
        throw err;
      }
    }

    // Web Fallback: Caller uses standard HTML inputs
    return null;
  },

  /**
   * Request native Android camera permissions explicitly if required
   */
  async checkAndRequestPermissions(): Promise<boolean> {
    if (!capacitorBridge.isNative()) return true;

    try {
      const check = await Camera.checkPermissions();
      if (check.camera === 'granted' && check.photos === 'granted') {
        return true;
      }

      const req = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
      return req.camera === 'granted' || req.photos === 'granted';
    } catch (err) {
      console.warn('Camera permission check failed:', err);
      return false;
    }
  }
};
