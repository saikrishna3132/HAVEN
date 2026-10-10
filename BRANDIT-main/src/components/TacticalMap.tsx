import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { Haven, IndianCity, UserLocationState, PRESET_UPLOAD_CITIES } from '../data/havenData';
import { playTactileClick } from '../utils/audioSynth';
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
}

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
  onCustomLocalitySubmit
}) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [viewMode, setViewMode] = useState<'google' | 'solarpunk'>('google');
  const [infoWindowHaven, setInfoWindowHaven] = useState<Haven | null>(null);
  const [isFullMap, setIsFullMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(currentCity.zoom);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');

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
          isFullMap ? 'fixed inset-4 z-50 min-h-[90vh]' : 'min-h-[580px] h-[580px]'
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
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* View Mode Toggle */}
            <div className="bg-[#04081c]/95 backdrop-blur-md p-1 rounded-xl border border-blue-900/60 flex items-center gap-1 shadow-lg">
              <button
                onClick={() => {
                  playTactileClick();
                  setViewMode('google');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                  viewMode === 'google'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Google Maps (Black)
              </button>
              <button
                onClick={() => {
                  playTactileClick();
                  setViewMode('solarpunk');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                  viewMode === 'solarpunk'
                    ? 'bg-red-950 text-red-200 border border-red-500/80 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Radar Deck
              </button>
            </div>

            {/* Map Type Toggle when in Google mode */}
            {viewMode === 'google' && (
              <div className="bg-[#04081c]/95 backdrop-blur-md p-1 rounded-xl border border-blue-900/60 flex items-center gap-1 shadow-lg">
                {(['roadmap', 'hybrid', 'terrain'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      playTactileClick();
                      setMapType(t);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] uppercase transition-all ${
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
          </div>
        </div>

        {/* MAP CONTENT VIEWPORT */}
        <div className="relative w-full h-full flex-1">
          {viewMode === 'google' ? (
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} region="IN" language="en">
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
                styles={DARK_TACTICAL_MAP_STYLES}
                style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
              >
                <MapController targetCenter={targetCenter} zoom={zoomLevel} />

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
                          className={`w-9 h-9 rounded-xl ${pinBg} flex items-center justify-center border shadow-xl shadow-black`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{iconName}</span>
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
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          infoWindowHaven.category === 'hospital' || infoWindowHaven.category === 'fire'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {infoWindowHaven.categoryLabel}
                        </span>
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
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-blue-400 mt-2 pt-1 border-t border-blue-900/60">
                        <span>Distance: {infoWindowHaven.distance}</span>
                        <span>{infoWindowHaven.openBeds ? `${infoWindowHaven.openBeds} Beds Free` : 'Ready'}</span>
                      </div>
                    </div>
                  </InfoWindow>
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
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg shadow-black ${
                        isCritical
                          ? 'bg-[#180507] border-red-500 text-red-400'
                          : 'bg-[#050e24] border-blue-500 text-blue-400'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">{iconName}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#050b1e] border border-blue-800 text-white font-mono text-[10px] rounded-lg whitespace-nowrap shadow-xl pointer-events-none transition-opacity">
                        {h.name} ({h.distance})
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

      {/* Rapid Distance Route Guidance Pill (Black Red Blue Card) */}
      <div className="bg-[#050b1e] p-4 rounded-xl border border-blue-900/60 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#08122c] border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[20px]">directions_walk</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Zero-Radiation Corridor Verified</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span className="font-mono text-xs text-blue-400 font-normal">
                ({userLocation.localityName || currentCity.name})
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              {currentCity.id === 'jaipur' || userLocation.localityName?.toLowerCase().includes('jaipur')
                ? 'JLN Marg solar canopy, Central Park Statue Circle, SMS Trauma corridor, & MI Road avenues illuminated by emergency LED beacons.'
                : `Local safe conduits and civilian access corridors illuminated by independent solar lamps in ${userLocation.localityName || currentCity.name}.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playTactileClick();
            onStartCompass();
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider tactile-button whitespace-nowrap shadow-md shadow-blue-950/70"
        >
          Start Compass Mode
        </button>
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
