import React from 'react';
import { Haven } from '../data/havenData';
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
  onJoinMeal
}) => {
  return (
    <div className="flex flex-col gap-3.5 text-slate-100">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-2 border-b border-blue-900/50">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500 text-[20px]">
            local_fire_department
          </span>
          Live Sanctuary Feed
        </h3>
        <span className="font-mono text-xs text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2.5 py-0.5 rounded-full font-semibold">
          {havens.length} Active Harbors
        </span>
      </div>

      {havens.length === 0 ? (
        <div className="p-8 text-center bg-[#050b1e] rounded-2xl border border-blue-900/60">
          <span className="material-symbols-outlined text-slate-600 text-[32px] block mb-2">
            search_off
          </span>
          <p className="font-semibold text-slate-300 text-sm">No safe havens match current criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try expanding search radius or toggling off layer filters.</p>
        </div>
      ) : (
        havens.map((h) => {
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isEmergency ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                    <span className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${isEmergency ? 'text-red-400' : 'text-blue-400'}`}>
                      {h.categoryLabel}
                    </span>
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

              {/* Features Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {h.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#030718] border border-blue-950 px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-blue-950">
                {h.category === 'hospital' ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileClick();
                        onDispatchAmbulance(h);
                      }}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button-red text-center transition-all shadow-md shadow-red-950"
                    >
                      Dispatch Ambulance
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileClick();
                        onCallDirect(h);
                      }}
                      className="px-3.5 py-2 bg-[#080f24] border border-red-900/60 hover:border-red-500 rounded-xl text-xs font-mono text-red-300 hover:text-white"
                    >
                      Call Desk
                    </button>
                  </>
                ) : h.category === 'fire' || h.category === 'peacekeeper' ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileClick();
                        onRequestEscort(h);
                      }}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button text-center transition-all shadow-md shadow-blue-950"
                    >
                      Request Walk Escort
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileClick();
                        onTuneRadio(h.radioChannel);
                      }}
                      className="px-3 py-2 bg-[#080f24] border border-blue-900/70 hover:border-blue-500 rounded-xl text-xs font-mono text-blue-300 hover:text-white"
                    >
                      Radio
                    </button>
                  </>
                ) : h.category === 'safehouse' ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileClick();
                        onJoinMeal(h);
                      }}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button text-center transition-all shadow-md shadow-blue-950"
                    >
                      Reserve Bed / Meal
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileClick();
                        onTuneRadio(h.radioChannel);
                      }}
                      className="px-3 py-2 bg-[#080f24] border border-blue-900/70 hover:border-blue-500 rounded-xl text-xs font-mono text-blue-300 hover:text-white"
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
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button text-center transition-all shadow-md shadow-blue-950"
                    >
                      Reserve Bed / Access
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileClick();
                        onTuneRadio(h.radioChannel);
                      }}
                      className="px-3 py-2 bg-[#080f24] border border-blue-900/70 hover:border-blue-500 rounded-xl text-xs font-mono text-blue-300 hover:text-white"
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
  );
};
