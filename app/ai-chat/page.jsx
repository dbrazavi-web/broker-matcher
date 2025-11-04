'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams?.get('role') || 'employer';
  
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // BROKER: Show follow-up questions immediately
  if (role === 'broker' && step === 0) {
    const ready = answers.q1 && answers.q2 && answers.q3 && answers.q4;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Broker Setup - 4 Quick Questions</h1>
          
          <div className="bg-green-900/30 border-2 border-green-500/50 rounded-xl p-6">
            <div className="space-y-4 mb-6">
              
              <div className="bg-slate-900/50 rounded p-4">
                <p className="text-sm mb-3">Do SMB clients (10-100 employees) get same response time as larger clients?</p>
                <div className="flex gap-2">
                  {['Yes', 'No', 'Depends'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setAnswers({...answers, q1: opt})}
                      className={`px-4 py-2 rounded transition ${answers.q1 === opt ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <p className="text-sm mb-3">What's your minimum client size?</p>
                <div className="flex gap-2">
                  {['No min', '10-50', '50-100', '100+'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setAnswers({...answers, q2: opt})}
                      className={`px-4 py-2 rounded transition ${answers.q2 === opt ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <p className="text-sm mb-3">Would employers pay $999/month for guaranteed same-day response?</p>
                <div className="flex gap-2">
                  {['Yes', 'Maybe', 'No'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setAnswers({...answers, q3: opt})}
                      className={`px-4 py-2 rounded transition ${answers.q3 === opt ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <p className="text-sm mb-3">Know brokers who specialize in sub-100 employee companies?</p>
                <div className="flex gap-2">
                  {['Yes many', 'A few', 'No rare'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setAnswers({...answers, q4: opt})}
                      className={`px-4 py-2 rounded transition ${answers.q4 === opt ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <button 
              onClick={() => router.push('/platform/broker/dashboard')}
              disabled={!ready}
              className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                ready 
                  ? 'bg-green-600 hover:bg-green-700 cursor-pointer' 
                  : 'bg-slate-700 opacity-50 cursor-not-allowed'
              }`}
            >
              {ready ? '✓ Go to Dashboard!' : `Answer all 4 questions (${Object.keys(answers).length}/4)`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMPLOYER: Simple flow
  if (role === 'employer' && step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Employer Setup</h1>
          <button 
            onClick={() => router.push('/platform/projects')}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-xl"
          >
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-950 text-white p-8">Loading...</div>;
}

export default function AIChat() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
