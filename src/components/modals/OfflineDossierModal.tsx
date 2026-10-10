import React from 'react';
import { Haven, IndianCity, UserLocationState } from '../../data/havenData';
import { playTactileClick } from '../../utils/audioSynth';

interface OfflineDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  havens: Haven[];
  currentCity: IndianCity;
  userLocation: UserLocationState;
}

export const OfflineDossierModal: React.FC<OfflineDossierModalProps> = ({
  isOpen,
  onClose,
  havens,
  currentCity,
  userLocation
}) => {
  if (!isOpen) return null;

  const latStr = userLocation.coords ? userLocation.coords.lat.toFixed(5) : currentCity.center.lat.toFixed(5);
  const lngStr = userLocation.coords ? userLocation.coords.lng.toFixed(5) : currentCity.center.lng.toFixed(5);
  const sectorName = userLocation.localityName || currentCity.name;
  const topHavens = havens.slice(0, 6);

  const handlePrint = () => {
    playTactileClick();
    window.print();
  };

  const handleDownloadJson = () => {
    playTactileClick();
    const manifest = {
      generatedAt: new Date().toISOString(),
      sector: sectorName,
      coordinates: { lat: latStr, lng: lngStr },
      network: 'HavenPulse Civic Defense Mesh',
      emergencyFrequencies: [
        { label: 'Primary Mesh Net', freq: '142.400 MHz FM' },
        { label: 'Emergency Trauma Net', freq: '142.080 MHz FM' },
        { label: 'National Simplex Calling', freq: '146.520 MHz FM' }
      ],
      hotlines: [
        { service: 'National All-Emergency', number: '112' },
        { service: 'Ambulance Triage', number: '108' },
        { service: 'Fire & Rescue', number: '101' },
        { service: 'Disaster Helpline', number: '1070' }
      ],
      topSanctuaries: topHavens.map((h) => ({
        id: h.id,
        name: h.name,
        category: h.categoryLabel,
        distance: h.distance,
        address: h.address,
        phone: h.phone,
        radioChannel: h.radioChannel,
        coordinates: { lat: h.lat, lng: h.lng }
      }))
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HavenPulse-Sector-Dossier-${sectorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-2xl bg-[#04081c] rounded-3xl p-5 sm:p-7 border border-blue-900/80 shadow-2xl shadow-black max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-blue-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-500/60 text-blue-400 flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[20px]">download_for_offline</span>
            </span>
            <div>
              <span className="font-mono text-[10px] text-blue-400 uppercase font-bold tracking-wider">
                Offline Resilience Protocol · Go-Bag Ready
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Sector Defense Dossier & Manifest
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

        {/* Scrollable Printable Dossier Content */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1 text-xs">
          {/* Top Banner Notice */}
          <div className="bg-[#020512] border border-blue-900/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="font-mono text-[11px] text-blue-300 font-bold uppercase">
                  Current Sector Anchor: {sectorName}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Coordinates: <strong className="text-white">{latStr}°N, {lngStr}°E</strong> • Sector Radius: 15 km
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-[11px] font-bold flex items-center gap-1.5 tactile-button shadow-md shadow-blue-950"
              >
                <span className="material-symbols-outlined text-[15px]">print</span>
                Print Go-Bag Sheet
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 bg-[#09122c] border border-blue-700 hover:border-blue-500 text-blue-300 rounded-xl font-mono text-[11px] font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">file_download</span>
                JSON Mesh
              </button>
            </div>
          </div>

          {/* Emergency Lifeline Numbers */}
          <div className="bg-[#050b1e] border border-blue-950 rounded-2xl p-4">
            <h4 className="font-mono text-[11px] text-red-400 uppercase font-bold flex items-center gap-1.5 mb-2.5">
              <span className="material-symbols-outlined text-[16px]">call</span>
              Official Emergency Helplines (Pan-India)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950">
                <span className="text-[10px] text-slate-400 block">National Emergency</span>
                <strong className="text-red-400 text-base font-bold">112</strong>
              </div>
              <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950">
                <span className="text-[10px] text-slate-400 block">Medical / Ambulance</span>
                <strong className="text-blue-400 text-base font-bold">108</strong>
              </div>
              <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950">
                <span className="text-[10px] text-slate-400 block">Fire & Rescue</span>
                <strong className="text-orange-400 text-base font-bold">101</strong>
              </div>
              <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950">
                <span className="text-[10px] text-slate-400 block">Disaster Relief</span>
                <strong className="text-cyan-400 text-base font-bold">1070</strong>
              </div>
            </div>
          </div>

          {/* Radio Mesh Frequencies */}
          <div className="bg-[#050b1e] border border-blue-950 rounded-2xl p-4">
            <h4 className="font-mono text-[11px] text-blue-400 uppercase font-bold flex items-center gap-1.5 mb-2.5">
              <span className="material-symbols-outlined text-[16px]">radio</span>
              Offline Radio & LoRa Frequencies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950">
                <span className="text-slate-400 block text-[10px]">Jaipur ParkNet / Civic:</span>
                <strong className="text-blue-300">142.400 MHz (CH 04)</strong>
              </div>
              <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950">
                <span className="text-slate-400 block text-[10px]">SMS Medical Net:</span>
                <strong className="text-red-300">142.080 MHz (CH 08)</strong>
              </div>
              <div className="bg-[#020512] p-2.5 rounded-xl border border-blue-950">
                <span className="text-slate-400 block text-[10px]">National Calling:</span>
                <strong className="text-slate-200">146.520 MHz FM</strong>
              </div>
            </div>
          </div>

          {/* Top Sanctuaries Table */}
          <div className="bg-[#050b1e] border border-blue-950 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2.5">
              <h4 className="font-mono text-[11px] text-slate-200 uppercase font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-400">shield</span>
                Closest Verified Sanctuaries in {sectorName}
              </h4>
              <span className="font-mono text-[10px] text-slate-400">
                {topHavens.length} Shelters Listed
              </span>
            </div>

            <div className="space-y-2">
              {topHavens.map((h, i) => (
                <div
                  key={h.id}
                  className="bg-[#020512] p-2.5 rounded-xl border border-blue-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-blue-400 font-bold">#{i + 1}</span>
                      <strong className="text-white text-xs">{h.name}</strong>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 bg-blue-950 text-blue-300 rounded border border-blue-800">
                        {h.categoryLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{h.address}</div>
                    <div className="font-mono text-[10px] text-slate-500">
                      GPS: {h.lat.toFixed(4)}°N, {h.lng.toFixed(4)}°E • {h.radioChannel}
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <div className="text-blue-400 font-bold text-xs">{h.distance}</div>
                    <div className="text-slate-400 text-[10px]">{h.eta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field Survival Guidelines Checklist */}
          <div className="bg-[#050b1e] border border-blue-950 rounded-2xl p-4">
            <h4 className="font-mono text-[11px] text-slate-300 uppercase font-bold mb-2">
              Civic Defense Quick Checklist:
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px] list-disc list-inside">
              <li>Keep at least 3 liters of potable water per person in sealed containers.</li>
              <li>Tune battery or hand-crank radio to VHF 142.400 MHz on the hour for grid announcements.</li>
              <li>Trauma cases: Direct to SMS Hospital JLN Marg via Zero-Radiation corridor.</li>
              <li>Follow LED light beacons at Central Park Statue Circle during total grid blackout.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-blue-950 flex justify-between items-center shrink-0">
          <span className="font-mono text-[10px] text-slate-500">
            HAVENPULSE CIVIC DEFENSE PROTOCOL • ENCRYPTED AIRGAP COPY
          </span>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs font-bold tactile-button"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
