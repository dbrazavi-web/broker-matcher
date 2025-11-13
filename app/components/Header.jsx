'use client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="w-full bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">RF</span>
          </div>
          <div>
            <div className="text-white font-bold text-xl">RightFit</div>
            <div className="text-slate-400 text-xs">Decision Science Intelligence</div>
          </div>
        </button>
      </div>
    </header>
  );
}
