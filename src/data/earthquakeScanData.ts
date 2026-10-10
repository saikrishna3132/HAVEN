import { calculateDistanceKm, formatDistanceMetrics } from './havenData';

export interface SeismicZone {
  id: string;
  name: string;
  type: 'danger_weak_tall' | 'safe_residence'; // 'danger_weak_tall' (Red) | 'safe_residence' (Green)
  riskLevel: 'CRITICAL_COLLAPSE' | 'HIGH_HAZARD' | 'SEISMIC_SAFE' | 'OPEN_GROUND_HAVEN';
  statusLabel: string;
  structureHeight: string;
  structuralType: string;
  collapseRiskPercent: number; // 0 - 100
  richterTolerance: string;
  dangerRadiusMeters: number; // In meters
  capacity?: number; // Number of people who can reside
  canReside: boolean; // true = People can reside here (Green Area), false = Hazardous (Red Area)
  breakingChance: 'VERY HIGH' | 'HIGH' | 'LOW' | 'NEGLIGIBLE';
  buildingScale: string; // e.g., 'Big Commercial High-Rise', 'Massive Open Park'
  residentsAdvice: string;
  lat: number;
  lng: number;
  distance?: string;
  distanceKm?: number;
  eta?: string;
  mapCoords: { x: number; y: number }; // Fallback radar coords
  address: string;
  yearBuilt: number;
  tags: string[];
}

// JAIPUR CORE SEISMIC SCANNER DATASET (Pre-analyzed structural mesh)
export const JAIPUR_SEISMIC_ZONES: SeismicZone[] = [
  // RED AREAS: WEAK, TALL, CRITICAL COLLAPSE PROBABILITY (PEOPLE CANNOT RESIDE)
  {
    id: 'quake-red-01',
    name: 'Aravalli Tower (Aging Commercial High-Rise)',
    type: 'danger_weak_tall',
    riskLevel: 'CRITICAL_COLLAPSE',
    statusLabel: 'CRITICAL COLLAPSE HAZARD',
    structureHeight: '18 Stories (64m Elevation)',
    structuralType: 'Non-Ductile Pre-1982 Concrete Frame + Heavy Glass Curtain',
    collapseRiskPercent: 92,
    richterTolerance: 'Severe Failure > 5.2 Richter',
    dangerRadiusMeters: 75,
    canReside: false,
    breakingChance: 'VERY HIGH',
    buildingScale: 'Big High-Rise Tower (18 Stories, Weak Core)',
    residentsAdvice: 'UNINHABITABLE. Big and weak structure with very high chance of breaking. Extreme risk of pillar shear buckling and falling glass fragmentation. Maintain minimum 75m clearance.',
    lat: 26.9155,
    lng: 75.8115,
    mapCoords: { x: 55, y: 44 },
    address: 'Near Statue Circle Crossroads, C-Scheme, Jaipur',
    yearBuilt: 1981,
    tags: ['Soft-Story Ground Parking', 'Brittle Facade', 'High Overhang Danger', 'Falling Glass Zone']
  },
  {
    id: 'quake-red-02',
    name: 'Old Walled City Multi-Tier Dense Block',
    type: 'danger_weak_tall',
    riskLevel: 'CRITICAL_COLLAPSE',
    statusLabel: 'HIGH COLLAPSE HAZARD',
    structureHeight: '5 Stories (Dense Overhanging Masonry)',
    structuralType: 'Unreinforced Lime-Mortar Masonry with Timber Floor Beam Decay',
    collapseRiskPercent: 88,
    canReside: false,
    breakingChance: 'VERY HIGH',
    buildingScale: 'Dense Multi-Tier Masonry Tenement (Weak Mortar, Big Footprint)',
    residentsAdvice: 'EVACUATE IMMEDIATELY. Weak load-bearing masonry with very high breaking chance. Narrow alleyways prone to complete rubble chokepoints and structural pancake collapse.',
    richterTolerance: 'Failure > 4.8 Richter',
    dangerRadiusMeters: 55,
    lat: 26.9240,
    lng: 75.8235,
    mapCoords: { x: 68, y: 32 },
    address: 'Johari Bazaar Corridor, Old Pink City, Jaipur',
    yearBuilt: 1952,
    tags: ['Narrow Chokepoint', 'Unreinforced Masonry', 'Pancake Collapse Risk', 'Overhead Rubble']
  },
  {
    id: 'quake-red-03',
    name: 'Tonk Road Commercial Atrium & Old Tower',
    type: 'danger_weak_tall',
    riskLevel: 'HIGH_HAZARD',
    statusLabel: 'HIGH STRUCTURAL RISK',
    structureHeight: '14 Stories (48m Elevation)',
    structuralType: 'Pre-Stressed Concrete with Corroded Rebar & Cantilever Balconies',
    collapseRiskPercent: 84,
    canReside: false,
    breakingChance: 'VERY HIGH',
    buildingScale: 'Big Commercial Complex & 14-Story Tower (Corroded Rebar)',
    residentsAdvice: 'DO NOT ENTER. Significant foundation settlement and column joint spalling observed under seismic stress. High probability of exterior facade breakaway.',
    richterTolerance: 'Failure > 5.4 Richter',
    dangerRadiusMeters: 65,
    lat: 26.8820,
    lng: 75.7990,
    mapCoords: { x: 42, y: 72 },
    address: 'Tonk Road Transit Junction, Bapu Nagar, Jaipur',
    yearBuilt: 1986,
    tags: ['Settlement Cracks', 'Cantilever Failure', 'Corroded Rebar', 'Perimeter Danger']
  },
  {
    id: 'quake-red-04',
    name: 'Mansarovar Metro Corridor High-Rise Block 4',
    type: 'danger_weak_tall',
    riskLevel: 'HIGH_HAZARD',
    statusLabel: 'STRUCTURAL DAMAGE LIKELY',
    structureHeight: '16 Stories (54m Elevation)',
    structuralType: 'Asymmetric Tower with Inadequate Shear Wall Reinforcement',
    collapseRiskPercent: 78,
    canReside: false,
    breakingChance: 'HIGH',
    buildingScale: 'Big Asymmetric High-Rise Tower (16 Stories)',
    residentsAdvice: 'AVOID PERIMETER. Big asymmetric tower with high chance of breaking under lateral shear waves. High debris throw trajectory.',
    richterTolerance: 'Critical Damage > 5.6 Richter',
    dangerRadiusMeters: 70,
    lat: 26.8640,
    lng: 75.7680,
    mapCoords: { x: 26, y: 80 },
    address: 'Mansarovar Sector 3 Boulevard, Jaipur',
    yearBuilt: 1993,
    tags: ['Torsional Twist', 'Inadequate Shear Walls', 'Debris Ejection', 'Hazard Perimeter']
  },
  {
    id: 'quake-red-05',
    name: 'MI Road Industrial Chimney & Dilapidated Mill',
    type: 'danger_weak_tall',
    riskLevel: 'CRITICAL_COLLAPSE',
    statusLabel: 'COLLAPSE PERIMETER',
    structureHeight: '32m Unreinforced Masonry Stack',
    structuralType: 'Brittle Brick Chimney Stack with Vertical Fissures',
    collapseRiskPercent: 95,
    canReside: false,
    breakingChance: 'VERY HIGH',
    buildingScale: 'Tall Industrial Smokestack & Decayed Factory Shed',
    residentsAdvice: 'IMMEDIATE FLIGHT ZONE. Tall and brittle chimney stack will topple during S-wave ground acceleration. 80m blast radius.',
    richterTolerance: 'Topple > 4.5 Richter',
    dangerRadiusMeters: 80,
    lat: 26.9180,
    lng: 75.7950,
    mapCoords: { x: 38, y: 40 },
    address: 'Off MI Road Industrial Belt, Jaipur',
    yearBuilt: 1964,
    tags: ['Chimney Toppling', 'Radial Debris Blast', 'Vertical Cracks', 'Zero Safety Margin']
  },

  // GREEN AREAS: CERTIFIED SEISMIC RESISTANT, DEEP FOUNDATION, OPEN GROUND RESIDENCE (PEOPLE CAN RESIDE HERE)
  {
    id: 'quake-green-01',
    name: 'Central Park Seismic Assembly Grounds & Dome',
    type: 'safe_residence',
    riskLevel: 'OPEN_GROUND_HAVEN',
    statusLabel: 'CERTIFIED SEISMIC REFUGE',
    structureHeight: 'Open Ground + Low-Rise Geodesic Pods (4m)',
    structuralType: 'Deep Earth Anchored Geodesic Lattice + Wide Open Botanical Clearing',
    collapseRiskPercent: 2,
    canReside: true,
    breakingChance: 'NEGLIGIBLE',
    buildingScale: 'Expansive 40-Acre Clear Open Sanctuary Ground',
    richterTolerance: 'Safe up to 9.0 Richter (Open Ground Zero Fall Hazard)',
    dangerRadiusMeters: 140, // Safe radius
    capacity: 2500,
    residentsAdvice: 'MAXIMUM SAFETY. PEOPLE CAN SAFELY RESIDE HERE. 100% open field with zero tall structures overhead. Autonomous solar power, artesian groundwater well, and medical triage tents.',
    lat: 26.9067,
    lng: 75.8078,
    mapCoords: { x: 48, y: 52 },
    address: 'Central Park South Lawns, Prithviraj Road, Jaipur',
    yearBuilt: 2021,
    tags: ['Zero Fall Hazard', 'Base Anchored', 'Emergency Water Reserves', 'Triage Capable']
  },
  {
    id: 'quake-green-02',
    name: 'SMS Hospital Base-Isolated Trauma Citadel',
    type: 'safe_residence',
    riskLevel: 'SEISMIC_SAFE',
    statusLabel: 'BASE-ISOLATED MEDICAL CITADEL',
    structureHeight: '3 Stories Low-Profile Heavy Core (12m)',
    structuralType: 'Elastomeric Lead-Rubber Base Isolators + Damped Friction Pendulums',
    collapseRiskPercent: 4,
    canReside: true,
    breakingChance: 'LOW',
    buildingScale: 'Heavy Low-Rise Engineered Complex with Base Decoupling',
    richterTolerance: 'Certified Operational up to 8.5 Richter',
    dangerRadiusMeters: 90,
    capacity: 650,
    residentsAdvice: 'CERTIFIED SAFE FOR RESIDENCE. Base isolators decouple ground tremor energy from structure. 24/7 solar microgrid and sterile surgical suites remain fully functional.',
    lat: 26.8929,
    lng: 75.8159,
    mapCoords: { x: 50, y: 62 },
    address: 'JLN Marg Medical Complex, Ashok Nagar, Jaipur',
    yearBuilt: 2020,
    tags: ['Lead-Rubber Isolators', 'Grade A+ Seismic', 'Trauma Ready', 'Backup Oxygen']
  },
  {
    id: 'quake-green-03',
    name: 'Statue Circle Fortified Civilian Eco-Hub',
    type: 'safe_residence',
    riskLevel: 'OPEN_GROUND_HAVEN',
    statusLabel: 'REINFORCED RESIDENTIAL SHELTER',
    structureHeight: 'Single-Story Reinforced Monolith (4.5m)',
    structuralType: 'Ductile Steel Space Frame with Carbon Fiber Wrapping',
    collapseRiskPercent: 5,
    canReside: true,
    breakingChance: 'LOW',
    buildingScale: 'Single-Story Reinforced Community Pavilion',
    richterTolerance: 'Safe up to 8.2 Richter',
    dangerRadiusMeters: 85,
    capacity: 480,
    residentsAdvice: 'SAFE RESIDENTIAL ZONE. Broad street setbacks eliminate falling debris hazard. Community kitchens and clean emergency drinking water tanks online.',
    lat: 26.9110,
    lng: 75.8020,
    mapCoords: { x: 45, y: 46 },
    address: 'Statue Circle Garden Periphery, C-Scheme, Jaipur',
    yearBuilt: 2022,
    tags: ['Carbon Fiber Reinforced', 'Wide Setback', 'Community Kitchen', 'Child Safe']
  },
  {
    id: 'quake-green-04',
    name: 'Jaigarh Granite Subterranean Vault #01',
    type: 'safe_residence',
    riskLevel: 'SEISMIC_SAFE',
    statusLabel: 'BEDROCK SUBTERRANEAN VAULT',
    structureHeight: 'Subsurface Granite Cavern (-8m Depth)',
    structuralType: 'Solid Natural Aravalli Granite Strata + Rock-Bolted Reinforced Concrete Lining',
    collapseRiskPercent: 1,
    canReside: true,
    breakingChance: 'NEGLIGIBLE',
    buildingScale: 'Natural Bedrock Subterranean Bunker & Vault',
    richterTolerance: 'Safe up to 9.2 Richter (Bedrock Wave Dampening)',
    dangerRadiusMeters: 100,
    capacity: 350,
    residentsAdvice: 'HIGHEST STRUCTURAL SECURITY. Bedrock movement experiences zero harmonic amplification. Constant thermal stability and filtered airlock circulation.',
    lat: 26.9850,
    lng: 75.8510,
    mapCoords: { x: 74, y: 15 },
    address: 'Jaigarh Fort Ridge Outpost, Amer Sector, Jaipur',
    yearBuilt: 2018,
    tags: ['Bedrock Anchored', 'Harmonic Dampened', 'Subterranean Vault', 'Zero Surface Hazard']
  },
  {
    id: 'quake-green-05',
    name: 'Rajasthan University Open Botanical Lawns',
    type: 'safe_residence',
    riskLevel: 'OPEN_GROUND_HAVEN',
    statusLabel: 'OPEN SEISMIC REFUGE CAMP',
    structureHeight: 'Expansive Open Turf Lawns (0m Overhead)',
    structuralType: 'Zero-Overhead Clear Zone + Flexible Bamboo-Steel Modular Shelters',
    collapseRiskPercent: 3,
    canReside: true,
    breakingChance: 'NEGLIGIBLE',
    buildingScale: 'Expansive Campus Botanical Lawns (Mass Open Ground)',
    richterTolerance: 'Safe up to 9.0 Richter',
    dangerRadiusMeters: 160,
    capacity: 1800,
    residentsAdvice: 'OPEN EVACUATION FIELD. High-capacity civilian safe harbor with zero overhead falling objects. Direct access from JLN Marg corridor.',
    lat: 26.8845,
    lng: 75.8190,
    mapCoords: { x: 53, y: 69 },
    address: 'University Campus Lawns, JLN Marg, Jaipur',
    yearBuilt: 2019,
    tags: ['Open Ground Area', 'Mass Capacity', 'Zero Glass', 'Helipad Access']
  }
];

// Helper to calculate distance from current user coordinates
export function recalculateSeismicDistances(
  userLat: number,
  userLng: number,
  baseZones: SeismicZone[] = JAIPUR_SEISMIC_ZONES
): SeismicZone[] {
  return baseZones.map((zone) => {
    const distKm = calculateDistanceKm(userLat, userLng, zone.lat, zone.lng);
    const metrics = formatDistanceMetrics(distKm);
    return {
      ...zone,
      distance: metrics.distanceStr,
      distanceKm: distKm,
      eta: metrics.etaStr
    };
  });
}

// Generate dynamic seismic scan data for any custom locality or GPS location outside Jaipur
export function generateSeismicZonesForLocation(
  centerLat: number,
  centerLng: number,
  localityName: string
): SeismicZone[] {
  const cleanName = localityName.split(',')[0].trim() || 'Sector';

  const offsets = [
    // 3 RED DANGER BUILDINGS
    {
      name: `${cleanName} Skyline Commercial Tower`,
      dLat: 0.007,
      dLng: 0.005,
      type: 'danger_weak_tall' as const,
      riskLevel: 'CRITICAL_COLLAPSE' as const,
      statusLabel: 'CRITICAL COLLAPSE HAZARD',
      height: '19 Stories (68m)',
      typeDesc: 'Unreinforced Non-Ductile Concrete Frame with Precast Heavy Facade',
      riskPct: 91,
      advice: 'EXTREME HAZARD: High probability of structural shear failure. Maintain minimum 75m debris perimeter.',
      rad: 75,
      year: 1982,
      x: 58,
      y: 42
    },
    {
      name: `${cleanName} Old Bazaar Dilapidated Tenement`,
      dLat: -0.006,
      dLng: 0.008,
      type: 'danger_weak_tall' as const,
      riskLevel: 'CRITICAL_COLLAPSE' as const,
      statusLabel: 'HIGH COLLAPSE HAZARD',
      height: '6 Stories Overhanging Brickwork',
      typeDesc: 'Aging Brick-and-Lime Loadbearing Masonry with Deteriorated Timber Lintels',
      riskPct: 86,
      advice: 'EVACUATE AREA: High pancake collapse likelihood and falling parapet stones.',
      rad: 55,
      year: 1968,
      x: 65,
      y: 62
    },
    {
      name: `${cleanName} Central Mall Old Glass Atrium`,
      dLat: 0.004,
      dLng: -0.009,
      type: 'danger_weak_tall' as const,
      riskLevel: 'HIGH_HAZARD' as const,
      statusLabel: 'STRUCTURAL HAZARD ZONE',
      height: '11 Stories Concrete with Soft-Story Entrance',
      typeDesc: 'Soft First-Story Parking with Weak Lateral Bracing and Heavy Curtain Wall',
      riskPct: 82,
      advice: 'DANGER ZONE: Soft-story ground floor buckling anticipated during primary S-waves.',
      rad: 60,
      year: 1989,
      x: 35,
      y: 48
    },

    // 3 GREEN SAFE RESIDENCES
    {
      name: `${cleanName} Civic Park Open Evacuation Grounds`,
      dLat: -0.003,
      dLng: -0.004,
      type: 'safe_residence' as const,
      riskLevel: 'OPEN_GROUND_HAVEN' as const,
      statusLabel: 'CERTIFIED SEISMIC RESIDENCE',
      height: 'Open Ground + Low-Rise Emergency Shelters (3.5m)',
      typeDesc: 'Wide Open Turf Zone with Zero Overhead Structural Hazards',
      riskPct: 2,
      advice: 'SAFE TO RESIDE: Primary neighborhood assembly ground. Safe distance from all building perimeters.',
      rad: 140,
      year: 2022,
      x: 46,
      y: 56,
      cap: 1600
    },
    {
      name: `${cleanName} Civil Hospital Base-Isolated Safe Wing`,
      dLat: 0.008,
      dLng: -0.006,
      type: 'safe_residence' as const,
      riskLevel: 'SEISMIC_SAFE' as const,
      statusLabel: 'BASE-ISOLATED REINFORCED SHELTER',
      height: '3 Stories Deep Foundation Citadel (11m)',
      typeDesc: 'Engineered Elastomeric Base-Dampened Structure (Grade A+ Certified)',
      riskPct: 4,
      advice: 'SAFE RESIDENCE: Certified to remain fully operational during major ground tremors.',
      rad: 85,
      year: 2021,
      x: 39,
      y: 36,
      cap: 550
    },
    {
      name: `${cleanName} Municipal Sports Complex & Safe Lawns`,
      dLat: -0.009,
      dLng: 0.002,
      type: 'safe_residence' as const,
      riskLevel: 'OPEN_GROUND_HAVEN' as const,
      statusLabel: 'CERTIFIED MASS REFUGE',
      height: 'Open Stadium Ground (0m Overhead Hazard)',
      typeDesc: 'Reinforced Perimeter with Wide Open Astroturf Assembly Arena',
      riskPct: 3,
      advice: 'SAFE TO RESIDE: High-capacity civilian safe harbor with autonomous emergency water and power.',
      rad: 150,
      year: 2023,
      x: 52,
      y: 75,
      cap: 2200
    }
  ];

  return offsets.map((item, idx) => {
    const lat = centerLat + item.dLat;
    const lng = centerLng + item.dLng;
    const distKm = calculateDistanceKm(centerLat, centerLng, lat, lng);
    const metrics = formatDistanceMetrics(distKm);

    return {
      id: `quake-zone-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}-${idx}`,
      name: item.name,
      type: item.type,
      riskLevel: item.riskLevel,
      statusLabel: item.statusLabel,
      structureHeight: item.height,
      structuralType: item.typeDesc,
      collapseRiskPercent: item.riskPct,
      canReside: item.type === 'safe_residence',
      breakingChance: item.type === 'danger_weak_tall' ? 'VERY HIGH' : 'NEGLIGIBLE',
      buildingScale: item.type === 'danger_weak_tall' ? 'Tall/Big Structural Risk Zone' : 'Certified Safe Civilian Ground',
      richterTolerance: item.type === 'safe_residence' ? 'Safe up to 8.8 Richter' : 'Failure > 5.2 Richter',
      dangerRadiusMeters: item.rad,
      capacity: item.cap,
      residentsAdvice: item.advice,
      lat,
      lng,
      distance: metrics.distanceStr,
      distanceKm: distKm,
      eta: metrics.etaStr,
      mapCoords: { x: item.x, y: item.y },
      address: `Near ${cleanName} Sector Corridor`,
      yearBuilt: item.year,
      tags: item.type === 'danger_weak_tall'
        ? ['Collapse Risk', 'Falling Glass', 'Soft Story', 'High Hazard Area', 'Red Area']
        : ['Seismic Certified', 'Open Assembly Ground', 'Safe to Reside', 'Water Reserves', 'Green Area']
    };
  });
}
