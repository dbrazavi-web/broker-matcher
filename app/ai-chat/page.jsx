'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams?.get('role') || 'employer';
  
  const [messages, setMessages] = useState([
    { role: 'ai', content: role === 'broker' 
      ? "👋 Hi! I'm RightFit AI. Let me get you set up in our broker network - takes 2 minutes. What's your firm name?"
      : "👋 Hi! I'm RightFit AI. I'll help align your team in just a few minutes. What's your company name?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [showFollowups, setShowFollowups] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const employerQuestions = [
    { key: 'name', q: "What's your company name?", type: 'text' },
    { key: 'size', q: "How many employees?", type: 'buttons', opts: ['10-50', '51-200', '201-500', '500+'] },
    { key: 'email', q: "Your email?", type: 'text' },
    { key: 'industry', q: "What industry?", type: 'buttons', opts: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Other'] }
  ];

  const brokerQuestions = [
    { key: 'name', q: "What's your firm name?", type: 'text' },
    { key: 'email', q: "Your email?", type: 'text' },
    { key: 'years', q: "Years of experience?", type: 'buttons', opts: ['0-5', '5-10', '10-15', '15+'] },
    { key: 'clientSize', q: "Sweet spot client size?", type: 'buttons', opts: ['10-50', '51-200', '201-500', '500+'] },
    { key: 'specialty', q: "Primary specialty?", type: 'buttons', opts: ['SMB Focus', 'Enterprise', 'Cost Optimization', 'Tech Industry', 'Healthcare'] }
  ];

  const questions = role === 'broker' ? brokerQuestions : employerQuestions;
  const currentQ = questions[step];

  const addMsg = (r, c) => setMessages(m => [...m, { role: r, content: c }]);

  const handleAnswer = (ans) => {
    addMsg('user', ans);
    const newData = { ...data, [currentQ.key]: ans };
    setData(newData);

    // EMPLOYER: Show predictions after industry
    if (role === 'employer' && currentQ.key === 'industry') {
      setTimeout(() => {
        setMessages(m => [...m, { role: 'predict' }]);
      }, 800);
      return;
    }

    // BROKER: Show followups after specialty
    if (role === 'broker' && currentQ.key === 'specialty') {
      setTimeout(() => {
        addMsg('ai', 'Perfect! 4 quick follow-ups (30 seconds)...');
        setTimeout(() => {
          setShowFollowups(true);
          setMessages(m => [...m, { role: 'followups' }]);
        }, 1000);
      }, 500);
      return;
    }

    // Next question
    if (step < questions.length - 1) {
      setStep(step + 1);
      setTimeout(() => addMsg('ai', questions[step + 1].q), 600);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col">
      <nav className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-sm">RF</span>
          </div>
          <span className="font-bold">RightFit Benefits AI</span>
        </div>
      </nav>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((m, i) => (
            <div key={i}>
              {m.role === 'ai' && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">🤖</div>
                  <div className="bg-slate-800 rounded-2xl px-6 py-4">{m.content}</div>
                </div>
              )}
              {m.role === 'user' && (
                <div className="flex justify-end">
                  <div className="bg-blue-600 rounded-2xl px-6 py-4">{m.content}</div>
                </div>
              )}
              {m.role === 'predict' && <PredictBox onAccept={() => router.push('/platform/projects')} />}
              {m.role === 'followups' && <FollowupsBox onComplete={() => router.push('/platform/broker/dashboard')} />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-700 bg-slate-900/50 p-6">
        <div className="max-w-3xl mx-auto">
          {!showFollowups && currentQ?.type === 'buttons' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentQ.opts.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition">
                  {opt}
                </button>
              ))}
            </div>
          )}
          {!showFollowups && currentQ?.type === 'text' && (
            <form onSubmit={(e) => { e.preventDefault(); if (input) { handleAnswer(input); setInput(''); } }} className="flex gap-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your answer..." className="flex-1 px-6 py-3 bg-slate-800 rounded-xl text-white" />
              <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold">Send</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function PredictBox({ onAccept }) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-purple-500 rounded-full flex-shrink-0">✨</div>
      <div className="flex-1 bg-purple-900/30 border-2 border-purple-500/50 rounded-2xl px-6 py-4">
        <p className="font-bold mb-2">🔮 AI Predictions</p>
        <div className="bg-slate-900/50 rounded p-3 mb-4">
          <span className="text-slate-400">Budget:</span>
          <span className="ml-2">$100K-$250K</span>
        </div>
        <button onClick={onAccept} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold">
          ✓ Accept & Continue
        </button>
      </div>
    </div>
  );
}

function FollowupsBox({ onComplete }) {
  const [a, setA] = useState({});
  const ready = a.q1 && a.q2 && a.q3 && a.q4;

  const qs = [
    { k: 'q1', q: 'Do SMB clients (10-100 employees) get same response time as larger clients?', opts: ['Yes', 'No', 'Depends'] },
    { k: 'q2', q: "What's your minimum client size?", opts: ['No min', '10-50', '50-100', '100+'] },
    { k: 'q3', q: 'Would employers pay $999/month for guaranteed same-day response?', opts: ['Yes', 'Maybe', 'No'] },
    { k: 'q4', q: 'Know brokers who specialize in sub-100 employee companies?', opts: ['Yes many', 'A few', 'No rare'] }
  ];

  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-green-500 rounded-full flex-shrink-0">📋</div>
      <div className="flex-1 bg-green-900/30 border-2 border-green-500/50 rounded-2xl px-6 py-4">
        <p className="font-bold mb-4">Quick Follow-ups</p>
        <div className="space-y-3 mb-4">
          {qs.map(q => (
            <div key={q.k} className="bg-slate-900/50 rounded p-3">
              <p className="text-sm mb-2">{q.q}</p>
              <div className="flex flex-wrap gap-2">
                {q.opts.map(o => (
                  <button 
                    key={o} 
                    onClick={() => setA({...a, [q.k]: o})} 
                    className={`px-3 py-1 rounded text-xs transition ${a[q.k]===o ? 'bg-green-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={onComplete}
          disabled={!ready}
          className={`w-full py-3 rounded-lg font-bold transition ${ready ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-700 opacity-50 cursor-not-allowed'}`}
        >
          {ready ? '✓ Complete!' : `Answer all 4 (${Object.keys(a).length}/4)`}
        </button>
      </div>
    </div>
  );
}

export default function AIChat() {
  return <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}><ChatContent /></Suspense>;
}
