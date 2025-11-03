'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StakeholderAnalysis() {
  const router = useRouter();
  
  const [priorities, setPriorities] = useState({
    cfo: 50,
    hr: 50,
    ceo: 50,
    employee: 50
  });

  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    size: '',
    email: ''
  });

  const handleAnalyze = () => {
    sessionStorage.setItem('analysis', JSON.stringify({ priorities, companyInfo }));
    router.push('/analyze/results');
  };

  const isComplete = companyInfo.name && companyInfo.size && companyInfo.email;

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
        
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <span>Home</span>
            <span>›</span>
            <span className="text-blue-400">Stakeholder Analysis</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Benefits Strategy Analysis</h1>
          <p className="text-xl text-slate-300">
            Analyze competing priorities across your organization to determine the right benefits approach
          </p>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold">1</div>
            <div className="h-0.5 w-20 bg-slate-700"></div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-500">2</div>
            <div className="h-0.5 w-20 bg-slate-700"></div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-500">3</div>
          </div>
          <span className="ml-4 text-slate-400">Step 1 of 3</span>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-8">
          
          <h2 className="text-2xl font-bold mb-6">Company Information</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name *</label>
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                placeholder="e.g., Acme Corp"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Company Size *</label>
              <select
                value={companyInfo.size}
                onChange={(e) => setCompanyInfo({...companyInfo, size: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:border-blue-400 focus:outline-none"
              >
                <option value="">Select size</option>
                <option value="10-50">10-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Your Email *</label>
            <input
              type="email"
              value={companyInfo.email}
              onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
            />
          </div>

          <h2 className="text-2xl font-bold mb-6 mt-12">Stakeholder Priorities</h2>
          <p className="text-slate-300 mb-8">Adjust the sliders to indicate each stakeholder's primary focus</p>

          <div className="mb-10">
            <label className="block text-lg font-bold mb-4">CFO Priority</label>
            <div className="flex items-center gap-6">
              <span className="text-sm w-32 text-slate-400">Cost Control</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.cfo}
                  onChange={(e) => setPriorities({...priorities, cfo: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
                  style={{accentColor: '#60a5fa'}}
                />
              </div>
              <span className="text-sm w-32 text-right text-slate-400">Investment</span>
            </div>
            <div className="text-center mt-2">
              <span className="inline-block px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-sm font-medium">
                {priorities.cfo}%
              </span>
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-lg font-bold mb-4">HR Priority</label>
            <div className="flex items-center gap-6">
              <span className="text-sm w-32 text-slate-400">Simplicity</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.hr}
                  onChange={(e) => setPriorities({...priorities, hr: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{accentColor: '#60a5fa'}}
                />
              </div>
              <span className="text-sm w-32 text-right text-slate-400">Support</span>
            </div>
            <div className="text-center mt-2">
              <span className="inline-block px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-sm font-medium">
                {priorities.hr}%
              </span>
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-lg font-bold mb-4">CEO Priority</label>
            <div className="flex items-center gap-6">
              <span className="text-sm w-32 text-slate-400">Cost Focus</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.ceo}
                  onChange={(e) => setPriorities({...priorities, ceo: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{accentColor: '#60a5fa'}}
                />
              </div>
              <span className="text-sm w-32 text-right text-slate-400">Retention</span>
            </div>
            <div className="text-center mt-2">
              <span className="inline-block px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-sm font-medium">
                {priorities.ceo}%
              </span>
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-lg font-bold mb-4">Employee Priority</label>
            <div className="flex items-center gap-6">
              <span className="text-sm w-32 text-slate-400">Low Premium</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.employee}
                  onChange={(e) => setPriorities({...priorities, employee: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{accentColor: '#60a5fa'}}
                />
              </div>
              <span className="text-sm w-32 text-right text-slate-400">Coverage</span>
            </div>
            <div className="text-center mt-2">
              <span className="inline-block px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-sm font-medium">
                {priorities.employee}%
              </span>
            </div>
          </div>

        </div>

        <button
          onClick={handleAnalyze}
          disabled={!isComplete}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-lg transition shadow-lg shadow-blue-400/50"
        >
          Analyze Priorities →
        </button>

      </div>
    </div>
  );
}
