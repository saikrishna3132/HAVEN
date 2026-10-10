import React, { useState, useEffect } from 'react';
import { playTactileClick } from '../../utils/audioSynth';

export interface VolunteerProfile {
  id: string;
  callsign: string;
  name: string;
  phone: string;
  location: string;
  role: string;
  shift: string;
  resourceTags: string[];
  resourceDescription: string;
  registeredAt: string;
}

interface VolunteerPatrolModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName?: string;
  onEnrollSuccess?: (profile: VolunteerProfile) => void;
}

const COMMON_RESOURCES = [
  { id: 'vehicle', label: 'Motorcycle / 4x4 / Vehicle', icon: 'two_wheeler' },
  { id: 'medical', label: 'Trauma Kit & First Aid', icon: 'medical_services' },
  { id: 'water', label: 'Potable Water Cans / Filter', icon: 'water_drop' },
  { id: 'solar', label: 'Solar Battery Bank / Inverter', icon: 'solar_power' },
  { id: 'radio', label: 'VHF / UHF Walkie-Talkies', icon: 'radio' },
  { id: 'flashlights', label: 'Tactical Flashlights & Beacons', icon: 'flashlight_on' },
  { id: 'tools', label: 'Rescue Tools & Heavy Ropes', icon: 'handyman' },
  { id: 'rations', label: 'Dry Rations & Energy Food', icon: 'lunch_dining' },
  { id: 'highvis', label: 'High-Vis Vests & Helmet', icon: 'shield' },
];

const ROLES = [
  'Safe Passage Escort & Perimeter Scout',
  'Medical & Triage First Responder',
  'Water, Food & Resource Logistics Driver',
  'Radio Communications & Mesh Dispatcher',
  'Zero-Radiation Corridor Night Watch Sentinel'
];

const SHIFTS = [
  'Evening Patrol (17:00 - 21:00)',
  'Night Sentinel Watch (21:00 - 05:00)',
  'Morning Scout (06:00 - 12:00)',
  'Afternoon Logistics (12:00 - 17:00)',
  'Emergency On-Call (24/7 Rapid Response)'
];

const LOCAL_STORAGE_VOLUNTEERS_KEY = 'havenpulse_patrol_volunteers_v1';

export const VolunteerPatrolModal: React.FC<VolunteerPatrolModalProps> = ({
  isOpen,
  onClose,
  locationName = 'Jaipur',
  onEnrollSuccess
}) => {
  const cleanLocation =
    locationName.replace(/\(GPS Locked\)/i, '').replace(/\(Pink City\)/i, '').trim() || 'Jaipur';

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(cleanLocation);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedShift, setSelectedShift] = useState(SHIFTS[0]);
  const [selectedResources, setSelectedResources] = useState<string[]>([
    'vehicle',
    'medical'
  ]);
  const [resourceDescription, setResourceDescription] = useState('');
  const [enrolledProfile, setEnrolledProfile] = useState<VolunteerProfile | null>(null);

  // Sync default location
  useEffect(() => {
    if (cleanLocation && !location) {
      setLocation(cleanLocation);
    }
  }, [cleanLocation, location]);

  if (!isOpen) return null;

  const toggleResource = (id: string) => {
    playTactileClick();
    setSelectedResources((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();

    if (!name.trim()) {
      alert('Please enter your Name');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your Phone / Contact number');
      return;
    }
    if (!location.trim()) {
      alert('Please specify your Current Location / Operational Area');
      return;
    }
    if (!resourceDescription.trim()) {
      alert('Please describe what resources you have and how you can help');
      return;
    }

    const squadCode = ['ALPHA', 'BRAVO', 'ECHO', 'SIERRA'][Math.floor(Math.random() * 4)];
    const num = Math.floor(100 + Math.random() * 900);
    const callsign = `PATROL-${squadCode}-${num}`;

    const profile: VolunteerProfile = {
      id: `vol-${Date.now()}`,
      callsign,
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      role: selectedRole,
      shift: selectedShift,
      resourceTags: selectedResources.map(
        (id) => COMMON_RESOURCES.find((r) => r.id === id)?.label || id
      ),
      resourceDescription: resourceDescription.trim(),
      registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Store in localStorage
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_VOLUNTEERS_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(profile);
      localStorage.setItem(LOCAL_STORAGE_VOLUNTEERS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    setEnrolledProfile(profile);
    if (onEnrollSuccess) {
      onEnrollSuccess(profile);
    }
  };

  const handleClose = () => {
    playTactileClick();
    setEnrolledProfile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-2xl bg-[#04081c] rounded-3xl p-6 md:p-8 border border-blue-900/80 shadow-2xl shadow-black max-h-[92vh] overflow-y-auto tactical-scrollbar relative">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-950 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#08122c] border border-red-500/60 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-950/50">
              <span className="material-symbols-outlined text-[22px]">shield_person</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-mono text-xs uppercase font-bold tracking-wider text-red-400">
                  Civilian Defense Registry
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="font-mono text-xs text-blue-400 font-semibold">
                  {cleanLocation} Tactical Sector
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
                Join Volunteer Patrol Squad
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-[#08122c] border border-blue-900 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Body: Either Form or Enrolled Pass */}
        {enrolledProfile ? (
          /* SUCCESS CONFIRMATION PASS */
          <div className="py-6 space-y-5 animate-fade-in relative z-10">
            <div className="p-4 bg-emerald-950/70 border border-emerald-500/70 rounded-2xl flex items-center gap-3 text-emerald-200">
              <span className="material-symbols-outlined text-3xl text-emerald-400">
                verified_user
              </span>
              <div>
                <h4 className="font-bold text-sm text-white font-mono">
                  Volunteer Patrol Registration Confirmed!
                </h4>
                <p className="text-xs text-emerald-300/90 mt-0.5 font-mono">
                  Your credentials and resource contribution details have been uploaded to the{' '}
                  {cleanLocation} Civilian Mesh Dispatch.
                </p>
              </div>
            </div>

            {/* Tactical Volunteer Credential Card */}
            <div className="bg-[#020512] rounded-2xl p-5 border border-blue-800/80 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-blue-950 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-xs uppercase font-bold text-slate-300">
                    Official Squad Dispatch Credentials
                  </span>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-blue-950 border border-blue-500 text-blue-300 font-bold">
                  {enrolledProfile.callsign}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Volunteer Name:</span>
                  <span className="text-white text-sm font-bold">{enrolledProfile.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Phone / Contact:</span>
                  <span className="text-emerald-400 text-sm font-bold">{enrolledProfile.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Operational Location:</span>
                  <span className="text-blue-300 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-red-400">pin_drop</span>
                    {enrolledProfile.location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Assigned Patrol Shift:</span>
                  <span className="text-amber-300 font-bold">{enrolledProfile.shift}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-[10px] uppercase block">Assigned Squad Role:</span>
                  <span className="text-slate-200 font-semibold">{enrolledProfile.role}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-[10px] uppercase block mb-1">
                    Resources Committed Through Which You Will Help:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {enrolledProfile.resourceTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-700 text-[11px] text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="p-3 bg-[#060d26] rounded-xl border border-blue-950 text-slate-300 font-sans text-xs italic">
                    "{enrolledProfile.resourceDescription}"
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-950 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                <span>VHF Broadcast Relay: 142.400 MHz</span>
                <span>Enrolled at: {enrolledProfile.registeredAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-950 border border-blue-400 tactile-button"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION & RESOURCE UPLOAD FORM */
          <form onSubmit={handleSubmit} className="py-5 space-y-5 relative z-10 font-mono">
            <div className="bg-[#050b1e] p-3.5 rounded-xl border border-blue-900/60 text-xs text-slate-300">
              <p className="leading-relaxed">
                Fill in your basic information and describe the resources and equipment you can
                bring to assist the <span className="text-blue-400 font-bold">{cleanLocation}</span>{' '}
                volunteer squad. You will be assigned a patrol shift and radio callsign immediately.
              </p>
            </div>

            {/* Basic Details: Name, Number, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Field 1: Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-blue-400">person</span>
                  <span>Full Name:</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Rathore"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#020512] border border-blue-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Field 2: Phone / Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-emerald-400">call</span>
                  <span>Phone Number:</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98290 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#020512] border border-blue-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Field 3: Location */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-red-400">pin_drop</span>
                  <span>Present Location:</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JLN Marg / Mansarovar / Vaishali"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#020512] border border-blue-900/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Operational Role & Shift Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Squad Role Preference:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-[#020512] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {ROLES.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Available Shift Window:
                </label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full bg-[#020512] border border-blue-900/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {SHIFTS.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* WHAT RESOURCES HE/SHE HAS THROUGH WHICH HE/SHE CAN HELP */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-red-400">
                    inventory_2
                  </span>
                  <span>What Resources / Gear Do You Have to Help? (Select all that apply)</span>
                </label>
                <span className="text-[10px] text-slate-500 uppercase">
                  {selectedResources.length} selected
                </span>
              </div>

              {/* Resource Tag Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMMON_RESOURCES.map((res) => {
                  const isChecked = selectedResources.includes(res.id);
                  return (
                    <button
                      type="button"
                      key={res.id}
                      onClick={() => toggleResource(res.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2 transition-all ${
                        isChecked
                          ? 'bg-blue-950 border-blue-500 text-blue-200 font-bold shadow-md shadow-blue-950/50'
                          : 'bg-[#020512] border-blue-950 text-slate-400 hover:text-white hover:border-blue-800'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isChecked ? 'text-blue-400' : 'text-slate-500'
                        }`}
                      >
                        {res.icon}
                      </span>
                      <span className="truncate">{res.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resource Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-blue-400">edit_note</span>
                  <span>Describe the Resources & How You Can Help Through Them:</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Vehicles, gear capacity, rations, medicines, special skills
                </span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Example: I have a Royal Enfield motorcycle with a 20L extra fuel jerrycan, a fully stocked trauma first aid kit with tourniquets, and 2 Baofeng UHF radios. Can escort civilians or carry emergency medicines across JLN Marg and Statue Circle."
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
                className="w-full bg-[#020512] border border-blue-900/80 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans resize-none"
              ></textarea>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-blue-950 gap-3">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Encrypted on local mesh network · No commercial tracking</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 via-red-500 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950 border border-red-400 flex items-center gap-2 tactile-button"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Upload Details & Join Squad</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
