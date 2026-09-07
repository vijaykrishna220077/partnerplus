import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, MapPin, Navigation, CheckCircle2, Loader2, Compass, Tag } from 'lucide-react';
import { mockLocations } from '../data/mockData';
import { locationService } from '../services/locationService';

export const LocationPickerModal: React.FC = () => {
  const { 
    isLocationPickerOpen, 
    closeLocationPicker, 
    currentLocation, 
    setCurrentLocation, 
    city, 
    setCity, 
    addToast,
    t
  } = useApp();

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>(city || 'All');

  if (!isLocationPickerOpen) return null;

  // Extract unique cities from mock locations
  const availableCities = ['All', ...Array.from(new Set(mockLocations.map(loc => loc.city)))];

  const handleLocateMe = async () => {
    setIsLoadingLocation(true);
    try {
      // 1. Get live GPS coordinates using browser's native navigator.geolocation API
      const { coords, isSimulated, accuracyWarning } = await locationService.getCurrentLocation();
      
      // 2. Convert coordinates into readable street address using OpenStreetMap Nominatim API
      const geoResult = await locationService.fetchReverseGeocode(coords.latitude, coords.longitude);
      
      const newAddress = geoResult.address;
      const detectedCity = geoResult.city;

      // 3. Update application state with reverse geocoded readable address
      setCurrentLocation(newAddress);
      setCity(detectedCity);
      setSelectedCityFilter(detectedCity);

      addToast({
        type: isSimulated ? 'info' : 'success',
        title: isSimulated ? 'Fallback Location Set' : 'Live Location Detected',
        message: `${newAddress}${geoResult.pincode ? ` (Pincode: ${geoResult.pincode})` : ''}${accuracyWarning ? `. ${accuracyWarning}` : ''}`
      });

      closeLocationPicker();
    } catch (error: any) {
      console.error('Error detecting live location:', error);
      addToast({
        type: 'warning',
        title: 'Location Error',
        message: 'Failed to detect current location. Please select a locality manually.'
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSelectArea = (area: typeof mockLocations[0]) => {
    setCurrentLocation(`${area.name}, ${area.city}`);
    setCity(area.city);
    addToast({
      type: 'info',
      title: 'Location Updated',
      message: `Switched location to ${area.name}, ${area.city}.`
    });
    closeLocationPicker();
  };

  // Filter locations based on active tab
  const filteredLocations = selectedCityFilter === 'All'
    ? mockLocations
    : mockLocations.filter(loc => loc.city.toLowerCase() === selectedCityFilter.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold font-serif text-white">
                {t("location.changeLocation") || "Where do you need the service?"}
              </h3>
              <p className="text-[11px] text-slate-300">
                {t("location.serviceArea") || "Current City"}: <span className="font-semibold text-emerald-400">{city || 'Not set'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeLocationPicker}
            disabled={isLoadingLocation}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[60vh] overflow-y-auto">
          {/* GPS Quick Action - Locate Me Button */}
          <button
            onClick={handleLocateMe}
            disabled={isLoadingLocation}
            className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 text-emerald-950 flex items-center justify-between gap-3 transition group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition shrink-0 shadow-xs">
                {isLoadingLocation ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Navigation className="w-5 h-5 fill-current" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm block text-emerald-950">{t("location.useCurrentLocation") || "Locate Me"}</span>
                  <span className="text-[10px] uppercase font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">GPS</span>
                </div>
                <span className="text-[11px] text-emerald-800 font-medium">
                  {isLoadingLocation ? 'Fetching coordinates...' : 'Detect location via OpenStreetMap'}
                </span>
              </div>
            </div>
            
            <div className="shrink-0">
              {isLoadingLocation ? (
                <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5 bg-emerald-200/60 px-3 py-1.5 rounded-xl animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Fetching...
                </span>
              ) : (
                <span className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  Detect
                </span>
              )}
            </div>
          </button>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                {t("location.nearbyWorkers") || "Popular Localities"}
              </h4>
              {selectedCityFilter !== 'All' && (
                <button
                  onClick={() => setSelectedCityFilter('All')}
                  className="text-[11px] text-emerald-600 hover:underline font-medium cursor-pointer"
                >
                  Show All
                </button>
              )}
            </div>

            {/* City Selection Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {availableCities.map(cityName => {
                const isActive = selectedCityFilter.toLowerCase() === cityName.toLowerCase();
                return (
                  <button
                    key={cityName}
                    onClick={() => setSelectedCityFilter(cityName)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cityName}
                  </button>
                );
              })}
            </div>

            {/* Localities List */}
            <div className="space-y-2 mt-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(loc => {
                  const isSelected = currentLocation.includes(loc.name);
                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleSelectArea(loc)}
                      disabled={isLoadingLocation}
                      className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{loc.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({loc.pincode})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {loc.city}, {loc.state}
                        </div>
                        {loc.popularLandmarks && loc.popularLandmarks.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap pt-0.5">
                            <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                            {loc.popularLandmarks.map((landmark, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-100 text-slate-600 font-normal px-1.5 py-0.5 rounded"
                              >
                                {landmark}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-slate-500 bg-slate-50 rounded-xl">
                  No localities found for {selectedCityFilter}.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-right">
          <button
            onClick={closeLocationPicker}
            disabled={isLoadingLocation}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


