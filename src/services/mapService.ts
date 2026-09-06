import { GeoPoint } from '../types';
import { locationService } from './locationService';

export interface MapMarker {
  id: string;
  type: 'worker' | 'customer' | 'job' | 'project' | 'emergency' | 'cooperative';
  title: string;
  subtitle?: string;
  latitude: number;
  longitude: number;
  status?: string;
  avatarUrl?: string;
  onClick?: () => void;
}

export interface MapRoute {
  origin: GeoPoint;
  destination: GeoPoint;
  distanceKm: number;
  etaMinutes: number;
  waypoints?: GeoPoint[];
}

class MapService {
  /**
   * Generates a simulated realistic street route polyline between two GPS points
   * with intermediate turns appropriate for city navigation.
   */
  public generateRoutePoints(origin: GeoPoint, destination: GeoPoint): GeoPoint[] {
    const points: GeoPoint[] = [];
    const steps = 6;
    
    // Start at origin
    points.push(origin);

    const latDelta = (destination.latitude - origin.latitude) / steps;
    const lngDelta = (destination.longitude - origin.longitude) / steps;

    for (let i = 1; i < steps; i++) {
      // Add slight road jog for authentic urban street curve
      const jitterLat = (i % 2 === 0 ? 0.0006 : -0.0004);
      const jitterLng = (i % 2 === 1 ? 0.0005 : -0.0003);
      points.push({
        latitude: Number((origin.latitude + latDelta * i + jitterLat).toFixed(5)),
        longitude: Number((origin.longitude + lngDelta * i + jitterLng).toFixed(5))
      });
    }

    // End at destination
    points.push(destination);
    return points;
  }

  /**
   * Helper to compute route metadata
   */
  public getDirections(origin: GeoPoint, destination: GeoPoint): MapRoute {
    const distanceKm = locationService.calculateDistance(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude
    );
    const etaMinutes = locationService.calculateEtaMinutes(distanceKm, 'bike');
    const waypoints = this.generateRoutePoints(origin, destination);

    return {
      origin,
      destination,
      distanceKm,
      etaMinutes,
      waypoints
    };
  }

  /**
   * Constructs external native navigation intent URL (Google Maps / Apple Maps / OpenStreetMap)
   */
  public getExternalDirectionsUrl(destLat: number, destLng: number, label?: string): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&destination_place_id=${encodeURIComponent(label || 'Service Destination')}`;
  }
}

export const mapService = new MapService();
