'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlatformProjects() {
  const router = useRouter();
  const [projects] = useState([
    {
      id: 1,
      name: 'Q1 2025 Benefits Strategy',
      company: 'Acme Corp',
      status: 'In Progress',
      progress: 65,
      lastViewed: '2 hours ago',
      role: 'Project Lead'
    },
    {
      id: 2,
      name: 'Broker Evaluation',
      company: 'TechStart Inc',
      status: 'Started',
      progress: 15,
      lastViewed: '5 days ago',
      role: 'Contributor'
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-slate-400 text-sm mt-1">Manage your benefits strategy projects</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Quick Start</h2>
          <p className="text-slate-400 text-sm mb-6">Begin solving your benefits challenges</p>
          
          <div className="space-y-4">
            <button onClick={() => router.push('/ai-chat')} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-left px-6 py-4 rounded-xl transition flex items-center gap-4 group">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">Define a New Project</div>
                <div className="text-blue-100 text-sm">Start stakeholder alignment and find your ideal broker</div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Projects</h2>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                        {project.name}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{project.company}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white font-bold">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: project.progress + '%' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Last Viewed: {project.lastViewed}</p>
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium">
                    Continue →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
