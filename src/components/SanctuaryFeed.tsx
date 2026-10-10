import React, { useState } from 'react';
import { Haven } from '../data/havenData';
import { SeismicZone } from '../data/earthquakeScanData';
import { playTactileClick } from '../utils/audioSynth';

interface SanctuaryFeedProps {
  havens: Haven[];
  selectedHaven: Haven | null;
  onSelectHaven: (haven: Haven) => void;
  onReserveBed: (haven: Haven) => void;
  onTuneRadio: (channel: string) => void;
  onDispatchAmbulance: (haven: Haven) => void;
  onCallDirect: (haven: Haven) => void;
  onRequestEscort: (haven: Haven) => void;
  onJoinMeal: (haven: Haven) => void;
  isEarthquakeScannerActive?: boolean;
  seismicZones?: SeismicZone[];
  onSelectSeismicZone?: (zone: SeismicZone) => void;
  onOpenEarthquakeScannerSettings?: () => void;
  onOpenFamilyShield?: () => void;
  isFamilyFilterActive?: boolean;
  onToggleFamilyFilter?: () => void;
}

export const SanctuaryFeed: React.FC<SanctuaryFeedProps> = ({
  havens,
  selectedHaven,
  onSelectHaven,
  onReserveBed,
  onTuneRadio,
  onDispatchAmbulance,
  onCallDirect,
  onRequestEscort,
  onJoinMeal,
  isEarthquakeScannerActive = false,
  seismicZones = [],
  onSelectSeismicZone,
  onOpenEarthquakeScannerSettings,
  onOpenFamilyShield,
  isFamilyFilterActive = false,
  onToggleFamilyFilter
}) => {
  const [feedMode, setFeedMode] = useState<'havens' | 'earthquake' | 'family'>(
    isEarthquakeScannerActive ? 'earthquake' : isFamilyFilterActive ? 'family' : 'havens'
  );
  const [seismicFilter, setSeismicFilter] = useState<'all' | 'red' | 'green'>('all');

  // Sync feed mode when scanner is toggled from outside
  React.useEffect(() => {
    if (isEarthquakeScannerActive) {
      setFeedMode('earthquake');
    }
  }, [isEarthquakeScannerActive]);

  React.useEffect(() => {
    if (isFamilyFilterActive) {
      setFeedMode('family');
    }
  }, [isFamilyFilterActive]);

  const redZones = seismicZones.filter((z) => z.type === 'danger_weak_tall');
  const greenZones = seismicZones.filter((z) => z.type === 'safe_residence');
  const familyHavens = havens.filter((h) => h.childFriendly);

  const filteredSeismicZones = seismicZones.filter((z) => {
    if (seismicFilter === 'red') return z.type === 'danger_weak_tall';
    if (seismicFilter === 'green') return z.type === 'safe_residence';
    return true;
  });

  const displayedHavens = feedMode === 'family' ? familyHavens : havens;

  return (
    <div className="flex flex-col gap-3.5 text-slate-100 max-h-[580px] lg:max-h-[620px] overflow-y-auto pr-1">
      {/* Feed Mode Switcher Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-blue-900/50 flex-wrap gap-2 sticky top-0 bg-[#020617]/95 backdrop-blur-md z-20 pt-1">
        <div className="flex items-center gap-1.5 bg-[#03081e] p-1 rounded-2xl border border-blue-950 flex-wrap">
          <button
            onClick={() => {
              playTactileClick();
              setFeedMode('havens');
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              feedMode === 'havens'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">night_shelter</span>
            <span>All Sanctuaries ({havens.length})</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setFeedMode('earthquake');
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              feedMode === 'earthquake'
                ? 'bg-red-950 text-red-200 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
                : 'text-slate-400 hover:text-red-400'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-red-400">earthquake</span>
            <span>Quake Scanner ({seismicZones.length})</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setFeedMode('family');
              if (onToggleFamilyFilter && !isFamilyFilterActive) {
                onToggleFamilyFilter();
              }
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              feedMode === 'family'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-400">escalator_warning</span>
            <span>Family & Kids ({familyHavens.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {feedMode === 'family' && onOpenFamilyShield && (
            <button
              onClick={() => {
                playTactileClick();
                onOpenFamilyShield();
              }}
              className="p-1.5 bg-[#031c12] border border-emerald-800 hover:border-emerald-500 text-emerald-300 rounded-xl font-mono text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md"
              title="Open Family & Child Protection Shield"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">shield</span>
              <span className="hidden sm:inline">Child Shield</span>
            </button>
          )}

          {feedMode === 'earthquake' && onOpenEarthquakeScannerSettings && (
            <button
              onClick={() => {
                playTactileClick();
                onOpenEarthquakeScannerSettings();
              }}
              className="p-1.5 bg-[#0a1128] border border-red-900/80 hover:border-red-500 text-red-300 rounded-xl font-mono text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md"
              title="Configure Earthquake Scanner Settings"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span className="hidden sm:inline">Settings</span>
            </button>
          )}
        </div>
      </div>

      {/* FEED MODE: EARTHQUAKE SCANNER (RED WEAK BUILDINGS VS GREEN SAFE RESIDENCES) */}
      {feedMode === 'earthquake' ? (
        <div className="space-y-3">
          {/* Diagnostic Legend & Category Filter Tabs */}
          <div className="bg-[#04081c] p-3 rounded-2xl border border-red-950 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[11px] font-mono">
              <span className="text-red-400 font-bold">🔴 RED AREA:</span> Weak & Big Hazards •{' '}
              <span className="text-emerald-400 font-bold">🟢 GREEN AREA:</span> Safe Residences
            </div>

            {/* Sub-filter tabs */}
            <div className="bg-[#020512] p-0.5 rounded-xl border border-blue-950 flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => {
                  playTactileClick();
                  setSeismicFilter('all');
                }}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] cursor-pointer ${
                  seismicFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({seismicZones.length})
              </button>
              <button
                onClick={() => {
                  playTactileClick();
                  setSeismicFilter('red');
                }}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] cursor-pointer ${
                  seismicFilter === 'red'
                    ? 'bg-red-600 text-white'
                    : 'text-red-400 hover:text-red-200'
                }`}
              >
                🔴 Red ({redZones.length})
              </button>
              <button
                onClick={() => {
                  playTactileClick();
                  setSeismicFilter('green');
                }}
                className={`px-2 py-0.5 rounded-lg font-bold text-[11px] cursor-pointer ${
                  seismicFilter === 'green'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-400 hover:text-emerald-200'
                }`}
              >
                🟢 Green ({greenZones.length})
              </button>
            </div>
          </div>

          {filteredSeismicZones.length === 0 ? (
            <div className="p-8 text-center bg-[#050b1e] rounded-2xl border border-blue-900/60">
              <span className="material-symbols-outlined text-slate-600 text-[32px] block mb-2">
                domain_disabled
              </span>
              <p className="font-semibold text-slate-300 text-sm">No seismic structures match filter.</p>
            </div>
          ) : (
            filteredSeismicZones.map((zone) => {
              const isDanger = zone.type === 'danger_weak_tall';
              return (
                <div
                  key={zone.id}
                  onClick={() => {
                    playTactileClick();
                    if (onSelectSeismicZone) {
                      onSelectSeismicZone(zone);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative shadow-lg ${
                    isDanger
                      ? 'bg-[#0e0205] border-red-900/80 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : 'bg-[#02110a] border-emerald-900/80 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  }`}
                >
                  {/* Top Bar with Status Badge */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isDanger ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                          }`}
                        ></span>
                        <span
                          className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
                            isDanger ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {isDanger
                            ? 'RED AREA · WEAK & BIG (DO NOT RESIDE)'
                            : 'GREEN AREA · CERTIFIED SAFE RESIDENCE'}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                        {zone.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{zone.address}</p>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span
                        className={`font-mono text-sm font-bold block ${
                          isDanger ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {isDanger ? `${zone.collapseRiskPercent}% BREAK RISK` : 'SAFE TO RESIDE'}
                      </span>
                      <span className="block font-mono text-[11px] text-slate-500">
                        {zone.distance || 'Nearby'}
                      </span>
                    </div>
                  </div>

                  {/* Structural Spec Banner */}
                  <div
                    className={`p-2.5 rounded-xl border my-2.5 font-mono text-xs flex flex-wrap items-center justify-between gap-2 ${
                      isDanger
                        ? 'bg-red-950/40 border-red-900/70 text-red-200'
                        : 'bg-emerald-950/40 border-emerald-900/70 text-emerald-200'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        Structure Height & Scale:
                      </span>
                      <strong>{zone.structureHeight}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        {isDanger ? 'Debris Hazard Fall Buffer:' : 'Resident Capacity:'}
                      </span>
                      <strong>
                        {isDanger ? `${zone.dangerRadiusMeters}m Buffer` : `${zone.capacity || 500} People`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Richter Limit:</span>
                      <strong>{zone.richterTolerance.split('(')[0]}</strong>
                    </div>
                  </div>

                  {/* Advice text */}
                  <p className="text-xs text-slate-300 font-mono leading-relaxed mb-3">
                    {zone.residentsAdvice}
                  </p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileClick();
                        if (onSelectSeismicZone) {
                          onSelectSeismicZone(zone);
                        }
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono uppercase font-bold tactile-button text-center shadow-md cursor-pointer ${
                        isDanger
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                      }`}
                    >
                      {isDanger ? 'Inspect Weak Structure' : 'Inspect Safe Haven / Reside'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* STANDARD SANCTUARIES & FAMILY FEED */
        <div className="space-y-3">
          {/* Family Mode Explanatory Banner if in Family Mode */}
          {feedMode === 'family' && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-950/60 to-blue-950/60 border border-emerald-500/60 rounded-2xl flex items-center justify-between gap-3 text-xs font-mono shadow-lg">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">child_care</span>
                </span>
                <div>
                  <div className="font-bold text-emerald-200">
                    FAMILY & CHILDREN PRIORITY FEED ACTIVE
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Filtered to shelters offering pediatric doctors, infant milk formula, and family dorms.
                  </div>
                </div>
              </div>

              {onOpenFamilyShield && (
                <button
                  onClick={() => {
                    playTactileClick();
                    onOpenFamilyShield();
                  }}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold shrink-0 cursor-pointer shadow-md"
                >
                  Family Shield →
                </button>
              )}
            </div>
          )}

          {displayedHavens.length === 0 ? (
            <div className="p-8 text-center bg-[#050b1e] rounded-2xl border border-blue-900/60">
              <span className="material-symbols-outlined text-slate-600 text-[32px] block mb-2">
                search_off
              </span>
              <p className="font-semibold text-slate-300 text-sm">No safe havens match current criteria.</p>
              <p className="text-xs text-slate-500 mt-1">Try expanding search radius or toggling off filters.</p>
            </div>
          ) : (
            displayedHavens.map((h) => {
              const isSelected = selectedHaven?.id === h.id;
              const isEmergency = h.category === 'hospital' || h.category === 'fire';

              return (
                <div
                  key={h.id}
                  onClick={() => onSelectHaven(h)}
                  className={`bg-[#050b1e] p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? isEmergency
                        ? 'border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.25)] ring-1 ring-red-500'
                        : 'border-blue-500 shadow-[0_0_24px_rgba(37,99,235,0.25)] ring-1 ring-blue-500'
                      : 'border-blue-950 hover:border-blue-900 hover:bg-[#070e28]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`w-1.5 h-1.5 rounded-full ${isEmergency ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                        <span className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${isEmergency ? 'text-red-400' : 'text-blue-400'}`}>
                          {h.categoryLabel}
                        </span>
                        {h.childFriendly && (
                          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                            👶 Family Safe
                          </span>
                        )}
                        <span className="text-slate-600 text-[11px]">·</span>
                        <span className="font-mono text-[11px] text-slate-400">{h.sector.split(' ')[0]}</span>
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight leading-snug">
                        {h.name}
                      </h4>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className={`font-mono text-sm font-bold ${isEmergency ? 'text-red-400' : 'text-blue-400'}`}>
                        {h.eta}
                      </span>
                      <span className="block font-mono text-[11px] text-slate-500">{h.distance}</span>
                    </div>
                  </div>

                  {/* Family & Child Care Highlights */}
                  {h.childFriendly && (
                    <div className="mb-2.5 p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-emerald-400">child_care</span>
                        {h.pediatricCare ? 'Pediatric Emergency Wing' : h.babySupplies ? 'Infant Nutrition & Cribs' : 'Private Family Dorms'}
                      </span>
                      <span className="text-emerald-400 text-[11px] font-bold">
                        {h.childSafetyTags ? h.childSafetyTags[0] : 'Child Protection'}
                      </span>
                    </div>
                  )}

                  {/* Occupancy or Triage Indicator */}
                  {h.occupancyPercent !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between font-mono text-[11px] mb-1">
                        <span className="text-slate-400">
                          Occupancy: <strong className="text-slate-200">{h.occupancyPercent}%</strong>
                        </span>
                        <span className="text-blue-400 font-semibold">{h.openBeds} Beds Open</span>
                      </div>
                      <div className="w-full bg-[#020512] rounded-full h-1.5 overflow-hidden border border-blue-950">
                        <div
                          className="bg-blue-500 h-full rounded-full shadow-[0_0_6px_#3b82f6]"
                          style={{ width: `${h.occupancyPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {h.triageWait && (
                    <div className="mb-3 bg-red-950/50 border border-red-800/60 px-3 py-1.5 rounded-xl flex items-center justify-between font-mono text-xs">
                      <span className="text-red-300 font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-red-400">bolt</span>
                        Triage: {h.triageWait}
                      </span>
                      <span className="text-slate-400">{h.doctorsCount} Doctors On Duty</span>
                    </div>
                  )}

                  {/* Description */}
                  {h.description && (
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {h.description}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {h.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="font-mono text-[10px] bg-[#020512] text-slate-400 px-2 py-0.5 rounded border border-blue-950"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-blue-950/70">
                    {isEmergency ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTactileClick();
                            onDispatchAmbulance(h);
                          }}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button text-center transition-all shadow-md shadow-red-950 cursor-pointer"
                        >
                          Dispatch Ambulance
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTactileClick();
                            onTuneRadio(h.radioChannel);
                          }}
                          className="px-3 py-2 bg-[#080f24] border border-blue-900/70 hover:border-blue-500 rounded-xl text-xs font-mono text-blue-300 hover:text-white cursor-pointer"
                        >
                          Radio Net
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTactileClick();
                            onReserveBed(h);
                          }}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button text-center transition-all shadow-md shadow-blue-950 cursor-pointer"
                        >
                          Reserve Bed / Access
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTactileClick();
                            onTuneRadio(h.radioChannel);
                          }}
                          className="px-3 py-2 bg-[#080f24] border border-blue-900/70 hover:border-blue-500 rounded-xl text-xs font-mono text-blue-300 hover:text-white cursor-pointer"
                        >
                          Radio: {h.radioChannel.split(' ')[1] || 'CH 12'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
