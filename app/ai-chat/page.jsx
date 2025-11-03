'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AIChat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'employer';
  
  const [messages, setMessages] = useState([
    { role: 'ai', content: role === 'broker' 
      ? "👋 Hi! I'm RightFit AI. Let me get you set up in our broker network - this takes 2 minutes. First, what's your firm name?"
      : "👋 Hi! I'm RightFit, your AI Benefits Agent. I'll help align your team in just a few minutes. Let's start - what's your company name?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    name: '',
    size: '',
    email: '',
    industry: '',
    yearsExp: '',
    specialty: ''
  });
  const [aiTyping, setAiTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const employerQuestions = [
    { key: 'name', question: "What's your company name?", type: 'text' },
    { key: 'size', question: "How many employees?", type: 'select', options: ['10-50', '51-200', '201-500', '500+'] },
    { key: 'email', question: "Your email?", type: 'text' },
    { key: 'industry', question: "What industry?", type: 'select', options: ['Technology', 'Healthcare', 'Financial Services', 'Retail', 'Manufacturing', 'Professional Services', 'Other'] },
  ];

  const brokerQuestions = [
    { key: 'name', question: "What's your firm name?", type: 'text' },
    { key: 'email', question: "Your email?", type: 'text' },
    { key: 'yearsExp', question: "Years of experience?", type: 'select', options: ['0-5', '5-10', '10-15', '15+'] },
    { key: 'size', question: "Sweet spot client size?", type: 'select', options: ['10-50', '51-200', '201-500', '500+', 'All sizes'] },
    { key: 'specialty', question: "Primary specialty?", type: 'select', options: ['SMB Focus', 'Enterprise', 'Cost Optimization', 'Tech Industry', 'Healthcare', 'Full Service'] },
  ];

  const questions = role === 'broker' ? brokerQuestions : employerQuestions;

  const brokerFollowUps = (answers) => {
    return {
      h1: "Quick question: Do SMB clients (10-100 employees) get same response time as larger clients?",
      h1Options: ['Yes, same service', 'No, enterprise gets priority', 'Depends on urgency'],
      h2: "Honestly - what's your minimum client size you'll take on?",
      h2Options: ['No minimum', '10-50', '50-100', '100+'],
      h3: "Would an employer pay $999/month for guaranteed same-day response?",
      h3Options: ['Yes, definitely', 'Maybe', 'No, too high'],
      h4: "Know other brokers who specialize in sub-100 employee companies?",
      h4Options: ['Yes, many', 'A few', 'No, rare']
    };
  };

  const predictAnswers = (industry, size) => {
    const predictions = {};
    if (industry === 'Technology') {
      predictions.priorities = { cfo: 45, hr: 65, ceo: 70, employee: 60 };
      predictions.timeline = '1-3 months';
      predictions.budget = '$100K-$250K';
    } else {
      predictions.priorities = { cfo: 40, hr: 60, ceo: 55, employee: 55 };
      predictions.timeline = '1-3 months';
      predictions.budget = '$50K-$100K';
    }
    return predictions;
  };

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  const addAIMessage = (content, delay = 800) => {
    setAiTyping(true);
    setTimeout(() => {
      addMessage('ai', content);
      setAiTyping(false);
    }, delay);
  };

  const handleAnswer = (answer) => {
    const currentQ = questions[currentQuestion];
    addMessage('user', answer);
    const newAnswers = { ...answers, [currentQ.key]: answer };
    setAnswers(newAnswers);

    // EMPLOYER: Show predictions after industry
    if (role === 'employer' && currentQ.key === 'industry' && newAnswers.size) {
      const predictions = predictAnswers(answer, newAnswers.size);
      setTimeout(() => {
        addAIMessage('✨ Based on ' + newAnswers.size + ' ' + answer + ' companies, here are my predictions...', 1000);
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'ai-suggestions', predictions: predictions, timestamp: new Date() }]);
        }, 1800);
      }, 500);
      return;
    }

    // BROKER: Show H1-H4 follow-ups after specialty
    if (role === 'broker' && currentQ.key === 'specialty') {
      setTimeout(() => {
        addAIMessage("Perfect! 4 quick follow-ups to match you better (30 seconds)...", 800);
        setTimeout(() => {
          const followUps = brokerFollowUps(newAnswers);
          setMessages(prev => [...prev, { role: 'broker-followups', followUps: followUps, timestamp: new Date() }]);
        }, 1600);
      }, 500);
      return;
    }

    // Move to next question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        addAIMessage(questions[currentQuestion + 1].question, 600);
        setCurrentQuestion(currentQuestion + 1);
      }, 400);
    }
  };

  const acceptPredictions = (predictions) => {
    sessionStorage.setItem('userRole', 'employer');
    sessionStorage.setItem('analysis', JSON.stringify({
      companyInfo: { name: answers.name, size: answers.size, email: answers.email },
      priorities: predictions.priorities,
      discovery: { industry: answers.industry, timeline: predictions.timeline, budget: predictions.budget }
    }));
    addMessage('user', '✓ Accepted');
    addAIMessage("Creating your dashboard...", 800);
    setTimeout(() => router.push('/platform/projects'), 2000);
  };

  const submitBrokerFollowUps = (followUpAnswers) => {
    sessionStorage.setItem('userRole', 'broker');
    sessionStorage.setItem('brokerProfile', JSON.stringify({
      ...answers,
      h1_response: followUpAnswers.h1,
      h2_response: followUpAnswers.h2,
      h3_response: followUpAnswers.h3,
      h4_response: followUpAnswers.h4
    }));
    addMessage('user', '✓ Completed');
    addAIMessage("Perfect! Setting up your dashboard...", 800);
    setTimeout(() => router.push('/platform/broker/dashboard'), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleAnswer(input);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex flex-col">
      <nav className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RF</span>
            </div>
            <span className="text-xl font-bold">RightFit Benefits AI</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-300 font-medium">{role === 'broker' ? 'Broker' : 'Employer'} Mode</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.role === 'ai' && (
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl rounded-tl-none px-6 py-4">
                      <p className="text-slate-100 leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              )}
              {msg.role === 'user' && (
                <div className="flex gap-4 items-start justify-end">
                  <div className="flex-1 max-w-xl">
                    <div className="bg-blue-600 rounded-2xl rounded-tr-none px-6 py-4">
                      <p className="text-white leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              )}
              {msg.role === 'ai-suggestions' && (
                <EmployerPredictions predictions={msg.predictions} onAccept={acceptPredictions} />
              )}
              {msg.role === 'broker-followups' && (
                <BrokerFollowUps followUps={msg.followUps} onSubmit={submitBrokerFollowUps} />
              )}
            </div>
          ))}
          {aiTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur p-6">
        <div className="max-w-3xl mx-auto">
          {currentQuestion < questions.length && questions[currentQuestion].type === 'select' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {questions[currentQuestion].options.map(option => (
                <button key={option} onClick={() => handleAnswer(option)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm transition">
                  {option}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your answer..." className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" />
            <button type="submit" disabled={!input.trim()} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-bold transition">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function EmployerPredictions({ predictions, onAccept }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
        <span className="text-xl">✨</span>
      </div>
      <div className="flex-1">
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur border-2 border-purple-500/50 rounded-2xl px-6 py-4">
          <p className="text-purple-200 font-bold mb-3">🔮 AI Predictions</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="bg-slate-900/50 rounded p-3">
              <span className="text-slate-400">Timeline:</span>
              <span className="text-white ml-2 font-medium">{predictions.timeline}</span>
            </div>
            <div className="bg-slate-900/50 rounded p-3">
              <span className="text-slate-400">Budget:</span>
              <span className="text-white ml-2 font-medium">{predictions.budget}</span>
            </div>
            <div className="bg-slate-900/50 rounded p-3">
              <span className="text-slate-400 block mb-2">Stakeholder Priorities:</span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(predictions.priorities).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 capitalize">{key}:</span>
                    <span className="text-blue-400 font-bold">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => onAccept(predictions)} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition">
            ✓ Accept & See My Matches
          </button>
        </div>
      </div>
    </div>
  );
}

function BrokerFollowUps({ followUps, onSubmit }) {
  const [followUpAnswers, setFollowUpAnswers] = useState({});

  const allAnswered = Object.keys(followUpAnswers).length === 4;

  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
        <span className="text-xl">📋</span>
      </div>
      <div className="flex-1">
        <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur border-2 border-green-500/50 rounded-2xl px-6 py-4">
          <p className="text-green-200 font-bold mb-4">Quick Follow-ups (H1-H4 Validation)</p>
          
          <div className="space-y-4 mb-4">
            {/* H1 */}
            <div className="bg-slate-900/50 rounded p-4">
              <p className="text-sm text-slate-300 mb-2">{followUps.h1}</p>
              <div className="flex flex-wrap gap-2">
                {followUps.h1Options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFollowUpAnswers({...followUpAnswers, h1: opt})}
                    className={`px-3 py-1 rounded text-xs transition ${
                      followUpAnswers.h1 === opt
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* H2 */}
            <div className="bg-slate-900/50 rounded p-4">
              <p className="text-sm text-slate-300 mb-2">{followUps.h2}</p>
              <div className="flex flex-wrap gap-2">
                {followUps.h2Options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFollowUpAnswers({...followUpAnswers, h2: opt})}
                    className={`px-3 py-1 rounded text-xs transition ${
                      followUpAnswers.h2 === opt
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* H3 */}
            <div className="bg-slate-900/50 rounded p-4">
              <p className="text-sm text-slate-300 mb-2">{followUps.h3}</p>
              <div className="flex flex-wrap gap-2">
                {followUps.h3Options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFollowUpAnswers({...followUpAnswers, h3: opt})}
                    className={`px-3 py-1 rounded text-xs transition ${
                      followUpAnswers.h3 === opt
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* H4 */}
            <div className="bg-slate-900/50 rounded p-4">
              <p className="text-sm text-slate-300 mb-2">{followUps.h4}</p>
              <div className="flex flex-wrap gap-2">
                {followUps.h4Options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFollowUpAnswers({...followUpAnswers, h4: opt})}
                    className={`px-3 py-1 rounded text-xs transition ${
                      followUpAnswers.h4 === opt
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSubmit(followUpAnswers)}
            disabled={!allAnswered}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
          >
            ✓ Complete & View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
        <span className="text-xl">🤖</span>
      </div>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl px-6 py-4">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
}
