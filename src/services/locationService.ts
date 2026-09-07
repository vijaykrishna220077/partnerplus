import { GeoPoint, LocationPermissionState, WorkerLocationRecord, CustomerLocationRecord } from '../types';
import { realtimeHub } from './db';
import { logger } from '../utils/logger';

// Known landmark coordinates across Tamil Nadu (Coimbatore, Chennai, Madurai, Salem)
export const KNOWN_AREAS_COORDINATES = [
  { name: 'Sri Krishna College of Engineering and Technology (SKCET), Kuniamuthur, Coimbatore', lat: 10.9372, lng: 76.9562, city: 'Coimbatore' },
  { name: 'Anna Nagar West, Chennai', lat: 13.0850, lng: 80.2101, city: 'Chennai' },
  { name: 'T. Nagar, Chennai', lat: 13.0418, lng: 80.2341, city: 'Chennai' },
  { name: 'Velachery, Chennai', lat: 12.9815, lng: 80.2180, city: 'Chennai' },
  { name: 'Adyar, Chennai', lat: 13.0012, lng: 80.2565, city: 'Chennai' },
  { name: 'Ambattur Industrial Estate, Chennai', lat: 13.1143, lng: 80.1548, city: 'Chennai' },
  { name: 'Peelamedu, Coimbatore', lat: 11.0284, lng: 77.0034, city: 'Coimbatore' },
  { name: 'Gandhipuram, Coimbatore', lat: 11.0168, lng: 76.9674, city: 'Coimbatore' },
  { name: 'RS Puram, Coimbatore', lat: 11.0089, lng: 76.9509, city: 'Coimbatore' },
  { name: 'Saravanampatti, Coimbatore', lat: 11.0805, lng: 76.9942, city: 'Coimbatore' },
  { name: 'KK Nagar, Madurai', lat: 9.9252, lng: 78.1198, city: 'Madurai' },
];

class LocationService {
  private watcherId: number | null = null;
  private currentCoords: GeoPoint | null = null;
  private permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown' = 'unknown';
  private trackingMode: 'OFFLINE' | 'DISCOVERY' | 'ACTIVE_JOB' | 'EMERGENCY' = 'OFFLINE';
  private activeLocationSharingTokens: Set<string> = new Set();
  private mockIntervalId: any = null;

  constructor() {
    this.checkPermissionState();
  }

  private async checkPermissionState(): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        this.permissionStatus = status.state as any;
        status.onchange = () => {
          this.permissionStatus = status.state as any;
          realtimeHub.emit('location:permission_changed', this.getPermissionState());
        };
      } catch (err) {
        logger.warn('[LocationService] Geolocation permissions query notice:', err);
        this.permissionStatus = 'prompt';
      }
    }
  }

  public getPermissionState(): LocationPermissionState {
    const hasGeo = typeof navigator !== 'undefined' && 'geolocation' in navigator;
    return {
      hasGeolocationApi: hasGeo,
      permissionStatus: this.permissionStatus,
      isTrackingEnabled: this.watcherId !== null || this.mockIntervalId !== null,
      lastKnownCoordinates: this.currentCoords || undefined
    };
  }

  /**
   * Requests location permission and returns the current position.
   * If browser GPS fails or is denied, falls back to a deterministic, realistic coordinate
   * with accuracy indicator so user can continue safely without hard blocker.
   */
  public async getCurrentLocation(): Promise<{ coords: GeoPoint; isSimulated: boolean; accuracyWarning?: string }> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      const fallback = this.getDeterministicFallback();
      this.currentCoords = fallback;
      return { coords: fallback, isSimulated: true, accuracyWarning: 'Browser geolocation not supported' };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.permissionStatus = 'granted';
          const coords: GeoPoint = {
            latitude: Number(position.coords.latitude.toFixed(5)),
            longitude: Number(position.coords.longitude.toFixed(5)),
            accuracy: Math.round(position.coords.accuracy),
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            timestamp: position.timestamp
          };
          this.currentCoords = coords;
          
          let accuracyWarning: string | undefined;
          if (coords.accuracy && coords.accuracy > 75) {
            accuracyWarning = `Location accuracy is low (~${coords.accuracy}m). Adjust map pin if needed.`;
          }

          resolve({ coords, isSimulated: false, accuracyWarning });
        },
        (error) => {
          console.warn('Geolocation prompt error or denied:', error.message);
          this.permissionStatus = error.code === 1 ? 'denied' : 'prompt';
          // Graceful fallback coordinate for Coimbatore / Chennai
          const fallback = this.getDeterministicFallback();
          this.currentCoords = fallback;
          resolve({
            coords: fallback,
            isSimulated: true,
            accuracyWarning: error.code === 1 
              ? 'GPS permission denied. Using selected service area pin.' 
              : 'GPS unavailable. Using default cooperative service pin.'
          });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    });
  }

  /**
   * Watch live location for active navigation or real-time dispatch tracking.
   */
  public watchLocation(callback: (coords: GeoPoint) => void): () => void {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        this.watcherId = navigator.geolocation.watchPosition(
          (pos) => {
            const coords: GeoPoint = {
              latitude: Number(pos.coords.latitude.toFixed(5)),
              longitude: Number(pos.coords.longitude.toFixed(5)),
              accuracy: Math.round(pos.coords.accuracy),
              heading: pos.coords.heading || 0,
              speed: pos.coords.speed || 0,
              timestamp: pos.timestamp
            };
            this.currentCoords = coords;
            callback(coords);
            realtimeHub.emit('location:coords_updated', coords);
          },
          (err) => {
            console.warn('watchPosition error:', err);
          },
          { enableHighAccuracy: true, maximumAge: 10000 }
        );
      } catch (e) {
        console.warn('Failed to start watchPosition:', e);
      }
    }

    return () => {
      this.stopWatchingLocation();
    };
  }

  public stopWatchingLocation(): void {
    if (this.watcherId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watcherId);
      this.watcherId = null;
    }
    if (this.mockIntervalId !== null) {
      clearInterval(this.mockIntervalId);
      this.mockIntervalId = null;
    }
  }

  /**
   * Haversine formula to compute great-circle distance between two GPS coordinates in kilometers.
   */
  public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Number(d.toFixed(2));
  }

  public calculateEtaMinutes(distanceKm: number, mode: 'bike' | 'car' | 'walk' = 'bike'): number {
    // Average urban speeds in Indian cities
    const speeds = {
      bike: 22, // 22 km/h
      car: 18,  // 18 km/h traffic
      walk: 4.5 // 4.5 km/h
    };
    const speed = speeds[mode] || 20;
    const hours = distanceKm / speed;
    const minutes = Math.max(3, Math.round(hours * 60));
    return minutes;
  }

  /**
   * Live Reverse Geocoding using OpenStreetMap Nominatim API.
   * Converts latitude and longitude into a readable street address.
   * Falls back gracefully to local coordinate matching if network fails.
   */
  public async fetchReverseGeocode(lat: number, lng: number): Promise<{ address: string; area: string; city: string; pincode: string }> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.street || addr.pedestrian || addr.footway;
          const area = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || addr.subdistrict || addr.village || addr.town;
          const city = addr.city || addr.town || addr.municipality || addr.district || addr.county || addr.state || 'Chennai';
          const pincode = addr.postcode || '';

          // Format clean, readable street address
          const components = [
            addr.house_number || addr.building,
            road,
            area,
            city,
            addr.state
          ].filter(Boolean);

          const formattedAddress = components.length >= 2 
            ? components.join(', ')
            : (data.display_name ? data.display_name.split(',').slice(0, 4).join(',').trim() : `${lat.toFixed(4)}, ${lng.toFixed(4)}`);

          return {
            address: formattedAddress,
            area: area || city,
            city: city,
            pincode: pincode
          };
        }
      }
    } catch (error) {
      console.warn('Nominatim reverse geocoding request failed, falling back to local service:', error);
    }

    return this.reverseGeocode(lat, lng);
  }

  /**
   * Reverse geocoding matching against known Tamil Nadu cooperative service areas or fallback
   */
  public reverseGeocode(lat: number, lng: number): { address: string; area: string; city: string; pincode: string } {
    let closest = KNOWN_AREAS_COORDINATES[0];
    let minDistance = Infinity;

    for (const place of KNOWN_AREAS_COORDINATES) {
      const dist = this.calculateDistance(lat, lng, place.lat, place.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = place;
      }
    }

    if (minDistance < 6) {
      return {
        address: `${closest.name}, Near Cooperative Dispatch Centre`,
        area: closest.name.split(',')[0],
        city: closest.city,
        pincode: closest.city === 'Chennai' ? '600040' : '641004'
      };
    }

    return {
      address: `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`,
      area: 'Local Sector Zone',
      city: 'Coimbatore',
      pincode: '641001'
    };
  }

  /**
   * Privacy & Consent-managed location sharing token
   */
  public startLocationSharing(scopeId: string, role: string): boolean {
    this.activeLocationSharingTokens.add(scopeId);
    realtimeHub.emit('location:sharing_started', { scopeId, role });
    return true;
  }

  public stopLocationSharing(scopeId: string): void {
    this.activeLocationSharingTokens.delete(scopeId);
    realtimeHub.emit('location:sharing_stopped', { scopeId });
  }

  public isLocationSharingActive(scopeId: string): boolean {
    return this.activeLocationSharingTokens.has(scopeId);
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private getDeterministicFallback(): GeoPoint {
    return {
      latitude: 11.0168,
      longitude: 76.9674,
      accuracy: 25,
      timestamp: Date.now()
    };
  }
}

export const locationService = new LocationService();
