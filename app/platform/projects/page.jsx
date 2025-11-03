'use client';
import { useRouter } from 'next/navigation';

export default function PlatformProjects() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your benefits strategy projects</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Quick Start</h2>
          <p className="text-slate-400 text-sm mb-6">Begin your benefits journey</p>
          
          <div className="space-y-4">
            <button onClick={() => router.push('/platform/alignment')} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-left px-6 py-4 rounded-xl transition flex items-center gap-4 group">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">Start New Project</div>
                <div className="text-blue-100 text-sm">Align stakeholders and find your ideal broker</div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button onClick={() => router.push('/platform/matches')} className="w-full bg-slate-800 hover:bg-slate-700 text-white text-left px-6 py-4 rounded-xl transition flex items-center gap-4 border border-slate-700">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold">View Your Broker Matches</div>
                <div className="text-slate-400 text-sm">See your top 3 matched brokers</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
