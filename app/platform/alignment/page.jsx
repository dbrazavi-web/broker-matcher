'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Alignment() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [priorities, setPriorities] = useState({ cfo: 50, hr: 50, ceo: 50, employee: 50 });
  const [stakeholders, setStakeholders] = useState([
    { id: 1, name: 'CFO', email: '', invited: false, responded: false },
    { id: 2, name: 'HR Director', email: '', invited: false, responded: false },
    { id: 3, name: 'CEO', email: '', invited: false, responded: false },
    { id: 4, name: 'Employees Rep', email: '', invited: false, responded: false }
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);

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

  const handleInvite = (stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setShowInviteModal(true);
  };

  const sendInvite = (email) => {
    const updated = stakeholders.map(s => 
      s.id === selectedStakeholder.id ? { ...s, email, invited: true } : s
    );
    setStakeholders(updated);
    setShowInviteModal(false);
    alert(`Invitation sent to ${email}! They'll receive a link to provide their input.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-bold mb-6">Stakeholder Alignment</h1>
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
        
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Step {tab + 1} of {tabs.length}</span>
            <span className="text-white font-bold">{Math.round(((tab + 1) / tabs.length) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all" style={{ width: `${((tab + 1) / tabs.length) * 100}%` }}></div>
          </div>
        </div>

        {/* Tab 0: Problem Definition */}
        {tab === 0 && (
          <div className="bg-slate-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Define Your Problem</h2>
            <p className="text-slate-400 mb-6">What benefits challenge are you trying to solve?</p>
            <textarea className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" rows="4" placeholder="Describe your main challenge..."></textarea>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Timeline</label>
                <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white">
                  <option>Immediate (1 month)</option>
                  <option>Soon (1-3 months)</option>
                  <option>Planning (3-6 months)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Budget Range</label>
                <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white">
                  <option>$50K - $100K</option>
                  <option>$100K - $250K</option>
                  <option>$250K+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Stakeholder Mapping */}
        {tab === 1 && (
          <div className="space-y-6">
            
            {/* Invite Summary */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Stakeholder Input Collection</h3>
                  <p className="text-blue-200 text-sm mb-4">
                    Invite key stakeholders to provide their priorities. {stakeholders.filter(s => s.invited).length} of {stakeholders.length} invited.
                  </p>
                </div>
              </div>
            </div>

            {/* Stakeholder Cards */}
            <div className="bg-slate-900 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Map Stakeholder Priorities</h2>
              <div className="space-y-4">
                {stakeholders.map(s => (
                  <div key={s.id} className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-2xl">👤</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{s.name}</h3>
                          {s.invited ? (
                            <div className="flex items-center gap-2 text-sm">
                              <span className={`${s.responded ? 'text-green-400' : 'text-yellow-400'}`}>
                                {s.responded ? '✓ Responded' : '⏳ Invited - Pending'}
                              </span>
                              <span className="text-slate-500">({s.email})</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">Not yet invited</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleInvite(s)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          s.invited 
                            ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {s.invited ? 'Resend Invite' : 'Invite Stakeholder'}
                      </button>
                    </div>
                    
                    {/* Priority Slider */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-400">Priority Level</span>
                        <span className="text-2xl font-bold text-blue-400">{priorities[s.name.toLowerCase().split(' ')[0]] || 50}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={priorities[s.name.toLowerCase().split(' ')[0]] || 50}
                        onChange={(e) => setPriorities({...priorities, [s.name.toLowerCase().split(' ')[0]]: parseInt(e.target.value)})}
                        className="w-full" 
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>Cost Focus</span>
                        <span>Service Focus</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Goals */}
        {tab === 2 && (
          <div className="bg-slate-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Goals & Solutions</h2>
            <div className="grid grid-cols-3 gap-4">
              {['Cost Optimization', 'Coverage Enhancement', 'Employee Engagement', 'Compliance', 'Strategic Planning', 'Vendor Management'].map(g => (
                <div key={g} className="bg-slate-800 rounded-lg p-6 hover:border hover:border-blue-500 cursor-pointer transition">
                  <h3 className="font-bold mb-2">{g}</h3>
                  <p className="text-sm text-slate-400">Explore strategies</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Brokers */}
        {tab === 3 && (
          <div className="bg-slate-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Your Matched Brokers</h2>
            <p className="text-slate-400 mb-6">Based on stakeholder priorities</p>
            <button onClick={() => router.push('/platform/matches')} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-bold">
              View Your Top 3 Matches →
            </button>
          </div>
        )}

        {/* Tab 4: Reports */}
        {tab === 4 && (
          <div className="bg-slate-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">AI Report & Insights</h2>
            <p className="text-slate-400 mb-8">12 comprehensive reports</p>
            <div className="grid grid-cols-3 gap-4">
              {reports.map(r => (
                <div key={r.name} className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-blue-500 cursor-pointer transition">
                  <span className="text-2xl mb-2 block">{r.icon}</span>
                  <h3 className="font-bold text-sm mb-3">{r.name}</h3>
                  <button className="w-full text-xs bg-slate-700 hover:bg-slate-600 py-2 rounded">View Report</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={() => setTab(Math.max(0, tab - 1))} disabled={tab === 0} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg">← Previous</button>
          <button onClick={() => setTab(Math.min(4, tab + 1))} disabled={tab === 4} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg">Continue →</button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Invite {selectedStakeholder?.name}</h3>
            <p className="text-slate-400 text-sm mb-4">
              They'll receive an email with a link to provide their priorities for this benefits project.
            </p>
            <input
              type="email"
              placeholder="Enter email address"
              defaultValue={selectedStakeholder?.email}
              id="invite-email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg">
                Cancel
              </button>
              <button 
                onClick={() => {
                  const email = document.getElementById('invite-email').value;
                  if (email) sendInvite(email);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
