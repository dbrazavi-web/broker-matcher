'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AIChat() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { role: 'ai', content: "👋 Hi! I'm RightFit, your AI Benefits Agent. I'll help align your team in just 15 minutes. Let's start with some basics about your company.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    companyName: '',
    companySize: '',
    email: '',
    industry: '',
    growth: '',
    currentBroker: '',
    satisfaction: '',
    timeline: '',
    budget: '',
    painPoints: [],
    priorities: {},
    cfo: 50,
    hr: 50,
    ceo: 50,
    employee: 50
  });
  const [aiTyping, setAiTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const questions = [
    { key: 'companyName', question: "What's your company name?", type: 'text' },
    { key: 'companySize', question: "How many employees do you have?", type: 'select', options: ['10-50', '51-200', '201-500', '500+'] },
    { key: 'email', question: "What's your email?", type: 'text' },
    { key: 'industry', question: "What industry are you in?", type: 'select', options: ['Technology', 'Healthcare', 'Financial Services', 'Retail', 'Manufacturing', 'Professional Services', 'Other'] },
    { key: 'currentBroker', question: "Do you currently have a benefits broker?", type: 'select', options: ['Yes', 'No', 'Not sure'] }
  ];

  const predictAnswers = (industry, size) => {
    const predictions = {};
    if (industry === 'Technology') {
      predictions.growth = 'Growth (2-5 years)';
      predictions.budget = '100k-250k';
      predictions.painPoints = ['High costs', 'Employee dissatisfaction', 'Limited plan options'];
      predictions.priorities = { cfo: 45, hr: 65, ceo: 70, employee: 60 };
      predictions.timeline = 'Soon (1-3 months)';
    } else if (industry === 'Healthcare') {
      predictions.growth = 'Mature (5-10 years)';
      predictions.budget = '250k-500k';
      predictions.painPoints = ['Compliance concerns', 'Complex administration'];
      predictions.priorities = { cfo: 55, hr: 70, ceo: 60, employee: 55 };
      predictions.timeline = 'Planning (3-6 months)';
    } else {
      predictions.growth = 'Growth (2-5 years)';
      predictions.budget = '50k-100k';
      predictions.painPoints = ['High costs', 'Slow response times'];
      predictions.priorities = { cfo: 40, hr: 60, ceo: 55, employee: 55 };
      predictions.timeline = 'Soon (1-3 months)';
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

    if (currentQ.key === 'industry' && newAnswers.companySize) {
      const predictions = predictAnswers(answer, newAnswers.companySize);
      setTimeout(() => {
        addAIMessage('✨ Based on ' + answer + ' companies, I can predict the rest with 90% confidence. Want me to auto-fill?', 1000);
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'ai-suggestions', predictions: predictions, timestamp: new Date() }]);
        }, 1800);
      }, 500);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        addAIMessage(questions[currentQuestion + 1].question, 600);
        setCurrentQuestion(currentQuestion + 1);
      }, 400);
    }
  };

  const acceptPredictions = (predictions) => {
    setAnswers({ ...answers, ...predictions });
    sessionStorage.setItem('analysis', JSON.stringify({
      companyInfo: { name: answers.companyName, size: answers.companySize, email: answers.email },
      priorities: predictions.priorities
    }));
    addMessage('user', '✓ Accepted predictions');
    addAIMessage("Great! Let me create your analysis...", 800);
    setTimeout(() => router.push('/analyze/matrix'), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleAnswer(input);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RF</span>
            </div>
            <span className="text-xl font-bold">RightFit Benefits AI Agent</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI Agent Active</span>
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
                    <p className="text-xs text-slate-500 mt-1 ml-2">RightFit AI</p>
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
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur border-2 border-purple-500/50 rounded-2xl px-6 py-4">
                      <p className="text-purple-200 font-bold mb-3">🔮 AI Predictions</p>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="bg-slate-900/50 rounded p-2">
                          <span className="text-slate-400">Budget:</span>
                          <span className="text-white ml-2">${msg.predictions.budget}</span>
                        </div>
                        <div className="bg-slate-900/50 rounded p-2">
                          <span className="text-slate-400">Timeline:</span>
                          <span className="text-white ml-2">{msg.predictions.timeline}</span>
                        </div>
                      </div>
                      <button onClick={() => acceptPredictions(msg.predictions)} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg">
                        ✓ Accept & Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {aiTyping && (
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
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur p-6">
        <div className="max-w-3xl mx-auto">
          {currentQuestion < questions.length && questions[currentQuestion].type === 'select' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {questions[currentQuestion].options.map(option => (
                <button key={option} onClick={() => handleAnswer(option)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm">
                  {option}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your answer..." className="flex-1 px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white" />
            <button type="submit" disabled={!input.trim()} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-bold">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
