export interface Haven {
  id: string;
  name: string;
  city: string;
  category: 'bunker' | 'hospital' | 'fire' | 'safehouse' | 'peacekeeper' | 'water';
  categoryLabel: string;
  badgeClass: string;
  dotClass: string;
  distance: string;
  distanceKm?: number;
  eta: string;
  travelMode: 'walk' | 'drive' | 'bike';
  occupancyPercent?: number;
  openBeds?: number;
  totalBeds?: number;
  triageWait?: string;
  doctorsCount?: number;
  description?: string;
  tags: string[];
  radiationSafe: boolean;
  petFriendly: boolean;
  wheelchairReady: boolean;
  filteredWater: boolean;
  radioChannel: string;
  phone: string;
  lat: number;
  lng: number;
  mapCoords: { x: number; y: number }; // percentage on fallback mesh
  address: string;
  sector: string;
}

export interface UserLocationState {
  coords: { lat: number; lng: number } | null;
  localityName: string;
  isGpsAllowed: boolean;
  accuracyMeters?: number;
  timestamp?: number;
}

export interface IndianCity {
  id: string;
  name: string;
  state: string;
  center: { lat: number; lng: number };
  zoom: number;
  sectorName: string;
}

// PRIMARY DEFAULT: JAIPUR (PINK CITY)
export const DEFAULT_JAIPUR_CITY: IndianCity = {
  id: 'jaipur',
  name: 'Jaipur (Pink City)',
  state: 'Rajasthan',
  center: { lat: 26.9124, lng: 75.7873 },
  zoom: 13,
  sectorName: 'Sector 09 Thar-Aravalli · Jaipur Pink City Mesh'
};

// Popular preset cities for quick manual selection if user prefers not to use GPS
export const PRESET_UPLOAD_CITIES: IndianCity[] = [
  DEFAULT_JAIPUR_CITY,
  {
    id: 'jodhpur',
    name: 'Jodhpur (Sun City)',
    state: 'Rajasthan',
    center: { lat: 26.2389, lng: 73.0243 },
    zoom: 13,
    sectorName: 'Sector 09-West · Marwar Desert Mesh'
  },
  {
    id: 'udaipur',
    name: 'Udaipur (City of Lakes)',
    state: 'Rajasthan',
    center: { lat: 24.5854, lng: 73.7125 },
    zoom: 13,
    sectorName: 'Sector 09-South · Mewar Lake Mesh'
  },
  {
    id: 'kota',
    name: 'Kota (Chambal Valley)',
    state: 'Rajasthan',
    center: { lat: 25.2138, lng: 75.8648 },
    zoom: 13,
    sectorName: 'Sector 09-East · Chambal Power Mesh'
  },
  {
    id: 'ajmer',
    name: 'Ajmer & Pushkar',
    state: 'Rajasthan',
    center: { lat: 26.4499, lng: 74.6399 },
    zoom: 13,
    sectorName: 'Sector 09-Central · Aravalli Ridge'
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    center: { lat: 28.6139, lng: 77.2090 },
    zoom: 13,
    sectorName: 'Sector 01 North · Capital Mesh'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 13,
    sectorName: 'Sector 07 South · Silicon Mesh'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    center: { lat: 19.0760, lng: 72.8777 },
    zoom: 13,
    sectorName: 'Sector 03 West · Coastal Harbor'
  }
];

// Haversine distance calculator in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format distance and realistic ETA based on travel speed
export function formatDistanceMetrics(distanceKm: number): {
  distanceStr: string;
  etaStr: string;
  travelMode: 'walk' | 'bike' | 'drive';
} {
  if (distanceKm < 1.0) {
    const meters = Math.max(50, Math.round(distanceKm * 1000));
    const minutes = Math.max(1, Math.round(meters / 75)); // walking pace
    return {
      distanceStr: `${meters}m close`,
      etaStr: `${minutes} min walk`,
      travelMode: 'walk'
    };
  } else if (distanceKm < 3.5) {
    const minutes = Math.max(2, Math.round(distanceKm * 3.8)); // swift bike pace
    return {
      distanceStr: `${distanceKm.toFixed(1)} km`,
      etaStr: `${minutes} min bike`,
      travelMode: 'bike'
    };
  } else {
    const minutes = Math.max(3, Math.round(distanceKm * 2.2)); // motor convoy pace
    return {
      distanceStr: `${distanceKm.toFixed(1)} km`,
      etaStr: `${minutes} min drive`,
      travelMode: 'drive'
    };
  }
}

// COMPREHENSIVE JAIPUR EMERGENCY LIFELINES AND HAVENS
export const JAIPUR_HAVENS_DATA: Haven[] = [
  {
    id: 'jaipur-central-park-haven',
    name: 'Central Park & Statue Circle Civic Safe Haven',
    city: 'jaipur',
    category: 'safehouse',
    categoryLabel: 'Civic Safe House',
    badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
    dotClass: 'bg-blue-400',
    distance: '450m close',
    distanceKm: 0.45,
    eta: '6 min walk',
    travelMode: 'walk',
    occupancyPercent: 48,
    openBeds: 85,
    totalBeds: 160,
    tags: ['Solar Canopy 35kW', 'Annakshetra Hot Langar', 'Family Dorms', 'Pet Friendly'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 04 (142.400 MHz • ParkNet)',
    phone: 'Desk: 0141-2385-SAFE',
    lat: 26.9067,
    lng: 75.8078,
    mapCoords: { x: 48, y: 52 },
    address: 'Prithviraj Road, Near Statue Circle, C-Scheme, Jaipur 302005',
    sector: 'Sector 09-Core (C-Scheme Green Ring)',
    description: 'Expansive central park botanical sanctuary offering daily hot Bajra/Khichdi community meals, 35 kW solar battery charging stations, and zero-hazard illuminated tree paths.'
  },
  {
    id: 'jaipur-sms-hospital',
    name: 'SMS Hospital (Sawai Man Singh) Solarpunk Trauma Center',
    city: 'jaipur',
    category: 'hospital',
    categoryLabel: '24/7 Field Hospital',
    badgeClass: 'bg-red-950 text-red-300 border-red-500/60',
    dotClass: 'bg-red-500',
    distance: '1.2 km',
    distanceKm: 1.2,
    eta: '4 min drive',
    travelMode: 'drive',
    triageWait: 'FAST (~2 min)',
    doctorsCount: 16,
    tags: ['Trauma ICU 40 Beds', 'Solar Oxygen Plant', 'Burns & Decontamination Unit', 'Blood Bank'],
    radiationSafe: true,
    petFriendly: false,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 08 (142.080 MHz • SMS-MED)',
    phone: 'Emergency: 108 / 0141-2518-108',
    lat: 26.8929,
    lng: 75.8159,
    mapCoords: { x: 50, y: 62 },
    address: 'Jawaharlal Nehru Marg, Ashok Nagar, Jaipur 302004',
    sector: 'Sector 09-Central (JLN Medical Corridor)',
    description: 'Premier regional trauma hospital operating on independent PM-Surya solar battery arrays with sterile medical isolation airlocks and 108 ambulance priority dispatch.'
  },
  {
    id: 'jaipur-sdmh-hospital',
    name: 'Santokba Durlabhji Memorial Hospital (SDMH) Emergency Wing',
    city: 'jaipur',
    category: 'hospital',
    categoryLabel: '24/7 Field Hospital',
    badgeClass: 'bg-red-950 text-red-300 border-red-500/60',
    dotClass: 'bg-red-500',
    distance: '1.8 km',
    distanceKm: 1.8,
    eta: '6 min drive',
    travelMode: 'drive',
    triageWait: 'IMMEDIATE',
    doctorsCount: 12,
    tags: ['Cardiology Trauma', 'Pediatric Wing', 'Potable Dialysis Unit', 'Solar Power Bank'],
    radiationSafe: true,
    petFriendly: false,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 10 (142.100 MHz • SDMH-MED)',
    phone: 'Emergency: 0141-2566-251',
    lat: 26.8902,
    lng: 75.8034,
    mapCoords: { x: 47, y: 64 },
    address: 'Bhawani Singh Road, Near Rambagh Circle, Bapu Nagar, Jaipur 302015',
    sector: 'Sector 09-Central (Bapu Nagar Medical Hub)',
    description: 'Major emergency care facility equipped with dual redundant solar-diesel backup, dedicated trauma ICU, and clean transfusion supplies.'
  },
  {
    id: 'jaipur-fortis-hospital',
    name: 'Fortis Escorts Hospital Malviya Nagar Trauma Deck',
    city: 'jaipur',
    category: 'hospital',
    categoryLabel: '24/7 Field Hospital',
    badgeClass: 'bg-red-950 text-red-300 border-red-500/60',
    dotClass: 'bg-red-500',
    distance: '3.8 km',
    distanceKm: 3.8,
    eta: '9 min drive',
    travelMode: 'drive',
    triageWait: 'MODERATE (~5 min)',
    doctorsCount: 14,
    tags: ['Critical Care ICU', 'Helipad Evacuation', 'Solar Blood Storage', 'Ambulance Hub'],
    radiationSafe: true,
    petFriendly: false,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 14 (142.140 MHz • FORTIS-EMG)',
    phone: 'Direct: 0141-2547-000',
    lat: 26.8488,
    lng: 75.8073,
    mapCoords: { x: 53, y: 80 },
    address: 'Jawaharlal Nehru Marg, Malviya Nagar Sector 5, Jaipur 302017',
    sector: 'Sector 09-South (Malviya Nagar South Hub)',
    description: 'Advanced trauma center with multi-specialty triage, emergency helipad, and solar chilled blood depository.'
  },
  {
    id: 'jaipur-jaigarh-vault',
    name: 'Jaigarh Fort Subterranean Eco-Vault #01',
    city: 'jaipur',
    category: 'bunker',
    categoryLabel: 'Fortified Bunker',
    badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
    dotClass: 'bg-blue-400',
    distance: '8.4 km',
    distanceKm: 8.4,
    eta: '18 min drive',
    travelMode: 'drive',
    occupancyPercent: 62,
    openBeds: 240,
    totalBeds: 700,
    tags: ['Granite Rock Vault', 'Ancient Rainwater Sump', 'PM-Surya Solar Array', 'Pet Friendly'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 09 (142.090 MHz • VU2-JPR)',
    phone: 'Direct: 0141-2530-VAULT',
    lat: 26.9855,
    lng: 75.8507,
    mapCoords: { x: 58, y: 22 },
    address: 'Amer-Jaigarh Hilltop Ridge, Jaipur 302028',
    sector: 'Sector 09-North (Aravalli Ridge Sanctuary)',
    description: 'Reinforced medieval subterranean stone vault built into ancient hill aquifers with 60 kW off-grid solar inverters, seed vaults, and thick granite radiation shielding.'
  },
  {
    id: 'jaipur-secretariat-bunker',
    name: 'Rajasthan Civil Defence EOC & Secretariat Subterranean Bunker',
    city: 'jaipur',
    category: 'bunker',
    categoryLabel: 'Fortified Bunker',
    badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
    dotClass: 'bg-blue-400',
    distance: '1.1 km',
    distanceKm: 1.1,
    eta: '14 min walk',
    travelMode: 'walk',
    occupancyPercent: 38,
    openBeds: 310,
    totalBeds: 500,
    tags: ['Command Bunker', 'HEPA Air Filtration', 'Ham Radio Station', 'Hardened Blast Door'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 01 (142.010 MHz • RAJ-EOC)',
    phone: 'Civil Defence: 1070 / 0141-2227-248',
    lat: 26.8998,
    lng: 75.8015,
    mapCoords: { x: 47, y: 55 },
    address: 'Bhagwan Das Road, Government Secretariat Complex, Jaipur 302005',
    sector: 'Sector 09-Central (State Operations Ring)',
    description: 'State disaster emergency bunker with heavy concrete fallout shielding, independent water purification, and satellite comms.'
  },
  {
    id: 'jaipur-jalmahal-water',
    name: 'Jal Mahal & Man Sagar Jal-Shakti Water Harvester #09',
    city: 'jaipur',
    category: 'water',
    categoryLabel: 'Water & Food Pod',
    badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
    dotClass: 'bg-blue-400',
    distance: '5.2 km',
    distanceKm: 5.2,
    eta: '12 min drive',
    travelMode: 'drive',
    tags: ['Solar Multi-Stage RO', 'Traditional Baori Filter', 'Organic Rations', 'Solar Streetlights'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 11 (142.550 MHz • Jal-Net)',
    phone: 'Water Desk: 0141-2670-JAL',
    lat: 26.9534,
    lng: 75.8462,
    mapCoords: { x: 56, y: 32 },
    address: 'Amer Road, Jal Mahal Lakefront Promenade, Jaipur 302002',
    sector: 'Sector 09-Northeast (Lake Basin Corridor)',
    description: 'Solar-driven atmospheric moisture and surface water purification plant dispensing 3,800L tested potable drinking water daily with emergency dry rations.'
  },
  {
    id: 'jaipur-ramniwas-water',
    name: 'Ram Niwas Garden & Albert Hall Potable Water Pod',
    city: 'jaipur',
    category: 'water',
    categoryLabel: 'Water & Food Pod',
    badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
    dotClass: 'bg-blue-400',
    distance: '1.4 km',
    distanceKm: 1.4,
    eta: '5 min bike',
    travelMode: 'bike',
    tags: ['Subterranean Water Tank', 'Solar UV Filtration', 'Ready Rations', 'Medical First-Aid'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 13 (142.330 MHz • Garden-Water)',
    phone: 'Reservoir: 0141-2578-WATR',
    lat: 26.9118,
    lng: 75.8193,
    mapCoords: { x: 51, y: 49 },
    address: 'Museum Marg, Ram Niwas Bagh, Jaipur 302004',
    sector: 'Sector 09-Core (Heritage Cultural Buffer)',
    description: 'Civilian potable water distribution center with 20,000L subterranean storage, solar-powered filtration pumps, and family meal distribution kits.'
  },
  {
    id: 'jaipur-cscheme-fire',
    name: 'C-Scheme & MI Road Civic Guardian & Fire Watch #09',
    city: 'jaipur',
    category: 'fire',
    categoryLabel: 'Fire & Guardian Post',
    badgeClass: 'bg-red-950 text-red-300 border-red-500/60',
    dotClass: 'bg-red-500',
    distance: '0.7 km',
    distanceKm: 0.7,
    eta: '8 min walk',
    travelMode: 'walk',
    tags: ['Solar Pumper Fleet', 'Thermal Drones', 'Escort Convoy', 'Decontamination'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: false,
    filteredWater: true,
    radioChannel: 'CH 03 (142.300 MHz • Fire Net)',
    phone: 'Emergency: 101 / 0141-2365-FIRE',
    lat: 26.9165,
    lng: 75.8052,
    mapCoords: { x: 46, y: 46 },
    address: 'Mirza Ismail Road (MI Road), Near Panch Batti, Jaipur 302001',
    sector: 'Sector 09-Central (MI Road Hub)',
    description: 'Volunteer rapid responder outpost with high-pressure solar decontamination water tenders and nighttime illuminated escort convoys across the walled city.'
  },
  {
    id: 'jaipur-ghatgate-fire',
    name: 'Ghat Gate Municipal Fire Station & Rapid Rescue Base',
    city: 'jaipur',
    category: 'fire',
    categoryLabel: 'Fire & Guardian Post',
    badgeClass: 'bg-red-950 text-red-300 border-red-500/60',
    dotClass: 'bg-red-500',
    distance: '2.5 km',
    distanceKm: 2.5,
    eta: '7 min drive',
    travelMode: 'drive',
    tags: ['Heavy Rescue Tender', 'Hydraulic Cutters', 'Solar Radio Base', 'Rescue Dogs'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: false,
    filteredWater: true,
    radioChannel: 'CH 06 (142.600 MHz • Walled-Fire)',
    phone: 'Emergency: 101 / 0141-2601-090',
    lat: 26.9130,
    lng: 75.8360,
    mapCoords: { x: 55, y: 48 },
    address: 'Ghat Gate Bazaar, Walled Pink City, Jaipur 302003',
    sector: 'Sector 09-East (Walled City Heritage Gate)',
    description: 'Historic city gate tactical fire station equipped for urban structure collapse, solar lighting beacons, and search & rescue teams.'
  },
  {
    id: 'jaipur-nahargarh-relay',
    name: 'Nahargarh Ridge High-Ground Peacekeeper & Radio Tower',
    city: 'jaipur',
    category: 'peacekeeper',
    categoryLabel: 'Peacekeeper Post',
    badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
    dotClass: 'bg-blue-400',
    distance: '3.6 km',
    distanceKm: 3.6,
    eta: '12 min drive',
    travelMode: 'drive',
    tags: ['LoRaWAN Master Repeater', 'Aravalli Ridge Radar', 'Solar Beacon', 'Night Spotlights'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 02 (142.020 MHz • Master Relay)',
    phone: 'Tower: 0141-2400-RELAY',
    lat: 26.9372,
    lng: 75.8155,
    mapCoords: { x: 50, y: 38 },
    address: 'Krishna Nagar, Nahargarh Fort Road, Jaipur 302002',
    sector: 'Sector 09-Summit (Panoramic Watchpost)',
    description: 'High-altitude radio repeater station broadcasting civic defense alerts across the entire Jaipur urban basin on 865 MHz LoRa and shortwave.'
  },
  {
    id: 'jaipur-mansarovar-haven',
    name: 'Mansarovar Solar Colony Emergency Refuge',
    city: 'jaipur',
    category: 'safehouse',
    categoryLabel: 'Civic Safe House',
    badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
    dotClass: 'bg-blue-400',
    distance: '6.5 km',
    distanceKm: 6.5,
    eta: '14 min drive',
    travelMode: 'drive',
    occupancyPercent: 35,
    openBeds: 110,
    totalBeds: 200,
    tags: ['Asia Largest Colony Mesh', 'PM-Surya 80kW', 'Community Kitchen', 'Pet Refuge'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 07 (142.700 MHz • Mansarovar)',
    phone: 'Colony Desk: 0141-2390-SAFE',
    lat: 26.8580,
    lng: 75.7627,
    mapCoords: { x: 38, y: 75 },
    address: 'Madhyam Marg, Mansarovar Sector 12, Jaipur 302020',
    sector: 'Sector 09-Southwest (Residential Grid)',
    description: 'High-capacity solar residential collective with interconnected rooftop battery banks, community halls, and private family quarantine rooms.'
  },
  {
    id: 'jaipur-malviya-wtp',
    name: 'Malviya Nagar & WTP Solar Microgrid Vault #04',
    city: 'jaipur',
    category: 'bunker',
    categoryLabel: 'Fortified Bunker',
    badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
    dotClass: 'bg-blue-400',
    distance: '5.8 km',
    distanceKm: 5.8,
    eta: '11 min drive',
    travelMode: 'drive',
    occupancyPercent: 54,
    openBeds: 150,
    totalBeds: 350,
    tags: ['Subterranean Carpark Vault', '120kW Solar Inverters', 'Fiber Uplink', 'Air Purifiers'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 05 (142.500 MHz • TechHub)',
    phone: 'Vault: 0141-2720-BUNK',
    lat: 26.8532,
    lng: 75.8051,
    mapCoords: { x: 52, y: 78 },
    address: 'Jawaharlal Nehru Marg, Malviya Nagar, Jaipur 302017',
    sector: 'Sector 09-South (IT & Commercial Corridor)',
    description: 'Engineered subterranean double-basement bunker with heavy reinforced concrete shielding, dual diesel-solar generators, and satellite transceiver.'
  },
  {
    id: 'jaipur-vaishali-haven',
    name: 'Vaishali Nagar Community Safe Shelter & Solar Relief Hub',
    city: 'jaipur',
    category: 'safehouse',
    categoryLabel: 'Civic Safe House',
    badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
    dotClass: 'bg-blue-400',
    distance: '5.1 km',
    distanceKm: 5.1,
    eta: '11 min drive',
    travelMode: 'drive',
    occupancyPercent: 42,
    openBeds: 95,
    totalBeds: 180,
    tags: ['Rooftop Solar Array', 'Community Dining', 'Wi-Fi Hotspot', 'First-Aid Pod'],
    radiationSafe: true,
    petFriendly: true,
    wheelchairReady: true,
    filteredWater: true,
    radioChannel: 'CH 15 (142.850 MHz • West-Safe)',
    phone: 'Relief Desk: 0141-2351-HELP',
    lat: 26.9080,
    lng: 75.7440,
    mapCoords: { x: 34, y: 50 },
    address: 'Amrapali Circle, Vaishali Nagar, Jaipur 302021',
    sector: 'Sector 09-West (Vaishali Civic Sector)',
    description: 'Residential community relief center with rooftop solar generators, purified deep tube-well water, and emergency food packets.'
  }
];

// Helper to generate hyper-localized nearby emergency facilities for ANY GPS location where user is present
export function generateNearbyFacilitiesForLocation(
  userLat: number,
  userLng: number,
  locationName: string
): Haven[] {
  const shortName = locationName.split(',')[0].trim() || 'Local Area';

  // Seed offsets around user's exact coordinates (0.3km to 3.5km)
  const templateHavens: {
    idSuffix: string;
    name: string;
    category: Haven['category'];
    categoryLabel: string;
    dLat: number;
    dLng: number;
    badgeClass: string;
    dotClass: string;
    description: string;
    tags: string[];
    radio: string;
    phone: string;
    addressSuffix: string;
    openBeds?: number;
    totalBeds?: number;
    occupancyPercent?: number;
    doctorsCount?: number;
    triageWait?: string;
  }[] = [
    {
      idSuffix: 'hospital-primary',
      name: `${shortName} Civic Field Hospital & Solarpunk Trauma Triage`,
      category: 'hospital',
      categoryLabel: '24/7 Field Hospital',
      dLat: 0.0075,
      dLng: 0.0062,
      badgeClass: 'bg-red-950 text-red-300 border-red-500/60',
      dotClass: 'bg-red-500',
      description: `Primary 24/7 trauma response clinic in ${shortName} powered by continuous solar storage with emergency ICU and oxygen reserves.`,
      tags: ['Trauma ICU', 'Solar Oxygen Plant', 'Burns & Decon Pod', '108 Ambulance Hub'],
      radio: 'CH 08 (142.080 MHz • MED-PRI)',
      phone: 'Emergency 108 / Local Ambulance Dispatch',
      addressSuffix: `Main Arterial Road, ${shortName}`,
      doctorsCount: 14,
      triageWait: 'FAST (<3 min)'
    },
    {
      idSuffix: 'bunker-subterranean',
      name: `${shortName} Subterranean Eco-Vault & Fallout Haven #01`,
      category: 'bunker',
      categoryLabel: 'Fortified Bunker',
      dLat: -0.0052,
      dLng: -0.0048,
      badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
      dotClass: 'bg-blue-400',
      description: `Reinforced underground concrete & stone shelter in ${shortName} equipped with HEPA air filtration and independent water reservoir.`,
      tags: ['Subterranean Vault', 'HEPA Air Filter', 'PM-Surya Solar 50kW', 'Family Safe'],
      radio: 'CH 01 (142.100 MHz • BUNK-01)',
      phone: 'Direct: Civilian Shelter Network',
      addressSuffix: `Civil Lines Sector, ${shortName}`,
      openBeds: 180,
      totalBeds: 400,
      occupancyPercent: 42
    },
    {
      idSuffix: 'fire-guardian',
      name: `${shortName} Rapid Fire Watch & Civilian Guardian Outpost`,
      category: 'fire',
      categoryLabel: 'Fire & Guardian Post',
      dLat: 0.0038,
      dLng: -0.0041,
      badgeClass: 'bg-red-950 text-red-300 border-red-500/60',
      dotClass: 'bg-red-500',
      description: `Rapid responder rescue base in ${shortName} with solar water tender pumpers, nighttime searchlights, and trained rescue squads.`,
      tags: ['Solar Fire Pumper', 'Thermal Drone Scout', 'Escort Convoy', 'Emergency 101'],
      radio: 'CH 03 (142.300 MHz • FIRE-GUARD)',
      phone: 'Emergency 101 / Station Dispatch',
      addressSuffix: `Market Circle, ${shortName}`
    },
    {
      idSuffix: 'safehouse-civic',
      name: `${shortName} Botanical Garden & Civic Safe Refuge`,
      category: 'safehouse',
      categoryLabel: 'Civic Safe House',
      dLat: -0.0031,
      dLng: 0.0055,
      badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
      dotClass: 'bg-blue-400',
      description: `Open-canopy community refuge with daily langar meals, solar phone charging stations, and family rest quarters.`,
      tags: ['Community Kitchen', 'Solar Microgrid 30kW', 'Pet Friendly', 'Potable Water'],
      radio: 'CH 04 (142.400 MHz • SAFE-REFUGE)',
      phone: 'Helpdesk: 24/7 Community Desk',
      addressSuffix: `Municipal Park Ring, ${shortName}`,
      openBeds: 120,
      totalBeds: 250,
      occupancyPercent: 35
    },
    {
      idSuffix: 'water-harvester',
      name: `${shortName} Solar Multi-Stage Potable Water & Rations Pod`,
      category: 'water',
      categoryLabel: 'Water & Food Pod',
      dLat: 0.0089,
      dLng: -0.0025,
      badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
      dotClass: 'bg-blue-400',
      description: `High-yield water purification station dispensing tested potable mineral water with dry ration survival rations.`,
      tags: ['Solar RO Filtration', 'Tested Potable Water', 'Dry Food Rations', 'First Aid'],
      radio: 'CH 11 (142.550 MHz • WATER-POD)',
      phone: 'Water Reserve Desk',
      addressSuffix: `Water Works Road, ${shortName}`
    },
    {
      idSuffix: 'peacekeeper-relay',
      name: `${shortName} High-Ground Peacekeeper & LoRaWAN Master Relay`,
      category: 'peacekeeper',
      categoryLabel: 'Peacekeeper Post',
      dLat: -0.0095,
      dLng: 0.0082,
      badgeClass: 'bg-blue-950 text-blue-300 border-blue-500/60',
      dotClass: 'bg-blue-400',
      description: `Elevated observation and communications post maintaining civilian mesh connectivity and neighborhood escort patrols.`,
      tags: ['LoRaWAN 865 MHz', 'Night Spotlight Beacon', 'Civic Guard Patrol', 'SOS Relay'],
      radio: 'CH 02 (142.020 MHz • MESH-RELAY)',
      phone: 'Watch Post Control',
      addressSuffix: `High Ground Vantage Point, ${shortName}`
    }
  ];

  return templateHavens.map((tmpl) => {
    const lat = userLat + tmpl.dLat;
    const lng = userLng + tmpl.dLng;
    const distKm = calculateDistanceKm(userLat, userLng, lat, lng);
    const metrics = formatDistanceMetrics(distKm);

    // Compute relative mapCoords (40-60 range on radar)
    const mapX = Math.round(50 + tmpl.dLng * 2500);
    const mapY = Math.round(50 - tmpl.dLat * 2500);

    return {
      id: `geo-${tmpl.idSuffix}-${Math.round(userLat * 100)}`,
      name: tmpl.name,
      city: 'user-present-city',
      category: tmpl.category,
      categoryLabel: tmpl.categoryLabel,
      badgeClass: tmpl.badgeClass,
      dotClass: tmpl.dotClass,
      distance: metrics.distanceStr,
      distanceKm: distKm,
      eta: metrics.etaStr,
      travelMode: metrics.travelMode,
      occupancyPercent: tmpl.occupancyPercent,
      openBeds: tmpl.openBeds,
      totalBeds: tmpl.totalBeds,
      triageWait: tmpl.triageWait,
      doctorsCount: tmpl.doctorsCount,
      description: tmpl.description,
      tags: tmpl.tags,
      radiationSafe: true,
      petFriendly: true,
      wheelchairReady: true,
      filteredWater: true,
      radioChannel: tmpl.radio,
      phone: tmpl.phone,
      lat,
      lng,
      mapCoords: {
        x: Math.max(15, Math.min(85, mapX)),
        y: Math.max(15, Math.min(85, mapY))
      },
      address: tmpl.addressSuffix,
      sector: `Local Sector (${shortName} Mesh)`
    };
  });
}

// Global category filters
export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Lifelines', icon: 'grid_view' },
  { id: 'hospital', label: 'Field Hospitals', icon: 'local_hospital' },
  { id: 'bunker', label: 'Subterranean Bunkers', icon: 'night_shelter' },
  { id: 'safehouse', label: 'Safe Houses', icon: 'cottage' },
  { id: 'fire', label: 'Fire & Guardians', icon: 'local_fire_department' },
  { id: 'water', label: 'Water & Food Pods', icon: 'water_drop' },
  { id: 'peacekeeper', label: 'Peacekeepers', icon: 'security' }
];

export const INDIAN_HAVENS_DATA: Haven[] = JAIPUR_HAVENS_DATA;
export const INDIAN_CITIES: IndianCity[] = [DEFAULT_JAIPUR_CITY, ...PRESET_UPLOAD_CITIES.slice(1)];
