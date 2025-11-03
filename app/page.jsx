'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleRoleSelect = (role) => {
    sessionStorage.setItem('userRole', role);
    router.push(`/ai-chat?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        
        <nav className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">RF</span>
              </div>
              <div>
                <div className="font-bold text-lg">RightFit Benefits</div>
                <div className="text-xs text-slate-400">AI Decision Intelligence</div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-8 py-20 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-8">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-300 text-sm font-medium">Powered by Agentic AI</span>
          </div>

          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Benefits Decisions in One Day,<br />Not Four Weeks
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered decision intelligence that aligns stakeholders, matches you with the perfect broker, and eliminates weeks of back-and-forth meetings.
          </p>

          <div className="flex items-center justify-center gap-8 mb-16">
            <div>
              <div className="text-3xl font-bold text-blue-400">615+</div>
              <div className="text-sm text-slate-400">Brokers</div>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div>
              <div className="text-3xl font-bold text-purple-400">1 Day</div>
              <div className="text-sm text-slate-400">vs 4 Weeks</div>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div>
              <div className="text-3xl font-bold text-green-400">90%</div>
              <div className="text-sm text-slate-400">Match Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            <button onClick={() => handleRoleSelect('employer')} onMouseEnter={() => setHoveredRole('employer')} onMouseLeave={() => setHoveredRole(null)} className="group relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300"></div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                  I'm an Employer
                </h3>
                
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Align your team and find the perfect broker. Skip weeks of meetings and get matched with 3 ideal partners today.
                </p>

                <ul className="space-y-3 mb-6">
                  {['Stakeholder alignment', 'AI-powered broker matching', '3 vetted options in 24 hours', 'Free decision report'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className="text-sm font-medium text-blue-400">Start Free →</span>
                  <div className={`w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center transition-all ${hoveredRole === 'employer' ? 'bg-blue-500' : ''}`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>

            <button onClick={() => handleRoleSelect('broker')} onMouseEnter={() => setHoveredRole('broker')} onMouseLeave={() => setHoveredRole(null)} className="group relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 hover:border-purple-500 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-300"></div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition">
                  I'm a Broker
                </h3>
                
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Get qualified leads and close deals faster. Join 615+ brokers receiving pre-aligned clients ready to decide.
                </p>

                <ul className="space-y-3 mb-6">
                  {['Qualified employer leads', 'AI tools for your clients', 'Higher close rates', 'Free to join network'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className="text-sm font-medium text-purple-400">Join Network →</span>
                  <div className={`w-8 h-8 rounded-full border-2 border-purple-500 flex items-center justify-center transition-all ${hoveredRole === 'broker' ? 'bg-purple-500' : ''}`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
