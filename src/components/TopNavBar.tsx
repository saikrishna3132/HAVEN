import React, { useState } from 'react';
import { playTactileClick } from '../utils/audioSynth';

interface TopNavBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenEmergencyCall: () => void;
  onOpenSolarModal: () => void;
  onOpenProfileModal: () => void;
  onToggleSos: () => void;
  isSosActive: boolean;
  onOpenOfflineDossier?: () => void;
  isEarthquakeScannerActive?: boolean;
  onOpenEarthquakeScannerSettings?: () => void;
  onOpenFamilyShield?: () => void;
  isFamilyFilterActive?: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenEmergencyCall,
  onOpenSolarModal,
  onOpenProfileModal,
  onToggleSos,
  isSosActive,
  onOpenOfflineDossier,
  isEarthquakeScannerActive = false,
  onOpenEarthquakeScannerSettings,
  onOpenFamilyShield,
  isFamilyFilterActive = false
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { title: 'Substation Alpha Online', time: '12m ago', desc: 'Jaipur solar microgrid stabilized. Clean 5.2 MW output across Aravalli blue corridor.', icon: 'bolt', level: 'blue' },
    { title: 'Potable Water Convoy Arrived', time: '34m ago', desc: '14,200L tested potable water stocked at Jal Mahal & Man Sagar Harvester.', icon: 'water_drop', level: 'blue' },
    { title: 'Priority 1 Medical Pod Ready', time: '1h ago', desc: 'SMS Hospital (Sawai Man Singh) reports 16 doctors on active trauma triage.', icon: 'medical_services', level: 'red' }
  ];

  return (
    <header className="bg-[#030717]/95 backdrop-blur-md border-b border-blue-900/40 sticky top-0 z-40 text-slate-100">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-7xl mx-auto py-3">
        {/* Brand & Badge */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              playTactileClick();
              onSelectTab('radar');
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#09122a] border border-blue-500/50 flex items-center justify-center shadow-lg shadow-blue-950/60 group-hover:border-blue-400 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
              <span className="material-symbols-outlined text-blue-400 text-[22px]">shield</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                HavenPulse
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shadow-[0_0_6px_#ef4444]"></span>
              </span>
              <span className="font-mono text-[10px] text-blue-400 font-semibold tracking-wider -mt-0.5">
                CIVIC DEFENSE MESH
              </span>
            </div>
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { id: 'radar', label: 'Radar', icon: 'radar' },
            { id: 'shelters', label: 'Shelters', icon: 'night_shelter' },
            { id: 'medical', label: 'Medical', icon: 'medical_services' },
            { id: 'resources', label: 'Resources', icon: 'water_bottle' },
            { id: 'community', label: 'Community', icon: 'groups' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                playTactileClick();
                onSelectTab(item.id);
              }}
              className={`font-semibold pb-1 text-sm flex items-center gap-1.5 transition-all relative ${
                activeTab === item.id
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
              <span>{item.label}</span>
              {activeTab === item.id && (
                <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Earthquake Scanner Setting Button */}
          {onOpenEarthquakeScannerSettings && (
            <button
              onClick={() => {
                playTactileClick();
                onOpenEarthquakeScannerSettings();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all tactile-button shadow-md ${
                isEarthquakeScannerActive
                  ? 'bg-red-950 text-red-200 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-[#09122a] text-slate-300 border-blue-900/80 hover:border-red-500 hover:text-white'
              }`}
              title="Earthquake Scanner Setting: Red Area (Weak/Big Buildings) vs Green Area (Safe Residences)"
            >
              <span className="material-symbols-outlined text-[16px] text-red-400">earthquake</span>
              <span className="hidden sm:inline">Quake Scanner</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isEarthquakeScannerActive ? 'bg-red-500 animate-ping' : 'bg-slate-500'}`}></span>
            </button>
          )}

          {/* Family & Child Protection Shield Button */}
          {onOpenFamilyShield && (
            <button
              onClick={() => {
                playTactileClick();
                onOpenFamilyShield();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all tactile-button shadow-md cursor-pointer ${
                isFamilyFilterActive
                  ? 'bg-emerald-950 text-emerald-200 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-[#09122a] text-slate-300 border-blue-900/80 hover:border-emerald-500 hover:text-white'
              }`}
              title="Family Defense Shield: Children registry, Lost Child SOS, Pediatric Havens"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">escalator_warning</span>
              <span className="hidden md:inline">Family Shield</span>
            </button>
          )}

          {/* Emergency Call Button */}
          <button
            onClick={() => {
              playTactileClick();
              onOpenEmergencyCall();
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#0a1024] border border-red-700/70 hover:border-red-500 rounded-xl text-red-200 text-xs font-mono font-semibold tactile-button transition-all shadow-md shadow-red-950/40"
          >
            <span className="material-symbols-outlined text-[15px] text-red-400">call</span>
            <span>Emergency 112</span>
          </button>

          {/* Offline Dossier Go-Bag Icon */}
          {onOpenOfflineDossier && (
            <button
              onClick={() => {
                playTactileClick();
                onOpenOfflineDossier();
              }}
              aria-label="Offline Sector Dossier"
              className="w-9 h-9 rounded-xl bg-[#09122a] border border-blue-900/80 flex items-center justify-center text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all tactile-button"
              title="Printable Go-Bag Dossier & Offline Manifest"
            >
              <span className="material-symbols-outlined text-[19px]">download_for_offline</span>
            </button>
          )}

          {/* Solar Telemetry Icon */}
          <button
            onClick={() => {
              playTactileClick();
              onOpenSolarModal();
            }}
            aria-label="Solar Power Status"
            className="w-9 h-9 rounded-xl bg-[#09122a] border border-blue-900/80 flex items-center justify-center text-blue-400 hover:border-blue-400 hover:shadow-[0_0_12px_rgba(37,99,235,0.3)] transition-all tactile-button"
            title="Solar Microgrid Telemetry"
          >
            <span className="material-symbols-outlined text-[19px]">solar_power</span>
          </button>

          {/* Broadcast Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => {
                playTactileClick();
                setShowNotifications(!showNotifications);
              }}
              aria-label="Broadcast Alerts"
              className="w-9 h-9 rounded-xl bg-[#09122a] border border-blue-900/80 flex items-center justify-center text-slate-300 hover:border-blue-400 transition-all relative tactile-button"
              title="Broadcast Alerts"
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#080e22] border border-blue-900/80 rounded-2xl p-4 z-50 animate-fade-in shadow-2xl shadow-black">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-900/50">
                  <span className="font-mono text-xs text-blue-400 uppercase font-semibold">
                    Ground Mesh Alerts
                  </span>
                  <span className="font-mono text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">
                    3 Active
                  </span>
                </div>
                <div className="space-y-2.5">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-2.5 bg-[#0a1128] border border-blue-950 rounded-xl text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <span className={`material-symbols-outlined text-[14px] ${n.level === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
                            {n.icon}
                          </span>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-2.5 py-1 text-center text-xs text-slate-400 hover:text-blue-400 font-medium font-mono"
                >
                  Dismiss Alerts
                </button>
              </div>
            )}
          </div>

          {/* SOS Beacon Primary Button (Tactical Laser Red) */}
          <button
            onClick={() => {
              playTactileClick();
              onToggleSos();
            }}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold tactile-button-red flex items-center gap-1.5 transition-all ${
              isSosActive
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-pulse'
                : 'bg-red-950/80 border border-red-700/80 text-red-200 hover:bg-red-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSosActive ? 'emergency' : 'e911_emergency'}
            </span>
            <span className="hidden sm:inline">{isSosActive ? 'SOS ACTIVE' : 'SOS Beacon'}</span>
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => {
              playTactileClick();
              onOpenProfileModal();
            }}
            className="w-9 h-9 rounded-xl border border-blue-500/60 overflow-hidden bg-slate-900 ml-1 hover:border-blue-400 transition-all hover:scale-105 shadow-md shadow-blue-950"
            title="Civilian Defense Identity"
          >
            <img
              className="w-full h-full object-cover"
              alt="Civilian neighborhood responder"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyHnIFkLUGQ65YwnPSix4Lm0BMf3bS_10kGYgFOeUM1-xImekOX_nrXVzMFg4WY2aMEVJnlMSntICFxOKhDu-8M5WjG2reljE-vf0_lTIMPpppTt1fyH8AU1S22DnGH_SAFV6BTBWevCLgR2Kw1BnqpvVPbiyJxeqN6i4P-rboqruN-C65Dfu4JQ5JSOlQFXQerDco7XrZ18QSeMKGGPdprQs5VkBrjJnjbHXS6vrzxbhopFQGFe32Tw"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
