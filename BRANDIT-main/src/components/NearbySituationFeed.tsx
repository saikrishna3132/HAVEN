import React, { useState, useEffect, useRef } from 'react';
import { playTactileClick } from '../utils/audioSynth';
import { UserLocationState, IndianCity } from '../data/havenData';
import { getInitialReportsForLocation } from '../data/cityReportsData';

export interface CitizenReport {
  id: string;
  name: string;
  location: string;
  phone: string;
  comment: string;
  category: 'safe_passage' | 'resource' | 'medical' | 'hazard' | 'patrol';
  categoryLabel: string;
  badgeClass: string;
  timestamp: string;
  createdAt: number;
  verifiedCount: number;
  userVerified?: boolean;
}

const LOCAL_STORAGE_KEY_PREFIX = 'havenpulse_citizen_reports_v3_';

interface NearbySituationFeedProps {
  userLocation: UserLocationState;
  currentCity: IndianCity;
}

export const NearbySituationFeed: React.FC<NearbySituationFeedProps> = ({
  userLocation,
  currentCity
}) => {
  // Determine normalized active locality key for location-aware storage and seeding
  const activeLocalityString = (userLocation.localityName || currentCity.name || 'Jaipur').trim();
  const normalizedKey = activeLocalityString.toLowerCase().replace(/[^a-z0-9]/g, '_');

  // Track the previous locality string to detect when user moves/changes location
  const prevLocalityRef = useRef<string>(activeLocalityString);

  // Helper to load reports for a given locality string
  const loadReportsForLocality = (locString: string): CitizenReport[] => {
    const key = locString.toLowerCase().replace(/[^a-z0-9]/g, '_');
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // storage recovery fallback
    }
    return getInitialReportsForLocation(locString, currentCity.name);
  };

  // Reports state initialized for the current active locality
  const [reports, setReports] = useState<CitizenReport[]>(() => {
    return loadReportsForLocality(activeLocalityString);
  });

  // Form input state
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [name, setName] = useState('');
  const [locationInput, setLocationInput] = useState(activeLocalityString);
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<CitizenReport['category']>('safe_passage');
  const [submittedAlert, setSubmittedAlert] = useState<string | null>(null);
  const [locationSwitchedAlert, setLocationSwitchedAlert] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'safe_passage' | 'resource' | 'medical' | 'patrol'>('all');

  // DYNAMIC LOCATION SYNC:
  // Whenever user changes their location (e.g. Jaipur -> Mumbai, Delhi, Bengaluru, Mansarovar, or GPS coords),
  // dynamically update the input box location AND switch the intelligence feed reports to match that city!
  useEffect(() => {
    if (activeLocalityString !== prevLocalityRef.current) {
      prevLocalityRef.current = activeLocalityString;
      // Auto-update input box location field to tracked/uploaded user location
      setLocationInput(activeLocalityString);

      // Load or generate localized citizen reports for this new location
      const newReports = loadReportsForLocality(activeLocalityString);
      setReports(newReports);

      // Show brief visual confirmation that board synced to new user sector
      setLocationSwitchedAlert(`Intelligence Board synced to ${activeLocalityString}`);
      const t = setTimeout(() => setLocationSwitchedAlert(null), 4000);
      return () => clearTimeout(t);
    }
  }, [activeLocalityString, currentCity.name]);

  // Persist reports for this specific sector in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${normalizedKey}`, JSON.stringify(reports));
    } catch {
      // storage quota or unavailable
    }
  }, [reports, normalizedKey]);

  // Category metadata helper
  const getCategoryMeta = (cat: CitizenReport['category']) => {
    switch (cat) {
      case 'medical':
        return {
          label: 'Medical Safe Harbor',
          badgeClass: 'bg-red-950/80 text-red-300 border-red-600/70',
          dot: 'bg-red-500'
        };
      case 'resource':
        return {
          label: 'Water & Power Station',
          badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-600/70',
          dot: 'bg-blue-400'
        };
      case 'hazard':
        return {
          label: 'Hazard / Route Alert',
          badgeClass: 'bg-red-950/90 text-red-400 border-red-500 font-bold',
          dot: 'bg-red-600 animate-ping'
        };
      case 'patrol':
        return {
          label: 'Community Refuge',
          badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/70',
          dot: 'bg-indigo-400'
        };
      case 'safe_passage':
      default:
        return {
          label: 'Safe Passage Corridor',
          badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/70',
          dot: 'bg-cyan-400'
        };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();

    if (!name.trim()) {
      alert('Please enter your Name or Civilian Identifier');
      return;
    }
    if (!locationInput.trim()) {
      alert('Please enter your Current Location / Neighborhood');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your Contact / Emergency Phone Number');
      return;
    }
    if (!comment.trim()) {
      alert('Please describe what is happening in your nearby area');
      return;
    }

    const meta = getCategoryMeta(category);

    const newReport: CitizenReport = {
      id: `rep-${Date.now()}`,
      name: name.trim(),
      location: locationInput.trim(),
      phone: phone.trim(),
      comment: comment.trim(),
      category,
      categoryLabel: meta.label,
      badgeClass: meta.badgeClass,
      timestamp: 'Just now',
      createdAt: Date.now(),
      verifiedCount: 1,
      userVerified: true
    };

    setReports([newReport, ...reports]);
    setComment('');
    setSubmittedAlert(`Situation report broadcasted for ${newReport.location}!`);
    setTimeout(() => setSubmittedAlert(null), 5000);
  };

  const handleVerify = (id: string) => {
    playTactileClick();
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isV = r.userVerified;
          return {
            ...r,
            verifiedCount: isV ? r.verifiedCount - 1 : r.verifiedCount + 1,
            userVerified: !isV
          };
        }
        return r;
      })
    );
  };

  const filteredReports = reports.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.category === activeFilter;
  });

  return (
    <div className="bg-[#050b1e] rounded-xl border border-blue-900/70 shadow-2xl overflow-hidden mt-4">
      {/* Tactical Header */}
      <div className="bg-gradient-to-r from-[#08122c] via-[#050b1e] to-[#12071a] p-4 border-b border-blue-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#030712] border border-blue-500/60 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[20px] text-blue-400">broadcast_on_home</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-red-400">
                Ground Situation Live Dispatch
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="font-mono text-xs text-blue-400 font-semibold">
                {reports.length} Reports in {activeLocalityString.split('(')[0].split(',')[0].trim()}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
                Nearby Civilian Intelligence & Situation Board
              </h3>
              <span className="font-mono text-[10px] text-blue-300 bg-blue-950/90 border border-blue-700/80 px-2 py-0.5 rounded-full">
                {activeLocalityString}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick sync badge showing user location link */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#020510] border border-blue-900/80 text-[11px] font-mono text-slate-300">
            <span className="material-symbols-outlined text-[14px] text-emerald-400">my_location</span>
            <span>Sector: <span className="text-white font-bold">{activeLocalityString.split('(')[0].trim()}</span></span>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              setIsFormOpen(!isFormOpen);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
              isFormOpen
                ? 'bg-blue-600/30 text-blue-300 border-blue-500 hover:bg-blue-600/40'
                : 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-md shadow-red-950 animate-pulse'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isFormOpen ? 'remove' : 'add_alert'}
            </span>
            <span>{isFormOpen ? 'Hide Input Box' : 'Type Nearby Situation'}</span>
          </button>
        </div>
      </div>

      {/* Location Switch Toast */}
      {locationSwitchedAlert && (
        <div className="bg-blue-950/90 border-b border-blue-500/70 p-2.5 px-4 flex items-center justify-between text-blue-200 text-xs font-mono animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-[18px]">travel_explore</span>
            <span>{locationSwitchedAlert}. Showing messages broadcasted by people near you.</span>
          </div>
          <span className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">Auto-Synced</span>
        </div>
      )}

      {/* Success Notification Bar */}
      {submittedAlert && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/60 p-3 px-4 flex items-center gap-2 text-emerald-200 text-xs font-mono animate-fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
          <span>{submittedAlert}</span>
        </div>
      )}

      {/* INPUT INTERACTION BOX (Type what is happening in your nearby) */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-4 bg-[#030712]/95 border-b border-blue-900/50 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-blue-400">edit_note</span>
              <span>Post Your Ground Update (Civilian Situation Report):</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-blue-400">sync</span>
              <span>Location auto-tracked from upper console ({activeLocalityString}) or editable manually</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Field 1: Name */}
            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-blue-400">person</span>
                <span>Your Name:</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kabir Shekhawat / Volunteer 12"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050b1e] border border-blue-900/80 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Field 2: Location (Auto-tracked or manually entered) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-red-400">pin_drop</span>
                  <span>Your Location / Area:</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setLocationInput(activeLocalityString);
                  }}
                  title="Reset to tracked location from upper console"
                  className="text-[10px] font-mono text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Use Tracked
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Bandra West, Mumbai / CP, Delhi / Mansarovar..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full bg-[#050b1e] border border-blue-900/80 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Field 3: Phone Number */}
            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-emerald-400">call</span>
                <span>Phone / Contact Number:</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +91 98290 XXXXX / Radio CH-04"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#050b1e] border border-blue-900/80 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Field 4: Category / Tag & Comment Textarea */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-start">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1">
                Situation Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CitizenReport['category'])}
                className="w-full bg-[#050b1e] border border-blue-900/80 rounded-lg px-2.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              >
                <option value="safe_passage">Safe Passage Corridor</option>
                <option value="resource">Water & Power Station</option>
                <option value="medical">Medical Safe Harbor</option>
                <option value="hazard">Hazard / Obstacle Warning</option>
                <option value="patrol">Community Refuge</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-mono font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>What is happening in your nearby area?</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  Details will display directly under your Name, Location & Phone header
                </span>
              </label>
              <textarea
                required
                rows={2}
                placeholder={`Type real-time nearby update in ${locationInput || activeLocalityString}... (e.g. 'Safe passage verified open. Solar emergency lights operational. Drinking water filtration running.')`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#050b1e] border border-blue-900/80 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>
                Broadcasting to <span className="text-white font-semibold">{locationInput || activeLocalityString}</span> civilian defense network.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setName('');
                  setComment('');
                  setPhone('');
                }}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white rounded-lg border border-transparent hover:border-slate-800"
              >
                Reset
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-red-600 via-red-500 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-red-950/80 border border-red-400 flex items-center gap-2 tactile-button"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Broadcast Nearby Update</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Tabs for Citizen Reports */}
      <div className="px-4 py-2 bg-[#040817] border-b border-blue-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="text-slate-400 font-bold mr-1">Filter by:</span>
          {(
            [
              { id: 'all', label: 'All Reports' },
              { id: 'safe_passage', label: 'Safe Passages' },
              { id: 'medical', label: 'Medical' },
              { id: 'resource', label: 'Water & Power' },
              { id: 'patrol', label: 'Refuge Hubs' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playTactileClick();
                setActiveFilter(tab.id);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] border transition-all ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-sm'
                  : 'bg-[#08122c] text-slate-400 border-blue-950 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="material-symbols-outlined text-[13px] text-blue-400">near_me</span>
          <span>Showing {filteredReports.length} reports for <span className="text-blue-300 font-semibold">{activeLocalityString.split('(')[0].trim()}</span></span>
        </div>
      </div>

      {/* LIST OF CITIZEN REPORTS: Displays name, location, number above the comment */}
      <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto tactical-scrollbar bg-[#020510]/80">
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-mono text-xs">
            <span className="material-symbols-outlined text-3xl mb-1 text-slate-600">
              radar
            </span>
            <p>No citizen reports currently posted in this category for {activeLocalityString}.</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-2 text-blue-400 underline hover:text-blue-300"
            >
              Be the first to post a ground situation update
            </button>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-[#050b1e] border border-blue-900/60 hover:border-blue-700/80 rounded-xl p-3.5 transition-all shadow-md group relative"
            >
              {/* === DISPLAY HEADER (ABOVE COMMENT): NAME, LOCATION, NUMBER === */}
              <div className="pb-2.5 mb-2.5 border-b border-blue-950/80">
                {/* Row 1: Name and Category badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-950 border border-blue-600/50 flex items-center justify-center text-blue-400 font-bold text-xs font-mono">
                      {report.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs md:text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                        {report.name}
                        <span
                          className="material-symbols-outlined text-[14px] text-blue-400"
                          title="Verified Civilian Transmitter"
                        >
                          verified
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${report.badgeClass}`}
                    >
                      {report.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {report.timestamp}
                    </span>
                  </div>
                </div>

                {/* Row 2: Location and Phone Number prominently highlighted ABOVE the comment */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-mono mt-1">
                  {/* Location badge */}
                  <div className="inline-flex items-center gap-1 text-slate-200 bg-[#08122c] px-2 py-0.5 rounded border border-blue-900">
                    <span className="material-symbols-outlined text-[13px] text-red-400">
                      pin_drop
                    </span>
                    <span className="text-slate-400 text-[10px] uppercase">Location:</span>
                    <span className="text-white font-semibold">{report.location}</span>
                  </div>

                  {/* Phone Number badge */}
                  <div className="inline-flex items-center gap-1 text-slate-200 bg-[#08122c] px-2 py-0.5 rounded border border-blue-900">
                    <span className="material-symbols-outlined text-[13px] text-emerald-400">
                      call
                    </span>
                    <span className="text-slate-400 text-[10px] uppercase">Phone / Contact:</span>
                    <a
                      href={`tel:${report.phone}`}
                      className="text-emerald-300 font-semibold hover:underline"
                    >
                      {report.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* === COMMENT (BELOW THE NAME, LOCATION, NUMBER HEADER) === */}
              <div className="text-xs text-slate-200 leading-relaxed font-sans bg-[#030715]/70 p-2.5 rounded-lg border border-blue-950 mb-2">
                <p className="whitespace-pre-wrap">{report.comment}</p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVerify(report.id)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-all ${
                      report.userVerified
                        ? 'bg-blue-900/60 text-blue-300 border-blue-500 font-bold'
                        : 'bg-[#08122c] text-slate-400 border-blue-950 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px] text-blue-400">
                      thumb_up
                    </span>
                    <span>Confirm Verified ({report.verifiedCount})</span>
                  </button>

                  <a
                    href={`tel:${report.phone}`}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[13px]">phone_in_talk</span>
                    <span>Call Reporter</span>
                  </a>
                </div>

                <span className="text-[10px] text-slate-500">Live Civ-Grid # {report.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
