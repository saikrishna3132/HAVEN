import React, { useState, useMemo, useEffect } from 'react';
import {
  DEFAULT_JAIPUR_CITY,
  JAIPUR_HAVENS_DATA,
  PRESET_UPLOAD_CITIES,
  Haven,
  IndianCity,
  UserLocationState,
  calculateDistanceKm,
  formatDistanceMetrics,
  generateNearbyFacilitiesForLocation
} from './data/havenData';
import { TopAlertBar } from './components/TopAlertBar';
import { TopNavBar } from './components/TopNavBar';
import { HeroSection } from './components/HeroSection';
import { TacticalMap } from './components/TacticalMap';
import { SanctuaryFeed } from './components/SanctuaryFeed';
import { TelemetryWidgets } from './components/TelemetryWidgets';
import { CommunityBanner } from './components/CommunityBanner';
import { FooterSection } from './components/FooterSection';

// Modals
import { CompassModal } from './components/modals/CompassModal';
import { ReservationModal } from './components/modals/ReservationModal';
import { RadioModal } from './components/modals/RadioModal';
import { AmbulanceModal } from './components/modals/AmbulanceModal';
import { RegisterHavenModal } from './components/modals/RegisterHavenModal';
import { BuddyFinderModal } from './components/modals/BuddyFinderModal';
import { EmergencyCallModal } from './components/modals/EmergencyCallModal';
import { SolarGridModal } from './components/modals/SolarGridModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { SurvivalGuidesModal } from './components/modals/SurvivalGuidesModal';
import { VolunteerPatrolModal } from './components/modals/VolunteerPatrolModal';
import { OfflineDossierModal } from './components/modals/OfflineDossierModal';
import { SosDistressModal } from './components/modals/SosDistressModal';
import { SeismicInspectorModal } from './components/modals/SeismicInspectorModal';
import { EarthquakeScannerSettingsModal } from './components/modals/EarthquakeScannerSettingsModal';
import { FamilyChildSafetyModal } from './components/modals/FamilyChildSafetyModal';
import {
  SeismicZone,
  JAIPUR_SEISMIC_ZONES,
  generateSeismicZonesForLocation,
  recalculateSeismicDistances
} from './data/earthquakeScanData';
import { playTactileClick } from './utils/audioSynth';

export default function App() {
  const [currentCity, setCurrentCity] = useState<IndianCity>(DEFAULT_JAIPUR_CITY);
  const [havensList, setHavensList] = useState<Haven[]>(JAIPUR_HAVENS_DATA);
  const [selectedHaven, setSelectedHaven] = useState<Haven | null>(JAIPUR_HAVENS_DATA[0]);
  const [isSosActive, setIsSosActive] = useState(false);
  const [activeTab, setActiveTab] = useState('radar');
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(15);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Earthquake Scanner State
  const [isEarthquakeScannerActive, setIsEarthquakeScannerActive] = useState(false);
  const [seismicZones, setSeismicZones] = useState<SeismicZone[]>(JAIPUR_SEISMIC_ZONES);
  const [inspectedSeismicZone, setInspectedSeismicZone] = useState<SeismicZone | null>(null);
  const [earthquakeScannerSettingsOpen, setEarthquakeScannerSettingsOpen] = useState(false);
  const [isQuakeSimulating, setIsQuakeSimulating] = useState(false);

  // User Present Location & Geolocation state
  const [userLocation, setUserLocation] = useState<UserLocationState>({
    coords: DEFAULT_JAIPUR_CITY.center,
    localityName: 'Jaipur (Pink City)',
    isGpsAllowed: false
  });
  const [isLocating, setIsLocating] = useState(false);

  // Layer filters
  const [filterRadiation, setFilterRadiation] = useState(true);
  const [filterPet, setFilterPet] = useState(true);
  const [filterWheelchair, setFilterWheelchair] = useState(true);
  const [filterWater, setFilterWater] = useState(true);

  // Modals
  const [compassOpen, setCompassOpen] = useState(false);
  const [reservationModalHaven, setReservationModalHaven] = useState<Haven | null>(null);
  const [radioModalOpen, setRadioModalOpen] = useState(false);
  const [radioChannel, setRadioChannel] = useState<string>('CH 04 (142.400 MHz • Jaipur ParkNet)');
  const [ambulanceModalHaven, setAmbulanceModalHaven] = useState<Haven | null>(null);
  const [registerHavenOpen, setRegisterHavenOpen] = useState(false);
  const [buddyFinderOpen, setBuddyFinderOpen] = useState(false);
  const [emergencyCallOpen, setEmergencyCallOpen] = useState(false);
  const [solarGridOpen, setSolarGridOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [volunteerPatrolOpen, setVolunteerPatrolOpen] = useState(false);
  const [survivalGuideOpen, setSurvivalGuideOpen] = useState<'map' | 'solar' | 'mesh' | null>(null);
  const [offlineDossierOpen, setOfflineDossierOpen] = useState(false);
  const [sosDistressModalOpen, setSosDistressModalOpen] = useState(false);

  // High contrast mode
  const [isSunlightMode, setIsSunlightMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleSunlightMode = () => {
    setIsSunlightMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('contrast-125', 'brightness-105');
      } else {
        document.documentElement.classList.remove('contrast-125', 'brightness-105');
      }
      return next;
    });
  };

  // Recompute distance for Jaipur havens based on user coordinates
  const recalculateJaipurDistances = (userLat: number, userLng: number, baseHavens = JAIPUR_HAVENS_DATA): Haven[] => {
    return baseHavens
      .map((h) => {
        const distKm = calculateDistanceKm(userLat, userLng, h.lat, h.lng);
        const metrics = formatDistanceMetrics(distKm);
        return {
          ...h,
          distance: metrics.distanceStr,
          distanceKm: distKm,
          eta: metrics.etaStr,
          travelMode: metrics.travelMode
        };
      })
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  };

  // DETECT / ALLOW USER GPS LOCATION FLOW WITH IP FALLBACK
  const handleDetectLocation = () => {
    setIsLocating(true);
    showToast('Requesting location authorization...');

    const applyCoordinates = (lat: number, lng: number, label: string, isRealGps: boolean, accuracy = 50) => {
      const distFromJaipur = calculateDistanceKm(
        lat,
        lng,
        DEFAULT_JAIPUR_CITY.center.lat,
        DEFAULT_JAIPUR_CITY.center.lng
      );

      if (distFromJaipur <= 45) {
        // User is in or around Jaipur!
        const updatedHavens = recalculateJaipurDistances(lat, lng);
        setHavensList(updatedHavens);
        setSelectedHaven(updatedHavens[0]);
        setSeismicZones(recalculateSeismicDistances(lat, lng));
        setUserLocation({
          coords: { lat, lng },
          localityName: isRealGps ? 'Jaipur (GPS Locked)' : label,
          isGpsAllowed: true,
          accuracyMeters: accuracy,
          timestamp: Date.now()
        });
        setCurrentCity({
          ...DEFAULT_JAIPUR_CITY,
          center: { lat, lng },
          name: isRealGps ? 'Jaipur (GPS Locked)' : `Jaipur (${label})`
        });
        setIsLocating(false);
        showToast(`Location acquired (${label})! Showing ${updatedHavens.length} nearby facilities sorted by distance.`);
      } else {
        // Outside Jaipur: generate local facilities around coordinates
        const localityTag = label || `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
        const generatedHavens = generateNearbyFacilitiesForLocation(lat, lng, localityTag);
        setHavensList(generatedHavens);
        setSelectedHaven(generatedHavens[0]);
        setSeismicZones(generateSeismicZonesForLocation(lat, lng, localityTag));
        setUserLocation({
          coords: { lat, lng },
          localityName: localityTag,
          isGpsAllowed: true,
          accuracyMeters: accuracy,
          timestamp: Date.now()
        });
        setCurrentCity({
          id: 'present-user-location',
          name: localityTag,
          state: 'Ground Sector',
          center: { lat, lng },
          zoom: 14,
          sectorName: `${localityTag} Mesh`
        });
        setIsLocating(false);
        showToast(`Location acquired (${localityTag})! Generated nearby emergency facilities.`);
      }
    };

    const tryNetworkFallback = async (reason: string) => {
      showToast(`${reason} Attempting network IP location detection...`);
      try {
        const res = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
            applyCoordinates(
              data.latitude,
              data.longitude,
              data.cityName ? `${data.cityName}, ${data.regionName || ''}`.trim() : 'Network Location',
              false,
              1000
            );
            return;
          }
        }
      } catch {
        // Continue to secondary IP service
      }

      try {
        const res2 = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
        if (res2.ok) {
          const data2 = await res2.json();
          if (typeof data2.latitude === 'number' && typeof data2.longitude === 'number') {
            applyCoordinates(
              data2.latitude,
              data2.longitude,
              data2.city ? `${data2.city}, ${data2.region || ''}`.trim() : 'Network Location',
              false,
              1500
            );
            return;
          }
        }
      } catch {
        // Both failed
      }

      setIsLocating(false);
      showToast('Location permission unavailable in current preview frame. Please enter your present city/locality manually.');
    };

    if (!navigator.geolocation) {
      tryNetworkFallback('Browser Geolocation unavailable.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 20);
        applyCoordinates(lat, lng, 'GPS Accurate', true, accuracy);
      },
      (err) => {
        console.warn('Geolocation error:', err.code, err.message);
        if (err.code === 1) {
          tryNetworkFallback('Browser or iframe permission blocked.');
        } else if (err.code === 3) {
          tryNetworkFallback('GPS request timed out.');
        } else {
          tryNetworkFallback('Position unavailable.');
        }
      },
      {
        enableHighAccuracy: false, // false works much faster on laptops/WiFi and avoids timeout
        timeout: 7000,
        maximumAge: 30000
      }
    );
  };

  // UPLOAD / SELECT PRESENT CITY FROM PRESETS
  const handleUploadCity = (city: IndianCity) => {
    setCurrentCity(city);
    setUserLocation({
      coords: city.center,
      localityName: city.name,
      isGpsAllowed: false
    });

    if (city.id === 'jaipur') {
      const updated = recalculateJaipurDistances(city.center.lat, city.center.lng);
      setHavensList(updated);
      setSelectedHaven(updated[0]);
      setSeismicZones(recalculateSeismicDistances(city.center.lat, city.center.lng));
      showToast(`Map anchored to ${city.name} (${city.state}). Showing verified Jaipur lifelines.`);
    } else {
      const generated = generateNearbyFacilitiesForLocation(city.center.lat, city.center.lng, city.name);
      setHavensList(generated);
      setSelectedHaven(generated[0]);
      setSeismicZones(generateSeismicZonesForLocation(city.center.lat, city.center.lng, city.name));
      showToast(`Sector uploaded: ${city.name}. Showing nearby emergency facilities.`);
    }
  };

  // CUSTOM LOCALITY / CITY NAME SUBMISSION (e.g. "Mansarovar", "Vaishali Nagar", "Kota", etc.)
  const handleCustomLocalitySubmit = (localityText: string) => {
    const query = localityText.toLowerCase().trim();

    // Check if user entered a specific Jaipur locality
    if (query.includes('mansarovar')) {
      const lat = 26.8580;
      const lng = 75.7627;
      const updated = recalculateJaipurDistances(lat, lng);
      setHavensList(updated);
      setSelectedHaven(updated[0]);
      setUserLocation({
        coords: { lat, lng },
        localityName: 'Mansarovar, Jaipur',
        isGpsAllowed: false
      });
      setCurrentCity({
        ...DEFAULT_JAIPUR_CITY,
        center: { lat, lng },
        name: 'Mansarovar (Jaipur)'
      });
      showToast('Anchored to Mansarovar, Jaipur! Updated nearby facilities.');
      return;
    }

    if (query.includes('malviya') || query.includes('wtp')) {
      const lat = 26.8532;
      const lng = 75.8051;
      const updated = recalculateJaipurDistances(lat, lng);
      setHavensList(updated);
      setSelectedHaven(updated[0]);
      setUserLocation({
        coords: { lat, lng },
        localityName: 'Malviya Nagar, Jaipur',
        isGpsAllowed: false
      });
      setCurrentCity({
        ...DEFAULT_JAIPUR_CITY,
        center: { lat, lng },
        name: 'Malviya Nagar (Jaipur)'
      });
      showToast('Anchored to Malviya Nagar, Jaipur! Updated nearby facilities.');
      return;
    }

    if (query.includes('vaishali')) {
      const lat = 26.9080;
      const lng = 75.7440;
      const updated = recalculateJaipurDistances(lat, lng);
      setHavensList(updated);
      setSelectedHaven(updated[0]);
      setUserLocation({
        coords: { lat, lng },
        localityName: 'Vaishali Nagar, Jaipur',
        isGpsAllowed: false
      });
      setCurrentCity({
        ...DEFAULT_JAIPUR_CITY,
        center: { lat, lng },
        name: 'Vaishali Nagar (Jaipur)'
      });
      showToast('Anchored to Vaishali Nagar, Jaipur! Updated nearby facilities.');
      return;
    }

    // Check preset cities (e.g. Mumbai, Delhi, Bengaluru, Jodhpur, Udaipur, Kota, Ajmer)
    const matchedPreset = PRESET_UPLOAD_CITIES.find((c) => {
      const cName = c.name.toLowerCase();
      const cId = c.id.toLowerCase();
      const cState = c.state.toLowerCase();
      return (
        query.includes(cId) ||
        query.includes(cName.split('(')[0].trim()) ||
        cName.includes(query) ||
        (query.length >= 3 && cState.includes(query))
      );
    });

    if (matchedPreset) {
      handleUploadCity(matchedPreset);
      return;
    }

    // Check specific popular metros
    if (query.includes('bombay') || query.includes('nariman') || query.includes('bandra') || query.includes('dadar') || query.includes('thane')) {
      const mumbaiPreset = PRESET_UPLOAD_CITIES.find((c) => c.id === 'mumbai');
      if (mumbaiPreset) {
        handleUploadCity(mumbaiPreset);
        return;
      }
    }

    if (query.includes('noida') || query.includes('gurgaon') || query.includes('gurugram') || query.includes('cp') || query.includes('connaught')) {
      const delhiPreset = PRESET_UPLOAD_CITIES.find((c) => c.id === 'delhi');
      if (delhiPreset) {
        handleUploadCity(delhiPreset);
        return;
      }
    }

    if (query.includes('bangalore') || query.includes('whitefield') || query.includes('koramangala') || query.includes('indiranagar')) {
      const blrPreset = PRESET_UPLOAD_CITIES.find((c) => c.id === 'bengaluru');
      if (blrPreset) {
        handleUploadCity(blrPreset);
        return;
      }
    }

    // Custom area anywhere: generate nearby facilities around Jaipur or custom offset
    const lat = 26.9124 + (Math.random() - 0.5) * 0.04;
    const lng = 75.7873 + (Math.random() - 0.5) * 0.04;
    const generated = generateNearbyFacilitiesForLocation(lat, lng, localityText);
    setHavensList(generated);
    setSelectedHaven(generated[0]);
    setUserLocation({
      coords: { lat, lng },
      localityName: localityText,
      isGpsAllowed: false
    });
    setCurrentCity({
      id: 'custom-locality',
      name: localityText,
      state: 'Sector Mesh',
      center: { lat, lng },
      zoom: 14,
      sectorName: `${localityText} Sector Mesh`
    });
    showToast(`Anchored to ${localityText}. Showing nearby emergency facilities.`);
  };

  const handleRegisterSuccess = (newNode: any) => {
    const newHavenItem: Haven = {
      id: newNode.nodeId.toLowerCase(),
      name: newNode.name,
      city: currentCity.id,
      category: 'safehouse',
      categoryLabel: 'Civic Safe House',
      badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
      dotClass: 'bg-blue-400',
      distance: '0.4 km walk',
      distanceKm: 0.4,
      eta: '5 min walk',
      travelMode: 'walk',
      occupancyPercent: 10,
      openBeds: newNode.bedsOffered,
      totalBeds: newNode.bedsOffered,
      tags: ['Solar Microgrid', 'Potable Reserve', newNode.petAllowed ? 'Pet Friendly' : 'Human Safe'],
      radiationSafe: true,
      petFriendly: newNode.petAllowed,
      wheelchairReady: newNode.wheelchairAccess,
      filteredWater: true,
      radioChannel: newNode.callsign,
      phone: 'Civic Mesh Node (Jaipur)',
      lat: (userLocation.coords?.lat || currentCity.center.lat) + 0.003,
      lng: (userLocation.coords?.lng || currentCity.center.lng) + 0.003,
      mapCoords: { x: 50, y: 48 },
      address: `${newNode.address}, ${userLocation.localityName || currentCity.name}`,
      sector: `${currentCity.sectorName} (Community Node)`,
      description: 'Newly registered civilian emergency haven node with PM-Surya solar backup.'
    };
    setHavensList([newHavenItem, ...havensList]);
    setSelectedHaven(newHavenItem);
    showToast(`Haven Node ${newNode.nodeId} successfully registered!`);
  };

  // Filter Havens by distance (within radiusKm), search query, and categories
  const filteredHavens = useMemo(() => {
    return havensList.filter((h) => {
      // Distance filter: must be within radiusKm
      if (h.distanceKm !== undefined && h.distanceKm > radiusKm) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          h.name.toLowerCase().includes(query) ||
          h.sector.toLowerCase().includes(query) ||
          h.address.toLowerCase().includes(query) ||
          h.tags.some((t) => t.toLowerCase().includes(query)) ||
          (h.description && h.description.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (h.category !== selectedCategory) return false;
      }

      // Layer checkbox filters
      if (filterRadiation && !h.radiationSafe) return false;
      if (filterPet && !h.petFriendly) return false;
      if (filterWheelchair && !h.wheelchairReady) return false;
      if (filterWater && !h.filteredWater) return false;

      return true;
    });
  }, [
    havensList,
    radiusKm,
    searchQuery,
    selectedCategory,
    filterRadiation,
    filterPet,
    filterWheelchair,
    filterWater
  ]);

  // Tab navigation scroll/filter
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'radar') {
      setSelectedCategory('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'shelters') {
      setSelectedCategory('safehouse');
      const el = document.getElementById('shelters-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'medical') {
      setSelectedCategory('hospital');
      const el = document.getElementById('shelters-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'resources') {
      setSelectedCategory('water');
      const el = document.getElementById('shelters-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'community') {
      const el = document.getElementById('community-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReservationConfirmed = (havenId: string, reservedBeds: number) => {
    setHavensList((prev) =>
      prev.map((h) => {
        if (h.id === havenId && h.openBeds !== undefined) {
          const newOpen = Math.max(0, h.openBeds - reservedBeds);
          const total = h.totalBeds || (newOpen + reservedBeds);
          const newPct = Math.min(100, Math.round(((total - newOpen) / total) * 100));
          return {
            ...h,
            openBeds: newOpen,
            occupancyPercent: newPct
          };
        }
        return h;
      })
    );
    showToast(`Sanctuary Bed Confirmed! ${reservedBeds} slot(s) reserved.`);
  };

  return (
    <div className="bg-[#020617] text-slate-100 antialiased selection:bg-blue-600 selection:text-white flex flex-col min-h-screen">
      {/* Toast Notification (Black, Blue, Red) */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#050b1e] text-white px-5 py-2.5 rounded-full font-mono text-xs font-bold shadow-2xl border border-blue-500 animate-fade-in flex items-center gap-2 max-w-lg text-center">
          <span className="material-symbols-outlined text-blue-400 text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP ALERT / STATUS TICKER */}
      <TopAlertBar
        isSosActive={isSosActive}
        onToggleSos={() => setIsSosActive(!isSosActive)}
        locationName={userLocation.localityName || currentCity.name}
        coords={userLocation.coords || currentCity.center}
        onOpenSosConsole={() => setSosDistressModalOpen(true)}
      />

      {/* 2. TOP NAV BAR */}
      <TopNavBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenEmergencyCall={() => setEmergencyCallOpen(true)}
        onOpenSolarModal={() => setSolarGridOpen(true)}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onToggleSos={() => setIsSosActive(!isSosActive)}
        isSosActive={isSosActive}
        onOpenOfflineDossier={() => setOfflineDossierOpen(true)}
        isEarthquakeScannerActive={isEarthquakeScannerActive}
        onOpenEarthquakeScannerSettings={() => setEarthquakeScannerSettingsOpen(true)}
      />

      {/* 3. HERO BANNER & UNIVERSAL SEARCH WITH GPS LOCATE */}
      <main className="flex-grow">
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onLocateMe={handleDetectLocation}
          isLocating={isLocating}
          userLocation={userLocation}
        />

        {/* 4. INTERACTIVE SPLIT GRID: LIVE MAP & SAFE HAVENS FEED */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10" id="shelters-section">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block animate-ping"></span>
                <span className="font-mono text-xs text-blue-400 uppercase font-semibold tracking-wider">
                  Live Ground Radar · {userLocation.localityName || currentCity.name}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
                Nearby Safe Harbors & Google Maps Triage
              </h2>
            </div>

            {/* Filter Layers Controls (Black, Blue, Red Toggles) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-slate-400 uppercase font-bold mr-1">
                Layer Filters:
              </span>

              <label
                onClick={() => playTactileClick()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                  filterRadiation
                    ? 'bg-blue-950 text-blue-300 border-blue-500 shadow-md font-bold'
                    : 'bg-[#050b1e] text-slate-500 border-blue-950 hover:text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={filterRadiation}
                  onChange={(e) => setFilterRadiation(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500 w-3.5 h-3.5 accent-blue-500"
                />
                <span className="material-symbols-outlined text-[16px] text-blue-400">verified_user</span>
                Radiation Safe
              </label>

              <label
                onClick={() => playTactileClick()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                  filterPet
                    ? 'bg-blue-950 text-blue-300 border-blue-500 shadow-md font-bold'
                    : 'bg-[#050b1e] text-slate-500 border-blue-950 hover:text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={filterPet}
                  onChange={(e) => setFilterPet(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500 w-3.5 h-3.5 accent-blue-500"
                />
                <span className="material-symbols-outlined text-[16px] text-blue-400">pets</span>
                Pet Friendly
              </label>

              <label
                onClick={() => playTactileClick()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                  filterWheelchair
                    ? 'bg-blue-950 text-blue-300 border-blue-500 shadow-md font-bold'
                    : 'bg-[#050b1e] text-slate-500 border-blue-950 hover:text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={filterWheelchair}
                  onChange={(e) => setFilterWheelchair(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500 w-3.5 h-3.5 accent-blue-500"
                />
                <span className="material-symbols-outlined text-[16px] text-cyan-400">accessible</span>
                Wheelchair Ready
              </label>

              <label
                onClick={() => playTactileClick()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                  filterWater
                    ? 'bg-blue-950 text-blue-300 border-blue-500 shadow-md font-bold'
                    : 'bg-[#050b1e] text-slate-500 border-blue-950 hover:text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={filterWater}
                  onChange={(e) => setFilterWater(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500 w-3.5 h-3.5 accent-blue-500"
                />
                <span className="material-symbols-outlined text-[16px] text-blue-400">water_full</span>
                Filtered Water
              </label>

              {/* Earthquake Scanner Premier Setting */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setIsEarthquakeScannerActive((prev) => {
                      const next = !prev;
                      showToast(
                        next
                          ? '⚡ Earthquake Scanner Active: Red Area (Weak & Tall Hazards) vs Green Area (Safe Residences) enabled.'
                          : 'Earthquake Scanner Deactivated.'
                      );
                      return next;
                    });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono cursor-pointer transition-all shadow-md ${
                    isEarthquakeScannerActive
                      ? 'bg-red-950 text-red-200 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] font-bold animate-pulse'
                      : 'bg-[#050b1e] text-slate-400 border-blue-950 hover:border-red-500 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-red-400">earthquake</span>
                  <span>Earthquake Scanner: {isEarthquakeScannerActive ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setEarthquakeScannerSettingsOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-900/80 bg-[#120306] text-red-300 hover:border-red-500 hover:text-white text-xs font-mono font-bold cursor-pointer transition-all shadow-md"
                  title="Configure Earthquake Scanner sensitivity, magnitude simulation, and structural thresholds"
                >
                  <span className="material-symbols-outlined text-[15px] text-red-400">tune</span>
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </div>
            </div>

            {/* Active Earthquake Scanner Explanatory Ribbon */}
            {isEarthquakeScannerActive && (
              <div className="mt-3 p-3 bg-gradient-to-r from-red-950/40 via-[#090518] to-emerald-950/40 border border-red-500/70 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0"></span>
                  <div className="leading-snug">
                    <span className="text-white font-bold block sm:inline sm:mr-2">
                      EARTHQUAKE SCANNER ACTIVE:
                    </span>
                    <span className="text-red-300 font-semibold">
                      🔴 RED AREA: Very weak & big buildings with high breaking risk (Uninhabitable)
                    </span>
                    <span className="text-slate-500 mx-1.5 hidden sm:inline">•</span>
                    <span className="text-emerald-300 font-semibold block sm:inline">
                      🟢 GREEN AREA: Certified safe structures where people can reside
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playTactileClick();
                    setEarthquakeScannerSettingsOpen(true);
                  }}
                  className="px-2.5 py-1 bg-red-950 border border-red-700 hover:border-red-400 text-red-200 rounded-xl text-[11px] font-bold font-mono shrink-0 transition-all shadow-sm"
                >
                  Open Scanner Settings →
                </button>
              </div>
            )}
          </div>

          {/* Split Layout: Map (left) & Feed (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Map with Google Maps (Jaipur default & GPS present location) */}
            <div className="lg:col-span-7">
              <TacticalMap
                havens={filteredHavens}
                selectedHaven={selectedHaven}
                onSelectHaven={(h) => setSelectedHaven(h)}
                onStartCompass={() => setCompassOpen(true)}
                currentCity={currentCity}
                userLocation={userLocation}
                onDetectLocation={handleDetectLocation}
                isLocating={isLocating}
                onUploadCity={handleUploadCity}
                onCustomLocalitySubmit={handleCustomLocalitySubmit}
                onOpenOfflineDossier={() => setOfflineDossierOpen(true)}
                isEarthquakeScannerActive={isEarthquakeScannerActive}
                onToggleEarthquakeScanner={() => setIsEarthquakeScannerActive(!isEarthquakeScannerActive)}
                seismicZones={seismicZones}
                onSelectSeismicZone={(zone) => setInspectedSeismicZone(zone)}
                onOpenEarthquakeScannerSettings={() => setEarthquakeScannerSettingsOpen(true)}
              />
            </div>

            {/* Right 5 cols: Live Feed */}
            <div className="lg:col-span-5" id="medical-section">
              <SanctuaryFeed
                havens={filteredHavens}
                selectedHaven={selectedHaven}
                onSelectHaven={(h) => setSelectedHaven(h)}
                onReserveBed={(h) => setReservationModalHaven(h)}
                onTuneRadio={(ch) => {
                  setRadioChannel(ch);
                  setRadioModalOpen(true);
                }}
                onDispatchAmbulance={(h) => setAmbulanceModalHaven(h)}
                onCallDirect={() => setEmergencyCallOpen(true)}
                onRequestEscort={() => setBuddyFinderOpen(true)}
                onJoinMeal={(h) => setReservationModalHaven(h)}
                isEarthquakeScannerActive={isEarthquakeScannerActive}
                seismicZones={seismicZones}
                onSelectSeismicZone={(zone) => setInspectedSeismicZone(zone)}
                onOpenEarthquakeScannerSettings={() => setEarthquakeScannerSettingsOpen(true)}
              />
            </div>
          </div>
        </section>

        {/* 5. VITAL REAL-TIME COMMUNITY TELEMETRY WIDGETS */}
        <TelemetryWidgets
          onOpenRadio={() => {
            setRadioChannel('CH 04 (142.400 MHz • Jaipur ParkNet)');
            setRadioModalOpen(true);
          }}
          onOpenBuddyFinder={() => setBuddyFinderOpen(true)}
          onOpenSolarModal={() => setSolarGridOpen(true)}
          isEarthquakeScannerActive={isEarthquakeScannerActive}
          onOpenEarthquakeScannerSettings={() => setEarthquakeScannerSettingsOpen(true)}
        />

        {/* 6. COOPERATIVE RESILIENCE & COMMUNITY SECTION */}
        <CommunityBanner
          onOpenRegisterHaven={() => setRegisterHavenOpen(true)}
          onOpenVolunteerPatrol={() => setVolunteerPatrolOpen(true)}
          locationName={userLocation.localityName || currentCity.name}
        />
      </main>

      {/* 7. FOOTER WITH OFFLINE MESH & HOTLINE INFO */}
      <FooterSection
        onOpenGuides={(guide) => setSurvivalGuideOpen(guide)}
        onOpenEmergencyCall={() => setEmergencyCallOpen(true)}
        isSunlightMode={isSunlightMode}
        onToggleSunlightMode={handleToggleSunlightMode}
      />

      {/* MODALS */}
      <CompassModal
        isOpen={compassOpen}
        onClose={() => setCompassOpen(false)}
        destinationName={selectedHaven?.name}
        destinationEta={selectedHaven ? `${selectedHaven.eta} (${selectedHaven.distance})` : undefined}
      />

      <ReservationModal
        isOpen={!!reservationModalHaven}
        onClose={() => setReservationModalHaven(null)}
        haven={reservationModalHaven}
        onReservationConfirmed={handleReservationConfirmed}
      />

      <OfflineDossierModal
        isOpen={offlineDossierOpen}
        onClose={() => setOfflineDossierOpen(false)}
        havens={havensList}
        currentCity={currentCity}
        userLocation={userLocation}
      />

      <SosDistressModal
        isOpen={sosDistressModalOpen}
        onClose={() => setSosDistressModalOpen(false)}
        isSosActive={isSosActive}
        onToggleSos={() => setIsSosActive(!isSosActive)}
        userLocation={userLocation}
        currentCity={currentCity}
        nearestHaven={havensList[0]}
      />

      <EarthquakeScannerSettingsModal
        isOpen={earthquakeScannerSettingsOpen}
        onClose={() => setEarthquakeScannerSettingsOpen(false)}
        isActive={isEarthquakeScannerActive}
        onToggleActive={() => {
          setIsEarthquakeScannerActive((prev) => {
            const next = !prev;
            showToast(
              next
                ? '⚡ Earthquake Scanner Active: Red Area (Weak & Tall Hazards) vs Green Area (Safe Residences) enabled.'
                : 'Earthquake Scanner Deactivated.'
            );
            return next;
          });
        }}
        seismicZones={seismicZones}
        onSelectZone={(zone) => setInspectedSeismicZone(zone)}
        onSimulateTremor={() => {
          setIsQuakeSimulating(true);
          showToast('⚠️ Simulated 6.5 Richter Earthquake Tremor! Evacuate RED areas immediately.');
          setTimeout(() => setIsQuakeSimulating(false), 5000);
        }}
        isSimulating={isQuakeSimulating}
      />

      <SeismicInspectorModal
        isOpen={!!inspectedSeismicZone}
        onClose={() => setInspectedSeismicZone(null)}
        zone={inspectedSeismicZone}
        onRouteToZone={(zone) => {
          // If user requests to navigate to the zone
          const matched = havensList.find(
            (h) => calculateDistanceKm(h.lat, h.lng, zone.lat, zone.lng) < 0.8
          );
          if (matched) {
            setSelectedHaven(matched);
          } else {
            const temporaryHaven: Haven = {
              id: zone.id,
              name: zone.name,
              city: currentCity.name,
              category: zone.type === 'safe_residence' ? 'safehouse' : 'bunker',
              categoryLabel: zone.type === 'safe_residence' ? 'Safe Residence Ground' : 'Seismic Hazard Perimeter',
              badgeClass: zone.type === 'safe_residence' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800',
              dotClass: zone.type === 'safe_residence' ? 'bg-emerald-400' : 'bg-red-400',
              lat: zone.lat,
              lng: zone.lng,
              mapCoords: zone.mapCoords,
              address: zone.address,
              sector: 'Earthquake Scanner Sector',
              distance: zone.distance || '0.5 km',
              distanceKm: zone.distanceKm,
              eta: zone.eta || '6 min',
              travelMode: 'walk',
              openBeds: zone.capacity,
              description: zone.residentsAdvice,
              radiationSafe: true,
              petFriendly: true,
              wheelchairReady: true,
              filteredWater: true,
              phone: '112',
              radioChannel: 'CH 04 (142.400 MHz)',
              tags: zone.tags
            };
            setSelectedHaven(temporaryHaven);
          }
          showToast(
            zone.type === 'safe_residence'
              ? `Route locked to safe residence: ${zone.name}`
              : `Bypass route perimeter locked: ${zone.name}`
          );
        }}
      />

      <RadioModal
        isOpen={radioModalOpen}
        onClose={() => setRadioModalOpen(false)}
        initialChannel={radioChannel}
        locationName={userLocation.localityName || currentCity.name}
      />

      <AmbulanceModal
        isOpen={!!ambulanceModalHaven}
        onClose={() => setAmbulanceModalHaven(null)}
        hospital={ambulanceModalHaven}
      />

      <RegisterHavenModal
        isOpen={registerHavenOpen}
        onClose={() => setRegisterHavenOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <BuddyFinderModal
        isOpen={buddyFinderOpen}
        onClose={() => setBuddyFinderOpen(false)}
      />

      <EmergencyCallModal
        isOpen={emergencyCallOpen}
        onClose={() => setEmergencyCallOpen(false)}
      />

      <SolarGridModal
        isOpen={solarGridOpen}
        onClose={() => setSolarGridOpen(false)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <SurvivalGuidesModal
        isOpen={!!survivalGuideOpen}
        onClose={() => setSurvivalGuideOpen(null)}
        initialGuide={survivalGuideOpen || 'solar'}
      />

      <VolunteerPatrolModal
        isOpen={volunteerPatrolOpen}
        onClose={() => setVolunteerPatrolOpen(false)}
        locationName={userLocation.localityName || currentCity.name}
        onEnrollSuccess={(profile) => {
          showToast(`Squad Dispatch Active! Assigned Callsign: ${profile.callsign}`);
        }}
      />
    </div>
  );
}
