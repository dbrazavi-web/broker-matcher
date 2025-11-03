'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalysisResults() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('analysis');
    if (!stored) {
      router.push('/analyze');
      return;
    }
    
    setData(JSON.parse(stored));
    setTimeout(() => setLoading(false), 2000);
  }, [router]);

  if (!data) return null;

  const { priorities, companyInfo } = data;

  const getRecommendation = () => {
    const avgScore = (priorities.cfo + priorities.hr + priorities.ceo + priorities.employee) / 4;
    
    if (avgScore < 40) {
      return {
        type: 'Tech Platform',
        score: 85,
        reason: 'Strong cost focus across stakeholders suggests tech-enabled platform with lower overhead.',
        approach: 'Self-service platform with automated workflows'
      };
    } else if (avgScore > 60) {
      return {
        type: 'Traditional Broker',
        score: 82,
        reason: 'High service and support needs indicate traditional full-service broker is best fit.',
        approach: 'Dedicated broker with hands-on strategic consulting'
      };
    } else {
      return {
        type: 'Hybrid Approach',
        score: 79,
        reason: 'Mixed priorities suggest hybrid model combining tech efficiency with broker expertise.',
        approach: 'Tech platform with broker advisory services'
      };
    }
  };

  const recommendation = getRecommendation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-slate-300">Analyzing stakeholder priorities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BM</span>
            </div>
            <span className="text-xl font-bold">BrokerMatch</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <span>Home</span>
            <span>›</span>
            <span>Analysis</span>
            <span>›</span>
            <span className="text-blue-400">Results</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Analysis Complete</h1>
          <p className="text-slate-300">Project: {companyInfo.name}</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Strategic Recommendation Ready!</h3>
            <p className="text-green-200">Your benefits strategy analysis has been generated based on stakeholder priorities.</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400/20 to-blue-800/20 border-2 border-blue-400 rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{recommendation.type}</h2>
              <p className="text-blue-200">Recommended Approach</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-blue-400">{recommendation.score}%</div>
              <div className="text-sm text-blue-300">Fit Score</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Why This Approach:</h3>
              <p className="text-slate-300">{recommendation.reason}</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Implementation:</h3>
              <p className="text-slate-300">{recommendation.approach}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6">Stakeholder Priority Summary</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">CFO</span>
                <span className="text-blue-400 font-bold">{priorities.cfo}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{width: `${priorities.cfo}%`}}></div>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {priorities.cfo < 50 ? 'Cost-focused' : 'Investment-focused'}
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">HR</span>
                <span className="text-blue-400 font-bold">{priorities.hr}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{width: `${priorities.hr}%`}}></div>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {priorities.hr < 50 ? 'Simplicity-focused' : 'Support-focused'}
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">CEO</span>
                <span className="text-blue-400 font-bold">{priorities.ceo}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{width: `${priorities.ceo}%`}}></div>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {priorities.ceo < 50 ? 'Cost-efficient' : 'Retention-focused'}
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Employees</span>
                <span className="text-blue-400 font-bold">{priorities.employee}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{width: `${priorities.employee}%`}}></div>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {priorities.employee < 50 ? 'Premium-conscious' : 'Coverage-focused'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          
            href="https://calendly.com/dbrazavi"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-center font-bold py-4 rounded-lg transition shadow-lg"
          >
            Book Strategy Call
          </a>
          
          
            href="/surveys/employer"
            className="bg-slate-700 hover:bg-slate-600 text-white text-center font-bold py-4 rounded-lg transition"
          >
            Get Matched with Brokers
          </a>
        </div>

      </div>
    </div>
  );
}
