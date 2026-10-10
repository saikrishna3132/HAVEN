import React, { useState } from 'react';
import { Haven } from '../../data/havenData';
import { playTactileClick } from '../../utils/audioSynth';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  haven: Haven | null;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  haven
}) => {
  const [civilianName, setCivilianName] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [needs, setNeeds] = useState('');
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null);

  if (!isOpen || !haven) return null;

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();
    const code = `IN-${haven.id.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedCode(code);
  };

  const handleReset = () => {
    playTactileClick();
    setConfirmedCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-lg bg-[#04081c] rounded-3xl p-6 border border-blue-900/80 shadow-2xl shadow-black max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2.5 py-0.5 rounded uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {haven.categoryLabel}
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Reserve Bed / Walk-In Registration
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-xl bg-[#09122c] border border-blue-900 flex items-center justify-center hover:border-blue-500 text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {confirmedCode ? (
          /* Confirmation View */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-500/80 text-blue-400 flex items-center justify-center mx-auto shadow-xl shadow-blue-950">
              <span className="material-symbols-outlined text-[36px]">qr_code_2</span>
            </div>
            <div>
              <span className="bg-red-950 text-red-300 border border-red-700 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase">
                Sanctuary Entry Token
              </span>
              <h4 className="text-2xl font-black text-white font-mono tracking-wider mt-2">
                {confirmedCode}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Registered for <strong className="text-white">{adults} Adult(s)</strong> at{' '}
                <span className="text-blue-400">{haven.name}</span>. Safe passage granted.
              </p>
            </div>

            <div className="bg-[#020512] p-4 rounded-2xl border border-blue-950 max-w-xs mx-auto text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Radio Channel:</span>
                <span className="text-blue-400 font-bold">{haven.radioChannel.split(' ')[1] || 'CH 12'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Direct Desk:</span>
                <span className="text-white">{haven.phone.split(':')[1] || '080-2286-BUNK3'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Holding Window:</span>
                <span className="text-red-400 font-bold">45 Minutes</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs uppercase font-bold tactile-button shadow-lg shadow-blue-950"
            >
              Done & Return to Map
            </button>
          </div>
        ) : (
          /* Intake Form */
          <form onSubmit={handleReserve} className="py-4 space-y-4">
            <div className="bg-[#020512] p-3 rounded-2xl border border-blue-950 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 block font-semibold">{haven.name}</span>
                <span className="text-blue-400 font-bold">{haven.openBeds ? `${haven.openBeds} Beds Free` : 'Immediate Entry'}</span>
              </div>
              <span className="text-slate-400">{haven.eta} walk</span>
            </div>

            {/* Name */}
            <div>
              <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                Civilian / Family Contact Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={civilianName}
                onChange={(e) => setCivilianName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-blue-900 bg-[#020512] text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* Party breakdown */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-[#020512] rounded-xl border border-blue-950 text-center">
                <label className="block font-mono text-[10px] text-slate-400 uppercase font-semibold mb-1">Adults</label>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-6 h-6 rounded-md bg-[#09122c] border border-blue-900 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-white">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-6 h-6 rounded-md bg-[#09122c] border border-blue-900 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#020512] rounded-xl border border-blue-950 text-center">
                <label className="block font-mono text-[10px] text-slate-400 uppercase font-semibold mb-1">Children</label>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-6 h-6 rounded-md bg-[#09122c] border border-blue-900 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-white">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-6 h-6 rounded-md bg-[#09122c] border border-blue-900 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#020512] rounded-xl border border-blue-950 text-center">
                <label className="block font-mono text-[10px] text-slate-400 uppercase font-semibold mb-1">Pets</label>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPets(Math.max(0, pets - 1))}
                    className="w-6 h-6 rounded-md bg-[#09122c] border border-blue-900 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-white">{pets}</span>
                  <button
                    type="button"
                    onClick={() => setPets(pets + 1)}
                    className="w-6 h-6 rounded-md bg-[#09122c] border border-blue-900 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Special notes */}
            <div>
              <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                Medical / Dietary / Accessibility Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Wheelchair assistance required, insulin refrigeration needed"
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-blue-900 bg-[#020512] text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-1/3 py-2.5 rounded-xl border border-blue-900 bg-[#08122c] text-slate-300 text-xs font-mono uppercase font-bold hover:bg-[#0c1836]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button shadow-lg shadow-blue-950 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Generate Entry Pass</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
