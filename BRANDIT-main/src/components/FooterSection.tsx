import React from 'react';
import { playTactileClick } from '../utils/audioSynth';

interface FooterSectionProps {
  onOpenGuides: (guide: 'map' | 'solar' | 'mesh') => void;
  onOpenEmergencyCall: () => void;
  isSunlightMode: boolean;
  onToggleSunlightMode: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onOpenGuides,
  onOpenEmergencyCall,
  isSunlightMode,
  onToggleSunlightMode
}) => {
  return (
    <footer className="bg-[#02040d] text-slate-400 pt-12 pb-16 px-4 md:px-8 border-t border-blue-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-xs">
        {/* Brand & Offline Mesh Note */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-950">
              <span className="material-symbols-outlined text-[18px]">shield</span>
            </div>
            <span className="text-base font-bold text-white">
              HavenPulse
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed mb-4">
            Decentralized civilian defense grid built for cooperative resilience, solar micro-networks, and public safety across India.
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-blue-400">
            <span className="material-symbols-outlined text-[16px]">wifi_tethering</span>
            LoRaWAN 865-867 MHz (India ISM Band)
          </div>
        </div>

        {/* Emergency Hotlines */}
        <div>
          <h4 className="font-mono text-xs text-white uppercase font-bold tracking-wider mb-3">
            24/7 Distress Channels
          </h4>
          <ul className="space-y-2">
            <li
              onClick={() => {
                playTactileClick();
                onOpenEmergencyCall();
              }}
              className="flex items-center gap-2 cursor-pointer hover:text-white"
            >
              <span className="material-symbols-outlined text-red-500 text-[16px]">e911_emergency</span>
              <span>
                National Emergency: <strong className="text-white">Dial 112</strong>
              </span>
            </li>
            <li
              onClick={() => {
                playTactileClick();
                onOpenEmergencyCall();
              }}
              className="flex items-center gap-2 cursor-pointer hover:text-white"
            >
              <span className="material-symbols-outlined text-red-400 text-[16px]">health_and_safety</span>
              <span>
                Free Ambulance: <strong className="text-white">108 / 102</strong>
              </span>
            </li>
            <li
              onClick={() => {
                playTactileClick();
                onOpenEmergencyCall();
              }}
              className="flex items-center gap-2 cursor-pointer hover:text-white"
            >
              <span className="material-symbols-outlined text-red-500 text-[16px]">local_fire_department</span>
              <span>
                Fire & Rescue: <strong className="text-white">101</strong>
              </span>
            </li>
            <li
              onClick={() => {
                playTactileClick();
                onOpenEmergencyCall();
              }}
              className="flex items-center gap-2 cursor-pointer hover:text-white"
            >
              <span className="material-symbols-outlined text-blue-400 text-[16px]">radio</span>
              <span>
                VU2 Ham Radio Net: <strong className="text-white">142.800 MHz</strong>
              </span>
            </li>
          </ul>
        </div>

        {/* Offline Resources */}
        <div>
          <h4 className="font-mono text-xs text-white uppercase font-bold tracking-wider mb-3">
            Offline Preparedness
          </h4>
          <ul className="space-y-2 font-mono text-xs">
            <li>
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenGuides('map');
                }}
                className="hover:text-blue-400 flex items-center gap-1.5 transition-colors"
              >
                <span>🗺️</span>
                <span>Download Vector Sector Map (PDF)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenGuides('solar');
                }}
                className="hover:text-blue-400 flex items-center gap-1.5 transition-colors"
              >
                <span>☀️</span>
                <span>PM-Surya Solar Islanding Guide</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenGuides('mesh');
                }}
                className="hover:text-blue-400 flex items-center gap-1.5 transition-colors"
              >
                <span>📻</span>
                <span>ESP32 LoRa 865 MHz Setup Manual</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Hardware & Diagnostics */}
        <div>
          <h4 className="font-mono text-xs text-white uppercase font-bold tracking-wider mb-3">
            Node Diagnostics
          </h4>
          <div className="bg-[#04081c] p-3 rounded-xl border border-blue-950 font-mono text-[11px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Node ID:</span>
              <span className="text-blue-400 font-bold">IN-JPR-09</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mesh Health:</span>
              <span className="text-blue-400">99.8% Synchronized</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Threat Level:</span>
              <span className="text-blue-400 font-bold">NORMAL (GREEN)</span>
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={() => {
                playTactileClick();
                onToggleSunlightMode();
              }}
              className={`w-full py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all ${
                isSunlightMode
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                  : 'bg-[#04081c] text-slate-300 border-blue-950 hover:border-blue-700'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSunlightMode ? 'contrast' : 'lightbulb'}
              </span>
              <span>{isSunlightMode ? 'High-Contrast Active' : 'High-Contrast Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-blue-950/60 flex flex-wrap justify-between items-center gap-4 text-[11px] font-mono text-slate-500">
        <div>
          © 2026 HavenPulse Civic Defense Mesh · India Sector Network.
        </div>
        <div className="flex items-center gap-4">
          <span className="text-blue-400">AES-256 LoRa P2P</span>
          <span>·</span>
          <span className="text-red-400">NDMA Standard 112</span>
          <span>·</span>
          <span>Zero User Tracking</span>
        </div>
      </div>
    </footer>
  );
};
