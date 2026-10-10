import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { Haven, IndianCity, UserLocationState, PRESET_UPLOAD_CITIES } from '../data/havenData';
import { SeismicZone } from '../data/earthquakeScanData';
import { playTactileClick, playSeismicRumble } from '../utils/audioSynth';
import { NearbySituationFeed } from './NearbySituationFeed';

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyB4kw6m4kPLtvJy7gtq2GoNY6Gjr5WwH1s';

// Senior Hackathon Tactical Black, Red, and Blue Map Styling
const DARK_TACTICAL_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#030712' }] }, // Pitch Black Ground
  { elementType: 'labels.text.stroke', stylers: [{ color: '#020617' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }] // Cyan text
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#60a5fa' }] // Blue text
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#080f24' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#091530' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#020617' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94a3b8' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#1d4ed8' }] // Electric Blue Highways
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1e3a8a' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#93c5fd' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#0b132b' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#06132d' }] // Deep Sapphire Water
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#020617' }]
  }
];

interface TacticalMapProps {
  havens: Haven[];
  selectedHaven: Haven | null;
  onSelectHaven: (haven: Haven) => void;
  onStartCompass: () => void;
  currentCity: IndianCity;
  userLocation: UserLocationState;
  onDetectLocation: () => void;
  isLocating: boolean;
  onUploadCity: (city: IndianCity) => void;
  onCustomLocalitySubmit: (localityText: string) => void;
  onOpenOfflineDossier?: () => void;
  isEarthquakeScannerActive: boolean;
  onToggleEarthquakeScanner: () => void;
  seismicZones: SeismicZone[];
  onSelectSeismicZone: (zone: SeismicZone) => void;
  onOpenEarthquakeScannerSettings?: () => void;
  isFamilyFilterActive?: boolean;
  onOpenFamilyShield?: () => void;
}

// Tactical Route Layer that calculates and draws high-contrast route polyline on Google Map
const TacticalRouteLayer: React.FC<{
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  travelMode: 'WALKING' | 'DRIVING' | 'BICYCLING';
  onRouteCalculated?: (routeInfo: { distanceText: string; durationText: string }) => void;
}> = ({ origin, destination, travelMode, onRouteCalculated }) => {
  const map = useMap();
  const directionsRendererRef = React.useRef<any>(null);
  const fallbackPolylineRef = React.useRef<any>(null);

  useEffect(() => {
    // Check window.google
    const gWindow = window as any;
    if (!map || !gWindow.google || !gWindow.google.maps) return;

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    if (fallbackPolylineRef.current) {
      fallbackPolylineRef.current.setMap(null);
      fallbackPolylineRef.current = null;
    }

    if (!origin || !destination) return;

    const googleMaps = gWindow.google.maps;

    try {
      const directionsService = new googleMaps.DirectionsService();
      const directionsRenderer = new googleMaps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: travelMode === 'DRIVING' ? '#ef4444' : '#3b82f6',
          strokeOpacity: 0.9,
          strokeWeight: 6,
          zIndex: 25
        }
      });
      directionsRendererRef.current = directionsRenderer;

      const mode =
        travelMode === 'DRIVING'
          ? googleMaps.TravelMode.DRIVING
          : travelMode === 'BICYCLING'
          ? googleMaps.TravelMode.BICYCLING
          : googleMaps.TravelMode.WALKING;

      directionsService.route(
        {
          origin: new googleMaps.LatLng(origin.lat, origin.lng),
          destination: new googleMaps.LatLng(destination.lat, destination.lng),
          travelMode: mode
        },
        (result: any, status: any) => {
          if (status === googleMaps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);
            const leg = result.routes?.[0]?.legs?.[0];
            if (leg && onRouteCalculated) {
              onRouteCalculated({
                distanceText: leg.distance?.text || '',
                durationText: leg.duration?.text || ''
              });
            }
          } else {
            // Draw direct fallback geodesic line with radar glow
            const path = [
              new googleMaps.LatLng(origin.lat, origin.lng),
              new googleMaps.LatLng(destination.lat, destination.lng)
            ];
            const poly = new googleMaps.Polyline({
              path,
              geodesic: true,
              strokeColor: '#38bdf8',
              strokeOpacity: 0.85,
              strokeWeight: 4,
              map: map,
              zIndex: 25
            });
            fallbackPolylineRef.current = poly;
          }
        }
      );
    } catch {
      // Fallback
    }

    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
      if (fallbackPolylineRef.current) {
        fallbackPolylineRef.current.setMap(null);
      }
    };
  }, [map, origin?.lat, origin?.lng, destination?.lat, destination?.lng, travelMode]);

  return null;
};

// Seismic Map Circles Layer for Google Maps (Red Area Hazard Circles & Green Area Safe Residence Circles)
const SeismicMapCirclesLayer: React.FC<{
  zones: SeismicZone[];
  onSelectZone: (zone: SeismicZone) => void;
}> = ({ zones, onSelectZone }) => {
  const map = useMap();
  const circlesRef = React.useRef<any[]>([]);

  useEffect(() => {
    const gWindow = window as any;
    if (!map || !gWindow.google || !gWindow.google.maps) return;

    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    const googleMaps = gWindow.google.maps;

    zones.forEach((zone) => {
      const isDanger = zone.type === 'danger_weak_tall';
      const circle = new googleMaps.Circle({
        map: map,
        center: { lat: zone.lat, lng: zone.lng },
        radius: zone.dangerRadiusMeters,
        fillColor: isDanger ? '#ef4444' : '#10b981',
        fillOpacity: isDanger ? 0.35 : 0.28,
        strokeColor: isDanger ? '#dc2626' : '#059669',
        strokeOpacity: 0.95,
        strokeWeight: 2.5,
        zIndex: 15,
        clickable: true
      });

      circle.addListener('click', () => {
        playTactileClick();
        onSelectZone(zone);
      });

      circlesRef.current.push(circle);
    });

    return () => {
      circlesRef.current.forEach((c) => c.setMap(null));
      circlesRef.current = [];
    };
  }, [map, zones, onSelectZone]);

  return null;
};

// Map pan controller
const MapController: React.FC<{ targetCenter: { lat: number; lng: number }; zoom: number }> = ({
  targetCenter,
  zoom
}) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo(targetCenter);
      map.setZoom(zoom);
    }
  }, [map, targetCenter, zoom]);

  return null;
};

export const TacticalMap: React.FC<TacticalMapProps> = ({
  havens,
  selectedHaven,
  onSelectHaven,
  onStartCompass,
  currentCity,
  userLocation,
  onDetectLocation,
  isLocating,
  onUploadCity,
  onCustomLocalitySubmit,
  onOpenOfflineDossier,
  isEarthquakeScannerActive,
  onToggleEarthquakeScanner,
  seismicZones,
  onSelectSeismicZone,
  onOpenEarthquakeScannerSettings,
  isFamilyFilterActive,
  onOpenFamilyShield
}) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [viewMode, setViewMode] = useState<'google' | 'solarpunk'>('google');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [googleMapsFailed, setGoogleMapsFailed] = useState(false);
  const [infoWindowHaven, setInfoWindowHaven] = useState<Haven | null>(null);
  const [isFullMap, setIsFullMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(currentCity.zoom);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');
  const [travelMode, setTravelMode] = useState<'WALKING' | 'DRIVING' | 'BICYCLING'>('WALKING');
  const [routeInfo, setRouteInfo] = useState<{ distanceText: string; durationText: string } | null>(null);
  const [seismicFilter, setSeismicFilter] = useState<'all' | 'danger' | 'safe'>('all');
  const [isQuakeSimulating, setIsQuakeSimulating] = useState(false);

  const filteredSeismicZones = React.useMemo(() => {
    if (seismicFilter === 'danger') {
      return seismicZones.filter((z) => z.type === 'danger_weak_tall');
    }
    if (seismicFilter === 'safe') {
      return seismicZones.filter((z) => z.type === 'safe_residence');
    }
    return seismicZones;
  }, [seismicZones, seismicFilter]);

  useEffect(() => {
    setZoomLevel(currentCity.zoom);
  }, [currentCity]);

  // Center on selected haven, or user GPS position, or current city center
  const targetCenter = selectedHaven
    ? { lat: selectedHaven.lat, lng: selectedHaven.lng }
    : userLocation.coords
    ? userLocation.coords
    : currentCity.center;

  const handleCustomCitySubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCityInput.trim()) return;
    playTactileClick();
    onCustomLocalitySubmit(customCityInput.trim());
    setCustomCityInput('');
    setShowUploadModal(false);
  };

  return (
    <div className="flex flex-col gap-3.5 text-slate-100">
      {/* 
        NO MAJOR CITIES TABS: Replaced with User Present Location & Geolocation Console
        Defaults to Jaipur (Pink City), and lets user Allow Location or Upload/Enter present city
      */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#060c20] p-3 rounded-2xl border border-blue-900/60 shadow-xl shadow-black">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#09122c] border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold shadow-md shadow-blue-950">
            <span className="material-symbols-outlined text-[18px]">
              {userLocation.isGpsAllowed ? 'gps_fixed' : 'location_city'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Active Tactical Zone
              </span>
              {userLocation.isGpsAllowed ? (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] text-blue-300 bg-blue-950/80 border border-blue-700/80 px-1.5 py-0.2 rounded font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                  GPS LOCKED
                </span>
              ) : (
                <span className="font-mono text-[9px] text-slate-400 bg-slate-900/80 border border-slate-800 px-1.5 py-0.2 rounded">
                  JAIPUR DEFAULT
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-100 text-[14px]">
              <span>{userLocation.localityName || currentCity.name}</span>
              <span className="font-mono text-[10px] text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded hidden sm:inline-block">
                {currentCity.sectorName}
              </span>
            </div>
          </div>
        </div>

        {/* Location Action Bar: Allow My Location & Upload Present City */}
        <div className="flex items-center gap-2">
          {/* Allow / Detect Location Button */}
          <button
            onClick={() => {
              playTactileClick();
              onDetectLocation();
            }}
            disabled={isLocating}
            title="Allow browser location to pinpoint nearby facilities"
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
              userLocation.isGpsAllowed
                ? 'bg-blue-950/90 text-blue-300 border-blue-500 shadow-lg shadow-blue-950'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-950/80'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${isLocating ? 'animate-spin' : ''}`}>
              {isLocating ? 'autorenew' : userLocation.isGpsAllowed ? 'my_location' : 'near_me'}
            </span>
            <span>
              {isLocating
                ? 'Detecting GPS...'
                : userLocation.isGpsAllowed
                ? 'Re-Sync GPS'
                : 'Allow My Location'}
            </span>
          </button>

          {/* Upload / Change Present City Button */}
          <button
            onClick={() => {
              playTactileClick();
              setShowUploadModal(true);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium border bg-[#020617] border-blue-900/80 text-slate-300 hover:text-white hover:border-blue-500 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-400">upload_file</span>
            <span>Enter Present City</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div
        className={`relative bg-[#020512] rounded-2xl overflow-hidden border border-blue-900/70 flex flex-col justify-between transition-all shadow-2xl shadow-black ${
          isFullMap ? 'fixed inset-4 z-50 min-h-[90vh]' : 'min-h-[540px] h-[580px] lg:h-[620px]'
        }`}
      >
        {/* Top HUD inside Map */}
        <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap justify-between items-start gap-2 pointer-events-none">
          <div className="bg-[#04081c]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-blue-900/60 shadow-xl flex items-center gap-2.5 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <div>
              <div className="font-mono text-[11px] text-slate-300 uppercase font-semibold">
                {userLocation.localityName ? `${userLocation.localityName.toUpperCase()} SECTOR` : currentCity.sectorName.toUpperCase()}
              </div>
              <div className="font-mono text-[10px] text-blue-400 font-bold">
                TACTICAL MESH ACTIVE • {havens.length} SANCTUARIES IN PROXIMITY
              </div>
            </div>
          </div>

          {/* Map Layer / View Toggle & Controls */}
          <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
            {/* View Mode Toggle */}
            <div className="bg-[#04081c]/95 backdrop-blur-md p-1 rounded-xl border border-blue-900/60 flex items-center gap-1 shadow-lg">
              <button
                onClick={() => {
                  playTactileClick();
                  setViewMode('google');
                  setGoogleMapsFailed(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                  viewMode === 'google'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Google Maps Satellite & Vector Base"
              >
                Google Maps
              </button>
              <button
                onClick={() => {
                  playTactileClick();
                  setViewMode('solarpunk');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                  viewMode === 'solarpunk'
                    ? 'bg-blue-950 text-blue-200 border border-blue-500/80 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="100% Offline Tactical Radar Deck (No API key required)"
              >
                Radar Deck (Offline)
              </button>
            </div>

            {/* Map Type Toggle when in Google mode */}
            {viewMode === 'google' && (
              <div className="bg-[#04081c]/95 backdrop-blur-md p-1 rounded-xl border border-blue-900/60 flex items-center gap-1 shadow-lg hidden sm:flex">
                {(['roadmap', 'hybrid', 'terrain'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      playTactileClick();
                      setMapType(t);
                    }}
                    className={`px-2 py-1 rounded-lg font-mono text-[11px] uppercase transition-all ${
                      mapType === t
                        ? 'bg-blue-950 text-blue-200 font-semibold border border-blue-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* Family & Child Safety Shield Button */}
            {onOpenFamilyShield && (
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenFamilyShield();
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border shadow-lg ${
                  isFamilyFilterActive
                    ? 'bg-emerald-950 text-emerald-200 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-[#04081c]/95 text-emerald-300 border-emerald-900/80 hover:border-emerald-500 hover:text-white'
                }`}
                title="Family & Children Defense Shield: Lost Child Beacon, Pediatric Care, Family Rooms"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-400">escalator_warning</span>
                <span className="hidden sm:inline">Family Shield</span>
              </button>
            )}

            {/* Earthquake Scanner Toggle Button */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  playTactileClick();
                  onToggleEarthquakeScanner();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border shadow-lg ${
                  isEarthquakeScannerActive
                    ? 'bg-red-950 text-red-200 border-red-500 shadow-[0_0_18px_rgba(239,68,68,0.5)] animate-pulse'
                    : 'bg-[#04081c]/95 text-slate-300 border-blue-900/80 hover:border-red-500 hover:text-white'
                }`}
                title="Scan buildings nearby for structural collapse risk vs safe residential grounds"
              >
                <span className="material-symbols-outlined text-[16px] text-red-400">
                  earthquake
                </span>
                <span>{isEarthquakeScannerActive ? 'Quake Scanner: ON' : 'Quake Scanner'}</span>
              </button>

              {onOpenEarthquakeScannerSettings && (
                <button
                  onClick={() => {
                    playTactileClick();
                    onOpenEarthquakeScannerSettings();
                  }}
                  className="p-1.5 rounded-xl bg-[#04081c]/95 border border-blue-900/80 hover:border-red-500 text-slate-300 hover:text-white transition-all shadow-md"
                  title="Earthquake Scanner Settings & Magnitude Parameters"
                >
                  <span className="material-symbols-outlined text-[16px] text-red-400">tune</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Earthquake Scanner Diagnostic Bar */}
        {isEarthquakeScannerActive && (
          <div className="absolute top-16 left-3 right-3 z-30 bg-[#060204]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.35)] flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <div>
                <div className="font-mono text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <span>SEISMIC VULNERABILITY SCANNER ACTIVE</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">Fault Line Structural Radar</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300">
                  <strong className="text-red-400">RED AREA:</strong> Weak & Tall Collapse Hazards • <strong className="text-emerald-400">GREEN AREA:</strong> Safe Residences
                </div>
              </div>
            </div>

            {/* Filter buttons & Simulation */}
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="bg-[#020512] p-0.5 rounded-xl border border-red-950 flex items-center gap-1">
                <button
                  onClick={() => {
                    playTactileClick();
                    setSeismicFilter('all');
                  }}
                  className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold ${
                    seismicFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({seismicZones.length})
                </button>
                <button
                  onClick={() => {
                    playTactileClick();
                    setSeismicFilter('danger');
                  }}
                  className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold ${
                    seismicFilter === 'danger'
                      ? 'bg-red-600 text-white'
                      : 'text-red-400 hover:text-red-200'
                  }`}
                >
                  🔴 Red ({seismicZones.filter((z) => z.type === 'danger_weak_tall').length})
                </button>
                <button
                  onClick={() => {
                    playTactileClick();
                    setSeismicFilter('safe');
                  }}
                  className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold ${
                    seismicFilter === 'safe'
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-400 hover:text-emerald-200'
                  }`}
                >
                  🟢 Green ({seismicZones.filter((z) => z.type === 'safe_residence').length})
                </button>
              </div>

              {/* Tremor Simulation Button */}
              <button
                onClick={() => {
                  playTactileClick();
                  playSeismicRumble(5);
                  setIsQuakeSimulating(true);
                  setTimeout(() => setIsQuakeSimulating(false), 5000);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                  isQuakeSimulating
                    ? 'bg-red-600 text-white border-red-400 animate-bounce'
                    : 'bg-[#180508] text-red-300 border-red-800 hover:border-red-500'
                }`}
              >
                {isQuakeSimulating ? 'Tremor Active (6.5M)!' : 'Simulate 6.5M Quake'}
              </button>

              {onOpenEarthquakeScannerSettings && (
                <button
                  onClick={() => {
                    playTactileClick();
                    onOpenEarthquakeScannerSettings();
                  }}
                  className="px-2.5 py-1 bg-[#09122c] border border-blue-900 hover:border-red-500 rounded-xl text-xs font-mono font-bold text-slate-300 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px] text-red-400">tune</span>
                  <span className="hidden sm:inline">Settings</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tremor Simulation Alert Overlay */}
        {isQuakeSimulating && (
          <div className="absolute inset-0 z-40 bg-red-950/40 border-4 border-red-600 pointer-events-none animate-pulse flex items-center justify-center">
            <div className="bg-red-950/95 border-2 border-red-500 text-white p-4 rounded-2xl text-center shadow-2xl max-w-md pointer-events-auto">
              <span className="material-symbols-outlined text-red-400 text-[36px] animate-spin">
                earthquake
              </span>
              <h3 className="font-mono text-base font-black text-red-200 mt-1">
                SEISMIC TREMOR SIMULATION: 6.5 RICHTER DETECTED
              </h3>
              <p className="font-mono text-xs text-slate-300 mt-1">
                All RED high-rise structures buckling. Clear 80m perimeter immediately and move into GREEN residential assembly sanctuaries.
              </p>
            </div>
          </div>
        )}

        {/* MAP CONTENT VIEWPORT */}
        <div className="relative w-full h-full flex-1">
          {viewMode === 'google' ? (
            <APIProvider
              apiKey={GOOGLE_MAPS_API_KEY}
              region="IN"
              language="en"
              onLoad={() => {
                setGoogleMapsLoaded(true);
                setGoogleMapsFailed(false);
              }}
              onError={() => {
                setGoogleMapsFailed(true);
              }}
            >
              {googleMapsFailed && (
                <div className="absolute inset-0 z-40 bg-[#030718]/95 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/60 text-amber-400 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[32px]">map</span>
                  </div>
                  <h3 className="font-mono text-sm font-bold text-white mb-1">
                    Google Maps Tile Loading Issue
                  </h3>
                  <p className="font-mono text-xs text-slate-300 max-w-md mb-4 leading-relaxed">
                    Google Maps API key is restricted or offline. You can switch directly to the Tactical Radar Deck which runs 100% locally and shows all verified sanctuaries, seismic danger zones, and emergency lifelines.
                  </p>
                  <button
                    onClick={() => {
                      playTactileClick();
                      setViewMode('solarpunk');
                      setGoogleMapsFailed(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">radar</span>
                    Switch to Tactical Radar Deck (Offline)
                  </button>
                </div>
              )}
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                defaultCenter={targetCenter}
                defaultZoom={currentCity.zoom}
                mapTypeId={mapType}
                gestureHandling="greedy"
                disableDefaultUI={false}
                zoomControl={true}
                fullscreenControl={false}
                streetViewControl={false}
                colorScheme="DARK"
                style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
              >
                <MapController targetCenter={targetCenter} zoom={zoomLevel} />

                {/* Tactical Route Corridor from User to Selected Haven */}
                {selectedHaven && userLocation.coords && (
                  <TacticalRouteLayer
                    origin={userLocation.coords}
                    destination={{ lat: selectedHaven.lat, lng: selectedHaven.lng }}
                    travelMode={travelMode}
                    onRouteCalculated={(info) => setRouteInfo(info)}
                  />
                )}

                {/* USER PRESENT LOCATION MARKER ("YOU ARE HERE") */}
                {userLocation.coords && (
                  <AdvancedMarker
                    position={userLocation.coords}
                    title="Your Current Location (Present Civilian Beacon)"
                  >
                    <div className="relative cursor-pointer group flex flex-col items-center">
                      <div className="absolute -inset-4 rounded-full bg-blue-500/30 animate-ping pointer-events-none"></div>
                      <div className="w-10 h-10 rounded-full bg-[#05112e] border-2 border-blue-400 flex items-center justify-center text-blue-300 shadow-[0_0_20px_#3b82f6] z-30">
                        <span className="material-symbols-outlined text-[20px] text-blue-300">
                          person_pin_circle
                        </span>
                      </div>
                      <div className="mt-1 bg-[#050b1e]/95 border border-blue-500/80 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white shadow-lg whitespace-nowrap">
                        YOU ARE HERE
                      </div>
                    </div>
                  </AdvancedMarker>
                )}

                {/* Render Advanced Markers for each Haven */}
                {havens.map((haven) => {
                  const isSelected = selectedHaven?.id === haven.id;
                  const isCritical = haven.category === 'hospital' || haven.category === 'fire';

                  let pinBg = isCritical
                    ? 'bg-[#180507] text-red-400 border-red-500 shadow-red-950'
                    : 'bg-[#050e24] text-blue-400 border-blue-500 shadow-blue-950';

                  let pulseBg = isCritical ? 'bg-red-500/40' : 'bg-blue-500/40';

                  let iconName = 'night_shelter';
                  if (haven.category === 'hospital') iconName = 'local_hospital';
                  if (haven.category === 'fire') iconName = 'local_fire_department';
                  if (haven.category === 'safehouse') iconName = 'cottage';
                  if (haven.category === 'peacekeeper') iconName = 'security';
                  if (haven.category === 'water') iconName = 'water_drop';

                  return (
                    <AdvancedMarker
                      key={haven.id}
                      position={{ lat: haven.lat, lng: haven.lng }}
                      title={haven.name}
                      onClick={() => {
                        playTactileClick();
                        onSelectHaven(haven);
                        setInfoWindowHaven(haven);
                      }}
                    >
                      <div className="relative group cursor-pointer transition-transform duration-200 hover:scale-125">
                        <span className={`absolute -inset-2 rounded-full ${pulseBg} ${isCritical ? 'radar-pulse-red' : 'radar-pulse-blue'}`}></span>
                        <div
                          className={`w-9 h-9 rounded-xl ${pinBg} flex items-center justify-center border shadow-xl shadow-black relative`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{iconName}</span>
                          {haven.childFriendly && (
                            <span
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-black border border-black flex items-center justify-center text-[9px] font-bold shadow-md z-30"
                              title="Family & Child Safe Zone"
                            >
                              👶
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${isCritical ? 'bg-red-400 shadow-[0_0_8px_#ef4444]' : 'bg-blue-400 shadow-[0_0_8px_#3b82f6]'}`}></div>
                        )}
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {/* InfoWindow for selected Haven (Black, Red, Blue custom UI) */}
                {infoWindowHaven && (
                  <InfoWindow
                    position={{ lat: infoWindowHaven.lat, lng: infoWindowHaven.lng }}
                    onCloseClick={() => setInfoWindowHaven(null)}
                  >
                    <div className="p-2 max-w-xs bg-[#050b1e] text-slate-100 rounded-xl border border-blue-900">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          infoWindowHaven.category === 'hospital' || infoWindowHaven.category === 'fire'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {infoWindowHaven.categoryLabel}
                        </span>
                        {infoWindowHaven.childFriendly && (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                            👶 Family Safe
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-slate-400">
                          {infoWindowHaven.eta}
                        </span>
                      </div>
                      <h4 className="font-bold text-[13px] leading-tight text-white">
                        {infoWindowHaven.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {infoWindowHaven.address}
                      </p>
                      {infoWindowHaven.childSafetyTags && (
                        <div className="mt-1.5 text-[10px] font-mono text-emerald-300 bg-[#02140c] p-1.5 rounded-lg border border-emerald-900/60">
                          ✓ {infoWindowHaven.childSafetyTags[0]}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-blue-400 mt-2 pt-1 border-t border-blue-900/60">
                        <span>Distance: {infoWindowHaven.distance}</span>
                        <span>{infoWindowHaven.openBeds ? `${infoWindowHaven.openBeds} Beds Free` : 'Ready'}</span>
                      </div>
                    </div>
                  </InfoWindow>
                )}

                {/* Seismic Earthquake Scanner Map Overlay (Red Hazard Areas & Green Safe Residence Areas) */}
                {isEarthquakeScannerActive && (
                  <>
                    <SeismicMapCirclesLayer
                      zones={filteredSeismicZones}
                      onSelectZone={onSelectSeismicZone}
                    />

                    {filteredSeismicZones.map((zone) => {
                      const isDanger = zone.type === 'danger_weak_tall';
                      return (
                        <AdvancedMarker
                          key={zone.id}
                          position={{ lat: zone.lat, lng: zone.lng }}
                          title={`${zone.name} (${zone.statusLabel})`}
                          onClick={() => {
                            playTactileClick();
                            onSelectSeismicZone(zone);
                          }}
                        >
                          <div className="relative group cursor-pointer flex flex-col items-center">
                            <span
                              className={`absolute -inset-3 rounded-full pointer-events-none ${
                                isDanger ? 'bg-red-600/40 radar-pulse-red' : 'bg-emerald-500/30 animate-pulse'
                              }`}
                            ></span>
                            <div
                              className={`w-9 h-9 rounded-2xl flex items-center justify-center border shadow-xl z-30 transition-transform group-hover:scale-125 ${
                                isDanger
                                  ? 'bg-[#1e0307] border-red-500 text-red-400 shadow-red-950'
                                  : 'bg-[#02180f] border-emerald-400 text-emerald-300 shadow-emerald-950'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {isDanger ? 'domain_disabled' : 'night_shelter'}
                              </span>
                            </div>
                            <div
                              className={`mt-1 border px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-xl whitespace-nowrap ${
                                isDanger
                                  ? 'bg-red-950/95 border-red-500 text-red-200'
                                  : 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
                              }`}
                            >
                              {isDanger ? `RED: ${zone.collapseRiskPercent}% RISK` : 'GREEN: SAFE RESIDENCE'}
                            </div>
                          </div>
                        </AdvancedMarker>
                      );
                    })}
                  </>
                )}
              </Map>
            </APIProvider>
          ) : (
            /* Tactical Radar Screen (Black, Blue and Red Sweep) */
            <div className="relative w-full h-full bg-[#020512] overflow-hidden flex items-center justify-center">
              {/* Tactical Radar Concentric Circles */}
              <div className="absolute w-[500px] h-[500px] rounded-full border border-blue-500/20 pointer-events-none"></div>
              <div className="absolute w-[360px] h-[360px] rounded-full border border-blue-500/25 pointer-events-none"></div>
              <div className="absolute w-[220px] h-[220px] rounded-full border border-blue-500/30 pointer-events-none"></div>
              <div className="absolute w-[90px] h-[90px] rounded-full border border-red-500/40 pointer-events-none"></div>

              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-blue-500/25 pointer-events-none"></div>
              <div className="absolute inset-y-0 left-1/2 w-px bg-blue-500/25 pointer-events-none"></div>

              {/* Rotating Radar Sweep */}
              <div className="absolute w-[480px] h-[480px] rounded-full origin-center pointer-events-none animate-spin [animation-duration:8s] opacity-35 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(37,99,235,0.4)_0deg,transparent_65deg)]"></div>

              {/* Grid dots */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

              {/* Radar Legend Pill */}
              <div className="absolute bottom-4 left-4 z-20 bg-[#060c22]/90 border border-blue-900 px-3 py-1.5 rounded-xl font-mono text-[10px] text-slate-300">
                Range: 25km Radius · LoRa ISM Spectrum · Sector Sweep Active
              </div>

              {/* Radar Vector Line to Selected Haven */}
              {selectedHaven && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${selectedHaven.mapCoords.x}%`}
                    y2={`${selectedHaven.mapCoords.y}%`}
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="opacity-75 animate-pulse"
                  />
                </svg>
              )}

              {/* Center Radar Beacon: User Location */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-400 shadow-[0_0_12px_#3b82f6] animate-pulse"></div>
                <span className="font-mono text-[9px] text-blue-300 font-bold bg-[#04081c]/90 px-1.5 py-0.5 rounded border border-blue-800 mt-1">
                  YOU
                </span>
              </div>

              {havens.map((h) => {
                const isSelected = selectedHaven?.id === h.id;
                const isCritical = h.category === 'hospital' || h.category === 'fire';
                let iconName = 'night_shelter';
                if (h.category === 'hospital') iconName = 'local_hospital';
                if (h.category === 'fire') iconName = 'local_fire_department';
                if (h.category === 'safehouse') iconName = 'cottage';
                if (h.category === 'water') iconName = 'water_drop';

                return (
                  <div
                    key={h.id}
                    onClick={() => {
                      playTactileClick();
                      onSelectHaven(h);
                    }}
                    className={`absolute z-20 group cursor-pointer transition-transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                    }`}
                    style={{
                      top: `${h.mapCoords.y}%`,
                      left: `${h.mapCoords.x}%`
                    }}
                  >
                    <div className="relative">
                      <span className={`absolute -inset-2 rounded-full ${isCritical ? 'bg-red-500/35 radar-pulse-red' : 'bg-blue-500/35 radar-pulse-blue'}`}></span>
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg shadow-black relative ${
                        isCritical
                          ? 'bg-[#180507] border-red-500 text-red-400'
                          : 'bg-[#050e24] border-blue-500 text-blue-400'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">{iconName}</span>
                        {h.childFriendly && (
                          <span
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-black border border-black flex items-center justify-center text-[8px] font-bold shadow-md z-30"
                            title="Family & Child Safe Zone"
                          >
                            👶
                          </span>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#050b1e] border border-blue-800 text-white font-mono text-[10px] rounded-lg whitespace-nowrap shadow-xl pointer-events-none transition-opacity">
                        {h.name} ({h.distance})
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Seismic Earthquake Scanner Radar Zones (Red Collapse vs Green Safe) */}
              {isEarthquakeScannerActive &&
                filteredSeismicZones.map((zone) => {
                  const isDanger = zone.type === 'danger_weak_tall';
                  return (
                    <div
                      key={zone.id}
                      onClick={() => {
                        playTactileClick();
                        onSelectSeismicZone(zone);
                      }}
                      className="absolute z-25 group cursor-pointer transition-transform hover:scale-125"
                      style={{
                        top: `${zone.mapCoords.y}%`,
                        left: `${zone.mapCoords.x}%`
                      }}
                    >
                      <div className="relative flex flex-col items-center">
                        <span
                          className={`absolute -inset-3.5 rounded-full pointer-events-none ${
                            isDanger
                              ? 'bg-red-500/35 radar-pulse-red border border-red-500/60'
                              : 'bg-emerald-500/35 animate-pulse border border-emerald-500/60'
                          }`}
                        ></span>
                        <div
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-lg ${
                            isDanger
                              ? 'bg-[#180307] border-red-500 text-red-400 shadow-red-950'
                              : 'bg-[#02180f] border-emerald-500 text-emerald-400 shadow-emerald-950'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isDanger ? 'domain_disabled' : 'verified_user'}
                          </span>
                        </div>
                        <div
                          className={`opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                            isDanger
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {isDanger ? `RED: ${zone.collapseRiskPercent}% RISK` : 'GREEN: SAFE RESIDENCE'}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Bottom Map Bar (Precision Monospace HUD) */}
        <div className="relative z-30 flex flex-wrap justify-between items-center gap-2 bg-[#04081c]/95 backdrop-blur-md p-3 border-t border-blue-900/60">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="material-symbols-outlined text-blue-400 text-[16px]">pin_drop</span>
            <span>
              Anchor: <strong className="text-white">{targetCenter.lat.toFixed(4)}°N, {targetCenter.lng.toFixed(4)}°E</strong>{' '}
              <span className="text-slate-500">
                ({userLocation.localityName || currentCity.name})
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTactileClick();
                setZoomLevel((z) => Math.min(z + 1, 18));
              }}
              className="bg-[#080f26] px-2.5 py-1 rounded-lg border border-blue-900 text-xs font-mono hover:border-blue-600 text-slate-300"
            >
              + Zoom In
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setZoomLevel((z) => Math.max(z - 1, 8));
              }}
              className="bg-[#080f26] px-2.5 py-1 rounded-lg border border-blue-900 text-xs font-mono hover:border-blue-600 text-slate-300"
            >
              - Zoom Out
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setIsFullMap(!isFullMap);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg border border-blue-400 text-xs font-mono font-bold shadow-md shadow-blue-950"
            >
              {isFullMap ? 'Exit Full View' : 'Full Map'}
            </button>
          </div>
        </div>
      </div>

      {/* Senior Tactical Route Guidance & Multi-Mode Navigation Deck */}
      <div className="bg-[#050b1e] p-4 rounded-2xl border border-blue-900/70 flex flex-col gap-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${
              selectedHaven?.category === 'hospital' || selectedHaven?.category === 'fire'
                ? 'bg-red-950/80 border-red-500 text-red-400'
                : 'bg-[#08122c] border-blue-500/60 text-blue-400'
            }`}>
              <span className="material-symbols-outlined text-[22px]">
                {travelMode === 'DRIVING' ? 'directions_car' : travelMode === 'BICYCLING' ? 'directions_bike' : 'directions_walk'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold text-blue-400">
                  Target Corridor:
                </span>
                <span className="font-bold text-white text-sm">
                  {selectedHaven ? selectedHaven.name : 'Select a Safe Harbor'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {routeInfo
                  ? `Google Route: ${routeInfo.distanceText} • ${routeInfo.durationText} (${travelMode.toLowerCase()})`
                  : selectedHaven
                  ? `Sector Distance: ${selectedHaven.distance} • Est: ${selectedHaven.eta}`
                  : `Select any sanctuary on map or feed to view tactical corridor`}
              </p>
            </div>
          </div>

          {/* Travel Mode Selector */}
          <div className="flex items-center gap-1.5 bg-[#020512] p-1 rounded-xl border border-blue-950">
            <button
              onClick={() => {
                playTactileClick();
                setTravelMode('WALKING');
              }}
              title="Pedestrian Corridor"
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                travelMode === 'WALKING'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">directions_walk</span>
              Walk
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setTravelMode('BICYCLING');
              }}
              title="Bike / Light EV"
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                travelMode === 'BICYCLING'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">directions_bike</span>
              Bike
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setTravelMode('DRIVING');
              }}
              title="Emergency Vehicle Convoy"
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                travelMode === 'DRIVING'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">directions_car</span>
              Convoy
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-blue-950/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span className="text-[11px] font-mono text-slate-400">
              Corridor Status: <strong className="text-blue-300">Active Zero-Radiation Safe Zone</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Open Google Maps External Link */}
            {selectedHaven && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.coords?.lat || currentCity.center.lat},${userLocation.coords?.lng || currentCity.center.lng}&destination=${selectedHaven.lat},${selectedHaven.lng}&travelmode=${travelMode.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTactileClick()}
                className="px-3 py-1.5 bg-[#09122c] border border-blue-800 hover:border-blue-500 rounded-xl text-blue-300 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                Google Maps App
              </a>
            )}

            {/* Offline Dossier Exporter */}
            {onOpenOfflineDossier && (
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenOfflineDossier();
                }}
                className="px-3 py-1.5 bg-[#081326] border border-blue-700/80 hover:border-blue-400 rounded-xl text-blue-200 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 tactile-button"
              >
                <span className="material-symbols-outlined text-[15px]">download_for_offline</span>
                Offline Go-Bag Dossier
              </button>
            )}

            {/* Start Compass Mode */}
            <button
              onClick={() => {
                playTactileClick();
                onStartCompass();
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider tactile-button shadow-md shadow-blue-950 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">explore</span>
              Compass HUD
            </button>
          </div>
        </div>
      </div>

      {/* Ground Situation Reports & Community Interaction Box */}
      <NearbySituationFeed
        userLocation={userLocation}
        currentCity={currentCity}
      />

      {/* MODAL: UPLOAD / ENTER PRESENT CITY OR AREA */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#050b1e] border border-blue-900/80 rounded-2xl p-6 max-w-md w-full shadow-2xl text-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-blue-950 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-[20px]">
                  share_location
                </span>
                <h3 className="font-bold text-base text-white">Enter Your Present Location</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              If GPS is unavailable, enter your city, neighborhood, or area name below to center the map and view nearby emergency lifelines.
            </p>

            {/* Custom Input Form */}
            <form onSubmit={handleCustomCitySubmitForm} className="mb-5">
              <label className="block font-mono text-[11px] text-blue-400 uppercase font-semibold mb-1.5">
                City / Locality / Neighborhood
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCityInput}
                  onChange={(e) => setCustomCityInput(e.target.value)}
                  placeholder="e.g. Mansarovar, Jaipur, Jodhpur, Kota..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#020617] border border-blue-900/80 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow-md"
                >
                  Set
                </button>
              </div>
            </form>

            {/* Quick Pick Presets */}
            <div className="border-t border-blue-950 pt-4">
              <label className="block font-mono text-[10px] text-slate-400 uppercase font-semibold mb-2">
                Or Quick-Select Present City:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_UPLOAD_CITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      playTactileClick();
                      onUploadCity(c);
                      setShowUploadModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                      currentCity.id === c.id
                        ? 'bg-blue-950 text-blue-200 border-blue-500 font-bold'
                        : 'bg-[#020617] text-slate-400 border-blue-950 hover:border-blue-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-white">{c.name.split('(')[0].trim()}</div>
                    <div className="text-[10px] text-slate-500">{c.state}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Allow GPS shortcut */}
            <div className="mt-5 pt-3 border-t border-blue-950 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-mono">Prefer automatic GPS?</span>
              <button
                onClick={() => {
                  playTactileClick();
                  setShowUploadModal(false);
                  onDetectLocation();
                }}
                className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 underline"
              >
                Allow GPS Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
