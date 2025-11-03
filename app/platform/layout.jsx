'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PlatformLayout({ children }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Detect role from URL
  const isBroker = pathname?.includes('/broker');
  const role = isBroker ? 'broker' : 'employer';

  const employerNav = [
    { name: 'Projects', icon: '📊', path: '/platform/projects' },
    { name: 'Stakeholder Alignment', icon: '👥', path: '/platform/alignment' },
    { name: 'Broker Matches', icon: '🤝', path: '/platform/matches' },
    { name: 'Reports', icon: '📄', path: '/platform/reports' },
    { name: 'Team', icon: '👤', path: '/platform/team' },
  ];

  const brokerNav = [
    { name: 'Dashboard', icon: '📊', path: '/platform/broker/dashboard' },
    { name: 'My Leads', icon: '🎯', path: '/platform/broker/leads' },
    { name: 'Active Clients', icon: '👥', path: '/platform/broker/clients' },
    { name: 'Profile', icon: '⚙️', path: '/platform/broker/profile' },
  ];

  const navItems = role === 'broker' ? brokerNav : employerNav;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300`}>
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RF</span>
              </div>
              <div>
                <div className="font-bold text-sm">RightFit Benefits</div>
                <div className="text-xs text-slate-400">AI Agent</div>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 hover:bg-slate-800 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="text-xl">{item.icon}</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">DR</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">You</div>
                <div className="text-xs text-slate-400 truncate capitalize">{role}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {children}
      </div>

    </div>
  );
}
