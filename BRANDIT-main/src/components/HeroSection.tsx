import React from 'react';
import { CATEGORY_FILTERS, UserLocationState } from '../data/havenData';
import { playTactileClick } from '../utils/audioSynth';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  radiusKm: number;
  onRadiusChange: (r: number) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onLocateMe: () => void;
  isLocating: boolean;
  userLocation: UserLocationState;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  radiusKm,
  onRadiusChange,
  selectedCategory,
  onSelectCategory,
  onLocateMe,
  isLocating,
  userLocation
}) => {
  return (
    <section className="relative bg-[#020617] pt-12 pb-14 px-4 md:px-8 border-b border-blue-950 overflow-hidden text-slate-100">
      {/* Precision Ambient Gradients: Electric Blue & Tactical Crimson Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[340px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-12 right-10 w-80 h-80 bg-red-600/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Reassuring Message Banner */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-[#060e24] px-3.5 py-1.5 rounded-full border border-blue-500/40 mb-4 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span className="font-mono text-xs text-blue-400 font-semibold uppercase tracking-wider">
              {userLocation.isGpsAllowed
                ? `GPS LOCATION ACTIVE • NEARBY FACILITIES FOR ${userLocation.localityName.toUpperCase()}`
                : 'CIVILIAN DEFENSE MESH • JAIPUR & RAJASTHAN SECTOR'}
            </span>
          </div>

          <h1 className="text-display-hero font-display-hero text-white tracking-tight mb-4">
            You Are Not Alone. <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-red-400 bg-clip-text text-transparent">
              Safe Havens & Vital Lifelines
            </span>{' '}
            Near You.
          </h1>

          <p className="text-body-lg font-body-lg text-slate-400 max-w-2xl leading-relaxed">
            Real-time grid telemetry, walk-in subterranean shelters, 24/7 field hospitals, and solar-powered civilian watchposts across Jaipur and nearby sectors.
          </p>
        </div>

        {/* Universal Tactile Search Deck (Deep Void Card with Blue Accent) */}
        <div className="bg-[#050b1e]/90 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-blue-900/60 shadow-2xl shadow-black max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Search Text Input */}
            <div className="md:col-span-6 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-blue-400 text-[20px]">
                explore
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Jaipur facility, sector, or hospital (e.g. SMS Hospital, C-Scheme, Mansarovar)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-900/80 bg-[#020617] text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              )}
            </div>

            {/* Distance Slider Control */}
            <div className="md:col-span-4 bg-[#020617] px-3.5 py-2 rounded-xl border border-blue-900/60 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[11px] text-slate-400 font-bold uppercase">
                  Search Radius
                </span>
                <span className="font-mono text-xs text-blue-400 font-bold">
                  Within {radiusKm} km
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={radiusKm}
                onChange={(e) => onRadiusChange(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-[#0b1428] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-slate-500 font-semibold mt-1">
                <span>&lt; 5km (Walk)</span>
                <span>10km (Bike)</span>
                <span>25km (Convoy)</span>
              </div>
            </div>

            {/* Locate / Allow Location Instant Button */}
            <div className="md:col-span-2">
              <button
                onClick={() => {
                  playTactileClick();
                  onLocateMe();
                }}
                disabled={isLocating}
                className={`w-full py-2.5 px-4 font-bold rounded-xl text-xs font-mono uppercase tracking-wider tactile-button flex items-center justify-center gap-1.5 transition-all shadow-lg disabled:opacity-75 ${
                  userLocation.isGpsAllowed
                    ? 'bg-blue-950 text-blue-300 border border-blue-500 shadow-blue-950/70'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/70'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isLocating ? 'animate-spin' : ''}`}>
                  {isLocating ? 'autorenew' : userLocation.isGpsAllowed ? 'my_location' : 'near_me'}
                </span>
                <span>
                  {isLocating
                    ? 'Locating...'
                    : userLocation.isGpsAllowed
                    ? 'GPS Active'
                    : 'Allow GPS'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Clean Segmented Filter Tabs (Black Red Blue Discipline) */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
          {CATEGORY_FILTERS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const isCritical = cat.id === 'hospital' || cat.id === 'fire';

            return (
              <button
                key={cat.id}
                onClick={() => {
                  playTactileClick();
                  onSelectCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono border transition-all ${
                  isSelected
                    ? isCritical
                      ? 'bg-red-950/90 text-red-200 border-red-500/80 shadow-lg shadow-red-950/60 font-bold'
                      : 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-950/70 font-bold'
                    : 'bg-[#050b1e] border-blue-950 text-slate-400 hover:text-slate-200 hover:border-blue-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
