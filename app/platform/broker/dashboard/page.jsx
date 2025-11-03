'use client';
import { useState } from 'react';

export default function BrokerDashboard() {
  const [leads] = useState([
    {
      id: 1,
      company: 'Acme Corp',
      size: '150 employees',
      industry: 'Technology',
      matchScore: 92,
      status: 'New',
      timeline: 'Immediate',
      budget: '$100K-$250K',
      priorities: { cfo: 45, hr: 65, ceo: 70, employee: 60 },
      submittedAt: '2 hours ago'
    },
    {
      id: 2,
      company: 'TechStart Inc',
      size: '75 employees',
      industry: 'SaaS',
      matchScore: 88,
      status: 'Contacted',
      timeline: '1-3 months',
      budget: '$50K-$100K',
      priorities: { cfo: 40, hr: 70, ceo: 55, employee: 65 },
      submittedAt: '1 day ago'
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-950">
      
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Broker Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Your qualified leads and active opportunities</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">2 New Leads</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">New Leads</span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">2</div>
            <p className="text-xs text-green-400">+1 this week</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Active Conversations</span>
              <span className="text-2xl">💬</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">5</div>
            <p className="text-xs text-blue-400">3 need follow-up</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Match Score Avg</span>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">87%</div>
            <p className="text-xs text-purple-400">Above network avg</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Close Rate</span>
              <span className="text-2xl">🎉</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">42%</div>
            <p className="text-xs text-green-400">+12% vs last month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium text-white mb-1">Update Profile</div>
              <div className="text-xs text-slate-400">Keep your expertise current</div>
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition">
              <div className="text-2xl mb-2">🛠️</div>
              <div className="font-medium text-white mb-1">Use AI Tools</div>
              <div className="text-xs text-slate-400">Align client stakeholders</div>
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-white mb-1">View Analytics</div>
              <div className="text-xs text-slate-400">Track your performance</div>
            </button>
          </div>
        </div>

        {/* Leads List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Qualified Leads</h2>
            <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300">
              <option>All Leads</option>
              <option>New</option>
              <option>Contacted</option>
              <option>In Progress</option>
            </select>
          </div>

          <div className="space-y-6">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-slate-900 border-2 border-slate-800 hover:border-blue-500/50 rounded-xl p-6 transition group">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {lead.company.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                          {lead.company}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'New' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{lead.size} • {lead.industry}</p>
                      <p className="text-xs text-slate-500 mt-1">Submitted {lead.submittedAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-blue-400 mb-1">{lead.matchScore}%</div>
                    <div className="text-xs text-slate-400">Match Score</div>
                  </div>
                </div>

                {/* Why Matched */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <p className="text-sm font-medium text-blue-300 mb-1">Why you matched:</p>
                  <p className="text-sm text-blue-200">
                    This {lead.size} {lead.industry.toLowerCase()} company has stakeholder priorities that align perfectly with your expertise in balanced cost-service solutions.
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Timeline</p>
                    <p className="text-sm font-bold text-white">{lead.timeline}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Budget</p>
                    <p className="text-sm font-bold text-white">{lead.budget}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Company Size</p>
                    <p className="text-sm font-bold text-white">{lead.size}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Industry</p>
                    <p className="text-sm font-bold text-white">{lead.industry}</p>
                  </div>
                </div>

                {/* Stakeholder Priorities Preview */}
                <div className="mb-6">
                  <p className="text-sm text-slate-400 mb-3">Stakeholder Priorities:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(lead.priorities).map(([key, value]) => (
                      <div key={key} className="bg-slate-800 rounded p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 capitalize">{key}</span>
                          <span className="text-sm font-bold text-blue-400">{value}%</span>
                        </div>
                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{width: value + '%'}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                    Accept Lead & Contact
                  </button>
                  <button className="px-6 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition border border-slate-700">
                    View Full Details
                  </button>
                  <button className="px-6 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition border border-slate-700">
                    Pass
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Network Stats */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Your Network Performance</h3>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">615+</div>
              <div className="text-sm text-slate-400">Total Brokers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-1">Top 15%</div>
              <div className="text-sm text-slate-400">Your Ranking</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-1">42%</div>
              <div className="text-sm text-slate-400">Your Close Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-1">$125K</div>
              <div className="text-sm text-slate-400">Avg Deal Size</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
