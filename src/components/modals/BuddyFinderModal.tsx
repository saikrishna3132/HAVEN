import React, { useState } from 'react';
import { playTactileClick } from '../../utils/audioSynth';

interface BuddyFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BuddyRequest {
  id: string;
  names: string;
  route: string;
  timeframe: string;
  details: string;
  tags: string[];
  role: string;
}

export const BuddyFinderModal: React.FC<BuddyFinderModalProps> = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState<BuddyRequest[]>([
    {
      id: 'b1',
      names: 'Priya & Theo',
      route: 'C-Scheme Statue Circle → Jaigarh Fort Eco-Vault #01',
      timeframe: 'Departing in 15 mins (at 19:30)',
      details: 'Walking with gentle labrador and solar lantern. Carrying first-aid pouch and HAM radio. Seeking 1 or 2 companions for night walk.',
      tags: ['Pet Friendly', 'Solar Lantern', 'Quiet Pace'],
      role: 'Civilian Scout'
    },
    {
      id: 'b2',
      names: 'Arjun K.',
      route: 'SMS Hospital ER Pavilion → Malviya Nagar & WTP Hub',
      timeframe: 'Departing at 20:00',
      details: 'Electric cargo-cycle courier. Carrying insulated medicine box. Can escort walkers along illuminated asphalt corridor.',
      tags: ['Cargo Cycle', 'Med Supplies', 'Swift Pace'],
      role: 'Mesh Courier'
    },
    {
      id: 'b3',
      names: 'Dr. Meera & Father',
      route: 'Jal Mahal Lake Promenade → Central Park Safe Haven',
      timeframe: 'Departing in 35 mins',
      details: 'Paced walk with elder cane. Carrying water purity meter and dual VHF radio. Welcoming neighborhood companions.',
      tags: ['Wheelchair Assister', 'Elder Companion', 'Warm Paced'],
      role: 'Neighborhood Care'
    }
  ]);

  const [matchedId, setMatchedId] = useState<string | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [myName, setMyName] = useState('');
  const [myRoute, setMyRoute] = useState('');
  const [myTime, setMyTime] = useState('');
  const [myDetails, setMyDetails] = useState('');

  if (!isOpen) return null;

  const handlePairUp = (id: string) => {
    playTactileClick();
    setMatchedId(id);
  };

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();
    const newReq: BuddyRequest = {
      id: `b-${Date.now()}`,
      names: myName,
      route: myRoute,
      timeframe: myTime,
      details: myDetails,
      tags: ['New Request', 'Civic Verified'],
      role: 'Civilian Companion'
    };
    setRequests([newReq, ...requests]);
    setShowPostForm(false);
    setMatchedId(newReq.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
      <div className="w-full max-w-xl bg-[#04081c] rounded-3xl p-6 border border-blue-900/80 shadow-2xl shadow-black max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shadow-md shadow-blue-950">
              <span className="material-symbols-outlined text-[18px]">group_add</span>
            </span>
            <div>
              <span className="font-mono text-[10px] text-blue-400 uppercase font-semibold tracking-wider">
                Mutual Aid Accompaniment · India Mesh
              </span>
              <h3 className="text-base font-bold text-white">
                Survival Buddy Finder — Never Travel Alone
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

        {matchedId ? (
          /* Match Confirmation Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-500/80 text-blue-400 flex items-center justify-center mx-auto shadow-xl shadow-blue-950">
              <span className="material-symbols-outlined text-[34px]">connect_without_contact</span>
            </div>
            <div>
              <span className="bg-red-950 text-red-300 border border-red-700 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase">
                Pairing Verified
              </span>
              <h4 className="text-xl font-bold text-white mt-2">
                Travel Companion Connected!
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Direct rendezvous point transmitted to your civilian radio over{' '}
                <strong className="text-blue-300">CH 09 (142.900 MHz)</strong>. Meet at solar streetlamp checkpost.
              </p>
            </div>

            <div className="bg-[#020512] p-4 rounded-2xl border border-blue-950 text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Security Rule:</span>
                <span className="text-blue-400 font-bold">Always verify callsign in person</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Emergency Fallback:</span>
                <span className="text-red-400 font-bold">Dial 112 / Push SOS Top Beacon</span>
              </div>
            </div>

            <button
              onClick={() => {
                playTactileClick();
                setMatchedId(null);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs uppercase font-bold tactile-button shadow-lg shadow-blue-950"
            >
              Back to Buddy Requests
            </button>
          </div>
        ) : showPostForm ? (
          /* Post Form */
          <form onSubmit={handlePostRequest} className="py-4 space-y-3.5">
            <h4 className="font-bold text-sm text-white">Post Your Travel Route & Time</h4>
            <div>
              <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                Your Name / Callsign *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rohith & Ananya"
                value={myName}
                onChange={(e) => setMyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-blue-900 bg-[#020512] text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                Route (Origin → Safe Haven) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Indiranagar Metro → Cubbon Park Eco-Bunker"
                value={myRoute}
                onChange={(e) => setMyRoute(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-blue-900 bg-[#020512] text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                Departure Time *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Leaving in 20 minutes (at 18:45)"
                value={myTime}
                onChange={(e) => setMyTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-blue-900 bg-[#020512] text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate-300 font-bold uppercase mb-1">
                Details & Supplies Carried
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Carrying battery pack, pet harness, walking at moderate pace."
                value={myDetails}
                onChange={(e) => setMyDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-blue-900 bg-[#020512] text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setShowPostForm(false);
                }}
                className="w-1/3 py-2.5 rounded-xl border border-blue-900 bg-[#08122c] text-slate-300 text-xs font-mono uppercase font-bold hover:bg-[#0c1836]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono uppercase font-bold tactile-button shadow-lg shadow-blue-950"
              >
                Broadcast Buddy Request
              </button>
            </div>
          </form>
        ) : (
          /* List of requests */
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="font-mono text-xs text-slate-400">
                Active Civilian Walkers: <strong className="text-white">{requests.length} Nearby</strong>
              </span>
              <button
                onClick={() => {
                  playTactileClick();
                  setShowPostForm(true);
                }}
                className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/50 rounded-xl font-mono text-xs font-bold transition-all"
              >
                + Post My Route
              </button>
            </div>

            <div className="space-y-3">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-[#020512] rounded-2xl border border-blue-950 hover:border-blue-500/70 transition-all space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        <h4 className="font-bold text-white text-sm">{r.names}</h4>
                        <span className="font-mono text-[10px] text-slate-500">({r.role})</span>
                      </div>
                      <div className="font-mono text-xs text-blue-400 font-semibold">
                        {r.route}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-red-300 bg-red-950/80 border border-red-800/80 px-2 py-0.5 rounded font-bold shrink-0 ml-2">
                      {r.timeframe}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{r.details}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-blue-950">
                    <div className="flex flex-wrap gap-1">
                      {r.tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#060c22] border border-blue-950 text-[10px] font-mono text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handlePairUp(r.id)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider tactile-button shadow-md shadow-blue-950"
                    >
                      Pair Up Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
