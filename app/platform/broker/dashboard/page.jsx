'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BrokerDashboard() {
  const router = useRouter();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('rightfit_results');
    if (data) {
      setResults(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, []);

  if (!results || !results.metrics) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading your leads...</div>
      </div>
    );
  }

  const metrics = results.metrics;
  const extracted = results.extracted_data || {};

  // Mock employer leads based on broker profile
  const employerLeads = [
    {
      id: 1,
      company: "TechFlow Solutions",
      size: "120 employees",
      industry: extracted.primary_industries || "SaaS",
      alignment_score: 87,
      status: "In RFP",
      timeline: "2 weeks",
      budget: "$180K",
      pain_point: "Current broker lacks tech expertise, seeking specialist",
      decision_maker: "CFO",
      match_quality: 94
    },
    {
      id: 2,
      company: "DataCore Systems",
      size: "85 employees",
      industry: extracted.primary_industries || "SaaS",
      alignment_score: 82,
      status: "Unsatisfied with current",
      timeline: "1 month",
      budget: "$145K",
      pain_point: "Poor retention, high costs, wants industry benchmarks",
      decision_maker: "HR + CFO",
      match_quality: 91
    },
    {
      id: 3,
      company: "CloudNest Inc",
      size: "200 employees",
      industry: extracted.primary_industries || "SaaS",
      alignment_score: 79,
      status: "No broker",
      timeline: "3 weeks",
      budget: "$240K",
      pain_point: "Scaling fast, need proactive strategic partner",
      decision_maker: "CEO",
      match_quality: 88
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 65) return "text-blue-400";
    if (score >= 50) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center font-bold text-white">
              RF
            </div>
            <div>
              <div className="text-white font-bold">RightFit</div>
              <div className="text-slate-400 text-xs">Broker Dashboard</div>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-white text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Your Score Card */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Your Broker Specialization Score™</h2>
              <p className="text-slate-400">Industry concentration, retention, and service focus</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <div className="text-sm text-slate-400">Tier</div>
                <div className={`text-xl font-bold ${getScoreColor(metrics.overall_score)}`}>
                  {metrics.specialist_tier}
                </div>
              </div>
              <div className={`text-6xl font-bold ${getScoreColor(metrics.overall_score)}`}>
                {metrics.overall_score}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">Industry Focus</div>
              <div className="text-2xl font-bold text-blue-400">{metrics.industry_concentration}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">Retention</div>
              <div className="text-2xl font-bold text-green-400">{metrics.client_retention}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">Service Focus</div>
              <div className="text-2xl font-bold text-purple-400">{metrics.service_focus}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">Size Specialization</div>
              <div className="text-2xl font-bold text-orange-400">{metrics.size_specialization}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">Book Optimization</div>
              <div className="text-2xl font-bold text-yellow-400">{metrics.book_optimization}</div>
            </div>
          </div>

          {/* Market Positioning */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-600/20 to-green-600/10 border border-green-500/30 rounded-xl p-4">
              <div className="text-green-400 text-sm mb-1">Fee Premium</div>
              <div className="text-3xl font-bold text-white">+{metrics.fee_premium}%</div>
              <div className="text-slate-400 text-xs mt-1">vs generalists</div>
            </div>
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4">
              <div className="text-blue-400 text-sm mb-1">Close Rate</div>
              <div className="text-3xl font-bold text-white">{metrics.projected_close_rate}%</div>
              <div className="text-slate-400 text-xs mt-1">predicted</div>
            </div>
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-4">
              <div className="text-purple-400 text-sm mb-1">Avg Tenure</div>
              <div className="text-3xl font-bold text-white">{metrics.retention_years} yrs</div>
              <div className="text-slate-400 text-xs mt-1">client lifetime</div>
            </div>
          </div>
        </div>

        {/* Matched Employers */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Your Qualified Employer Leads</h2>
          <p className="text-slate-400 mb-6">
            Based on your Broker Specialization Score™ of {metrics.overall_score}, these employers have 
            <span className="text-green-400 font-semibold"> Employer Alignment Scores™</span> of 79+ and are pre-qualified for your niche.
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {employerLeads.map((lead, idx) => (
            <div key={lead.id} className="bg-slate-900/50 backdrop-blur border-2 border-slate-800 hover:border-purple-500 rounded-2xl p-6 transition">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{lead.company}</h3>
                    <p className="text-slate-400">{lead.size} • {lead.industry}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400 mb-1">Match Quality™</div>
                  <div className="text-4xl font-bold text-green-400">{lead.match_quality}</div>
                </div>
              </div>

              {/* Pain Point */}
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4 mb-4">
                <div className="text-sm font-semibold text-orange-400 mb-1">Their Pain Point</div>
                <div className="text-slate-300">{lead.pain_point}</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <div className="text-slate-400 text-xs mb-1">Alignment Score™</div>
                  <div className="text-lg font-bold text-blue-400">{lead.alignment_score}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Status</div>
                  <div className="text-lg font-bold text-white">{lead.status}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Timeline</div>
                  <div className="text-lg font-bold text-yellow-400">{lead.timeline}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Budget</div>
                  <div className="text-lg font-bold text-green-400">{lead.budget}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">Decision Maker</div>
                  <div className="text-lg font-bold text-white">{lead.decision_maker}</div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition">
                Request Introduction →
              </button>
            </div>
          ))}
        </div>

        {/* Specialization Advantage */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Your Specialist Advantage</h3>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Your Broker Specialization Score™ of {metrics.overall_score} positions you as a <span className="text-purple-400 font-semibold">{metrics.specialist_tier}</span>. 
            These leads are matched based on industry alignment, size fit, and decision readiness—not price shopping.
          </p>
          <div className="text-slate-400 text-sm mt-2">
            Patent-Pending Decision Science • Backed by Gartner, McKinsey, HBR
          </div>
        </div>
      </div>
    </div>
  );
}
