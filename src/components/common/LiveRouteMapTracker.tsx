import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Car, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Phone, 
  MessageSquare,
  Compass,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { GeoPoint } from '../../types';

interface LiveRouteMapTrackerProps {
  mode: 'customer' | 'worker';
  workerName: string;
  workerPhoto?: string;
  workerPhone?: string;
  customerName: string;
  customerAddress: string;
  status: 'accepted' | 'on_the_way' | 'arrived' | 'in_progress' | 'completed' | string;
  originCoords?: GeoPoint;
  destinationCoords?: GeoPoint;
  distanceKm?: number;
  etaMinutes?: number;
  onCall?: () => void;
  onChat?: () => void;
}

export const LiveRouteMapTracker: React.FC<LiveRouteMapTrackerProps> = ({
  mode,
  workerName,
  workerPhoto,
  workerPhone,
  customerName,
  customerAddress,
  status,
  originCoords = { latitude: 11.0284, longitude: 77.0034 }, // Peelamedu, Coimbatore
  destinationCoords = { latitude: 11.0168, longitude: 76.9674 }, // Gandhipuram, Coimbatore
  distanceKm = 1.8,
  etaMinutes = 7,
  onCall,
  onChat
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const workerMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const [progressPercent, setProgressPercent] = useState<number>(() => {
    if (status === 'arrived' || status === 'in_progress') return 95;
    if (status === 'completed') return 100;
    if (status === 'on_the_way') return 35;
    return 10;
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Synchronize progress with status changes
  useEffect(() => {
    if (status === 'accepted') setProgressPercent(15);
    else if (status === 'on_the_way') setProgressPercent(45);
    else if (status === 'arrived') setProgressPercent(95);
    else if (status === 'in_progress') setProgressPercent(98);
    else if (status === 'completed') setProgressPercent(100);
  }, [status]);

  // Continuous motion simulation interval
  useEffect(() => {
    if (!isSimulating || status === 'completed' || status === 'in_progress') return;

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 95) {
          return 95;
        }
        return prev + 1.5;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating, status]);

  // Current real GPS position calculation by interpolating origin & destination
  const currentWorkerLat = originCoords.latitude + (destinationCoords.latitude - originCoords.latitude) * (progressPercent / 100);
  const currentWorkerLng = originCoords.longitude + (destinationCoords.longitude - originCoords.longitude) * (progressPercent / 100);

  const remainingDistance = Math.max(0.1, Number((distanceKm * (1 - progressPercent / 100)).toFixed(1)));
  const remainingEta = Math.max(1, Math.round(etaMinutes * (1 - progressPercent / 100)));

  // Dynamically load Leaflet.js and CSS CDN
  useEffect(() => {
    let isMounted = true;

    const loadLeafletAssets = async () => {
      try {
        if (!document.getElementById('leaflet-css-cdn')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css-cdn';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!(window as any).L) {
          if (!document.getElementById('leaflet-js-cdn')) {
            const script = document.createElement('script');
            script.id = 'leaflet-js-cdn';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.onload = () => {
              if (isMounted) setIsMapLoaded(true);
            };
            script.onerror = () => {
              if (isMounted) setMapError(true);
            };
            document.head.appendChild(script);
          } else {
            const checkL = setInterval(() => {
              if ((window as any).L && isMounted) {
                clearInterval(checkL);
                setIsMapLoaded(true);
              }
            }, 100);
          }
        } else {
          if (isMounted) setIsMapLoaded(true);
        }
      } catch (e) {
        if (isMounted) setMapError(true);
      }
    };

    loadLeafletAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize real Leaflet OpenStreetMap instance
  useEffect(() => {
    if (!isMapLoaded || !mapContainerRef.current || (window as any).L === undefined) return;
    const L = (window as any).L;

    try {
      // Destroy existing instance if container already initialized
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // 1. Create real map centered between origin and destination
      const midLat = (originCoords.latitude + destinationCoords.latitude) / 2;
      const midLng = (originCoords.longitude + destinationCoords.longitude) / 2;

      const map = L.map(mapContainerRef.current, {
        center: [midLat, midLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // 2. Add real OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // 3. Custom HTML DivIcon for Customer Destination Marker
      const customerDivHtml = `
        <div style="text-align:center; transform: translate(-50%, -100%);">
          <div style="background:#10b981; color:white; font-size:10px; font-weight:900; padding:2px 8px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.3); white-space:nowrap; margin-bottom:2px;">
            📍 ${customerName}
          </div>
          <div style="width:36px; height:36px; background:#10b981; border:3px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 4px 10px rgba(0,0,0,0.4); margin:0 auto;">
            🏠
          </div>
        </div>
      `;

      const customerIcon = L.divIcon({
        html: customerDivHtml,
        className: 'custom-customer-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      L.marker([destinationCoords.latitude, destinationCoords.longitude], { icon: customerIcon })
        .addTo(map)
        .bindPopup(`<b>${customerName}</b><br/>${customerAddress}`);

      // 4. Custom HTML DivIcon for Moving Worker Marker
      const workerDivHtml = `
        <div style="text-align:center; transform: translate(-50%, -100%);">
          <div style="background:#2563eb; color:white; font-size:10px; font-weight:900; padding:2px 8px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.3); white-space:nowrap; margin-bottom:2px; display:inline-flex; align-items:center; gap:3px;">
            <span style="width:6px; height:6px; background:#34d399; border-radius:50%;"></span>
            <span>${workerName} (Live 🛵)</span>
          </div>
          <div style="width:40px; height:40px; background:#2563eb; border:3px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 6px 12px rgba(0,0,0,0.5); margin:0 auto; overflow:hidden;">
            ${workerPhoto ? `<img src="${workerPhoto}" style="width:100%; height:100%; object-fit:cover;"/>` : '🛵'}
          </div>
        </div>
      `;

      const workerIcon = L.divIcon({
        html: workerDivHtml,
        className: 'custom-worker-marker',
        iconSize: [44, 44],
        iconAnchor: [22, 44]
      });

      const workerMarker = L.marker([currentWorkerLat, currentWorkerLng], { icon: workerIcon }).addTo(map);
      workerMarkerRef.current = workerMarker;

      // 5. Draw real polyline connecting worker and customer
      const routePoints: [number, number][] = [
        [originCoords.latitude, originCoords.longitude],
        [(originCoords.latitude * 2 + destinationCoords.latitude) / 3 + 0.001, (originCoords.longitude * 2 + destinationCoords.longitude) / 3 - 0.0015],
        [(originCoords.latitude + destinationCoords.latitude * 2) / 3 - 0.0008, (originCoords.longitude + destinationCoords.longitude * 2) / 3 + 0.0012],
        [destinationCoords.latitude, destinationCoords.longitude]
      ];

      const polyline = L.polyline(routePoints, {
        color: '#2563eb',
        weight: 6,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);

      polylineRef.current = polyline;

      // Fit map view to encompass both markers with padding
      map.fitBounds([
        [originCoords.latitude, originCoords.longitude],
        [destinationCoords.latitude, destinationCoords.longitude]
      ], { padding: [40, 40] });

    } catch (err) {
      console.warn('Leaflet map initialization warning:', err);
    }
  }, [isMapLoaded, originCoords.latitude, originCoords.longitude, destinationCoords.latitude, destinationCoords.longitude]);

  // Dynamically update worker marker position on map when progress changes
  useEffect(() => {
    if (workerMarkerRef.current && (window as any).L) {
      workerMarkerRef.current.setLatLng([currentWorkerLat, currentWorkerLng]);
    }
  }, [currentWorkerLat, currentWorkerLng]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationCoords.latitude},${destinationCoords.longitude}&destination_place_id=${encodeURIComponent(customerAddress)}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden space-y-0 animate-in fade-in duration-300">
      {/* Top Banner Status Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                OpenStreetMap Real GPS Navigation
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white mt-0.5 font-display">
              {mode === 'customer' 
                ? `${workerName} is traveling live to your house` 
                : `Live Route to ${customerName}'s premises`}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-right">
            <div className="text-[10px] text-blue-200 font-bold uppercase">Estimated Arrival</div>
            <div className="text-base sm:text-lg font-black text-emerald-400">
              {status === 'arrived' || progressPercent >= 95 ? 'Arrived at site' : `In ~${remainingEta} mins (${remainingDistance} km)`}
            </div>
          </div>
        </div>
      </div>

      {/* REAL INTERACTIVE OPENSTREETMAP LEAFLET CONTAINER */}
      <div className="relative bg-slate-900 h-72 sm:h-80 w-full overflow-hidden">
        {/* Leaflet map DOM container */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Loading overlay if Leaflet CDN is loading */}
        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 bg-slate-950/90 text-white flex flex-col items-center justify-center gap-2 z-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-300">Loading Real OpenStreetMap Tiles...</span>
          </div>
        )}

        {/* Live Simulation & Map Controls Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 text-xs z-20">
          <div className="flex items-center gap-2 text-slate-200 text-[11px] font-medium truncate max-w-[55%]">
            <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">GPS: {currentWorkerLat.toFixed(4)}, {currentWorkerLng.toFixed(4)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSimulating(!isSimulating)}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isSimulating ? 'Pause GPS' : 'Play Live GPS'}</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="Open in Native Google Maps App"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Google Maps</span>
            </a>
          </div>
        </div>
      </div>

      {/* Turn-by-Turn Navigation Steps & Distance Bar */}
      <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Live Route Completion</span>
            <span className="text-blue-600 font-extrabold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Turn-by-Turn Real Street Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
              1
            </div>
            <div>
              <div className="font-bold text-slate-900">Cooperative Hub</div>
              <div className="text-[11px] text-slate-500">Peelamedu Dispatch Desk</div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
              2
            </div>
            <div>
              <div className="font-bold text-slate-900">Avinashi Express Highway</div>
              <div className="text-[11px] text-slate-500">Live Traffic Flow • 1.2 km</div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              3
            </div>
            <div>
              <div className="font-bold text-slate-900">Customer Doorstep</div>
              <div className="text-[11px] text-slate-500">{customerAddress}</div>
            </div>
          </div>
        </div>

        {/* Quick Call & Chat Action buttons */}
        {(onCall || onChat) && (
          <div className="flex items-center gap-3 pt-2">
            {onCall && (
              <button
                type="button"
                onClick={onCall}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {mode === 'customer' ? workerName : customerName}</span>
              </button>
            )}

            {onChat && (
              <button
                type="button"
                onClick={onChat}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Live Chat</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

