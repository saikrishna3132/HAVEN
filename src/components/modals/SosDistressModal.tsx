import React, { useState, useEffect } from 'react';
import { Haven, IndianCity, UserLocationState } from '../../data/havenData';
import { playTactileClick, startSOSBeaconTone, stopSOSBeaconTone } from '../../utils/audioSynth';

interface SosDistressModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSosActive: boolean;
  onToggleSos: () => void;
  userLocation: UserLocationState;
  currentCity: IndianCity;
  nearestHaven?: Haven | null;
}

export const SosDistressModal: React.FC<SosDistressModalProps> = ({
  isOpen,
  onClose,
  isSosActive,
  onToggleSos,
  userLocation,
  currentCity,
  nearestHaven
}) => {
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isOpticalStrobeActive, setIsOpticalStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState<'white' | 'red' | 'dark'>('dark');

  const latStr = userLocation.coords ? userLocation.coords.lat.toFixed(5) : currentCity.center.lat.toFixed(5);
  const lngStr = userLocation.coords ? userLocation.coords.lng.toFixed(5) : currentCity.center.lng.toFixed(5);
  const sectorName = userLocation.localityName || currentCity.name;
  const havenName = nearestHaven ? nearestHaven.name : 'Central Park Civic Haven';
  const havenDist = nearestHaven ? nearestHaven.distance : '0.5 km';

  // Morse SOS Strobe timing (. . . - - - . . .)
  useEffect(() => {
    if (!isOpticalStrobeActive) {
      setStrobeColor('dark');
      return;
    }

    let isMounted = true;
    const interval = setInterval(() => {
      if (!isMounted) return;
      setStrobeColor((prev) => (prev === 'white' ? 'red' : 'white'));
    }, 280);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpticalStrobeActive]);

  if (!isOpen) return null;

  const distressMessage = `🚨 [CIVIC SOS DISTRESS BEACON] 🚨
Sector: ${sectorName}
GPS Coordinates: ${latStr}°N, ${lngStr}°E
Google Maps Pin: https://maps.google.com/?q=${latStr},${lngStr}
Nearest Haven: ${havenName} (~${havenDist})
VHF Radio: 142.400 MHz (CH 04 ParkNet) / 142.080 MHz (CH 08 SMS-Med)
Status: Immediate civilian extraction / triage required.`;

  const handleCopyPayload = () => {
    playTactileClick();
    navigator.clipboard.writeText(distressMessage);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 3000);
  };

  const handleWhatsAppShare = () => {
    playTactileClick();
    const encoded = encodeURIComponent(distressMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleSmsShare = () => {
    playTactileClick();
    const encoded = encodeURIComponent(distressMessage);
    window.location.href = `sms:?&body=${encoded}`;
  };

  const toggleSiren = () => {
    playTactileClick();
    if (!isSosActive) {
      startSOSBeaconTone();
    } else {
      stopSOSBeaconTone();
    }
    onToggleSos();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in text-slate-100">
      {/* Optical Strobe Flash Overlay if activated */}
      {isOpticalStrobeActive && (
        <div
          className={`fixed inset-0 z-50 pointer-events-none transition-colors duration-100 ${
            strobeColor === 'white'
              ? 'bg-white opacity-90'
              : strobeColor === 'red'
              ? 'bg-red-600 opacity-90'
              : 'bg-black opacity-30'
          }`}
        />
      )}

      <div className="relative z-50 w-full max-w-lg bg-[#070204] rounded-3xl p-5 sm:p-6 border-2 border-red-600 shadow-[0_0_50px_rgba(239,68,68,0.4)] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-red-950">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-red-950 border border-red-500 text-red-400 flex items-center justify-center shadow-md animate-pulse">
              <span className="material-symbols-outlined text-[24px]">sos</span>
            </span>
            <div>
              <span className="font-mono text-[10px] text-red-400 uppercase font-black tracking-widest">
                CRITICAL DISTRESS BROADCAST · LEVEL 1
              </span>
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                Emergency Dispatch Console
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              setIsOpticalStrobeActive(false);
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-[#1a0508] border border-red-900 flex items-center justify-center hover:border-red-500 text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Status Callout */}
        <div className="my-4 bg-red-950/40 border border-red-800/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-red-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              GPS Anchor: {latStr}°N, {lngStr}°E
            </span>
            <span className="font-mono text-[10px] bg-red-900 text-red-100 px-2 py-0.5 rounded font-bold">
              {sectorName}
            </span>
          </div>
          <p className="text-slate-300 text-xs">
            Nearest Harbor: <strong className="text-white">{havenName}</strong> ({havenDist} away).
          </p>
        </div>

        {/* Distress Payload Message Box */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[11px] text-red-400 uppercase font-bold">
              Encrypted Distress Message (Auto-Generated):
            </label>
            <button
              onClick={handleCopyPayload}
              className="text-xs font-mono font-bold text-red-400 hover:text-white flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copiedPayload ? 'check' : 'content_copy'}
              </span>
              {copiedPayload ? 'COPIED!' : 'Copy'}
            </button>
          </div>
          <div className="bg-[#020512] border border-red-900/80 rounded-2xl p-3 font-mono text-[11px] text-slate-200 whitespace-pre-wrap select-all leading-relaxed">
            {distressMessage}
          </div>
        </div>

        {/* Quick Send Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3.5">
          <button
            onClick={handleCopyPayload}
            className="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-950"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            {copiedPayload ? 'Copied to Clipboard' : 'Copy SOS Message'}
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-3 bg-[#0c311a] hover:bg-[#124d29] border border-green-600 text-green-200 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            Send WhatsApp
          </button>
        </div>

        {/* Direct Emergency Calls */}
        <div className="mt-4 pt-3 border-t border-red-950 space-y-2">
          <label className="font-mono text-[11px] text-slate-400 uppercase font-bold block">
            Direct Speed-Dial Lifelines:
          </label>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <a
              href="tel:112"
              className="py-2 bg-[#1a0508] border border-red-800 hover:border-red-500 rounded-xl text-center text-red-300 font-bold block"
            >
              Dial 112 (SOS)
            </a>
            <a
              href="tel:108"
              className="py-2 bg-[#05112e] border border-blue-800 hover:border-blue-500 rounded-xl text-center text-blue-300 font-bold block"
            >
              Dial 108 (Medic)
            </a>
            <a
              href="tel:101"
              className="py-2 bg-[#201004] border border-orange-800 hover:border-orange-500 rounded-xl text-center text-orange-300 font-bold block"
            >
              Dial 101 (Fire)
            </a>
          </div>
        </div>

        {/* Hardware / Tactical Signaling Tools */}
        <div className="mt-4 pt-3 border-t border-red-950 grid grid-cols-2 gap-2">
          {/* Audio Siren Toggle */}
          <button
            onClick={toggleSiren}
            className={`py-2 px-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              isSosActive
                ? 'bg-red-700 text-white border-red-400 shadow-lg shadow-red-950'
                : 'bg-[#150508] text-red-400 border-red-900 hover:border-red-600'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSosActive ? 'volume_up' : 'volume_off'}
            </span>
            {isSosActive ? 'Mute Siren Tone' : 'Start Siren Tone'}
          </button>

          {/* Optical Morse Strobe */}
          <button
            onClick={() => {
              playTactileClick();
              setIsOpticalStrobeActive(!isOpticalStrobeActive);
            }}
            className={`py-2 px-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              isOpticalStrobeActive
                ? 'bg-white text-black border-white shadow-lg animate-pulse font-black'
                : 'bg-[#0a0518] text-yellow-300 border-yellow-700/60 hover:border-yellow-500'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">flash_on</span>
            {isOpticalStrobeActive ? 'Stop Strobe' : 'Morse SOS Strobe'}
          </button>
        </div>

        {/* Close Button */}
        <div className="mt-5 pt-3 border-t border-red-950 flex justify-end">
          <button
            onClick={() => {
              playTactileClick();
              setIsOpticalStrobeActive(false);
              onClose();
            }}
            className="px-4 py-2 bg-[#1a0508] border border-red-900 hover:border-red-600 text-slate-300 rounded-xl font-mono text-xs font-bold"
          >
            Dismiss Console
          </button>
        </div>
      </div>
    </div>
  );
};
