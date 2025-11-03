'use client';
import { useState } from 'react';

export default function Matches() {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Your Top 3 Broker Matches</h1>
      <p className="text-slate-400 mb-4">Button clicks: {clicks}</p>
      <div className="space-y-6 max-w-5xl">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">#1 Strategic Benefits Group</h3>
            <div className="text-4xl font-bold text-blue-400">92%</div>
          </div>
          <button 
            onClick={() => {
              setClicks(clicks + 1);
              alert('Introduction request sent to Strategic Benefits Group! They will contact you within 24 hours.');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition"
          >
            Request Introduction
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">#2 Complete Care Advisors</h3>
            <div className="text-4xl font-bold text-blue-400">88%</div>
          </div>
          <button 
            onClick={() => {
              setClicks(clicks + 1);
              alert('Introduction request sent to Complete Care Advisors! They will contact you within 24 hours.');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition"
          >
            Request Introduction
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">#3 Modern Benefits Partners</h3>
            <div className="text-4xl font-bold text-blue-400">85%</div>
          </div>
          <button 
            onClick={() => {
              setClicks(clicks + 1);
              alert('Introduction request sent to Modern Benefits Partners! They will contact you within 24 hours.');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition"
          >
            Request Introduction
          </button>
        </div>
      </div>
    </div>
  );
}
