import React, { useState, useEffect } from 'react';
import { startCivicRadio, stopCivicRadio, playTactileClick } from '../../utils/audioSynth';

interface RadioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChannel?: string;
  locationName?: string;
}

export const RadioModal: React.FC<RadioModalProps> = ({
  isOpen,
  onClose,
  initialChannel = 'FM 98.4 (Civic Broadcast)',
  locationName = 'Jaipur'
}) => {
  const [selectedChannel, setSelectedChannel] = useState(initialChannel);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [liveTranscriptIndex, setLiveTranscriptIndex] = useState(0);

  const cleanLocation = locationName.replace(/\(GPS Locked\)/i, '').replace(/\(Pink City\)/i, '').trim() || 'Jaipur';

  const channels = [
    { id: 'fm984', name: 'FM 98.4 / AM 1020', label: `${cleanLocation} Civic Radio & Weather Rollcall`, type: 'Broadcast' },
    { id: 'ch12', name: 'Haven CH 12 (142.120 MHz)', label: `${cleanLocation} Eco-Vault Tactical Net`, type: 'Two-Way' },
    { id: 'ch08', name: 'CH 08 (142.080 MHz)', label: `${cleanLocation} Hospital Emergency Triage Net`, type: 'Medical' },
    { id: 'ch04', name: 'CH 04 (142.800 MHz)', label: `${cleanLocation} Guardian & Fire Watch`, type: 'Peacekeeper' },
    { id: 'ch09', name: 'Channel 09 (142.900 MHz)', label: `${cleanLocation} Civic Accompaniment Net`, type: 'Community' },
  ];

  const transcripts = [
    `Broadcast anchor: '...solar flux in ${cleanLocation} sector has stabilized. Ground ambient radiation at 0.08 µSv/h. All civilian harbor gates open with fresh water and hot soup until dusk...'`,
    `Dispatcher 04: '...potable water convoy safely arrived at ${cleanLocation} intake. Solar batteries charging at full capacity. Keep emergency repeaters clear...'`,
    `Acoustic hour: '...Broadcasting local acoustic folk melodies over ${cleanLocation} civic LoRa frequencies. Sending warmth to all civilian outposts...'`,
    `Medical alert: '...Local field hospitals report trauma teams on active duty. Zero triage delay for emergency medical checks. Bring spare radios for battery swap...'`
  ];

  useEffect(() => {
    if (!isOpen) {
      if (isPlaying) {
        stopCivicRadio();
        setIsPlaying(false);
      }
      return;
    }
  }, [isOpen, isPlaying]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setLiveTranscriptIndex((prev) => (prev + 1) % transcripts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isOpen, transcripts.length]);

  if (!isOpen) return null;

  const togglePlay = () => {
    playTactileClick();
    if (isPlaying) {
      stopCivicRadio();
      setIsPlaying(false);
    } else {
      startCivicRadio();
      setIsPlaying(true);
    }
  };

  const handleTransmitDown = () => {
    playTactileClick();
    setIsTransmitting(true);
  };

  const handleTransmitUp = () => {
    setIsTransmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-xl bg-[#04081c] rounded-3xl p-6 border border-blue-900/80 shadow-2xl shadow-black max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shadow-md shadow-blue-950">
              <span className="material-symbols-outlined text-[18px]">radio</span>
            </span>
            <div>
              <span className="font-mono text-[10px] text-blue-400 uppercase font-semibold tracking-wider">
                Amateur Radio Emergency Service (VU2-NET)
              </span>
              <h3 className="text-base font-bold text-white">
                Shortwave Civic Radio Tuner
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#09122c] border border-blue-900 flex items-center justify-center hover:border-blue-500 text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Radio Player Deck */}
        <div className="py-4 space-y-4">
          <div className="bg-[#020512] p-4 rounded-2xl border border-blue-950 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Visualizer bars in Blue */}
            <div className="flex items-end gap-1 h-12 mb-3">
              {[20, 45, 75, 30, 90, 60, 40, 80, 55, 30, 70, 45, 95, 40, 20].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-blue-400 shadow-[0_0_6px_#3b82f6]' : 'bg-slate-800'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (volume / 100)) % 48)}px` : '6px'
                  }}
                ></div>
              ))}
            </div>

            <div className="font-mono text-2xl font-black text-white tracking-wider">
              {selectedChannel}
            </div>
            <div className="font-mono text-xs text-blue-400 mt-0.5">
              STATUS: {isPlaying ? 'STREAMING REAL-TIME AUDIO SYNTH' : 'CARRIER MUTED'}
            </div>

            {/* Play / Mute Button */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={togglePlay}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-bold flex items-center gap-2 transition-all ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950 tactile-button-red'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-950 tactile-button'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
                <span>{isPlaying ? 'Mute Radio' : 'Tune In'}</span>
              </button>

              <div className="flex items-center gap-2 bg-[#09122c] px-3 py-1.5 rounded-xl border border-blue-900 text-xs font-mono">
                <span className="material-symbols-outlined text-blue-400 text-[16px]">volume_up</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-20 accent-blue-500 h-1 bg-slate-800 rounded"
                />
              </div>
            </div>
          </div>

          {/* Live Transcript Ticker */}
          <div className="bg-[#020512] p-3 rounded-xl border border-blue-950 text-xs space-y-1">
            <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400 uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              Live Audio Transcript (Auto-Decoded):
            </div>
            <p className="font-mono text-slate-300 italic text-[11px] leading-relaxed">
              {transcripts[liveTranscriptIndex]}
            </p>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="block font-mono text-[11px] text-slate-400 font-bold uppercase mb-2">
              Select Civic Frequency Band
            </label>
            <div className="space-y-2">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    playTactileClick();
                    setSelectedChannel(ch.name);
                  }}
                  className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                    selectedChannel === ch.name
                      ? 'bg-blue-950/80 text-blue-200 border-blue-500 shadow-md font-bold'
                      : 'bg-[#020512] text-slate-400 border-blue-950 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white text-xs">{ch.name}</div>
                    <div className="text-[10px] text-slate-500">{ch.label}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ch.type === 'Medical'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-[#09122c] text-blue-300 border border-blue-900'
                  }`}>
                    {ch.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Push To Talk (Laser Red) */}
          <div className="pt-2">
            <button
              onMouseDown={handleTransmitDown}
              onMouseUp={handleTransmitUp}
              onTouchStart={handleTransmitDown}
              onTouchEnd={handleTransmitUp}
              className={`w-full py-3 rounded-2xl font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 transition-all border ${
                isTransmitting
                  ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                  : 'bg-[#0a0512] border-red-800/80 text-red-300 hover:bg-red-950'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isTransmitting ? 'mic' : 'mic_none'}
              </span>
              <span>{isTransmitting ? 'TRANSMITTING OVER CIVIC REPEATER...' : 'Hold to Broadcast (Push-to-Talk)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
