import React, { useState } from 'react';
import { Haven } from '../../data/havenData';
import { playTactileClick } from '../../utils/audioSynth';

interface AmbulanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital?: Haven | null;
}

export const AmbulanceModal: React.FC<AmbulanceModalProps> = ({
  isOpen,
  onClose,
  hospital
}) => {
  const [triageLevel, setTriageLevel] = useState<'CRITICAL' | 'URGENT' | 'STABLE'>('URGENT');
  const [patientCount, setPatientCount] = useState(1);
  const [locationNote, setLocationNote] = useState('Sector 09 Central - JLN Marg / Statue Circle Hub, Jaipur');
  const [symptoms, setSymptoms] = useState<string[]>(['Burns & Heat Trauma']);
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen) return null;

  const toggleSymptom = (sym: string) => {
    playTactileClick();
    if (symptoms.includes(sym)) {
      setSymptoms(symptoms.filter((s) => s !== sym));
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();
    setIsDispatched(true);
  };

  const resetAll = () => {
    playTactileClick();
    setIsDispatched(false);
    onClose();
  };

  const availableSymptoms = [
    'Burns & Heat Trauma',
    'Radiation Wash / Decontamination',
    'Pediatric Fever / Dehydration',
    'Bone Fracture / Splinting',
    'Solar Heat Exhaustion',
    'Asthma / Smoke Inhalation'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-lg bg-[#04081c] rounded-3xl p-6 border border-red-900/80 shadow-2xl shadow-black max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-red-950 border border-red-700 text-red-400 flex items-center justify-center shadow-md shadow-red-950">
              <span className="material-symbols-outlined text-[18px]">emergency</span>
            </span>
            <div>
              <span className="font-mono text-[10px] text-red-400 uppercase font-semibold tracking-wider">
                108 Emergency Medical Triage · India Mesh
              </span>
              <h3 className="text-base font-bold text-white">
                {hospital?.name || 'SMS Hospital (Sawai Man Singh) Solarpunk Trauma Center'}
              </h3>
            </div>
          </div>
          <button
            onClick={resetAll}
            className="w-8 h-8 rounded-xl bg-[#09122c] border border-blue-900 flex items-center justify-center hover:border-red-500 text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {isDispatched ? (
          /* Dispatched Active Tracker */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500 text-red-400 flex items-center justify-center mx-auto shadow-xl shadow-red-950 animate-pulse">
              <span className="material-symbols-outlined text-[32px]">ambulance</span>
            </div>
            <div>
              <span className="bg-red-950 text-red-300 border border-red-700 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase">
                Medic Unit IN-04 Dispatched
              </span>
              <h4 className="text-xl font-bold text-white mt-2">
                Solar Ambulance En Route
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Field doctors have received your GPS coordinates. Maintain radio contact on{' '}
                <strong className="text-blue-400">{hospital?.radioChannel || 'CH 08 (142.080 MHz)'}</strong>.
              </p>
            </div>

            <div className="bg-[#020512] p-4 rounded-2xl border border-blue-950 max-w-xs mx-auto text-center">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">
                Estimated Intercept In
              </span>
              <div className="font-mono text-3xl font-black text-red-400 tracking-tight mt-1">
                02:45 MIN
              </div>
              <span className="font-mono text-[11px] text-blue-400 font-semibold block mt-1">
                ✓ Priority electric corridor cleared
              </span>
            </div>

            <div className="bg-[#020512] p-3.5 rounded-xl text-left space-y-2 border border-blue-950">
              <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5 font-mono">
                <span className="material-symbols-outlined text-blue-400 text-[18px]">medical_services</span>
                Immediate First-Aid Protocol While Waiting:
              </div>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside font-mono">
                <li>Move patient under shaded solar canopy or indoor dry shelter.</li>
                <li>Provide clean filtered water in small sips if conscious.</li>
                <li>Flash continuous beacon towards North Sector streetlamps.</li>
              </ul>
            </div>

            <button
              onClick={resetAll}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs uppercase font-bold tactile-button shadow-lg shadow-blue-950"
            >
              Stand By At Intercept Checkpoint
            </button>
          </div>
        ) : (
          /* Triage Intake Form */
          <form onSubmit={handleDispatch} className="py-4 space-y-4">
            {/* Triage Level Selector */}
            <div>
              <label className="block font-mono text-[11px] text-slate-400 font-bold uppercase mb-1.5">
                Triage Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { level: 'CRITICAL', label: 'Code Red', desc: 'Immediate Threat', border: 'border-red-500 text-red-300 bg-red-950/60' },
                  { level: 'URGENT', label: 'Code Blue', desc: 'Fast Triage (~3m)', border: 'border-blue-500 text-blue-300 bg-blue-950/60' },
                  { level: 'STABLE', label: 'Code White', desc: 'Walk-in Consult', border: 'border-slate-500 text-slate-200 bg-slate-900/60' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.level}
                    onClick={() => {
                      playTactileClick();
                      setTriageLevel(item.level as 'CRITICAL' | 'URGENT' | 'STABLE');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      triageLevel === item.level
                        ? `${item.border} shadow-lg font-bold shadow-black`
                        : 'bg-[#020512] border-blue-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className="text-[10px] opacity-75">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                Civilian Location / Landmark *
              </label>
              <input
                type="text"
                required
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-blue-900 bg-[#020512] text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Symptoms Tags */}
            <div>
              <label className="block font-mono text-[11px] text-slate-400 font-bold uppercase mb-1.5">
                Reported Condition & Symptoms
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSymptoms.map((sym) => {
                  const selected = symptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                        selected
                          ? 'bg-red-950 border-red-500 text-red-300 font-semibold'
                          : 'bg-[#020512] border-blue-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {selected && '✓ '} {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Patient count */}
            <div>
              <label className="block font-mono text-[11px] text-slate-400 font-bold uppercase mb-1">
                Number of Injured / Transport Capacity
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((cnt) => (
                  <button
                    type="button"
                    key={cnt}
                    onClick={() => {
                      playTactileClick();
                      setPatientCount(cnt);
                    }}
                    className={`w-12 py-2 rounded-xl border font-mono text-xs font-bold transition-all ${
                      patientCount === cnt
                        ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                        : 'bg-[#020512] border-blue-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={resetAll}
                className="w-1/3 py-2.5 rounded-xl border border-blue-900 bg-[#08122c] text-slate-300 text-xs font-mono uppercase font-bold hover:bg-[#0c1836]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button-red shadow-lg shadow-red-950 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
                <span>Confirm Ambulance Dispatch</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
