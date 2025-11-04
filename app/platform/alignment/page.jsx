'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Alignment() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [priorities, setPriorities] = useState({ cfo: 50, hr: 50, ceo: 50, employee: 50 });

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
        {tab === 0 && (
          <div className="bg-slate-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Define Your Problem</h2>
            <textarea className="w-full px-4 py-3 bg-slate-800 rounded-lg text-white" rows="4" placeholder="Describe your challenge..."></textarea>
          </div>
        )}

        {tab === 1 && (
          <div className="bg-slate-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Map Stakeholder Priorities</h2>
            <div className="space-y-6">
              {[
                { key: 'cfo', label: 'CFO' },
                { key: 'hr', label: 'HR Director' },
                { key: 'ceo', label: 'CEO' },
                { key: 'employee', label: 'Employees' }
              ].map(s => (
                <div key={s.key} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">{s.label}</h3>
                    <span className="text-3xl font-bold text-blue-400">{priorities[s.key]}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={priorities[s.key]} onChange={(e) => setPriorities({...priorities, [s.key]: parseInt(e.target.value)})} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 2 && (
          <div className="bg-slate-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Goals & Solutions</h2>
            <div className="grid grid-cols-3 gap-4">
              {['Cost Optimization', 'Coverage Enhancement', 'Employee Engagement'].map(g => (
                <div key={g} className="bg-slate-800 rounded-lg p-6 hover:border hover:border-blue-500 cursor-pointer">
                  <h3 className="font-bold">{g}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 3 && (
          <div className="bg-slate-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Your Matched Brokers</h2>
            <button onClick={() => router.push('/platform/matches')} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-bold">
              View Your Top 3 Matches →
            </button>
          </div>
        )}

        {tab === 4 && (
          <div className="bg-slate-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">AI Report & Insights</h2>
            <p className="text-slate-400 mb-8">12 comprehensive reports</p>
            <div className="grid grid-cols-3 gap-4">
              {reports.map(r => (
                <div key={r.name} className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-blue-500 cursor-pointer">
                  <span className="text-2xl mb-2 block">{r.icon}</span>
                  <h3 className="font-bold text-sm">{r.name}</h3>
                  <button className="mt-3 w-full text-xs bg-slate-700 hover:bg-slate-600 py-2 rounded">View Report</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button onClick={() => setTab(Math.max(0, tab - 1))} disabled={tab === 0} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg">← Previous</button>
          <button onClick={() => setTab(Math.min(4, tab + 1))} disabled={tab === 4} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg">Continue →</button>
        </div>
      </div>
    </div>
  );
}
