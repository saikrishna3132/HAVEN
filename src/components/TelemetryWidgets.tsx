import React from 'react';
import { playTactileClick } from '../utils/audioSynth';

interface TelemetryWidgetsProps {
  onOpenRadio: () => void;
  onOpenBuddyFinder: () => void;
  onOpenSolarModal: () => void;
  onOpenEarthquakeScannerSettings?: () => void;
  isEarthquakeScannerActive?: boolean;
}

export const TelemetryWidgets: React.FC<TelemetryWidgetsProps> = ({
  onOpenRadio,
  onOpenBuddyFinder,
  onOpenSolarModal,
  onOpenEarthquakeScannerSettings,
  isEarthquakeScannerActive = false
}) => {
  return (
    <section className="bg-[#020512] py-14 px-4 md:px-8 border-y border-blue-950 text-slate-100" id="resources-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="font-mono text-xs text-blue-400 font-semibold uppercase tracking-wider">
            CIVIC SENSORS & REAL-TIME TELEMETRY
          </span>
          <h2 className="text-display-hero-mobile font-headline-lg font-bold text-white tracking-tight mt-1">
            Today’s Vital Atmosphere & Reserves
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time localized environmental diagnostics across India safe zones</p>
        </div>

        {/* Earthquake Scanner Premier Telemetry Banner */}
        {onOpenEarthquakeScannerSettings && (
          <div
            onClick={() => {
              playTactileClick();
              onOpenEarthquakeScannerSettings();
            }}
            className={`mb-8 p-4 rounded-2xl border transition-all cursor-pointer flex flex-wrap items-center justify-between gap-3 shadow-xl ${
              isEarthquakeScannerActive
                ? 'bg-gradient-to-r from-red-950/60 via-[#0a0518] to-emerald-950/60 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                : 'bg-[#050b1e] border-blue-900/60 hover:border-red-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                isEarthquakeScannerActive ? 'bg-red-950 border-red-500 text-red-400 animate-pulse' : 'bg-[#081128] border-blue-800 text-blue-400'
              }`}>
                <span className="material-symbols-outlined text-[24px]">earthquake</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    EARTHQUAKE STRUCTURAL SCANNER
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${
                    isEarthquakeScannerActive ? 'bg-red-950 text-red-300 border-red-500' : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                    {isEarthquakeScannerActive ? 'SCANNER LIVE' : 'CLICK TO CONFIGURE'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  <strong className="text-red-400">RED AREA:</strong> Weak & big buildings with high collapse chance (Uninhabitable) • <strong className="text-emerald-400">GREEN AREA:</strong> Certified safe buildings where people can reside.
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                playTactileClick();
                onOpenEarthquakeScannerSettings();
              }}
              className="px-4 py-2 bg-[#120306] border border-red-800 hover:border-red-500 text-red-200 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px] text-red-400">tune</span>
              <span>Scanner Settings →</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Widget 1: Air & Water Purity Index */}
          <div className="bg-[#050b1e] p-5 rounded-2xl border border-blue-900/60 hover:border-blue-500 transition-all flex flex-col justify-between shadow-lg shadow-black">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-blue-400 text-[28px]">air</span>
                <span className="font-mono text-[10px] text-blue-300 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded font-bold uppercase">
                  SAFE ZONE
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 uppercase font-semibold">
                Air & Water Purity (AQI Safe)
              </div>
              <div className="font-mono text-3xl font-black text-blue-400 tracking-tight mt-1">
                98.4 <span className="text-lg text-slate-500 font-normal">/ 100</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Particulate matter zero in micro-corridors; municipal solar water pumps operating at 100% capacity.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-950 flex justify-between items-center font-mono text-[11px]">
              <span className="text-slate-400">Radiation: 0.08 µSv/h</span>
              <span className="text-blue-400 font-bold">Optimal</span>
            </div>
          </div>

          {/* Widget 2: Solar Microgrid Reserve */}
          <div
            onClick={() => {
              playTactileClick();
              onOpenSolarModal();
            }}
            className="bg-[#050b1e] p-5 rounded-2xl border border-blue-900/60 hover:border-red-500 transition-all flex flex-col justify-between cursor-pointer shadow-lg shadow-black group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-red-500 text-[28px] group-hover:scale-110 transition-transform">
                  bolt
                </span>
                <span className="font-mono text-[10px] text-red-300 bg-red-950/80 border border-red-800/80 px-2 py-0.5 rounded font-bold uppercase">
                  GRID PEAK
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 uppercase font-semibold">
                Solar Microgrid Storage (PM-Surya)
              </div>
              <div className="font-mono text-3xl font-black text-white tracking-tight mt-1">
                94% <span className="text-sm text-red-400 font-normal">Stored</span>
              </div>
              {/* Battery bar (Red / Blue gradient) */}
              <div className="w-full bg-[#020512] rounded-full h-2 overflow-hidden border border-blue-950 mt-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-red-500 h-full rounded-full shadow-[0_0_8px_#ef4444]" style={{ width: '94%' }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Substation battery banks full. Public charging hubs open overnight for civilian radios & lights.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-950 flex justify-between items-center font-mono text-[11px]">
              <span className="text-slate-400">Output: 4.8 MW</span>
              <span className="text-red-400 font-bold">+18% Surplus</span>
            </div>
          </div>

          {/* Widget 3: Shortwave Civic Radio */}
          <div className="bg-[#050b1e] p-5 rounded-2xl border border-blue-900/60 hover:border-blue-500 transition-all flex flex-col justify-between shadow-lg shadow-black">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-blue-400 text-[28px]">radio</span>
                <span className="font-mono text-[10px] text-blue-300 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded font-bold uppercase">
                  LIVE BROADCAST
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 uppercase font-semibold">
                Amateur Radio Emergency Service
              </div>
              <div className="font-mono text-2xl font-bold text-white tracking-tight mt-1">
                VU2-NET · 142.800
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Hourly monsoon/weather bulletins, rollcall checks, and acoustic music broadcast over civic repeaters.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-950 flex justify-between items-center font-mono text-[11px]">
              <span className="text-slate-400">Repeater: CH 12</span>
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenRadio();
                }}
                className="text-blue-400 hover:text-blue-300 font-bold hover:underline font-mono"
              >
                Listen Online →
              </button>
            </div>
          </div>

          {/* Widget 4: Survival Buddy Finder */}
          <div className="bg-[#050b1e] p-5 rounded-2xl border border-blue-900/60 hover:border-blue-500 transition-all flex flex-col justify-between shadow-lg shadow-black">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-blue-400 text-[28px]">group_add</span>
                <span className="font-mono text-[10px] text-blue-300 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded font-bold uppercase">
                  34 LOOKING
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 uppercase font-semibold">
                Mutual Aid Accompaniment
              </div>
              <div className="text-lg font-bold text-white mt-1">
                Never Travel Alone
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Pair up with trained civilian scouts for medicine collection runs or night walks to bunkers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-950">
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenBuddyFinder();
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button text-center shadow-md shadow-blue-950"
              >
                Match With A Neighbor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
