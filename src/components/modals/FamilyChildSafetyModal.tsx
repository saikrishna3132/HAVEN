import React, { useState } from 'react';
import { Haven } from '../../data/havenData';
import { playTactileClick, playSeismicAlarmTone } from '../../utils/audioSynth';

interface FamilyChildSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  havens: Haven[];
  onSelectHaven: (haven: Haven) => void;
  onFilterFamilyHavens: () => void;
}

interface RegisteredChild {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  allergies: string;
  emergencyNote: string;
  wristbandId: string;
}

export const FamilyChildSafetyModal: React.FC<FamilyChildSafetyModalProps> = ({
  isOpen,
  onClose,
  havens,
  onSelectHaven,
  onFilterFamilyHavens
}) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'lost_child' | 'havens' | 'pediatric_guide'>('registry');

  // Registered children state (persisted locally)
  const [childrenList, setChildrenList] = useState<RegisteredChild[]>([
    {
      id: 'child-1',
      name: 'Aarav Sharma',
      age: 5,
      bloodType: 'B+',
      allergies: 'Peanuts, Dust Asthma',
      emergencyNote: 'Carries emergency inhaler; wears reflective blue cap',
      wristbandId: 'CH-8492-JPR'
    },
    {
      id: 'child-2',
      name: 'Diya Sharma',
      age: 2,
      bloodType: 'O+',
      allergies: 'Lactose Sensitivity',
      emergencyNote: 'Requires lactose-free formula or boiled goat milk',
      wristbandId: 'CH-8493-JPR'
    }
  ]);

  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState<number | ''>('');
  const [newChildBlood, setNewChildBlood] = useState('O+');
  const [newChildAllergies, setNewChildAllergies] = useState('');
  const [newChildNotes, setNewChildNotes] = useState('');

  // Lost Child Broadcast form state
  const [lostChildName, setLostChildName] = useState('');
  const [lostChildAge, setLostChildAge] = useState('');
  const [lostChildClothing, setLostChildClothing] = useState('Yellow jacket, blue jeans, white sneakers');
  const [lastSeenLocation, setLastSeenLocation] = useState('Statue Circle / Near C-Scheme Central Park');
  const [parentContact, setParentContact] = useState('+91 98290-SAFE1 / Radio CH 04');
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'baby-formula': true,
    'ors-packets': true,
    'whistle': true,
    'diapers': true,
    'fever-syrup': false,
    'comfort-toy': true,
    'child-id-tag': true
  });

  if (!isOpen) return null;

  const familyHavens = havens.filter((h) => h.childFriendly);

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName || newChildAge === '') return;
    playTactileClick();
    const newChild: RegisteredChild = {
      id: `child-${Date.now()}`,
      name: newChildName,
      age: Number(newChildAge),
      bloodType: newChildBlood,
      allergies: newChildAllergies || 'None',
      emergencyNote: newChildNotes || 'Guardian accompanied',
      wristbandId: `CH-${Math.floor(1000 + Math.random() * 9000)}-JPR`
    };
    setChildrenList((prev) => [...prev, newChild]);
    setNewChildName('');
    setNewChildAge('');
    setNewChildAllergies('');
    setNewChildNotes('');
  };

  const handleRemoveChild = (id: string) => {
    playTactileClick();
    setChildrenList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleTriggerLostChildAlert = () => {
    playTactileClick();
    playSeismicAlarmTone();
    setBroadcastActive(true);
    setBroadcastMessage(
      `🚨 URGENT CHILD REUNION BROADCAST SENT ACROSS ENCRYPTED MESH: Search squads alerted for ${lostChildName || 'Child'} (${lostChildAge || 'Age 4'}, ${lostChildClothing}). Monitoring Radio CH 04 & nearest Peacekeeper Outposts.`
    );
  };

  const toggleCheck = (id: string) => {
    playTactileClick();
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#030718] border-2 border-emerald-500/70 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-950/80 via-[#061a12] to-blue-950/80 border-b border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <span className="material-symbols-outlined text-[24px]">escalator_warning</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-mono">
                  FAMILY & CHILD DEFENSE SHIELD
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  Child Safety First
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Protective protocols for families with toddlers, infants & young children during earthquakes
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-2 bg-[#020512] border-b border-blue-950 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => {
              playTactileClick();
              setActiveTab('registry');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'registry'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            <span>Child Registry ({childrenList.length})</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setActiveTab('lost_child');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'lost_child'
                ? 'bg-red-600 text-white shadow-md animate-pulse'
                : 'text-slate-400 hover:text-red-300 hover:bg-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            <span>Lost Child Mesh SOS</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setActiveTab('havens');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'havens'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">child_care</span>
            <span>Pediatric & Family Havens ({familyHavens.length})</span>
          </button>

          <button
            onClick={() => {
              playTactileClick();
              setActiveTab('pediatric_guide');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'pediatric_guide'
                ? 'bg-emerald-800 text-emerald-100 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Drills & Kit Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: CHILD REGISTRY & ID PASS */}
          {activeTab === 'registry' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-400 text-[24px] shrink-0 mt-0.5">
                  verified_user
                </span>
                <div className="text-xs font-mono text-slate-200">
                  <strong className="text-emerald-300 block mb-0.5 font-sans text-sm">
                    Civilian Child Evacuation Passport
                  </strong>
                  Store medical badges, blood groups, and pediatric notes. During an evacuation, peacekeepers and medical staff scan this wristband ID to prioritize infant nutrition and medication.
                </div>
              </div>

              {/* Registered Children Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {childrenList.map((child) => (
                  <div
                    key={child.id}
                    className="p-3.5 bg-[#050e26] border border-blue-900/80 rounded-2xl shadow-lg relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-blue-900/50">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center font-mono font-bold text-xs">
                            {child.age}y
                          </span>
                          <div>
                            <div className="font-bold text-white text-sm">{child.name}</div>
                            <div className="text-[10px] font-mono text-emerald-400">
                              TAG: {child.wristbandId}
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 bg-red-950 border border-red-800 text-red-300 rounded font-mono text-[10px] font-bold">
                          {child.bloodType}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1 text-xs font-mono text-slate-300">
                        <div>
                          <span className="text-slate-500">Allergies:</span>{' '}
                          <span className="text-amber-300 font-semibold">{child.allergies}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Notes:</span>{' '}
                          <span className="text-slate-200">{child.emergencyNote}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-blue-900/40 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Mesh Secured
                      </span>
                      <button
                        onClick={() => handleRemoveChild(child.id)}
                        className="text-red-400 hover:text-red-200 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Child Form */}
              <div className="p-4 bg-[#020512] border border-blue-900/60 rounded-2xl">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">person_add</span>
                  Register Child to Family Defense Shield
                </h3>
                <form onSubmit={handleAddChild} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-slate-400 mb-1">Child Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kabir Verma"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      required
                      className="w-full bg-[#050b1e] border border-blue-900 focus:border-emerald-500 px-3 py-2 rounded-xl text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Age (Years/Months)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4"
                      min="0"
                      max="17"
                      value={newChildAge}
                      onChange={(e) => setNewChildAge(e.target.value ? Number(e.target.value) : '')}
                      required
                      className="w-full bg-[#050b1e] border border-blue-900 focus:border-emerald-500 px-3 py-2 rounded-xl text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Blood Type</label>
                    <select
                      value={newChildBlood}
                      onChange={(e) => setNewChildBlood(e.target.value)}
                      className="w-full bg-[#050b1e] border border-blue-900 focus:border-emerald-500 px-3 py-2 rounded-xl text-white outline-none"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Allergies / Special Nutrition</label>
                    <input
                      type="text"
                      placeholder="e.g. Penicillin allergy, Needs infant milk formula"
                      value={newChildAllergies}
                      onChange={(e) => setNewChildAllergies(e.target.value)}
                      className="w-full bg-[#050b1e] border border-blue-900 focus:border-emerald-500 px-3 py-2 rounded-xl text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Distinct Features</label>
                    <input
                      type="text"
                      placeholder="e.g. Red glasses, Dinosaur backpack"
                      value={newChildNotes}
                      onChange={(e) => setNewChildNotes(e.target.value)}
                      className="w-full bg-[#050b1e] border border-blue-900 focus:border-emerald-500 px-3 py-2 rounded-xl text-white outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-1">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      Issue Civilian Child Safety Passport
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: LOST CHILD MESH SOS */}
          {activeTab === 'lost_child' && (
            <div className="space-y-5">
              <div className="p-4 bg-red-950/40 border-2 border-red-600/80 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-red-400 text-[28px] animate-pulse shrink-0">
                  emergency
                </span>
                <div>
                  <h3 className="font-bold text-red-200 text-sm font-mono">
                    EMERGENCY REUNION BEACON (BROADCAST OVER CIVIC MESH)
                  </h3>
                  <p className="text-xs text-red-300 font-mono mt-1">
                    If an earthquake tremor or evacuation separated you from your child, trigger this alert immediately. It pings all local volunteer patrols, fire units, and shelter gates with your child's description.
                  </p>
                </div>
              </div>

              {broadcastActive && (
                <div className="p-4 bg-red-950 border border-red-500 rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse">
                  <div className="flex items-center gap-2 text-red-300 font-mono text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    ACTIVE REUNION BROADCAST IN PROGRESS
                  </div>
                  <div className="mt-2 text-white font-mono text-xs leading-relaxed bg-black/60 p-3 rounded-xl border border-red-900">
                    {broadcastMessage}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-red-300">
                      Radio Repeater 142.400 MHz • All 8 Shelters Notified
                    </span>
                    <button
                      onClick={() => {
                        playTactileClick();
                        setBroadcastActive(false);
                      }}
                      className="px-3 py-1 bg-black border border-red-400 text-red-200 hover:text-white rounded-lg text-xs font-mono font-bold"
                    >
                      Child Found / Cancel Alert
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-[#050c22] p-4 rounded-2xl border border-blue-900/80 space-y-3.5 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Child's Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Diya Sharma"
                      value={lostChildName}
                      onChange={(e) => setLostChildName(e.target.value)}
                      className="w-full bg-[#020512] border border-blue-900 focus:border-red-500 px-3 py-2 rounded-xl text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Age & Height</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 years old, ~105 cm"
                      value={lostChildAge}
                      onChange={(e) => setLostChildAge(e.target.value)}
                      className="w-full bg-[#020512] border border-blue-900 focus:border-red-500 px-3 py-2 rounded-xl text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Clothing & Visual Identifiers</label>
                  <input
                    type="text"
                    value={lostChildClothing}
                    onChange={(e) => setLostChildClothing(e.target.value)}
                    className="w-full bg-[#020512] border border-blue-900 focus:border-red-500 px-3 py-2 rounded-xl text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Last Known Location / Landmark</label>
                  <input
                    type="text"
                    value={lastSeenLocation}
                    onChange={(e) => setLastSeenLocation(e.target.value)}
                    className="w-full bg-[#020512] border border-blue-900 focus:border-red-500 px-3 py-2 rounded-xl text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Guardian Phone & Radio Uplink</label>
                  <input
                    type="text"
                    value={parentContact}
                    onChange={(e) => setParentContact(e.target.value)}
                    className="w-full bg-[#020512] border border-blue-900 focus:border-red-500 px-3 py-2 rounded-xl text-white outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleTriggerLostChildAlert}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl font-mono shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all uppercase"
                >
                  <span className="material-symbols-outlined text-[20px]">cell_tower</span>
                  Broadcast Lost Child SOS to Mesh Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PEDIATRIC & FAMILY HAVENS */}
          {activeTab === 'havens' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-slate-300">
                  Showing <strong className="text-emerald-400">{familyHavens.length} Sanctuaries</strong> with baby care, pediatric doctors, and family rooms.
                </div>
                <button
                  onClick={() => {
                    playTactileClick();
                    onFilterFamilyHavens();
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-emerald-950 border border-emerald-600 text-emerald-200 hover:text-white rounded-xl text-xs font-mono font-bold transition-all shadow-md"
                >
                  Apply Filter on Main Feed →
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {familyHavens.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => {
                      playTactileClick();
                      onSelectHaven(h);
                      onClose();
                    }}
                    className="p-4 bg-[#050e24] hover:bg-[#071333] border border-emerald-500/50 hover:border-emerald-400 rounded-2xl cursor-pointer transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{h.name}</span>
                        {h.pediatricCare && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">
                            Pediatric ICU Doctor
                          </span>
                        )}
                        {h.familyRooms && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Private Family Rooms
                          </span>
                        )}
                        {h.babySupplies && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                            Baby Food & Diapers
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-mono text-slate-300">
                        {h.address}
                      </div>

                      {h.childSafetyTags && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {h.childSafetyTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-[#03081e] border border-emerald-900 text-emerald-300 text-[10px] font-mono rounded-lg"
                            >
                              ✓ {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right font-mono text-xs">
                        <div className="text-emerald-400 font-bold">{h.distance}</div>
                        <div className="text-slate-400 text-[11px]">{h.eta}</div>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold shadow-md">
                        Lock Route →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EARTHQUAKE DRILLS FOR KIDS & CHECKLIST */}
          {activeTab === 'pediatric_guide' && (
            <div className="space-y-5">
              {/* Kids Earthquake Survival Drill Card */}
              <div className="bg-[#051126] border border-blue-900 p-4 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">shield_with_heart</span>
                  "TURTLE TUCK & HOLD" — Teaching Kids Earthquake Safety
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-[#020512] p-3 rounded-xl border border-blue-950">
                    <strong className="text-amber-300 block mb-1">1. DROP DOWN</strong>
                    Drop to hands and knees immediately. Crawl away from windows, ceiling fans, tall bookcases, and mirrors.
                  </div>
                  <div className="bg-[#020512] p-3 rounded-xl border border-blue-950">
                    <strong className="text-amber-300 block mb-1">2. COVER HEAD</strong>
                    Slide under a sturdy table or desk. Cover child's neck and head with arms or a padded backpack.
                  </div>
                  <div className="bg-[#020512] p-3 rounded-xl border border-blue-950">
                    <strong className="text-amber-300 block mb-1">3. HOLD TIGHT</strong>
                    Hold onto table legs until shaking stops. Speak in a calm, steady rhythm: "We are safe, we are holding on together."
                  </div>
                </div>
              </div>

              {/* Infant Nutrition in Disasters */}
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl space-y-2 text-xs font-mono text-slate-200">
                <h4 className="text-emerald-300 font-bold text-sm font-sans flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">water_bottle</span>
                  Safe Infant Formula & Water Rules
                </h4>
                <p>
                  • Never use untested tap or flood water to mix infant milk. Boil water vigorously for 1 minute or use certified solar-filtered sealed water from Sanctuaries.
                </p>
                <p>
                  • Keep pre-measured dry powder in sealed airtight bags. If baby formula runs out, immediately head to <strong className="text-emerald-300">SMS Hospital</strong> or <strong className="text-emerald-300">Central Park Haven</strong> for government pediatric rations.
                </p>
                <p>
                  • Oral Rehydration Solution (ORS): For dehydration in diarrhea/vomiting, mix 1 packet in 1 liter of safe drinking water.
                </p>
              </div>

              {/* Interactive Grab-Bag Checklist */}
              <div className="bg-[#020512] border border-blue-900/60 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">checklist</span>
                  Family & Child Evacuation Backpack Checklist
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {[
                    { id: 'baby-formula', label: 'Infant Milk Formula (3-Day Supply)' },
                    { id: 'ors-packets', label: 'Oral Rehydration Salts (ORS) x 6' },
                    { id: 'fever-syrup', label: 'Child Paracetamol Syrup + Dropper' },
                    { id: 'whistle', label: 'Pealess Emergency LED Whistle for child' },
                    { id: 'diapers', label: 'Diapers & Antiseptic Baby Wipes' },
                    { id: 'child-id-tag', label: 'Child Wristband ID / Waterproof Card' },
                    { id: 'comfort-toy', label: 'Small Comfort Blanket / Favorite Toy' }
                  ].map((item) => (
                    <label
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                        checkedItems[item.id]
                          ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-200'
                          : 'bg-[#050b1e] border-blue-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedItems[item.id]}
                        onChange={() => {}}
                        className="rounded text-emerald-500 focus:ring-emerald-500 accent-emerald-500 w-4 h-4"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#020512] border-t border-blue-950 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-400">
            Emergency Hotline: <strong className="text-white">1098 (Childline India)</strong> • <strong className="text-white">112 (Disaster Helpline)</strong>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer font-bold"
          >
            Close Family Shield
          </button>
        </div>
      </div>
    </div>
  );
};
