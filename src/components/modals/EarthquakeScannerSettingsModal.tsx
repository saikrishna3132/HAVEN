import React, { useState } from 'react';
import { SeismicZone } from '../../data/earthquakeScanData';
import { playTactileClick, playSeismicAlarmTone, playSeismicRumble } from '../../utils/audioSynth';

interface EarthquakeScannerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
  onToggleActive: () => void;
  seismicZones: SeismicZone[];
  onSelectZone: (zone: SeismicZone) => void;
  onSimulateTremor: () => void;
  isSimulating: boolean;
}

export const EarthquakeScannerSettingsModal: React.FC<EarthquakeScannerSettingsModalProps> = ({
  isOpen,
  onClose,
  isActive,
  onToggleActive,
  seismicZones,
  onSelectZone,
  onSimulateTremor,
  isSimulating
}) => {
  const [filterType, setFilterType] = useState<'all' | 'red' | 'green'>('all');
  const [richterMagnitude, setRichterMagnitude] = useState<number>(6.5);
  const [alarmToneEnabled, setAlarmToneEnabled] = useState<boolean>(true);
  const [minCollapseThreshold, setMinCollapseThreshold] = useState<number>(75);

  if (!isOpen) return null;

  const redZones = seismicZones.filter((z) => z.type === 'danger_weak_tall');
  const greenZones = seismicZones.filter((z) => z.type === 'safe_residence');

  const filteredZones = seismicZones.filter((z) => {
    if (filterType === 'red') return z.type === 'danger_weak_tall';
    if (filterType === 'green') return z.type === 'safe_residence';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#030617] rounded-3xl p-5 sm:p-6 border border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.25)] my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-blue-950 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg ${
              isActive
                ? 'bg-red-950 border-red-500 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-[#060c24] border-blue-800 text-blue-400'
            }`}>
              <span className="material-symbols-outlined text-[22px]">earthquake</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Earthquake Scanner Settings
                </h3>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${
                  isActive
                    ? 'bg-red-950 text-red-300 border-red-500'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}>
                  {isActive ? 'SCANNER ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                Structural vulnerability mesh • Red Area (Weak/Big Buildings) vs Green Area (Safe Residences)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-[#081026] border border-blue-900 flex items-center justify-center hover:border-red-500 text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto space-y-5 pr-1 py-4 flex-1">
          {/* Main Master Switch Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isActive
              ? 'bg-gradient-to-r from-red-950/40 via-[#0a0518] to-emerald-950/40 border-red-500/70 shadow-lg'
              : 'bg-[#050b1f] border-blue-900/60'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-red-500 animate-ping' : 'bg-slate-500'}`}></span>
                  Earthquake Scanner Mode
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Scans nearby buildings in real-time. Highlights big, weak buildings with high collapse chances in{' '}
                  <strong className="text-red-400 font-bold">RED AREA</strong>, and certified safe grounds where people can reside in{' '}
                  <strong className="text-emerald-400 font-bold">GREEN AREA</strong>.
                </p>
              </div>

              {/* Big Toggle Switch Button */}
              <button
                onClick={() => {
                  playTactileClick();
                  onToggleActive();
                }}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all shrink-0 tactile-button shadow-md ${
                  isActive
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950'
                }`}
              >
                {isActive ? 'Turn OFF' : 'Turn ON'}
              </button>
            </div>
          </div>

          {/* Red Area vs Green Area Diagnostic Comparison Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {/* Red Area Info Card */}
            <div className="bg-[#120306] p-3.5 rounded-2xl border-2 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-red-400 text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">domain_disabled</span>
                  RED AREA (HAZARDS)
                </span>
                <span className="bg-red-950 text-red-300 border border-red-700 px-2 py-0.5 rounded text-[10px] font-bold">
                  {redZones.length} Buildings
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                Nearby buildings that are <strong className="text-red-300">very weak and big</strong> (aging non-ductile concrete, soft stories, corroded rebar, cantilever balconies) with <strong className="text-red-400">very high chances of breaking</strong>.
              </p>
              <div className="bg-[#1e050a] p-2 rounded-xl border border-red-900/80 text-[10px] text-red-300 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-red-400 shrink-0">cancel</span>
                <span>PEOPLE CANNOT RESIDE HERE · CLEAR 80M PERIMETER</span>
              </div>
            </div>

            {/* Green Area Info Card */}
            <div className="bg-[#02140d] p-3.5 rounded-2xl border-2 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400 text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">night_shelter</span>
                  GREEN AREA (SAFE RESIDENCES)
                </span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                  {greenZones.length} Havens
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                Engineered structures & open fields where <strong className="text-emerald-300">people can safely reside</strong> (base-isolated hospitals, deep bedrock vaults, zero-overhead botanical clearings).
              </p>
              <div className="bg-[#032216] p-2 rounded-xl border border-emerald-900/80 text-[10px] text-emerald-300 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-400 shrink-0">check_circle</span>
                <span>PEOPLE CAN SAFELY RESIDE HERE · EMERGENCY LIFE SUPPORT</span>
              </div>
            </div>
          </div>

          {/* Scanner Parameters Configuration Controls */}
          <div className="bg-[#04081c] p-4 rounded-2xl border border-blue-900/60 space-y-4">
            <span className="font-mono text-xs text-blue-400 uppercase font-bold tracking-wider block">
              Scanner Sensitivity & Simulation Parameters
            </span>

            {/* Richter Scale Sensitivity */}
            <div>
              <div className="flex justify-between items-center font-mono text-xs mb-1.5">
                <span className="text-slate-300">Simulated Richter Magnitude:</span>
                <span className="text-red-400 font-bold text-sm">{richterMagnitude.toFixed(1)} Richter</span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                {[
                  { mag: 5.0, label: '5.0M (Moderate)' },
                  { mag: 6.5, label: '6.5M (Major)' },
                  { mag: 7.5, label: '7.5M (Severe)' },
                  { mag: 9.0, label: '9.0M (Extreme)' }
                ].map((item) => (
                  <button
                    key={item.mag}
                    onClick={() => {
                      playTactileClick();
                      setRichterMagnitude(item.mag);
                    }}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all ${
                      richterMagnitude === item.mag
                        ? 'bg-red-600 text-white border-red-400 shadow-md'
                        : 'bg-[#020512] text-slate-400 border-blue-950 hover:border-blue-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Collapse Risk Threshold */}
            <div>
              <div className="flex justify-between items-center font-mono text-xs mb-1">
                <span className="text-slate-300">Red Area Collapse Trigger Cutoff:</span>
                <span className="text-red-400 font-bold">&gt; {minCollapseThreshold}% Breaking Risk</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={minCollapseThreshold}
                onChange={(e) => setMinCollapseThreshold(parseInt(e.target.value))}
                className="w-full accent-red-500 h-1.5 bg-[#0b1428] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-slate-500 mt-1">
                <span>50% (Strict High Risk)</span>
                <span>75% (Critical Collapse)</span>
                <span>90% (Imminent Toppling)</span>
              </div>
            </div>

            {/* Audio Alarm Tone Setting */}
            <div className="flex items-center justify-between pt-2 border-t border-blue-950">
              <div>
                <span className="font-mono text-xs font-bold text-slate-200 block">
                  Seismic Proximity Alarm Audio
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Synthesize alarm chimes when entering weak building collapse buffers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playSeismicAlarmTone();
                  }}
                  className="px-2 py-1 bg-[#09122c] border border-blue-900 rounded-lg font-mono text-[10px] text-blue-300 hover:border-blue-500"
                >
                  Test Siren
                </button>
                <button
                  onClick={() => {
                    playTactileClick();
                    setAlarmToneEnabled(!alarmToneEnabled);
                  }}
                  className={`px-3 py-1 rounded-xl font-mono text-xs font-bold border transition-all ${
                    alarmToneEnabled
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-[#020512] text-slate-500 border-blue-950'
                  }`}
                >
                  {alarmToneEnabled ? 'ENABLED' : 'MUTED'}
                </button>
              </div>
            </div>
          </div>

          {/* Live Scanned Buildings Feed (Red & Green) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-blue-400 uppercase font-bold tracking-wider">
                Scanned Nearby Structures ({filteredZones.length})
              </span>

              {/* Filter tabs */}
              <div className="bg-[#020512] p-0.5 rounded-xl border border-blue-950 flex items-center gap-1 font-mono text-[11px]">
                <button
                  onClick={() => {
                    playTactileClick();
                    setFilterType('all');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    filterType === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({seismicZones.length})
                </button>
                <button
                  onClick={() => {
                    playTactileClick();
                    setFilterType('red');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    filterType === 'red' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-200'
                  }`}
                >
                  🔴 Red ({redZones.length})
                </button>
                <button
                  onClick={() => {
                    playTactileClick();
                    setFilterType('green');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    filterType === 'green' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-emerald-200'
                  }`}
                >
                  🟢 Green ({greenZones.length})
                </button>
              </div>
            </div>

            {/* List of Scanned Buildings */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredZones.map((zone) => {
                const isDanger = zone.type === 'danger_weak_tall';
                return (
                  <div
                    key={zone.id}
                    onClick={() => {
                      playTactileClick();
                      onSelectZone(zone);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isDanger
                        ? 'bg-[#120306] border-red-900/80 hover:border-red-500 hover:bg-[#1a050a]'
                        : 'bg-[#02130c] border-emerald-900/80 hover:border-emerald-500 hover:bg-[#031d13]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                          isDanger
                            ? 'bg-red-950 border-red-700 text-red-400'
                            : 'bg-emerald-950 border-emerald-700 text-emerald-400'
                        }`}>
                          <span className="material-symbols-outlined text-[18px]">
                            {isDanger ? 'domain_disabled' : 'night_shelter'}
                          </span>
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-[10px] uppercase font-bold ${
                              isDanger ? 'text-red-400' : 'text-emerald-400'
                            }`}>
                              {isDanger ? 'RED AREA · WEAK & BIG' : 'GREEN AREA · PEOPLE CAN RESIDE'}
                            </span>
                            <span className="text-slate-600 text-[10px]">·</span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {zone.distance || 'Nearby'}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                            {zone.name}
                          </h4>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`font-mono text-xs font-bold block ${
                          isDanger ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                          {isDanger ? `${zone.collapseRiskPercent}% BREAK RISK` : 'SAFE TO RESIDE'}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {isDanger ? zone.structureHeight.split('(')[0] : `${zone.capacity || 500} Cap.`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] font-mono text-slate-300 flex items-center justify-between border-t border-slate-900/80 pt-2">
                      <span className="line-clamp-1">{zone.buildingScale}</span>
                      <span className="text-blue-400 hover:underline flex items-center gap-1 shrink-0 font-bold">
                        Inspect Diagnostics →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3.5 border-t border-blue-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Tremor Simulation Button */}
          <button
            onClick={() => {
              playTactileClick();
              playSeismicRumble(4);
              onSimulateTremor();
              onClose();
            }}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 tactile-button ${
              isSimulating
                ? 'bg-red-600 text-white border-red-400 animate-pulse'
                : 'bg-[#180508] text-red-300 border-red-800 hover:border-red-500 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-red-400">earthquake</span>
            <span>Simulate 6.5M Quake Tremor</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTactileClick();
                onClose();
              }}
              className="px-4 py-2 bg-[#081026] border border-blue-900 hover:border-blue-500 rounded-xl font-mono text-xs text-slate-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                playTactileClick();
                if (!isActive) {
                  onToggleActive();
                }
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs font-bold tactile-button shadow-md shadow-blue-950"
            >
              Apply & View on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
