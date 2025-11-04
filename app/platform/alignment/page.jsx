'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Alignment() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [stakeholders, setStakeholders] = useState([
    { id: 1, name: 'DR', email: 'dbrazavi@gmail.com', role: 'Project Lead', type: 'internal', invited: true, responded: true, influence: 'high', interest: 'high' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [newStakeholder, setNewStakeholder] = useState({ name: '', email: '', role: '' });

  const tabs = [
    { name: 'Problem Definition', icon: '📋' },
    { name: 'Stakeholder Mapping', icon: '👥' },
    { name: 'Goals & Solutions', icon: '🎯' },
    { name: 'Connect Vendors & Experts', icon: '🤝' },
    { name: 'AI Report & Insights', icon: '📊' }
  ];

  const addStakeholder = () => {
    const newS = {
      id: stakeholders.length + 1,
      ...newStakeholder,
      type: 'internal',
      invited: false,
      responded: false,
      influence: 'low',
      interest: 'low'
    };
    setStakeholders([...stakeholders, newS]);
    setNewStakeholder({ name: '', email: '', role: '' });
    setShowAddModal(false);
  };

  const sendInvite = (email) => {
    const updated = stakeholders.map(s => 
      s.id === selectedStakeholder.id ? { ...s, email, invited: true } : s
    );
    setStakeholders(updated);
    setShowInviteModal(false);
    alert(`Invitation sent to ${email}! They'll receive a link to provide their input.`);
  };

  const getQuadrant = (s) => {
    if (s.influence === 'high' && s.interest === 'high') return 'key-players';
    if (s.influence === 'high' && s.interest === 'low') return 'keep-satisfied';
    if (s.influence === 'low' && s.interest === 'high') return 'keep-informed';
    return 'minimal-effort';
  };

  const quadrantCounts = {
    'key-players': stakeholders.filter(s => getQuadrant(s) === 'key-players').length,
    'keep-satisfied': stakeholders.filter(s => getQuadrant(s) === 'keep-satisfied').length,
    'keep-informed': stakeholders.filter(s => getQuadrant(s) === 'keep-informed').length,
    'minimal-effort': stakeholders.filter(s => getQuadrant(s) === 'minimal-effort').length
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Benefits Decision Alignment</h1>
              <p className="text-slate-400 text-sm">Startup123</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Invite Stakeholder
            </button>
          </div>
          <div className="flex gap-1 border-b border-slate-700">
            {tabs.map((t, i) => (
              <button key={i} onClick={() => setTab(i)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${tab === i ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}>
                <span>{t.icon}</span><span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Tab 1: Stakeholder Mapping */}
        {tab === 1 && (
          <div className="flex gap-6">
            
            {/* Left: Matrix */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Stakeholder Matrix</h2>
              <p className="text-slate-400 mb-6">Map stakeholders based on influence and interest levels</p>
              
              {/* Quadrant Badges */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/></svg>
                    <span className="text-sm font-medium">Key Players</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mt-1">{quadrantCounts['key-players']}</div>
                </div>
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="2"/></svg>
                    <span className="text-sm font-medium">Keep Satisfied</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mt-1">{quadrantCounts['keep-satisfied']}</div>
                </div>
                <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="4"/></svg>
                    <span className="text-sm font-medium">Keep Informed</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mt-1">{quadrantCounts['keep-informed']}</div>
                </div>
                <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L2 10l8 8 8-8-8-8z"/></svg>
                    <span className="text-sm font-medium">Minimal Effort</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400 mt-1">{quadrantCounts['minimal-effort']}</div>
                </div>
              </div>

              {/* Matrix Grid */}
              <div className="grid grid-cols-2 gap-4 aspect-square">
                {/* Top Left: Keep Satisfied */}
                <div className="bg-green-900/20 border-2 border-green-500/30 rounded-xl p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="2"/></svg>
                    <h3 className="font-bold text-green-300">Keep Satisfied</h3>
                    <span className="text-xs text-green-400 ml-auto">{quadrantCounts['keep-satisfied']}</span>
                  </div>
                  <p className="text-xs text-green-200/70 mb-4">High influence but low interest</p>
                  <div className="space-y-2 flex-1">
                    {stakeholders.filter(s => getQuadrant(s) === 'keep-satisfied').map(s => (
                      <div key={s.id} className="bg-slate-900/50 rounded p-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{s.name}</div>
                          <div className="text-xs text-slate-400 truncate">{s.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Right: Key Players */}
                <div className="bg-blue-900/20 border-2 border-blue-500/50 rounded-xl p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/></svg>
                    <h3 className="font-bold text-blue-300">Key Players</h3>
                    <span className="text-xs text-blue-400 ml-auto">{quadrantCounts['key-players']}</span>
                  </div>
                  <p className="text-xs text-blue-200/70 mb-4">High influence and high interest</p>
                  <div className="space-y-2 flex-1">
                    {stakeholders.filter(s => getQuadrant(s) === 'key-players').map(s => (
                      <div key={s.id} className="bg-slate-900/50 rounded p-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{s.name}</div>
                          <div className="text-xs text-slate-400 truncate">{s.role}</div>
                        </div>
                        {s.responded && <span className="text-green-400 text-xs">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Left: Minimal Effort */}
                <div className="bg-orange-900/20 border-2 border-orange-500/30 rounded-xl p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L2 10l8 8 8-8-8-8z"/></svg>
                    <h3 className="font-bold text-orange-300">Minimal Effort</h3>
                    <span className="text-xs text-orange-400 ml-auto">{quadrantCounts['minimal-effort']}</span>
                  </div>
                  <p className="text-xs text-orange-200/70 mb-4">Low influence and low interest</p>
                  <div className="space-y-2 flex-1">
                    {stakeholders.filter(s => getQuadrant(s) === 'minimal-effort').map(s => (
                      <div key={s.id} className="bg-slate-900/50 rounded p-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{s.name}</div>
                          <div className="text-xs text-slate-400 truncate">{s.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Right: Keep Informed */}
                <div className="bg-purple-900/20 border-2 border-purple-500/30 rounded-xl p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="4"/></svg>
                    <h3 className="font-bold text-purple-300">Keep Informed</h3>
                    <span className="text-xs text-purple-400 ml-auto">{quadrantCounts['keep-informed']}</span>
                  </div>
                  <p className="text-xs text-purple-200/70 mb-4">Low influence but high interest</p>
                  <div className="space-y-2 flex-1">
                    {stakeholders.filter(s => getQuadrant(s) === 'keep-informed').map(s => (
                      <div key={s.id} className="bg-slate-900/50 rounded p-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{s.name}</div>
                          <div className="text-xs text-slate-400 truncate">{s.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Stakeholder List */}
            <div className="w-80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">All Stakeholders</h3>
                <span className="text-sm text-slate-400">{stakeholders.length} Total</span>
              </div>
              <button onClick={() => setShowAddModal(true)} className="w-full mb-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Stakeholder
              </button>
              <div className="space-y-2">
                {stakeholders.map(s => (
                  <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-sm">{s.name}</div>
                          {s.type === 'internal' && (
                            <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">Internal</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{s.role}</div>
                        <div className="text-xs text-slate-500">{s.email}</div>
                        <div className="flex gap-2 mt-2">
                          {s.invited ? (
                            <span className={`text-xs ${s.responded ? 'text-green-400' : 'text-yellow-400'}`}>
                              {s.responded ? '✓ Responded' : '⏳ Pending'}
                            </span>
                          ) : (
                            <button onClick={() => { setSelectedStakeholder(s); setShowInviteModal(true); }} className="text-xs text-blue-400 hover:text-blue-300">
                              Send Invite
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs... */}
        {tab === 0 && <div className="bg-slate-900 rounded-xl p-8"><h2 className="text-2xl font-bold">Problem Definition</h2></div>}
        {tab === 2 && <div className="bg-slate-900 rounded-xl p-8"><h2 className="text-2xl font-bold">Goals & Solutions</h2></div>}
        {tab === 3 && <div className="bg-slate-900 rounded-xl p-8"><h2 className="text-2xl font-bold">Connect Vendors</h2></div>}
        {tab === 4 && <div className="bg-slate-900 rounded-xl p-8"><h2 className="text-2xl font-bold">AI Reports</h2></div>}

      </div>

      {/* Add Stakeholder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Add Stakeholder</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" value={newStakeholder.name} onChange={(e) => setNewStakeholder({...newStakeholder, name: e.target.value})} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" value={newStakeholder.email} onChange={(e) => setNewStakeholder({...newStakeholder, email: e.target.value})} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input type="text" value={newStakeholder.role} onChange={(e) => setNewStakeholder({...newStakeholder, role: e.target.value})} placeholder="e.g. CFO, HR Director" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg">Cancel</button>
              <button onClick={addStakeholder} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Invite {selectedStakeholder?.name}</h3>
            <p className="text-slate-400 text-sm mb-4">They'll receive a link to provide their priorities.</p>
            <input type="email" defaultValue={selectedStakeholder?.email} id="invite-email" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg">Cancel</button>
              <button onClick={() => sendInvite(document.getElementById('invite-email').value)} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
