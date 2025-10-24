'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { findTopMatches } from '../../../lib/matching-algorithm';

export default function MatchingDashboard() {
  const supabase = createClientComponentClient();
  const [employers, setEmployers] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [empData, brkData] = await Promise.all([
      supabase.from('employer_survey_responses').select('*').order('created_at', { ascending: false }),
      supabase.from('broker_survey_responses').select('*')
    ]);
    
    setEmployers(empData.data || []);
    setBrokers(brkData.data || []);
    setLoading(false);
  };

  const selectEmployer = (employer) => {
    setSelectedEmployer(employer);
    const matches = findTopMatches(employer, brokers);
    setTopMatches(matches);
  };

  const sendIntro = async (broker, matchScore) => {
    alert('Intro sent! Employer: ' + (selectedEmployer.company_name || 'Employer') + '\nBroker: ' + (broker.firm_name || 'Broker') + '\nMatch Score: ' + matchScore + '%');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading matching engine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold mb-2">🤖 AI-Assisted Matching Dashboard</h1>
        <p className="text-gray-400">Select an employer to see AI-suggested broker matches</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">📋 Employer Queue ({employers.length})</h2>
              
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {employers.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">No employers yet</div>
                ) : (
                  employers.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => selectEmployer(emp)}
                      className={'p-4 rounded-lg border-2 cursor-pointer transition-all ' + (selectedEmployer?.id === emp.id ? 'border-purple-500 bg-purple-900 bg-opacity-20' : 'border-gray-600 hover:border-gray-500 bg-gray-900')}
                    >
                      <div className="font-bold text-lg mb-1">{emp.company_name || 'Anonymous'}</div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>👥 {emp.employee_count}</div>
                        <div>🏢 {emp.industry}</div>
                        <div>💰 {emp.annual_spend}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!selectedEmployer ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <h3 className="text-2xl font-bold mb-2">Select an Employer</h3>
                <p className="text-gray-400">Click an employer to see AI matches</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-purple-900 bg-opacity-20 border border-purple-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">🎯 Matches for: {selectedEmployer.company_name || 'Employer'}</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-400">Size:</span> <span className="ml-2 font-semibold">{selectedEmployer.employee_count}</span></div>
                    <div><span className="text-gray-400">Industry:</span> <span className="ml-2 font-semibold">{selectedEmployer.industry}</span></div>
                    <div><span className="text-gray-400">Budget:</span> <span className="ml-2 font-semibold">{selectedEmployer.annual_spend}</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {topMatches.length === 0 ? (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                      <div className="text-gray-400">No brokers available yet</div>
                    </div>
                  ) : (
                    topMatches.map((match, idx) => {
                      const broker = brokers.find(b => b.id === match.brokerId);
                      const medal = ['🥇', '🥈', '🥉'][idx] || '🏅';
                      const scoreColor = match.score >= 80 ? 'text-green-400' : match.score >= 60 ? 'text-yellow-400' : 'text-orange-400';
                      
                      return (
                        <div key={match.brokerId} className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{medal}</span>
                              <div>
                                <h3 className="text-xl font-bold">{match.brokerName}</h3>
                                <div className="text-sm text-gray-400">{broker.client_size} • {broker.years_in_business}</div>
                              </div>
                            </div>
                            <div className={'text-4xl font-bold ' + scoreColor}>{match.score}%</div>
                          </div>

                          <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded-lg p-3 mb-3">
                            <div className="font-semibold text-green-400 mb-1 text-sm">✓ Why This Match:</div>
                            <ul className="space-y-1 text-xs">
                              {match.reasons.map((reason, i) => (
                                <li key={i} className="text-gray-300">• {reason}</li>
                              ))}
                            </ul>
                          </div>

                          <button
                            onClick={() => sendIntro(broker, match.score)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                          >
                            📧 Send Introduction
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
