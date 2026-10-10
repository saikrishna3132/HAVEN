import React, { useState } from 'react';
import { playTactileClick } from '../../utils/audioSynth';

interface RegisterHavenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess?: (havenNode: any) => void;
}

export const RegisterHavenModal: React.FC<RegisterHavenModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess
}) => {
  const [nodeType, setNodeType] = useState<'home' | 'cellar' | 'solar' | 'well'>('home');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [bedsOffered, setBedsOffered] = useState(4);
  const [waterLitersPerDay, setWaterLitersPerDay] = useState(250);
  const [solarKwCapacity, setSolarKwCapacity] = useState(5.0);
  const [petAllowed, setPetAllowed] = useState(true);
  const [wheelchairAccess, setWheelchairAccess] = useState(true);
  const [hasFirstAid, setHasFirstAid] = useState(true);
  const [callsign, setCallsign] = useState('');
  const [registeredNode, setRegisteredNode] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();
    const nodeId = `HAVEN-NODE-${Math.floor(100 + Math.random() * 900)}`;
    const newNode = {
      nodeId,
      name,
      address,
      bedsOffered,
      waterLitersPerDay,
      solarKwCapacity,
      petAllowed,
      wheelchairAccess,
      hasFirstAid,
      callsign: callsign || 'VU2-CIVIC-LOCAL',
    };
    setRegisteredNode(newNode);
    if (onRegisterSuccess) onRegisterSuccess(newNode);
  };

  const handleReset = () => {
    playTactileClick();
    setRegisteredNode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-xl bg-[#04081c] rounded-3xl p-6 border border-blue-900/80 shadow-2xl shadow-black max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shadow-md shadow-blue-950">
              <span className="material-symbols-outlined text-[18px]">add_home_work</span>
            </span>
            <div>
              <span className="font-mono text-[10px] text-blue-400 uppercase font-semibold tracking-wider">
                Cooperative Resilience Network · India
              </span>
              <h3 className="text-base font-bold text-white">
                Register Your Property as a Haven Node
              </h3>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-xl bg-[#09122c] border border-blue-900 flex items-center justify-center hover:border-blue-500 text-slate-300"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {registeredNode ? (
          /* Success registered view */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-500/80 text-blue-400 flex items-center justify-center mx-auto shadow-xl shadow-blue-950">
              <span className="material-symbols-outlined text-[34px]">verified</span>
            </div>

            <div>
              <span className="bg-red-950 text-red-300 border border-red-700 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase">
                Node Provisioned: {registeredNode.nodeId}
              </span>
              <h4 className="text-xl font-bold text-white mt-2">
                Sanctuary Node Provisioned!
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Thank you, civilian guardian! <strong className="text-white">{registeredNode.name}</strong> has been pinned to the Indian ground mesh radar.
              </p>
            </div>

            {/* Verification Package */}
            <div className="bg-[#020512] p-4 rounded-2xl border border-blue-950 text-left space-y-2">
              <span className="font-mono text-[10px] text-blue-400 uppercase font-bold block">
                Official Haven Package Dispatched:
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-400 text-[16px]">solar_power</span>
                  <span>PM-Surya Mesh Bridge</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-cyan-400 text-[16px]">wifi_tethering</span>
                  <span>LoRa 865MHz Repeater</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-blue-400 text-[16px]">water_drop</span>
                  <span>Potable kaveri testing kit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-red-400 text-[16px]">medical_services</span>
                  <span>NDMA trauma pack</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs uppercase font-bold tactile-button shadow-lg shadow-blue-950"
            >
              Return to Live Radar Mesh
            </button>
          </div>
        ) : (
          /* Intake Form */
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Join neighbors in offering dry resting beds, PM-Surya solar generation, Kaveri/borewell drinking water, or HAM emergency relay points during severe events.
            </p>

            {/* Node Space Type */}
            <div>
              <label className="block font-mono text-[11px] text-slate-400 font-bold uppercase mb-1.5">
                Type of Space Being Offered
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'home', label: 'Apartment', icon: 'home' },
                  { id: 'cellar', label: 'Basement', icon: 'inventory_2' },
                  { id: 'solar', label: 'Rooftop Solar', icon: 'solar_power' },
                  { id: 'well', label: 'Water Sump', icon: 'water_drop' }
                ].map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => {
                      playTactileClick();
                      setNodeType(t.id as any);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      nodeType === t.id
                        ? 'bg-blue-950/80 border-blue-500 text-blue-200 shadow-md font-bold'
                        : 'bg-[#020512] border-blue-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] block mb-0.5">{t.icon}</span>
                    <span className="text-[11px] font-mono">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                  Haven / Space Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar Solar Oasis"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-900 bg-[#020512] text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                  Locality / Landmark Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100ft Road, Sector 07 South"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-900 bg-[#020512] text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Capacity Controls */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-[#020512] rounded-2xl border border-blue-950">
              <div>
                <label className="block font-mono text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Beds Available
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={bedsOffered}
                  onChange={(e) => setBedsOffered(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-blue-900 bg-[#060c22] font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Water (Liters/Day)
                </label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  value={waterLitersPerDay}
                  onChange={(e) => setWaterLitersPerDay(parseInt(e.target.value) || 50)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-blue-900 bg-[#060c22] font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  Solar Rooftop (kW)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="50"
                  value={solarKwCapacity}
                  onChange={(e) => setSolarKwCapacity(parseFloat(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-blue-900 bg-[#060c22] font-mono text-xs text-white"
                />
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-2">
              <span className="block font-mono text-[11px] text-slate-400 font-bold uppercase">
                Facility Readiness
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setPetAllowed(!petAllowed);
                  }}
                  className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                    petAllowed ? 'bg-blue-950 border-blue-500 text-blue-300 font-semibold' : 'bg-[#020512] border-blue-950 text-slate-500'
                  }`}
                >
                  {petAllowed ? '✓ ' : ''}🐕 Pet Friendly
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setWheelchairAccess(!wheelchairAccess);
                  }}
                  className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                    wheelchairAccess ? 'bg-blue-950 border-blue-500 text-blue-300 font-semibold' : 'bg-[#020512] border-blue-950 text-slate-500'
                  }`}
                >
                  {wheelchairAccess ? '✓ ' : ''}♿ Ramp Ready
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setHasFirstAid(!hasFirstAid);
                  }}
                  className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                    hasFirstAid ? 'bg-red-950 border-red-500 text-red-300 font-semibold' : 'bg-[#020512] border-blue-950 text-slate-500'
                  }`}
                >
                  {hasFirstAid ? '✓ ' : ''}🩹 First-Aid Box
                </button>
              </div>
            </div>

            {/* Callsign / Phone */}
            <div>
              <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                Ham Callsign or Direct Phone (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. VU2-BLR-88 or 080-2520-XXXX"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
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
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                <span>Confirm Node Registration</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
