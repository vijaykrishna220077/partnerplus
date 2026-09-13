import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { capacitorBridge } from './capacitorBridge';

export interface PositionCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading?: number | null;
  speed?: number | null;
}

export const locationAdapter = {
  /**
   * Obtains high-accuracy GPS coordinates using native Capacitor Geolocation on Android,
   * or standard browser navigator.geolocation on Web.
   */
  async getCurrentPosition(): Promise<PositionCoordinates> {
    if (capacitorBridge.isNative()) {
      try {
        await this.requestPermissions();
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        });

        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed
        };
      } catch (err) {
        console.warn('Native Capacitor Geolocation failed, using web fallback:', err);
      }
    }

    // Web Fallback using navigator.geolocation
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // Fallback default coordinates (Coimbatore)
        resolve({ latitude: 11.0168, longitude: 76.9558, accuracy: 10 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed
        }),
        (err) => {
          console.warn('Browser geolocation failed, returning default location:', err);
          resolve({ latitude: 11.0168, longitude: 76.9558, accuracy: 50 });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    });
  },

  /**
   * Watches live position updates for active worker GPS tracking
   */
  async watchPosition(callback: (pos: PositionCoordinates) => void): Promise<string | number> {
    if (capacitorBridge.isNative()) {
      try {
        await this.requestPermissions();
        const watchId = await Geolocation.watchPosition(
          { enableHighAccuracy: true, timeout: 10000 },
          (position, err) => {
            if (err || !position) return;
            callback({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              heading: position.coords.heading,
              speed: position.coords.speed
            });
          }
        );
        return watchId;
      } catch (err) {
        console.warn('Native position watcher error:', err);
      }
    }

    // Web Fallback
    if (navigator.geolocation) {
      return navigator.geolocation.watchPosition((pos) => callback({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        heading: pos.coords.heading,
        speed: pos.coords.speed
      }));
    }

    return 'mock-watch';
  },

  /**
   * Clear active location watcher
   */
  async clearWatch(watchId: string | number): Promise<void> {
    if (capacitorBridge.isNative() && typeof watchId === 'string') {
      try {
        await Geolocation.clearWatch({ id: watchId });
        return;
      } catch (err) {
        console.warn('Clear watch error:', err);
      }
    }

    if (typeof watchId === 'number' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  },

  /**
   * Request GPS permissions on Android
   */
  async requestPermissions(): Promise<boolean> {
    if (!capacitorBridge.isNative()) return true;

    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location === 'granted') return true;

      const req = await Geolocation.requestPermissions({ permissions: ['location'] });
      return req.location === 'granted';
    } catch (err) {
      console.warn('Location permission request error:', err);
      return false;
    }
  }
};
