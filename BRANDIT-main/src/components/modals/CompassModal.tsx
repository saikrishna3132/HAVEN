import React, { useState, useEffect } from 'react';
import { playTactileClick } from '../../utils/audioSynth';

interface CompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName?: string;
  destinationEta?: string;
}

export const CompassModal: React.FC<CompassModalProps> = ({
  isOpen,
  onClose,
  destinationName = 'Jaigarh Fort Subterranean Eco-Vault #01',
  destinationEta = '11 min (0.8 km)'
}) => {
  const [heading, setHeading] = useState(38);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setHeading((prev) => 35 + Math.floor(Math.random() * 8));
    }, 1800);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    { title: 'Statue Circle Solar Canopy Path', dist: '280m', radiation: '0.04 µSv/h (Zero Risk)', icon: 'light_mode', status: 'In Progress' },
    { title: 'JLN Marg Protected Aravalli Trail', dist: '390m', radiation: '0.05 µSv/h (Zero Risk)', icon: 'water', status: 'Next' },
    { title: 'Jaigarh Granite Intake Gate Ramp', dist: '130m', radiation: '0.04 µSv/h (Zero Risk)', icon: 'door_front', status: 'Final' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className={`w-full max-w-lg rounded-3xl p-6 border transition-all duration-300 shadow-2xl ${
        flashlightOn
          ? 'bg-[#0f0407] text-red-100 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]'
          : 'bg-[#050b1e] text-slate-100 border-blue-900/80 shadow-black'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
            <span className="font-mono text-xs text-blue-400 uppercase tracking-wider font-semibold">
              TACTICAL COMPASS HUD · ZERO HAZARD PATH
            </span>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-[#09122c] border border-blue-900 flex items-center justify-center hover:border-blue-500 text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Main Compass HUD */}
        <div className="py-6 flex flex-col items-center">
          <div className="relative w-52 h-52 rounded-full border-2 border-blue-500/50 bg-[#020512] flex items-center justify-center shadow-2xl shadow-black">
            {/* North Indicator */}
            <div className="absolute top-2 font-mono text-xs font-bold text-red-500">N</div>
            <div className="absolute right-3 font-mono text-xs font-bold text-slate-600">E</div>
            <div className="absolute bottom-2 font-mono text-xs font-bold text-slate-600">S</div>
            <div className="absolute left-3 font-mono text-xs font-bold text-slate-600">W</div>

            {/* Range Rings */}
            <div className="w-36 h-36 rounded-full border border-dashed border-blue-950 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-blue-500/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-400 text-[24px]">explore</span>
              </div>
            </div>

            {/* Compass Needle (Red North, Blue South) */}
            <div
              className="absolute w-2 h-44 transition-transform duration-700 ease-out flex flex-col justify-between items-center pointer-events-none"
              style={{ transform: `rotate(${heading}deg)` }}
            >
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[24px] border-b-red-500 shadow-[0_0_10px_#ef4444]"></div>
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[24px] border-t-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="font-mono text-3xl font-black text-blue-400 tracking-tight">
              0{heading}° NNE
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Target: <strong className="text-white">{destinationName}</strong>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-blue-950/80 text-blue-300 border border-blue-700/80 px-3 py-1 rounded-full text-xs font-mono mt-2 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-blue-400">navigation</span>
              Safe Corridor Verified • ETA: {destinationEta}
            </div>
          </div>
        </div>

        {/* Step-by-Step Waypoints */}
        <div className="bg-[#020617] rounded-2xl p-3.5 mb-4 border border-blue-950">
          <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-2">
            Automated Waypoint Tracker ({steps.length} Checkpoints)
          </span>
          <div className="space-y-2">
            {steps.map((st, i) => (
              <div
                key={i}
                onClick={() => {
                  playTactileClick();
                  setCurrentStep(i);
                }}
                className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                  currentStep === i
                    ? 'bg-blue-950/80 text-blue-200 border-blue-500 shadow-md font-bold'
                    : 'bg-[#060b1e] text-slate-400 border-blue-950/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${currentStep === i ? 'bg-blue-400' : 'bg-slate-700'}`}></span>
                  <span>{st.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-500">{st.dist}</span>
                  <span className={currentStep === i ? 'text-blue-400' : 'text-slate-600'}>
                    {st.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Deck */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playTactileClick();
              setFlashlightOn(!flashlightOn);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono uppercase font-bold transition-all border flex items-center justify-center gap-1.5 ${
              flashlightOn
                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-[#080f28] border-blue-900 text-blue-300 hover:border-blue-500'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {flashlightOn ? 'highlight' : 'flash_on'}
            </span>
            <span>{flashlightOn ? 'High-Red Beacon ON' : 'Red Night Beacon'}</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button text-center shadow-lg shadow-blue-950"
          >
            Exit Compass HUD
          </button>
        </div>
      </div>
    </div>
  );
};
