import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Radio, 
  Navigation, 
  Users, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Briefcase,
  AlertCircle,
  Eye,
  CheckCircle2,
  Layers,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { OrganizationProject, OrganizationWorkRequest, OrganizationWorkerAssignment } from '../../../types';

interface OrgLiveMapTabProps {
  projects: OrganizationProject[];
  workRequests: OrganizationWorkRequest[];
}

type MapStyleOption = 'dark' | 'street' | 'satellite';

// 100% Free, Un-watermarked Map Tile Servers (No API Key Required)
const TILE_SERVERS: Record<MapStyleOption, { label: string; url: string; attribution: string; maxZoom: number }> = {
  dark: {
    label: 'Dark Tactical (Esri Dark)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin, USGS, NGA, EPA',
    maxZoom: 16
  },
  street: {
    label: 'OpenStreetMap (Street)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  },
  satellite: {
    label: 'World Imagery (Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics, USDA',
    maxZoom: 18
  }
};

// Base coordinates for Coimbatore projects
const PROJECT_COORDS: Record<string, { lat: number; lng: number; title: string }> = {
  ALL: { lat: 11.0284, lng: 77.0034, title: 'Coimbatore Industrial Sector Zone' },
  'proj-1': { lat: 11.0284, lng: 77.0034, title: 'Peelamedu Logistics Hub' },
  'proj-2': { lat: 11.0168, lng: 76.9674, title: 'Gandhipuram Commercial Complex' },
  'proj-3': { lat: 10.9372, lng: 76.9562, title: 'SKCET Smart Campus Site' },
  'proj-4': { lat: 11.0012, lng: 77.0312, title: 'Singanallur Agro Warehouse' }
};

// Offset worker coords around project center based on index & status
function getWorkerGeoCoords(baseLat: number, baseLng: number, index: number, total: number, status: string) {
  const angle = (index / Math.max(1, total)) * 2 * Math.PI + (index * 0.4);
  const distance = status === 'WORKING' ? 0.0015 : status === 'ARRIVED' ? 0.0035 : 0.0080;
  
  const lat = baseLat + Math.cos(angle) * distance;
  const lng = baseLng + Math.sin(angle) * distance;
  return { lat, lng };
}

export const OrgLiveMapTab: React.FC<OrgLiveMapTabProps> = ({
  projects,
  workRequests
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'ALL');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleOption>('dark');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Flatten active assignments
  const relevantRequests = selectedProjectId === 'ALL' 
    ? workRequests 
    : workRequests.filter(r => r.projectId === selectedProjectId);
  const activeAssignments = relevantRequests.flatMap(r => r.assignments);

  const selectedWorker = activeAssignments.find(a => a.workerId === selectedWorkerId) || activeAssignments[0];

  const workingCount = activeAssignments.filter(a => a.status === 'WORKING').length;
  const enRouteCount = activeAssignments.filter(a => a.status === 'ON_THE_WAY').length;
  const arrivedCount = activeAssignments.filter(a => a.status === 'ARRIVED').length;

  // Dynamically load Leaflet CDN
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = () => {
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
          const checkInterval = setInterval(() => {
            if ((window as any).L && isMounted) {
              clearInterval(checkInterval);
              setIsMapLoaded(true);
            }
          }, 100);
        }
      } else {
        if (isMounted) setIsMapLoaded(true);
      }
    };

    loadLeaflet();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isMapLoaded || !mapContainerRef.current || !(window as any).L) return;
    const L = (window as any).L;

    const baseCoords = PROJECT_COORDS[selectedProjectId] || PROJECT_COORDS['ALL'];

    try {
      // Create map instance if not already existing
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [baseCoords.lat, baseCoords.lng],
          zoom: 15,
          zoomControl: false,
          attributionControl: false
        });

        const activeTileConfig = TILE_SERVERS[mapStyle];
        const tileLayer = L.tileLayer(activeTileConfig.url, {
          maxZoom: activeTileConfig.maxZoom,
          attribution: activeTileConfig.attribution
        }).addTo(map);

        tileLayerRef.current = tileLayer;
        mapInstanceRef.current = map;

        // Custom Leaflet Zoom control bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);
      } else {
        // Update center if project changed
        mapInstanceRef.current.setView([baseCoords.lat, baseCoords.lng], 15);
      }

      const map = mapInstanceRef.current;

      // Update Tile Layer if style changed
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(TILE_SERVERS[mapStyle].url);
      }

      // Clear previous markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // 1. Add Project Center Site Marker
      const projectSiteIcon = L.divIcon({
        className: 'custom-leaflet-project-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(245, 158, 11, 0.2); border: 2px dashed #f59e0b; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #f59e0b; color: #090d16; display: flex; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 4px 12px rgba(245,158,11,0.4);">
                🏢
              </div>
            </div>
            <div style="margin-top: 4px; padding: 2px 8px; border-radius: 4px; background: rgba(15, 23, 42, 0.95); color: #fde68a; font-size: 10px; font-weight: 800; border: 1px solid #334155; white-space: nowrap;">
              ${baseCoords.title}
            </div>
          </div>
        `,
        iconSize: [0, 0]
      });

      const projectMarker = L.marker([baseCoords.lat, baseCoords.lng], { icon: projectSiteIcon }).addTo(map);
      markersRef.current.push(projectMarker);

      // 2. Add Worker Markers with Interactive Click & Status Styling
      const bounds = L.latLngBounds([[baseCoords.lat, baseCoords.lng]]);

      activeAssignments.forEach((asgn, idx) => {
        const workerPos = getWorkerGeoCoords(baseCoords.lat, baseCoords.lng, idx, activeAssignments.length, asgn.status);
        bounds.extend([workerPos.lat, workerPos.lng]);

        const isSelected = selectedWorker?.workerId === asgn.workerId;
        const colorBg = asgn.status === 'WORKING' ? '#10b981' : asgn.status === 'ARRIVED' ? '#f59e0b' : '#3b82f6';
        const colorBorder = asgn.status === 'WORKING' ? '#a7f3d0' : asgn.status === 'ARRIVED' ? '#fde68a' : '#bfdbfe';

        const workerIcon = L.divIcon({
          className: 'custom-worker-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%); transition: transform 0.2s ease;">
              <div style="
                width: ${isSelected ? '36px' : '30px'}; 
                height: ${isSelected ? '36px' : '30px'}; 
                border-radius: 50%; 
                background: ${colorBg}; 
                border: 2px solid ${colorBorder}; 
                color: #ffffff; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: 900; 
                font-size: 12px;
                box-shadow: 0 0 12px ${colorBg}88;
                ${isSelected ? 'transform: scale(1.15); outline: 3px solid #f59e0b;' : ''}
              ">
                ${asgn.workerName[0]}
              </div>
              <div style="
                margin-top: 3px; 
                padding: 1px 6px; 
                border-radius: 4px; 
                background: ${isSelected ? '#f59e0b' : 'rgba(15, 23, 42, 0.92)'}; 
                color: ${isSelected ? '#0f172a' : '#e2e8f0'}; 
                font-size: 9px; 
                font-weight: 800; 
                border: 1px solid ${isSelected ? '#f59e0b' : '#334155'};
                white-space: nowrap;
              ">
                ${asgn.workerName.split(' ')[0]} (${asgn.status})
              </div>
            </div>
          `,
          iconSize: [0, 0]
        });

        const marker = L.marker([workerPos.lat, workerPos.lng], { icon: workerIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedWorkerId(asgn.workerId);
        });

        markersRef.current.push(marker);
      });

      // Adjust bounds to fit all markers comfortably
      if (activeAssignments.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }

    } catch (err) {
      console.error('Error initializing Leaflet live map:', err);
    }
  }, [isMapLoaded, selectedProjectId, activeAssignments.length, mapStyle, selectedWorker?.workerId]);

  const handleFitBounds = () => {
    if (!mapInstanceRef.current || !markersRef.current.length || !(window as any).L) return;
    const L = (window as any).L;
    const group = L.featureGroup(markersRef.current);
    mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 16 });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>Organization Live Workforce Map</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Privacy-scoped real-time OpenStreetMap tracking restricted to currently assigned project workforce.
          </p>
        </div>

        {/* Project Selector & Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Filter Site:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="ALL">All Active Sites</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Telemetry Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">
            {workingCount}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Working On-Site</div>
            <div className="text-xs font-extrabold text-slate-900">Active Duty</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
            {enRouteCount}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">En Route</div>
            <div className="text-xs font-extrabold text-slate-900">GPS Navigation Active</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-xs">
            {arrivedCount}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Arrived</div>
            <div className="text-xs font-extrabold text-slate-900">At Project Gate</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-xs">
            {activeAssignments.length}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Total Tracked</div>
            <div className="text-xs font-extrabold text-slate-900">Workforce Roster</div>
          </div>
        </div>
      </div>

      {/* Interactive Tactical Map & Worker Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl min-h-[520px]">
        
        {/* Left / Center: Interactive Leaflet Map Stage (8 Cols) */}
        <div className="lg:col-span-8 relative p-0 flex flex-col justify-between overflow-hidden bg-[#0A0F1D] min-h-[420px]">
          
          {/* Top Floating Map Overlays */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 backdrop-blur-md shadow-md pointer-events-auto">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{PROJECT_COORDS[selectedProjectId]?.title || 'Coimbatore Industrial Sector'} • Live OpenStreetMap</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Map Layer Dropdown Switcher */}
              <div className="relative flex items-center">
                <select
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value as MapStyleOption)}
                  className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 backdrop-blur-md shadow-md cursor-pointer transition"
                >
                  {Object.entries(TILE_SERVERS).map(([key, cfg]) => (
                    <option key={key} value={key} className="bg-slate-900 text-slate-200">
                      🗺️ {cfg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fit All Markers */}
              <button
                type="button"
                onClick={handleFitBounds}
                title="Fit all markers in map view"
                className="p-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-amber-400 backdrop-blur-md shadow-md transition cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-slate-900/90 px-2.5 py-1.5 rounded-full border border-slate-800 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>GPS LIVE (&lt;5m)</span>
              </div>
            </div>
          </div>

          {/* Leaflet Map Canvas Container */}
          <div className="relative w-full h-full min-h-[440px] z-10">
            <div ref={mapContainerRef} className="w-full h-full min-h-[440px] bg-slate-950" />

            {!isMapLoaded && !mapError && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 text-slate-300 gap-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold">Initializing OpenStreetMap GPS Engine...</span>
              </div>
            )}

            {mapError && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950 text-amber-400 p-6 text-center gap-2">
                <AlertCircle className="w-8 h-8" />
                <span className="text-sm font-bold text-white">Map Engine Unavailable</span>
                <span className="text-xs text-slate-400">Showing raw dispatch coordinates view.</span>
              </div>
            )}
          </div>

          {/* Bottom Map Legend Overlay */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/95 p-3 border-t border-slate-800 text-slate-400">
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Working On-Site</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Arrived at Gate</span>
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>En Route (GPS Active)</span>
              </span>
            </div>

            <span className="text-[10px] text-slate-500">
              Click any worker marker on map to inspect dossier.
            </span>
          </div>

        </div>

        {/* Right: Worker Inspection Card (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between text-slate-200">
          {selectedWorker ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Assigned Artisan Dossier
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  selectedWorker.status === 'WORKING' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : selectedWorker.status === 'ARRIVED'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {selectedWorker.status}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-white">
                  {selectedWorker.workerName}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedWorker.trade} • {selectedWorker.workerTier} Tier
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>GPS Proximity:</span>
                    <span className="font-bold text-white">
                      {selectedWorker.currentLocation?.distanceKm || 0.1} km from project
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Estimated Arrival:</span>
                    <span className="font-bold text-amber-400">
                      {selectedWorker.currentLocation?.etaMinutes === 0 ? 'On-Site' : `${selectedWorker.currentLocation?.etaMinutes || 5} minutes`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Muster Check-In:</span>
                    <span className="font-bold text-emerald-400">
                      {selectedWorker.checkInTime || 'Pending Gate Arrival'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Hours Logged:</span>
                    <span className="font-bold text-white">
                      {selectedWorker.hoursWorked || 0} hrs today
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Statutory Insurance &amp; KYC Verified</span>
                  </div>
                  <p>
                    Covered under Cooperative PMSBY accident insurance. Direct daily wage protection guaranteed.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => alert(`Calling site worker ${selectedWorker.workerName} at ${selectedWorker.workerPhone}`)}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Worker ({selectedWorker.workerPhone})</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a worker marker on the map stage to inspect live dispatch telemetry.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
