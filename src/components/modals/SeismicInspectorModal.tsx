import React from 'react';
import { SeismicZone } from '../../data/earthquakeScanData';
import { playTactileClick } from '../../utils/audioSynth';

interface SeismicInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: SeismicZone | null;
  onRouteToZone?: (zone: SeismicZone) => void;
}

export const SeismicInspectorModal: React.FC<SeismicInspectorModalProps> = ({
  isOpen,
  onClose,
  zone,
  onRouteToZone
}) => {
  if (!isOpen || !zone) return null;

  const isDanger = zone.type === 'danger_weak_tall';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div
        className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 border shadow-2xl transition-all ${
          isDanger
            ? 'bg-[#090204] border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.35)]'
            : 'bg-[#020b08] border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.35)]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-3.5 border-b ${isDanger ? 'border-red-950' : 'border-emerald-950'}`}>
          <div className="flex items-center gap-2.5">
            <span
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-md ${
                isDanger
                  ? 'bg-red-950 border-red-500 text-red-400 animate-pulse'
                  : 'bg-emerald-950 border-emerald-500 text-emerald-400'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isDanger ? 'warning' : 'verified_user'}
              </span>
            </span>
            <div>
              <span
                className={`font-mono text-[10px] uppercase font-bold tracking-wider ${
                  isDanger ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {isDanger ? 'RED AREA · WEAK & TALL COLLAPSE HAZARD' : 'GREEN AREA · CERTIFIED SAFE RESIDENCE'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {zone.name}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
              isDanger
                ? 'bg-[#180508] border-red-900 hover:border-red-500 text-slate-300'
                : 'bg-[#03150e] border-emerald-900 hover:border-emerald-500 text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Status Callout Banner */}
        <div
          className={`my-4 p-3.5 rounded-2xl border ${
            isDanger
              ? 'bg-red-950/40 border-red-800/80 text-red-100'
              : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-100'
          }`}
        >
          <div className="flex items-center justify-between font-mono text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isDanger ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
              {zone.statusLabel}
            </span>
            <span>
              {isDanger ? `Collapse Probability: ${zone.collapseRiskPercent}%` : `Seismic Security: 98%`}
            </span>
          </div>
          <div className={`mt-1 font-mono text-[11px] font-bold py-1 px-2 rounded-lg flex items-center gap-1.5 ${
            isDanger ? 'bg-red-950/80 text-red-300 border border-red-700/60' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
          }`}>
            <span className="material-symbols-outlined text-[15px]">
              {isDanger ? 'report_problem' : 'verified'}
            </span>
            <span>
              {isDanger
                ? `RED AREA · VERY WEAK & BIG STRUCTURE · ${zone.breakingChance || 'VERY HIGH'} CHANCE OF BREAKING`
                : 'GREEN AREA · CERTIFIED RESIDENTIAL HAVEN · PEOPLE CAN RESIDE HERE'}
            </span>
          </div>
          <p className="text-xs leading-relaxed opacity-90 mt-2">
            {zone.residentsAdvice}
          </p>
        </div>

        {/* Structural Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 font-mono text-xs mb-4">
          <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950/80">
            <span className="text-[10px] text-slate-400 block uppercase">Building Height & Scale:</span>
            <strong className="text-white text-[12px] block leading-snug">{zone.structureHeight}</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">{zone.buildingScale}</span>
          </div>
          <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950/80">
            <span className="text-[10px] text-slate-400 block uppercase">Richter Limit:</span>
            <strong className={isDanger ? 'text-red-400 text-[13px]' : 'text-emerald-400 text-[13px]'}>
              {zone.richterTolerance}
            </strong>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {isDanger ? 'Breaking Risk: VERY HIGH' : 'Tremor Resistance: Grade A+'}
            </span>
          </div>
          <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950/80">
            <span className="text-[10px] text-slate-400 block uppercase">
              {isDanger ? 'Debris Hazard Buffer:' : 'Safe Shelter Buffer:'}
            </span>
            <strong className="text-white text-[13px]">{zone.dangerRadiusMeters} meters</strong>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {isDanger ? 'Blast Perimeter' : 'Clear Assembly Zone'}
            </span>
          </div>
          <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950/80">
            <span className="text-[10px] text-slate-400 block uppercase">
              {isDanger ? 'Resident Safety Status:' : 'Civilian Capacity:'}
            </span>
            <strong className={isDanger ? 'text-red-400 text-[12px]' : 'text-emerald-400 text-[13px]'}>
              {isDanger ? 'UNINHABITABLE (DO NOT RESIDE)' : `${zone.capacity || 500} People (CAN RESIDE)`}
            </strong>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {isDanger ? `Constructed in ${zone.yearBuilt}` : 'Solar Power & Clean Water'}
            </span>
          </div>
        </div>

        {/* Engineering Assessment Card */}
        <div className="bg-[#020512] p-3 rounded-2xl border border-blue-950/80 mb-4 text-xs">
          <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">
            Structural Engineering Diagnostics:
          </span>
          <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
            {zone.structuralType}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {zone.tags.map((tag, i) => (
              <span
                key={i}
                className={`font-mono text-[10px] px-2 py-0.5 rounded-lg border font-semibold ${
                  isDanger
                    ? 'bg-red-950/70 border-red-800 text-red-300'
                    : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Address and Distance */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-blue-950/80 mb-4">
          <span>{zone.address}</span>
          {zone.distance && (
            <span className="text-blue-400 font-bold">{zone.distance} ({zone.eta})</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2.5">
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="px-4 py-2 bg-[#09122c] border border-blue-900 hover:border-blue-500 rounded-xl font-mono text-xs text-slate-300"
          >
            Dismiss
          </button>

          {onRouteToZone && (
            <button
              onClick={() => {
                playTactileClick();
                onRouteToZone(zone);
                onClose();
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 tactile-button shadow-md ${
                isDanger
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isDanger ? 'alt_route' : 'directions_walk'}
              </span>
              {isDanger ? 'Plot Safe Bypass Route' : 'Navigate to Safe Haven'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
