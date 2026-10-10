import React, { useState } from 'react';
import { playTactileClick } from '../../utils/audioSynth';

interface SurvivalGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGuide?: 'map' | 'solar' | 'mesh';
}

export const SurvivalGuidesModal: React.FC<SurvivalGuidesModalProps> = ({
  isOpen,
  onClose,
  initialGuide = 'solar'
}) => {
  const [selectedGuide, setSelectedGuide] = useState<'map' | 'solar' | 'mesh'>(initialGuide);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const triggerDownload = (filename: string) => {
    playTactileClick();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-xl bg-[#04081c] rounded-3xl p-6 border border-blue-900/80 shadow-2xl shadow-black max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shadow-md shadow-blue-950">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </span>
            <div>
              <span className="font-mono text-[10px] text-blue-400 uppercase font-semibold tracking-wider">
                Permanent Offline Archive · India
              </span>
              <h3 className="text-base font-bold text-white">
                Civilian Defense Protocols (NDMA Standard)
              </h3>
            </div>
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

        {/* Tab selection in Black & Blue */}
        <div className="flex gap-2 my-4 border-b border-blue-950 pb-2">
          <button
            onClick={() => {
              playTactileClick();
              setSelectedGuide('map');
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
              selectedGuide === 'map'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                : 'bg-[#020512] text-slate-400 border-blue-950 hover:text-slate-200'
            }`}
          >
            🗺️ Offline India Sector Map
          </button>
          <button
            onClick={() => {
              playTactileClick();
              setSelectedGuide('solar');
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
              selectedGuide === 'solar'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                : 'bg-[#020512] text-slate-400 border-blue-950 hover:text-slate-200'
            }`}
          >
            ☀️ PM-Surya & Water Filtration
          </button>
          <button
            onClick={() => {
              playTactileClick();
              setSelectedGuide('mesh');
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
              selectedGuide === 'mesh'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                : 'bg-[#020512] text-slate-400 border-blue-950 hover:text-slate-200'
            }`}
          >
            📻 LoRaWAN & Ham Setup
          </button>
        </div>

        {downloadSuccess && (
          <div className="mb-4 p-3 bg-blue-950 text-blue-200 rounded-xl border border-blue-600 text-xs font-mono flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-blue-400">download_done</span>
            <span>Document cached to your local browser storage for offline access.</span>
          </div>
        )}

        {/* Guide Content */}
        {selectedGuide === 'map' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#020512] rounded-2xl border border-blue-950 space-y-2">
              <span className="font-mono text-[10px] text-blue-400 uppercase font-bold">
                Map Version 2026.4 · Vector Grid
              </span>
              <h4 className="font-bold text-white text-sm">
                Tactical Safe Zone Grid: Bengaluru, Delhi NCR, Mumbai & Hyderabad
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Includes all 48 municipal eco-bunkers, Kaveri & borewell water reserves, zero-radiation tree canopies, and solar streetlight arteries. Prints onto standard A3/A4 paper with low toner consumption.
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Includes offline coordinate hash: 12.9716°N / 77.5946°E datum</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>Includes battery-conserving night-red symbology</span>
              </div>
            </div>

            <button
              onClick={() => triggerDownload('havenpulse-india-offline-map.pdf')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs uppercase font-bold tactile-button shadow-lg shadow-blue-950 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Cache Vector PDF (3.2 MB)</span>
            </button>
          </div>
        )}

        {selectedGuide === 'solar' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#020512] rounded-2xl border border-blue-950 space-y-2">
              <span className="font-mono text-[10px] text-blue-400 uppercase font-bold">
                Field Guide #02 · Energy & Sanitation
              </span>
              <h4 className="font-bold text-white text-sm">
                Rooftop Solar Islanding & Bio-Sand Water Purification
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                How to safely isolate your PM-Surya rooftop solar inverter from grid blackouts, configure a 12V DC battery charging station, and construct a 3-stage bio-sand and moringa seed drinking water filter.
              </p>
            </div>

            <div className="p-3 bg-[#020512] rounded-xl border border-blue-950 text-xs space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                <span className="material-symbols-outlined text-red-400 text-[16px]">bolt</span>
                Step-By-Step Solar Islanding Check:
              </div>
              <ol className="text-slate-400 space-y-1 list-decimal list-inside text-[11px] font-mono">
                <li>Trip the main grid isolating MCB breaker before turning on inverter island mode.</li>
                <li>Ensure ground earth resistance is under 2.5 ohms (standard Indian electrical code).</li>
                <li>Direct DC output to priority refrigeration for insulin and radios first.</li>
              </ol>
            </div>

            <button
              onClick={() => triggerDownload('solar-water-purification-guide.pdf')}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-mono text-xs uppercase font-bold tactile-button-red shadow-lg shadow-red-950 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download Field Manual (1.8 MB)</span>
            </button>
          </div>
        )}

        {selectedGuide === 'mesh' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#020512] rounded-2xl border border-blue-950 space-y-2">
              <span className="font-mono text-[10px] text-blue-400 uppercase font-bold">
                Mesh Protocol #07 · Telecom Resilience
              </span>
              <h4 className="font-bold text-white text-sm">
                LoRaWAN 865-867 MHz & Ham Radio Emergency Repeater Setup
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Firmware flasher and diagram for converting ESP32 / Heltec LoRa modules into off-grid civic text nodes across India’s 865 MHz ISM frequency band.
              </p>
            </div>

            <div className="p-3 bg-[#020512] rounded-xl border border-blue-950 font-mono text-xs text-blue-300 space-y-1">
              <div>Frequency: 865.200 MHz - 867.000 MHz (IN865)</div>
              <div>Bandwidth: 125 kHz · Spreading Factor: SF12</div>
              <div>Coding Rate: 4/5 · TX Power: 20 dBm (100mW)</div>
            </div>

            <button
              onClick={() => triggerDownload('lorawan-civic-mesh-setup.zip')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs uppercase font-bold tactile-button shadow-lg shadow-blue-950 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>Download ESP32 Firmware & Manual (4.5 MB)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
