'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';

function PrioritiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams?.get('role') || 'employer';
  const [selectedCards, setSelectedCards] = useState([]);

  const employerCards = [
    { id: 'cost', emoji: '💰', title: 'Cut benefits costs 20%+', desc: 'Reduce spending without sacrificing coverage' },
    { id: 'speed', emoji: '⏱️', title: 'Faster decisions', desc: 'Go from months to weeks' },
    { id: 'alignment', emoji: '🎯', title: 'Align stakeholders', desc: 'Get CEO, CFO, HR on same page' },
    { id: 'satisfaction', emoji: '😊', title: 'Employee happiness', desc: 'Improve benefits satisfaction scores' },
    { id: 'switch', emoji: '🔄', title: 'Switch brokers', desc: 'Find responsive specialist' },
    { id: 'expertise', emoji: '🎓', title: 'Need expertise', desc: 'Access specialized knowledge' }
  ];

  const brokerCards = [
    { id: 'specialization', emoji: '📊', title: 'Prove my niche', desc: 'Show specialization score' },
    { id: 'leads', emoji: '🎯', title: 'Qualified leads', desc: 'Get matched employer intros' },
    { id: 'fees', emoji: '💵', title: 'Higher fees', desc: 'Command 43% premium as specialist' },
    { id: 'close', emoji: '📈', title: 'Close rate', desc: 'Boost from 18% to 61%' },
    { id: 'leadership', emoji: '🏆', title: 'Thought leadership', desc: 'Build market authority' },
    { id: 'tools', emoji: '🤖', title: 'Decision tools', desc: 'Use AI-powered intelligence' }
  ];

  const cards = role === 'employer' ? employerCards : brokerCards;

  const toggleCard = (id) => {
    setSelectedCards(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedCards.length > 0) {
      const priorities = selectedCards.join(',');
      router.push(`/ai-chat?role=${role}&priorities=${priorities}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header showBackButton={true} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full">
          
          <div className="mb-10 text-center max-w-3xl mx-auto">
            {role === 'employer' ? (
              <div className="space-y-4">
                <div className="text-4xl md:text-5xl font-bold text-yellow-400">
                  4 weeks. 12 meetings.
                </div>
                <div className="text-2xl text-slate-300">
                  <span className="text-red-400 font-bold">59%</span> switch brokers by Year 2.
                </div>
                <div className="text-xl text-slate-400">
                  We do it in <span className="text-green-400 font-semibold">24 hours</span>.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl md:text-5xl font-bold text-orange-400">
                  61% vs 18%
                </div>
                <div className="text-2xl text-slate-300">
                  Specialists close <span className="text-purple-400 font-bold">3.4X more</span> deals.
                </div>
                <div className="text-xl text-slate-400">
                  Command <span className="text-purple-400 font-semibold">43% higher fees</span>.
                </div>
              </div>
            )}
          </div>

          <h2 className="text-2xl text-white text-center mb-3 font-semibold">
            {role === 'employer' 
              ? 'What challenges are you solving?' 
              : 'What are your goals?'
            }
          </h2>
          <p className="text-slate-400 text-center mb-8 text-sm">
            Select all that apply
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => toggleCard(card.id)}
                className={`text-left p-6 rounded-xl border-2 transition ${
                  selectedCards.includes(card.id)
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{card.emoji}</div>
                  <div className="flex-1">
                    <div className="text-white font-semibold mb-1">{card.title}</div>
                    <div className="text-slate-400 text-sm">{card.desc}</div>
                  </div>
                  {selectedCards.includes(card.id) && (
                    <div className="text-blue-400 text-xl">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={selectedCards.length === 0}
              className="px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white text-lg rounded-xl font-semibold transition disabled:cursor-not-allowed"
            >
              {selectedCards.length === 0 
                ? 'Select at least one' 
                : `Continue →`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrioritiesPage() {
  return (
    <Suspense>
      <PrioritiesContent />
    </Suspense>
  );
}
