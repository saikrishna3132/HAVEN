import React, { useState, useEffect } from 'react';
import { startSOSBeaconTone, stopSOSBeaconTone, playTactileClick } from '../utils/audioSynth';

interface TopAlertBarProps {
  isSosActive: boolean;
  onToggleSos: () => void;
  locationName?: string;
  coords?: { lat: number; lng: number } | null;
  onOpenSosConsole?: () => void;
}

export const TopAlertBar: React.FC<TopAlertBarProps> = ({
  isSosActive,
  onToggleSos,
  locationName = 'Jaipur',
  coords = { lat: 26.9124, lng: 75.7873 },
  onOpenSosConsole
}) => {
  const [pingNode, setPingNode] = useState(4);
  const [pingMs, setPingMs] = useState(12);

  const cleanLocation = locationName.replace(/\(GPS Locked\)/i, '').replace(/\(Pink City\)/i, '').trim() || 'Jaipur';
  const latStr = coords ? coords.lat.toFixed(4) : '26.9124';
  const lngStr = coords ? coords.lng.toFixed(4) : '75.7873';

  useEffect(() => {
    const interval = setInterval(() => {
      setPingMs(8 + Math.floor(Math.random() * 9));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSosClick = () => {
    playTactileClick();
    if (!isSosActive) {
      startSOSBeaconTone();
      if (onOpenSosConsole) {
        onOpenSosConsole();
      }
    } else {
      stopSOSBeaconTone();
    }
    onToggleSos();
  };

  return (
    <>
      {/* Flashing Banner if SOS active - High-Alert Laser Crimson */}
      {isSosActive && (
        <div className="bg-red-950/95 text-red-100 border-b-2 border-red-600 px-4 py-2 text-center font-mono text-xs font-bold tracking-wider animate-pulse flex flex-wrap items-center justify-center gap-2.5 z-50 shadow-[0_0_25px_rgba(239,68,68,0.5)]">
          <span className="material-symbols-outlined text-[20px] text-red-400">warning</span>
          <span>
            SOS DISTRESS ACTIVE • COORDINATES: {latStr}°N, {lngStr}°E ({cleanLocation.toUpperCase()}) • FREQUENCY: 142.800 MHz • ENCRYPTED UPLINK
          </span>
          <div className="flex items-center gap-2">
            {onOpenSosConsole && (
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenSosConsole();
                }}
                className="bg-black hover:bg-slate-900 border border-red-400 text-white px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold shadow-md"
              >
                Open SOS Console
              </button>
            )}
            <button
              onClick={handleSosClick}
              className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold shadow-md"
            >
              Cancel Broadcast
            </button>
          </div>
        </div>
      )}

      <aside className="bg-[#020617] border-b border-blue-900/40 px-4 py-2 w-full z-50 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-500/50 text-blue-400 font-mono text-[11px] uppercase tracking-wider font-semibold shadow-[0_0_10px_rgba(37,99,235,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping inline-block"></span>
              GRID SECURE
            </span>
            <div className="flex items-center gap-2 font-mono text-slate-300 font-medium">
              <span className="material-symbols-outlined text-blue-400 text-[16px]">cell_tower</span>
              <span className="hidden sm:inline">RADAR MESH: ACTIVE • SECTOR ({cleanLocation.toUpperCase()}): BLUE SECURE SPECTRUM • DEFENSE LIFELINES OPERATIONAL</span>
              <span className="sm:hidden">RADAR ACTIVE • {cleanLocation}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-slate-500">Node</span>
              <strong className="text-blue-400 font-bold">#{pingNode}</strong>
              <span className="text-slate-500">Ping</span>
              <strong className="text-white font-bold">{pingMs}ms</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSosClick}
                className={`px-3 py-1 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition-all shadow-md font-mono ${
                  isSosActive
                    ? 'bg-red-600 text-white border border-red-400 animate-bounce shadow-red-950'
                    : 'bg-[#180507] hover:bg-red-950 text-red-400 border border-red-700/80 shadow-red-950/60'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">sos</span>
                <span>{isSosActive ? 'SOS ACTIVE' : 'SOS BEACON'}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
