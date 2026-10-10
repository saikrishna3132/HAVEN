import { CitizenReport } from '../components/NearbySituationFeed';

export interface CityReportsCollection {
  [cityKey: string]: CitizenReport[];
}

export const SEEDED_CITY_REPORTS: CityReportsCollection = {
  jaipur: [
    {
      id: 'rep-jpr-1',
      name: 'Dr. Ananya Sharma (Trauma Volunteer)',
      location: 'SMS Hospital Emergency Gate, JLN Marg, Jaipur',
      phone: '+91 98291 44520',
      comment:
        'SMS Hospital triage ward has emergency oxygen cylinders and 24/7 solar backup power operating. Safe pedestrian passage along JLN Marg is completely clear with medical volunteer escorts on duty.',
      category: 'medical',
      categoryLabel: 'Medical Safe Harbor',
      badgeClass: 'bg-red-950/80 text-red-300 border-red-600/70',
      timestamp: '4m ago',
      createdAt: Date.now() - 4 * 60 * 1000,
      verifiedCount: 19
    },
    {
      id: 'rep-jpr-2',
      name: 'Rohit Meena (Resident Scout)',
      location: 'Mansarovar Sector 5 Market, Jaipur',
      phone: '+91 94140 88219',
      comment:
        'Community borewell solar filter is 100% operational. 1,200L clean potable water tanks open for families. Solar charging station active for wireless radios and emergency power banks.',
      category: 'resource',
      categoryLabel: 'Water & Power Station',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-600/70',
      timestamp: '12m ago',
      createdAt: Date.now() - 12 * 60 * 1000,
      verifiedCount: 14
    },
    {
      id: 'rep-jpr-3',
      name: 'Pooja Shekhawat (Civil Defense Patrol)',
      location: 'Statue Circle to Central Park, Jaipur',
      phone: '+91 97832 10984',
      comment:
        'Zero-radiation corridor route inspected on foot. Solar LED lamp posts active along Statue Circle avenue. Safe transit verified towards C-Scheme and MI Road. No debris or blockages.',
      category: 'safe_passage',
      categoryLabel: 'Zero-Radiation Corridor',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/70',
      timestamp: '21m ago',
      createdAt: Date.now() - 21 * 60 * 1000,
      verifiedCount: 28
    },
    {
      id: 'rep-jpr-4',
      name: 'Major K.S. Rathore (Retd. Logistics)',
      location: 'Queens Road Community Center, Vaishali Nagar, Jaipur',
      phone: '+91 98280 55102',
      comment:
        'Cooperative pantry has received fresh flour, pulses, and solar lanterns. First-aid post manned by 3 nurses. Any civilians in western sector can safely dock here before nightfall.',
      category: 'patrol',
      categoryLabel: 'Community Refuge',
      badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/70',
      timestamp: '38m ago',
      createdAt: Date.now() - 38 * 60 * 1000,
      verifiedCount: 11
    }
  ],
  mumbai: [
    {
      id: 'rep-bom-1',
      name: 'Capt. Farhan Merchant (Marine Scout)',
      location: 'Marine Drive Promenade & Nariman Point, Mumbai',
      phone: '+91 98201 33490',
      comment:
        'Coastal promenade corridor inspected. Solar warning flashers active along Marine Drive to Churchgate. Safe sea-breeze transit corridor verified open with zero radiation and calm conditions.',
      category: 'safe_passage',
      categoryLabel: 'Zero-Radiation Coastal Corridor',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/70',
      timestamp: '3m ago',
      createdAt: Date.now() - 3 * 60 * 1000,
      verifiedCount: 31
    },
    {
      id: 'rep-bom-2',
      name: 'Dr. Priya Kulkarni (KEM Hospital Volunteer)',
      location: 'KEM Hospital Parel Triage Wing, Mumbai',
      phone: '+91 98192 45811',
      comment:
        'Parel emergency medical trauma center running on dual solar generators. 60 emergency stretchers and sterile burn treatments stocked. Ambulances stationed at Dr. E Borges Road.',
      category: 'medical',
      categoryLabel: 'Medical Safe Harbor',
      badgeClass: 'bg-red-950/80 text-red-300 border-red-600/70',
      timestamp: '9m ago',
      createdAt: Date.now() - 9 * 60 * 1000,
      verifiedCount: 24
    },
    {
      id: 'rep-bom-3',
      name: 'Aditya Sawant (Dadar Ward Relief Leader)',
      location: 'Shivaji Park Scout Pavilion, Dadar West, Mumbai',
      phone: '+91 99203 78120',
      comment:
        'Clean RO potable drinking water bowsers deployed next to Shivaji Park gymkhana. 2,500L available. Community radio broadcast active on CH 04 (142.400 MHz).',
      category: 'resource',
      categoryLabel: 'Water & Power Station',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-600/70',
      timestamp: '18m ago',
      createdAt: Date.now() - 18 * 60 * 1000,
      verifiedCount: 17
    },
    {
      id: 'rep-bom-4',
      name: 'Sunita Deshmukh (Andheri Civic Watch)',
      location: 'Andheri West Sports Complex & Link Road, Mumbai',
      phone: '+91 98335 11942',
      comment:
        'Community refuge center active in indoor badminton hall. Solar charging station for wireless walkie-talkies and powerbanks. Food packets being distributed for local families.',
      category: 'patrol',
      categoryLabel: 'Community Refuge',
      badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/70',
      timestamp: '32m ago',
      createdAt: Date.now() - 32 * 60 * 1000,
      verifiedCount: 15
    }
  ],
  delhi: [
    {
      id: 'rep-del-1',
      name: 'Dr. Vikramaditya Rao (AIIMS Trauma Squad)',
      location: 'AIIMS Emergency Complex, Ring Road, New Delhi',
      phone: '+91 98110 52391',
      comment:
        'AIIMS emergency trauma block powered by rooftop solar array with 70 oxygen reserves. Zero contamination reported across Ring Road underpass. Safe patient intake fully operational.',
      category: 'medical',
      categoryLabel: 'Medical Safe Harbor',
      badgeClass: 'bg-red-950/80 text-red-300 border-red-600/70',
      timestamp: '2m ago',
      createdAt: Date.now() - 2 * 60 * 1000,
      verifiedCount: 36
    },
    {
      id: 'rep-del-2',
      name: 'Gurpreet Singh (Civil Defense Connaught Place)',
      location: 'Inner Circle Block B to Janpath, Connaught Place, Delhi',
      phone: '+91 98712 80455',
      comment:
        'Central Delhi pedestrian corridor confirmed safe and monitored by civilian patrols. Solar street lamps active along Janpath and Barakhamba. Water distribution kiosk active at Central Park.',
      category: 'safe_passage',
      categoryLabel: 'Zero-Radiation Corridor',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/70',
      timestamp: '11m ago',
      createdAt: Date.now() - 11 * 60 * 1000,
      verifiedCount: 22
    },
    {
      id: 'rep-del-3',
      name: 'Ritu Bhardwaj (Dwarka Sector 10 Ward)',
      location: 'Dwarka Sector 10 Community Hall, New Delhi',
      phone: '+91 99104 33719',
      comment:
        'Underground rainwater purification cistern functioning at 100%. Free potable drinking water container refill available. Solar phone charging desks open for residents.',
      category: 'resource',
      categoryLabel: 'Water & Power Station',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-600/70',
      timestamp: '25m ago',
      createdAt: Date.now() - 25 * 60 * 1000,
      verifiedCount: 19
    },
    {
      id: 'rep-del-4',
      name: 'Harish Malik (Civilian Watch Rohini)',
      location: 'Swarn Jayanti Park Gate 2, Rohini Sector 10, Delhi',
      phone: '+91 98188 64920',
      comment:
        'Refuge hub established at sports center. Clean sleeping mats, dry rations, and first aid supplies ready. Volunteer escorts guiding people arriving from Outer Ring Road.',
      category: 'patrol',
      categoryLabel: 'Community Refuge',
      badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/70',
      timestamp: '41m ago',
      createdAt: Date.now() - 41 * 60 * 1000,
      verifiedCount: 13
    }
  ],
  bengaluru: [
    {
      id: 'rep-blr-1',
      name: 'Naveen Kumar (Cubbon Park Escort Patrol)',
      location: 'Cubbon Park MG Road Entrance, Bengaluru',
      phone: '+91 98450 12890',
      comment:
        'Cubbon Park green canopy corridor fully illuminated with solar LED pathways. Clear passage from MG Road to Vidhana Soudha. Volunteer patrols on duty with emergency radios.',
      category: 'safe_passage',
      categoryLabel: 'Zero-Radiation Green Corridor',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/70',
      timestamp: '5m ago',
      createdAt: Date.now() - 5 * 60 * 1000,
      verifiedCount: 27
    },
    {
      id: 'rep-blr-2',
      name: 'Dr. Shalini Hegde (Victoria Hospital Volunteer)',
      location: 'Victoria Hospital Emergency Deck, Fort Road, Bengaluru',
      phone: '+91 98801 77341',
      comment:
        'Trauma center has full solar battery reserves and emergency blood bank operating. Clean burn dressings and sterile saline drip packs stocked.',
      category: 'medical',
      categoryLabel: 'Medical Safe Harbor',
      badgeClass: 'bg-red-950/80 text-red-300 border-red-600/70',
      timestamp: '14m ago',
      createdAt: Date.now() - 14 * 60 * 1000,
      verifiedCount: 18
    },
    {
      id: 'rep-blr-3',
      name: 'Karthik Raman (Indiranagar Ward Defense)',
      location: '100ft Road Defense Pod, Indiranagar, Bengaluru',
      phone: '+91 99002 65412',
      comment:
        'Solar microgrid operational. Wireless mesh Wi-Fi bridge active between 12th Main and CMH Road. Clean water filtration dispensing 500L/hour.',
      category: 'resource',
      categoryLabel: 'Water & Power Station',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-600/70',
      timestamp: '29m ago',
      createdAt: Date.now() - 29 * 60 * 1000,
      verifiedCount: 16
    }
  ],
  jodhpur: [
    {
      id: 'rep-jdh-1',
      name: 'Col. Hanuwant Singh (Retd. Desert Scouts)',
      location: 'Mehrangarh Foothills & Clock Tower, Jodhpur',
      phone: '+91 94141 33201',
      comment:
        'Sardar Market safe transit corridor clear and guarded. Solar lanterns installed along High Court Road. Zero hazard reading across old city ramparts.',
      category: 'safe_passage',
      categoryLabel: 'Zero-Radiation Corridor',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/70',
      timestamp: '7m ago',
      createdAt: Date.now() - 7 * 60 * 1000,
      verifiedCount: 15
    },
    {
      id: 'rep-jdh-2',
      name: 'Dr. Ratan Lal (MDM Hospital Volunteer)',
      location: 'Mathura Das Mathur (MDM) Hospital, Shastri Nagar, Jodhpur',
      phone: '+91 98290 89123',
      comment:
        '24/7 solar trauma clinic open. Clean intravenous supplies and burn ointments available for civilians.',
      category: 'medical',
      categoryLabel: 'Medical Safe Harbor',
      badgeClass: 'bg-red-950/80 text-red-300 border-red-600/70',
      timestamp: '16m ago',
      createdAt: Date.now() - 16 * 60 * 1000,
      verifiedCount: 12
    }
  ],
  udaipur: [
    {
      id: 'rep-udr-1',
      name: 'Bhairav Rawat (Fateh Sagar Watch)',
      location: 'Fateh Sagar Paal & Moti Magri, Udaipur',
      phone: '+91 94142 66710',
      comment:
        'Lakeside corridor clear. Solar pumping station providing continuous clean mineral drinking water. Emergency radio station operating on CH 04.',
      category: 'resource',
      categoryLabel: 'Water & Power Station',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-600/70',
      timestamp: '8m ago',
      createdAt: Date.now() - 8 * 60 * 1000,
      verifiedCount: 14
    },
    {
      id: 'rep-udr-2',
      name: 'Dr. Meena Ranawat (MB Hospital)',
      location: 'Maharana Bhupal Hospital Emergency Wing, Court Circle, Udaipur',
      phone: '+91 98293 45678',
      comment:
        'Field hospital operating on solar microgrid. Immediate trauma intake available with clean sterile dressings.',
      category: 'medical',
      categoryLabel: 'Medical Safe Harbor',
      badgeClass: 'bg-red-950/80 text-red-300 border-red-600/70',
      timestamp: '22m ago',
      createdAt: Date.now() - 22 * 60 * 1000,
      verifiedCount: 17
    }
  ],
  kota: [
    {
      id: 'rep-kot-1',
      name: 'Er. Sandeep Verma (Chambal Relief)',
      location: 'Chambal Riverfront & Aerodrome Circle, Kota',
      phone: '+91 94144 12399',
      comment:
        'Hydro-solar water purification filter functioning. Clean drinking water supply open for surrounding residential wards. Clear transit along Jhalawar Road.',
      category: 'resource',
      categoryLabel: 'Water & Power Station',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-600/70',
      timestamp: '10m ago',
      createdAt: Date.now() - 10 * 60 * 1000,
      verifiedCount: 13
    }
  ],
  ajmer: [
    {
      id: 'rep-ajm-1',
      name: 'Mohit Chauhan (Ana Sagar Patrol)',
      location: 'Ana Sagar Circular Road & JLN Hospital, Ajmer',
      phone: '+91 94143 55901',
      comment:
        'JLN Hospital emergency gate clear and operating with emergency solar backup. Safe passage along Kutchery Road confirmed by civilian defense volunteers.',
      category: 'safe_passage',
      categoryLabel: 'Zero-Radiation Corridor',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/70',
      timestamp: '12m ago',
      createdAt: Date.now() - 12 * 60 * 1000,
      verifiedCount: 11
    }
  ]
};

// Generates dynamic localized seed reports for any custom city, neighborhood, or GPS location
export function generateLocalSeedReportsForCity(cityName: string): CitizenReport[] {
  const shortName = cityName.split('(')[0].split(',')[0].trim() || 'Local Area';
  const now = Date.now();

  return [
    {
      id: `rep-${shortName.toLowerCase().replace(/[^a-z0-9]/g, '')}-1`,
      name: `Dr. Shailesh Verma (${shortName} Medical Volunteer)`,
      location: `Main Civic Hospital & Emergency Triage, ${shortName}`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
      comment: `${shortName} emergency triage clinic is operating on backup solar batteries. Emergency oxygen reserves, sterile bandages, and clean water are stocked. Safe pedestrian passage verified.`,
      category: 'medical',
      categoryLabel: 'Medical Safe Harbor',
      badgeClass: 'bg-red-950/80 text-red-300 border-red-600/70',
      timestamp: '3m ago',
      createdAt: now - 3 * 60 * 1000,
      verifiedCount: 16
    },
    {
      id: `rep-${shortName.toLowerCase().replace(/[^a-z0-9]/g, '')}-2`,
      name: `Ramesh Chandra (${shortName} Civil Patrol)`,
      location: `Central Avenue & Main Market Crossing, ${shortName}`,
      phone: `+91 94${Math.floor(10000000 + Math.random() * 89999999)}`,
      comment: `Zero-radiation safe passage route checked and verified clear. Solar street lamps active across ${shortName} central boulevard. Escort patrols present for civilians.`,
      category: 'safe_passage',
      categoryLabel: 'Zero-Radiation Corridor',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/70',
      timestamp: '14m ago',
      createdAt: now - 14 * 60 * 1000,
      verifiedCount: 22
    },
    {
      id: `rep-${shortName.toLowerCase().replace(/[^a-z0-9]/g, '')}-3`,
      name: `Sunita Rao (${shortName} Community Warden)`,
      location: `Municipal Water Tank & Public Park, ${shortName}`,
      phone: `+91 99${Math.floor(10000000 + Math.random() * 89999999)}`,
      comment: `Solar RO water dispensing point running normally with clean tested drinking water. Free container refills and battery recharging hub open for local families.`,
      category: 'resource',
      categoryLabel: 'Water & Power Station',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-600/70',
      timestamp: '27m ago',
      createdAt: now - 27 * 60 * 1000,
      verifiedCount: 14
    },
    {
      id: `rep-${shortName.toLowerCase().replace(/[^a-z0-9]/g, '')}-4`,
      name: `Vikram Shekhawat (${shortName} Refuge Volunteer)`,
      location: `Community Hall & Indoor Sports Complex, ${shortName}`,
      phone: `+91 97${Math.floor(10000000 + Math.random() * 89999999)}`,
      comment: `Cooperative emergency shelter open with clean bedding, non-perishable food supplies, and radio comms. Civilians needing safe haven are welcome.`,
      category: 'patrol',
      categoryLabel: 'Community Refuge',
      badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/70',
      timestamp: '39m ago',
      createdAt: now - 39 * 60 * 1000,
      verifiedCount: 9
    }
  ];
}

// Helper to resolve city key or generate matching reports
export function getInitialReportsForLocation(
  userLocationName?: string,
  currentCityName?: string
): CitizenReport[] {
  const target = (userLocationName || currentCityName || 'Jaipur').toLowerCase();

  if (target.includes('mumbai') || target.includes('bombay') || target.includes('nariman') || target.includes('bandra') || target.includes('dadar')) {
    return SEEDED_CITY_REPORTS.mumbai;
  }
  if (target.includes('delhi') || target.includes('ncr') || target.includes('new delhi') || target.includes('gurgaon') || target.includes('noida')) {
    return SEEDED_CITY_REPORTS.delhi;
  }
  if (target.includes('bengaluru') || target.includes('bangalore') || target.includes('karnataka')) {
    return SEEDED_CITY_REPORTS.bengaluru;
  }
  if (target.includes('jodhpur')) {
    return SEEDED_CITY_REPORTS.jodhpur;
  }
  if (target.includes('udaipur')) {
    return SEEDED_CITY_REPORTS.udaipur;
  }
  if (target.includes('kota')) {
    return SEEDED_CITY_REPORTS.kota;
  }
  if (target.includes('ajmer') || target.includes('pushkar')) {
    return SEEDED_CITY_REPORTS.ajmer;
  }
  if (target.includes('jaipur') || target.includes('mansarovar') || target.includes('vaishali') || target.includes('malviya')) {
    return SEEDED_CITY_REPORTS.jaipur;
  }

  const cleanName = (userLocationName || currentCityName || 'Local Sector').split('(')[0].trim();
  return generateLocalSeedReportsForCity(cleanName);
}
