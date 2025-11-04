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
      : "👋 Hi! I'm RightFit AI. I'll help you find your perfect broker match. What's your company name?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [showFollowups, setShowFollowups] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const employerQuestions = [
    { key: 'name', q: "What's your company name?", type: 'text', placeholder: 'e.g., Acme Corp' },
    { key: 'location', q: "Where is your company located?", type: 'text', placeholder: 'City, State (e.g., Austin, TX)' },
    { key: 'size', q: "How many employees?", type: 'buttons', opts: ['10-50', '51-200', '201-500', '500+'] },
    { key: 'email', q: "Your work email?", type: 'email', placeholder: 'you@company.com' },
    { key: 'industry', q: "What industry?", type: 'buttons', opts: ['Technology/SaaS', 'FinTech', 'Healthcare/Biotech', 'Financial Services', 'E-commerce/Retail', 'Professional Services', 'Manufacturing', 'Media/Entertainment', 'Other'] },
    { key: 'painPoint', q: "What's your #1 benefits challenge right now?", type: 'buttons', opts: ['Costs too high', 'Takes too long to decide', 'Stakeholders never agree', 'Poor employee satisfaction', 'Broker not responsive', 'Too complex to manage'] }
  ];

  const brokerQuestions = [
    { key: 'name', q: "What's your brokerage firm name?", type: 'text', placeholder: 'e.g., Strategic Benefits Group' },
    { key: 'location', q: "Where are you located?", type: 'text', placeholder: 'City, State (e.g., San Francisco, CA)' },
    { key: 'email', q: "Your work email?", type: 'email', placeholder: 'you@brokerage.com' },
    { key: 'years', q: "Years of experience in benefits?", type: 'buttons', opts: ['0-5 years', '5-10 years', '10-15 years', '15+ years'] },
    { key: 'clientSize', q: "Your sweet spot client size?", type: 'buttons', opts: ['10-50 employees', '51-200 employees', '201-500 employees', '500+ employees', 'All sizes'] },
    { key: 'specialty', q: "Primary specialty?", type: 'buttons', opts: ['SMB Focus', 'Enterprise', 'Cost Optimization', 'Tech/Startups', 'Healthcare Industry', 'Full Service'] }
  ];

  const questions = role === 'broker' ? brokerQuestions : employerQuestions;
  const currentQ = questions[step];

  const addMsg = (r, c) => setMessages(m => [...m, { role: r, content: c }]);

  const validateEmail = (email) => {
    const validDomains = /\.(com|co|org|edu|net|io|ai|gov|us)$/i;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && validDomains.test(email);
  };

  const handleAnswer = (ans) => {
    // Email validation
    if (currentQ.key === 'email') {
      if (!validateEmail(ans)) {
        setEmailError('Please enter a valid work email (e.g., you@company.com)');
        return;
      }
      setEmailError('');
    }

    addMsg('user', ans);
    const newData = { ...data, [currentQ.key]: ans };
    setData(newData);

    // AI PREDICTION based on location + industry
    if (role === 'employer' && currentQ.key === 'location') {
      // Extract city/state for future prediction logic
      console.log('Location captured for AI prediction:', ans);
    }

    // EMPLOYER: Show followups after pain point
    if (role === 'employer' && currentQ.key === 'painPoint') {
      setTimeout(() => {
        addMsg('ai', '✨ Got it! 4 quick questions to find your perfect match (30 sec)...');
        setTimeout(() => {
          setShowFollowups(true);
          setMessages(m => [...m, { role: 'employer-followups' }]);
        }, 1000);
      }, 500);
      return;
    }

    // BROKER: Show followups after specialty
    if (role === 'broker' && currentQ.key === 'specialty') {
      setTimeout(() => {
        addMsg('ai', '✨ Perfect! 4 quick questions to optimize your matches (30 sec)...');
        setTimeout(() => {
          setShowFollowups(true);
          setMessages(m => [...m, { role: 'broker-followups' }]);
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
                  <div className="bg-blue-600 rounded-2xl px-6 py-4 max-w-xl">{m.content}</div>
                </div>
              )}
              {m.role === 'employer-followups' && <EmployerFollowups data={data} onComplete={() => router.push('/platform/alignment')} />}
              {m.role === 'broker-followups' && <BrokerFollowups data={data} onComplete={() => router.push('/platform/broker/dashboard')} />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-700 bg-slate-900/50 p-6">
        <div className="max-w-3xl mx-auto">
          {!showFollowups && (
            <>
              {currentQ?.type === 'buttons' && (
                <div>
                  <p className="text-slate-400 text-sm mb-3">{currentQ.q}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentQ.opts.map(opt => (
                      <button key={opt} onClick={() => handleAnswer(opt)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm transition">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {(currentQ?.type === 'text' || currentQ?.type === 'email') && (
                <form onSubmit={(e) => { e.preventDefault(); if (input) { handleAnswer(input); setInput(''); } }} className="space-y-2">
                  <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder={currentQ.placeholder} 
                    type={currentQ.type === 'email' ? 'email' : 'text'}
                    className="w-full px-6 py-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                  />
                  {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
                  <button type="submit" className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition">
                    Continue →
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployerFollowups({ data, onComplete }) {
  const [a, setA] = useState({});
  const ready = !!(a.q1 && a.q2 && a.q3 && a.q4);

  // Smart questions based on their pain point
  const painPoint = data.painPoint || '';
  
  const qs = [
    { 
      k: 'q1', 
      q: painPoint.includes('long') || painPoint.includes('agree') 
        ? 'How long does your typical benefits decision take?' 
        : 'How satisfied are you with your current benefits decision process?', 
      opts: painPoint.includes('long') 
        ? ['< 1 week', '1-2 weeks', '2-4 weeks', '4+ weeks'] 
        : ['Very satisfied', 'Somewhat satisfied', 'Not satisfied']
    },
    { k: 'q2', q: 'Which stakeholders are typically involved in benefits decisions?', opts: ['Just me', 'CFO + HR', 'CFO + HR + CEO', 'Full team (4+)'] },
    { k: 'q3', q: 'What would save you the most time?', opts: ['Faster broker responses', 'Better stakeholder alignment', 'Clearer plan comparisons', 'All of the above'] },
    { k: 'q4', q: 'Ideal benefits cost per employee per month?', opts: ['Under $500', '$500-$700', '$700-$900', '$900+'] }
  ];

  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-purple-500 rounded-full flex-shrink-0">📋</div>
      <div className="flex-1 bg-purple-900/30 border-2 border-purple-500/50 rounded-2xl px-6 py-4">
        <p className="font-bold mb-4">Quick Match Questions</p>
        <div className="space-y-3 mb-4">
          {qs.map(q => (
            <div key={q.k} className="bg-slate-900/50 rounded p-3">
              <p className="text-sm mb-2 text-slate-300">{q.q}</p>
              <div className="flex flex-wrap gap-2">
                {q.opts.map(o => (
                  <button 
                    key={o} 
                    onClick={() => setA({...a, [q.k]: o})} 
                    className={`px-3 py-1 rounded text-xs transition ${a[q.k]===o ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
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
          className={`w-full py-3 rounded-lg font-bold transition ${ready ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer' : 'bg-slate-700 opacity-50 cursor-not-allowed'}`}
        >
          {ready ? '✓ Find My Matches' : `Answer all 4 (${Object.keys(a).length}/4)`}
        </button>
      </div>
    </div>
  );
}

function BrokerFollowups({ data, onComplete }) {
  const [a, setA] = useState({});
  const ready = !!(a.q1 && a.q2 && a.q3 && a.q4);

  const qs = [
    { k: 'q1', q: 'What % of your leads are qualified (good fit for your services)?', opts: ['<25%', '25-50%', '50-75%', '>75%'] },
    { k: 'q2', q: 'Average time spent on each new lead before qualification?', opts: ['<30 min', '30-60 min', '1-2 hours', '2+ hours'] },
    { k: 'q3', q: 'Do smaller clients (10-100 employees) get equal service as enterprise?', opts: ['Yes, same service', 'No, enterprise priority', 'Depends on fit'] },
    { k: 'q4', q: 'Biggest bottleneck in your sales process?', opts: ['Finding qualified leads', 'Client decision time', 'Stakeholder alignment', 'Pricing negotiations'] }
  ];

  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-green-500 rounded-full flex-shrink-0">📋</div>
      <div className="flex-1 bg-green-900/30 border-2 border-green-500/50 rounded-2xl px-6 py-4">
        <p className="font-bold mb-4">Quick Network Questions</p>
        <div className="space-y-3 mb-4">
          {qs.map(q => (
            <div key={q.k} className="bg-slate-900/50 rounded p-3">
              <p className="text-sm mb-2 text-slate-300">{q.q}</p>
              <div className="flex flex-wrap gap-2">
                {q.opts.map(o => (
                  <button 
                    key={o} 
                    onClick={() => setA({...a, [q.k]: o})} 
                    className={`px-3 py-1 rounded text-xs transition ${a[q.k]===o ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
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
          className={`w-full py-3 rounded-lg font-bold transition ${ready ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-slate-700 opacity-50 cursor-not-allowed'}`}
        >
          {ready ? '✓ Complete Setup' : `Answer all 4 (${Object.keys(a).length}/4)`}
        </button>
      </div>
    </div>
  );
}

export default function AIChat() {
  return <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}><ChatContent /></Suspense>;
}
