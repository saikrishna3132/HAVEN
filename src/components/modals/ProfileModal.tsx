import React from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-md bg-[#04081c] rounded-3xl p-6 border border-blue-900/80 shadow-2xl shadow-black max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shadow-md shadow-blue-950">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </span>
            <span className="font-mono text-xs text-blue-400 font-semibold uppercase tracking-wider">
              Civilian Responder Identity (India)
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#09122c] border border-blue-900 flex items-center justify-center hover:border-blue-500 text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="py-5 text-center">
          <div className="w-24 h-24 rounded-2xl border-2 border-blue-500/60 overflow-hidden mx-auto shadow-xl shadow-blue-950 mb-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyHnIFkLUGQ65YwnPSix4Lm0BMf3bS_10kGYgFOeUM1-xImekOX_nrXVzMFg4WY2aMEVJnlMSntICFxOKhDu-8M5WjG2reljE-vf0_lTIMPpppTt1fyH8AU1S22DnGH_SAFV6BTBWevCLgR2Kw1BnqpvVPbiyJxeqN6i4P-rboqruN-C65Dfu4JQ5JSOlQFXQerDco7XrZ18QSeMKGGPdprQs5VkBrjJnjbHXS6vrzxbhopFQGFe32Tw"
              alt="Civilian Responder Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="text-xl font-bold text-white">
            Rowan Vance
          </h3>
          <div className="font-mono text-xs text-blue-400 font-semibold tracking-wide mt-0.5">
            CALLSIGN: VU2-ECHO-77 · MESH NODE #09 HOST (JAIPUR)
          </div>
          <span className="inline-block bg-blue-950 text-blue-300 border border-blue-700 px-3 py-1 rounded-full font-mono text-[11px] font-semibold mt-2">
            ✓ Certified Solar First Responder (India)
          </span>

          {/* Quick Metrics */}
          <div className="mt-5 grid grid-cols-2 gap-2 text-left font-mono text-xs">
            <div className="p-3 bg-[#020512] rounded-xl border border-blue-950">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Designated Refuge</span>
              <span className="text-white font-bold">Jaigarh Eco-Vault #01</span>
            </div>
            <div className="p-3 bg-[#020512] rounded-xl border border-blue-950">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Solar Battery Pack</span>
              <span className="text-blue-400 font-bold">94% Healthy</span>
            </div>
            <div className="p-3 bg-[#020512] rounded-xl border border-blue-950">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Volunteer Shifts</span>
              <span className="text-white font-bold">24 Completed</span>
            </div>
            <div className="p-3 bg-[#020512] rounded-xl border border-blue-950">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Water Sump Reserve</span>
              <span className="text-red-400 font-bold">1,800 L Purified</span>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs uppercase font-bold tactile-button shadow-lg shadow-blue-950"
            >
              Close ID Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
