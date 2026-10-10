import React, { useState } from 'react';
import { playTactileClick } from '../utils/audioSynth';

interface CommunityBannerProps {
  onOpenRegisterHaven: () => void;
  onOpenVolunteerPatrol?: () => void;
  locationName?: string;
}

export const CommunityBanner: React.FC<CommunityBannerProps> = ({
  onOpenRegisterHaven,
  onOpenVolunteerPatrol,
  locationName = 'Jaipur'
}) => {
  const [showPatrolSuccess, setShowPatrolSuccess] = useState(false);

  const cleanLocation = locationName.replace(/\(GPS Locked\)/i, '').replace(/\(Pink City\)/i, '').trim() || 'Jaipur';

  const handleJoinPatrol = () => {
    playTactileClick();
    if (onOpenVolunteerPatrol) {
      onOpenVolunteerPatrol();
    } else {
      setShowPatrolSuccess(true);
      setTimeout(() => setShowPatrolSuccess(false), 5000);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 text-slate-100" id="community-section">
      <div className="bg-gradient-to-br from-[#050c22] via-[#030614] to-[#01030a] rounded-3xl p-6 md:p-10 border border-blue-900/60 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow in Blue and Red */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs text-blue-400 uppercase tracking-wider font-semibold inline-block mb-2">
              COOPERATIVE DEFENSE NETWORK · {cleanLocation.toUpperCase()} SECTOR
            </span>
            <h2 className="text-display-hero-mobile font-headline-lg font-bold text-white tracking-tight mb-3">
              Have extra water, power, or cellar space? <br />
              <span className="text-blue-400">Register as a Haven Node!</span>
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-xl">
              Whether you have a dry basement, a PM-Surya solar rooftop inverter, first-aid knowledge, or spare rations in {cleanLocation}, every civilian registration fortifies our local grid.
            </p>

            {showPatrolSuccess && (
              <div className="mb-4 p-3 bg-blue-950/95 text-blue-200 rounded-xl border border-blue-500 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-lg shadow-blue-950">
                <span className="material-symbols-outlined text-[20px] text-blue-400">verified</span>
                <div>
                  <div className="font-bold text-white">
                    Assigned to {cleanLocation} Civic Volunteer Patrol Squad Alpha
                  </div>
                  <div className="text-blue-300 text-[11px]">
                    Shift: 17:00 - 20:00 · Direct callsign dispatched to {cleanLocation} VHF radio mesh.
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenRegisterHaven();
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl text-xs font-mono uppercase tracking-wider tactile-button flex items-center gap-2 shadow-lg shadow-blue-950"
              >
                <span className="material-symbols-outlined text-[18px]">add_home_work</span>
                Register My Space as Haven
              </button>

              <button
                onClick={handleJoinPatrol}
                className="bg-[#050a1c] hover:bg-[#08122c] text-red-300 border border-red-700/60 px-5 py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold tactile-button flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px] text-red-400">shield_person</span>
                <span>Join Volunteer Patrol</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#04081c]/90 rounded-2xl p-5 border border-blue-900/60 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3.5 flex items-center gap-2 font-mono">
                <span className="material-symbols-outlined text-blue-400 text-[20px]">
                  volunteer_activism
                </span>
                {cleanLocation} Community Contributions This Week
              </h3>
              <ul className="space-y-3 font-mono text-xs">
                <li className="flex items-center justify-between pb-2.5 border-b border-blue-950">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-blue-400 text-[16px]">water</span>
                    Fresh Water Distributed
                  </span>
                  <span className="font-bold text-white">14,200 Liters</span>
                </li>
                <li className="flex items-center justify-between pb-2.5 border-b border-blue-950">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-red-400 text-[16px]">bolt</span>
                    Solar Wattage Shared
                  </span>
                  <span className="font-bold text-white">820 kWh</span>
                </li>
                <li className="flex items-center justify-between pb-2.5 border-b border-blue-950">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-blue-400 text-[16px]">bed</span>
                    Shelter Beds Offered
                  </span>
                  <span className="font-bold text-white">348 Safe Nights</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-red-500 text-[16px]">medical_services</span>
                    First-Aid Pod Visits
                  </span>
                  <span className="font-bold text-white">189 Treated</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
