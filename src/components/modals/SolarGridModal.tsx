import React from 'react';

interface SolarGridModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SolarGridModal: React.FC<SolarGridModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-lg bg-[#04081c] rounded-3xl p-6 border border-blue-900/80 shadow-2xl shadow-black max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shadow-md shadow-blue-950">
              <span className="material-symbols-outlined text-[18px]">solar_power</span>
            </span>
            <div>
              <span className="font-mono text-[10px] text-blue-400 uppercase font-semibold tracking-wider">
                Microgrid Telemetry · PM-Surya Scheme
              </span>
              <h3 className="text-base font-bold text-white">
                Solar Battery Reserves (India)
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

        <div className="py-4 space-y-4">
          {/* Main Stat Banner */}
          <div className="bg-[#020512] p-4 rounded-2xl border border-blue-500/50 flex items-center justify-between shadow-lg shadow-black">
            <div>
              <span className="font-mono text-[10px] text-blue-400 uppercase font-bold">
                Communal Battery Banks
              </span>
              <div className="font-mono text-2xl font-black text-white mt-0.5">
                94% Full <span className="text-sm text-slate-400 font-normal">(3.6 MWh)</span>
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                Estimated runtime without sunlight: <strong className="text-blue-400">74 hours</strong>
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-600/50 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-950">
              <span className="material-symbols-outlined text-[26px]">bolt</span>
            </div>
          </div>

          {/* Grid Breakdown */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-[#020512] rounded-xl border border-blue-950">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Solar Generation</span>
              <div className="font-mono text-xl font-bold text-blue-400 mt-0.5">4.8 MW</div>
              <span className="text-[10px] text-slate-500">Peak daytime output</span>
            </div>
            <div className="p-3 bg-[#020512] rounded-xl border border-blue-950">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Grid Consumption</span>
              <div className="font-mono text-xl font-bold text-white mt-0.5">3.9 MW</div>
              <span className="text-[10px] text-red-400">+18% Surplus stored</span>
            </div>
          </div>

          {/* Regional Hubs Status */}
          <div>
            <h4 className="font-mono text-xs text-slate-300 uppercase font-bold mb-2">
              Major Municipal Battery Hubs (India)
            </h4>
            <div className="space-y-2">
              {[
                { name: 'Central Park Solar Battery Bank #09 (JPR)', capacity: '1,450 kWh', status: 'Optimal (98%)', isHigh: true },
                { name: 'Jaigarh Fort Mountain Inverter Array (JPR)', capacity: '920 kWh', status: 'Charging (94%)', isHigh: true },
                { name: 'SMS Hospital Medical Microgrid (JPR)', capacity: '2,100 kWh', status: 'Optimal (99%)', isHigh: true },
                { name: 'Mansarovar Solar Colony Battery Array (JPR)', capacity: '850 kWh', status: 'Discharging (88%)', isHigh: false },
              ].map((h, i) => (
                <div key={i} className="p-2.5 bg-[#020512] rounded-xl border border-blue-950 flex justify-between items-center text-xs font-mono">
                  <div>
                    <div className="font-bold text-white">{h.name}</div>
                    <div className="text-[10px] text-slate-500">{h.capacity} storage</div>
                  </div>
                  <span className={`text-[11px] font-bold ${h.isHigh ? 'text-blue-400' : 'text-slate-300'}`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs uppercase font-bold tactile-button shadow-lg shadow-blue-950"
          >
            Close Telemetry Window
          </button>
        </div>
      </div>
    </div>
  );
};
