import React, { useState } from 'react';
import { playTactileClick } from '../../utils/audioSynth';

interface EmergencyCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyCallModal: React.FC<EmergencyCallModalProps> = ({ isOpen, onClose }) => {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  if (!isOpen) return null;

  const lines = [
    { number: '112 / *SOS', name: 'National Emergency Response System (India)', desc: 'Direct unified emergency uplink across all states', icon: 'emergency', badge: 'PRIORITY 1', isRed: true },
    { number: '108 / 102', name: 'Free Ambulance & Emergency Medical Services', desc: 'Direct dispatch to nearest solar triage hospital', icon: 'health_and_safety', badge: 'AMBULANCE', isRed: true },
    { number: '101', name: 'Fire & Disaster Rescue Service', desc: 'Solar pumper trucks & decontamination crews', icon: 'local_fire_department', badge: 'FIRE & RESCUE', isRed: true },
    { number: '142.800 MHz', name: 'VU2 Disaster Amateur Radio Net', desc: 'Licensed Indian Ham Radio emergency communications', icon: 'radio', badge: 'HAM RADIO', isRed: false },
    { number: 'Channel 09', name: 'Animal Refuge & Street Animal Rescue', desc: 'Community veterinary squad & gaushala coordination', icon: 'pets', badge: 'COMMUNITY', isRed: false }
  ];

  const handleStartCall = (name: string) => {
    playTactileClick();
    setActiveCall(name);
    setCallDuration(1);
  };

  const handleEndCall = () => {
    playTactileClick();
    setActiveCall(null);
    setCallDuration(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-lg bg-[#04081c] rounded-3xl p-6 border border-red-900/80 shadow-2xl shadow-black max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-red-950 border border-red-700 text-red-400 flex items-center justify-center shadow-md shadow-red-950">
              <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
            </span>
            <div>
              <span className="font-mono text-[10px] text-red-400 uppercase font-semibold tracking-wider">
                24/7 National Emergency Mesh
              </span>
              <h3 className="text-base font-bold text-white">
                Emergency Distress Lines (India)
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              if (activeCall) handleEndCall();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-[#09122c] border border-blue-900 flex items-center justify-center hover:border-red-500 text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {activeCall ? (
          /* Active simulated phone call */
          <div className="py-8 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-red-950/80 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse">
              <span className="material-symbols-outlined text-[40px]">phone_in_talk</span>
            </div>
            <div>
              <span className="bg-red-900 text-red-100 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase tracking-wider">
                CALL CONNECTED (SIMULATED SECURE UPLINK)
              </span>
              <h4 className="text-xl font-bold text-white mt-2">
                {activeCall}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Transmitting GPS fix • Indian National Civic Grid
              </p>
            </div>

            <div className="p-3 bg-[#020512] rounded-xl border border-blue-950 max-w-xs mx-auto font-mono text-xs text-blue-400">
              Audio Link: High-Priority Voice Synthesizer
            </div>

            <button
              onClick={handleEndCall}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-mono text-xs uppercase font-bold tactile-button-red flex items-center justify-center gap-2 mx-auto shadow-lg shadow-red-950"
            >
              <span className="material-symbols-outlined text-[18px]">call_end</span>
              <span>Disconnect Distress Call</span>
            </button>
          </div>
        ) : (
          /* Hotline List */
          <div className="py-4 space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              In an extreme event, civilian networks patch directly to regional NDMA and 112 unified responders over dedicated priority lines.
            </p>

            <div className="space-y-2.5">
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={`p-3.5 bg-[#020512] rounded-2xl border transition-all flex items-center justify-between ${
                    l.isRed
                      ? 'border-red-950 hover:border-red-500/80'
                      : 'border-blue-950 hover:border-blue-500/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      l.isRed
                        ? 'bg-red-950/80 border border-red-800 text-red-400'
                        : 'bg-blue-950/80 border border-blue-800 text-blue-400'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">{l.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs">{l.number}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          l.isRed
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {l.badge}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-300 text-xs mt-0.5">{l.name}</div>
                      <div className="text-[11px] text-slate-500">{l.desc}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartCall(l.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                      l.isRed
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950 tactile-button-red'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950 tactile-button'
                    }`}
                  >
                    <span>Connect</span>
                    <span className="material-symbols-outlined text-[14px]">call</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
