'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Alignment() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [stakeholders, setStakeholders] = useState([
    { 
      id: 1, 
      name: 'DR', 
      email: 'dbrazavi@gmail.com', 
      role: 'CFO/Finance Lead', 
      type: 'internal', 
      invited: true, 
      responded: true,
      objectives: {
        costTarget: '$650',
        costTargetUnit: 'per employee per month',
        priorities: ['Cost control', 'Predictable budgeting'],
        concerns: ['Rising premiums', 'Hidden costs'],
        mustHaves: ['Comprehensive reporting', 'Cost transparency']
      },
      influence: 'high', 
      interest: 'high' 
    }
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

  const reports = [
    { name: 'Consolidated Summary', icon: '📑' },
    { name: 'Executive Summary', icon: '📄' },
    { name: 'Problem Solution Report', icon: '🔍' },
    { name: 'Stakeholder Discovery', icon: '👤' },
    { name: 'Business Case', icon: '💼' },
    { name: 'Build & Buy Requirements', icon: '🛠️' },
    { name: 'Financial Analysis', icon: '💰' },
    { name: 'Implementation Plan', icon: '📅' },
    { name: 'Risks', icon: '⚠️' },
    { name: 'Action Plan', icon: '✅' },
    { name: 'Operational Plan', icon: '⚙️' },
    { name: 'Approval Plan', icon: '✓' }
  ];

  const addStakeholder = () => {
    const newS = {
      id: stakeholders.length + 1,
      ...newStakeholder,
      type: 'internal',
      invited: false,
      responded: false,
      objectives: {},
      influence: 'medium',
      interest: 'medium'
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
    const shareLink = `${window.location.origin}/stakeholder-response?id=${selectedStakeholder.id}&project=startup123`;
    alert(`Invitation sent to ${email}!\n\nShare this link:\n${shareLink}`);
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
              <p className="text-slate-400 text-sm">Startup123 - 2025 Benefits Planning</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 font-medium"
            >
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
        
        {/* TAB 0: PROBLEM DEFINITION */}
        {tab === 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-3">Problem Definition</h2>
            <p className="text-slate-400 text-lg mb-8">What is each stakeholder looking to solve?</p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">{stakeholders.length}</div>
                <div className="text-sm text-slate-400">Total Stakeholders</div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                <div className="text-4xl font-bold text-green-400 mb-2">{stakeholders.filter(s => s.responded).length}</div>
                <div className="text-sm text-slate-400">Responded</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">{stakeholders.filter(s => !s.responded && s.invited).length}</div>
                <div className="text-sm text-slate-400">Pending</div>
              </div>
            </div>

            <div className="space-y-6">
              {stakeholders.map(s => (
                <div key={s.id} className="bg-slate-900 border-2 border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{s.name}</h3>
                          {s.type === 'internal' && <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">Internal</span>}
                        </div>
                        <div className="text-sm text-slate-400">{s.role}</div>
                      </div>
                    </div>
                    {s.responded ? (
                      <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Responded
                      </span>
                    ) : (
                      <button onClick={() => { setSelectedStakeholder(s); setShowInviteModal(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">
                        Send Invite
                      </button>
                    )}
                  </div>
                  {s.responded && s.objectives ? (
                    <div className="p-6 grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-3">PRIMARY OBJECTIVE</h4>
                        <div className="bg-slate-800 rounded-lg p-4">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-bold text-blue-400">{s.objectives.costTarget}</span>
                            <span className="text-sm text-slate-400">{s.objectives.costTargetUnit}</span>
                          </div>
                          <div className="text-sm text-slate-300">Target benefits cost</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-3">TOP PRIORITIES</h4>
                        <div className="space-y-2">
                          {s.objectives.priorities?.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-blue-400 font-bold text-xs">{i + 1}</div>
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500">
                      <p>Waiting for response...</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: STAKEHOLDER MAPPING */}
        {tab === 1 && (
          <div className="flex gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Stakeholder Matrix</h2>
              <p className="text-slate-400 mb-6">Map stakeholders based on influence and interest</p>
              
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg px-4 py-3">
                  <div className="text-sm font-medium mb-1">Key Players</div>
                  <div className="text-2xl font-bold text-blue-400">{quadrantCounts['key-players']}</div>
                </div>
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg px-4 py-3">
                  <div className="text-sm font-medium mb-1">Keep Satisfied</div>
                  <div className="text-2xl font-bold text-green-400">{quadrantCounts['keep-satisfied']}</div>
                </div>
                <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg px-4 py-3">
                  <div className="text-sm font-medium mb-1">Keep Informed</div>
                  <div className="text-2xl font-bold text-purple-400">{quadrantCounts['keep-informed']}</div>
                </div>
                <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg px-4 py-3">
                  <div className="text-sm font-medium mb-1">Minimal Effort</div>
                  <div className="text-2xl font-bold text-orange-400">{quadrantCounts['minimal-effort']}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 aspect-square">
                <div className="bg-green-900/20 border-2 border-green-500/30 rounded-xl p-6">
                  <h3 className="font-bold text-green-300 mb-2">Keep Satisfied</h3>
                  <p className="text-xs text-green-200/70 mb-4">High influence, low interest</p>
                  <div className="space-y-2">
                    {stakeholders.filter(s => getQuadrant(s) === 'keep-satisfied').map(s => (
                      <div key={s.id} className="bg-slate-900/50 rounded p-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium truncate">{s.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-900/20 border-2 border-blue-500/50 rounded-xl p-6">
                  <h3 className="font-bold text-blue-300 mb-2">Key Players</h3>
                  <p className="text-xs text-blue-200/70 mb-4">High influence, high interest</p>
                  <div className="space-y-2">
                    {stakeholders.filter(s => getQuadrant(s) === 'key-players').map(s => (
                      <div key={s.id} className="bg-slate-900/50 rounded p-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{s.name}</div>
                          {s.responded && <span className="text-green-400 text-xs">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-900/20 border-2 border-orange-500/30 rounded-xl p-6">
                  <h3 className="font-bold text-orange-300 mb-2">Minimal Effort</h3>
                  <p className="text-xs text-orange-200/70 mb-4">Low influence, low interest</p>
                </div>

                <div className="bg-purple-900/20 border-2 border-purple-500/30 rounded-xl p-6">
                  <h3 className="font-bold text-purple-300 mb-2">Keep Informed</h3>
                  <p className="text-xs text-purple-200/70 mb-4">Low influence, high interest</p>
                </div>
              </div>
            </div>

            <div className="w-80">
              <h3 className="text-lg font-bold mb-4">All Stakeholders ({stakeholders.length})</h3>
              <div className="space-y-2">
                {stakeholders.map(s => (
                  <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.role}</div>
                        <div className="text-xs text-slate-500">{s.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GOALS & SOLUTIONS */}
        {tab === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Goals & Solutions</h2>
            <div className="grid grid-cols-3 gap-4">
              {['Cost Optimization', 'Coverage Enhancement', 'Employee Engagement'].map(g => (
                <div key={g} className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-blue-500 cursor-pointer">
                  <h3 className="font-bold">{g}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CONNECT VENDORS */}
        {tab === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Connect Vendors & Experts</h2>
            <button onClick={() => router.push('/platform/matches')} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-bold">
              View Matched Brokers →
            </button>
          </div>
        )}

        {/* TAB 4: AI REPORTS */}
        {tab === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">AI Report & Insights</h2>
            <p className="text-slate-400 mb-8">12 comprehensive reports</p>
            <div className="grid grid-cols-3 gap-4">
              {reports.map(r => (
                <div key={r.name} className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-blue-500 cursor-pointer">
                  <span className="text-2xl mb-2 block">{r.icon}</span>
                  <h3 className="font-bold text-sm">{r.name}</h3>
                  <button className="mt-3 w-full text-xs bg-slate-800 hover:bg-slate-700 py-2 rounded">View Report</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Stakeholder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">Add Stakeholder</h3>
            <div className="space-y-4 mb-6">
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
                <select value={newStakeholder.role} onChange={(e) => setNewStakeholder({...newStakeholder, role: e.target.value})} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white">
                  <option value="">Select role...</option>
                  <option value="CFO/Finance Lead">CFO/Finance Lead</option>
                  <option value="HR Director">HR Director</option>
                  <option value="CEO">CEO</option>
                  <option value="Employee Representative">Employee Representative</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg">Cancel</button>
              <button onClick={addStakeholder} disabled={!newStakeholder.name || !newStakeholder.email || !newStakeholder.role} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-bold">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Invite {selectedStakeholder?.name}</h3>
            <p className="text-slate-400 text-sm mb-6">They'll receive a link to provide their input.</p>
            <input type="email" defaultValue={selectedStakeholder?.email} id="invite-email" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white mb-6" />
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
