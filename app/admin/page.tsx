'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AnalysisEngine from './analysis';
import Link from 'next/link';

export default function AdminDashboard() {
  const supabase = createClientComponentClient();
  const [employerResponses, setEmployerResponses] = useState([]);
  const [brokerResponses, setBrokerResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchResponses();
    
    const employerChannel = supabase
      .channel('employer_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'employer_survey_responses' }, () => {
        fetchResponses();
      })
      .subscribe();

    const brokerChannel = supabase
      .channel('broker_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'broker_survey_responses' }, () => {
        fetchResponses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(employerChannel);
      supabase.removeChannel(brokerChannel);
    };
  }, []);

  const fetchResponses = async () => {
    try {
      const [employerData, brokerData] = await Promise.all([
        supabase.from('employer_survey_responses').select('*').order('created_at', { ascending: false }),
        supabase.from('broker_survey_responses').select('*').order('created_at', { ascending: false })
      ]);
      
      setEmployerResponses(employerData.data || []);
      setBrokerResponses(brokerData.data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const employerCount = employerResponses.length;
    const brokerCount = brokerResponses.length;
    
    const avgEmployerFindingSatisfaction = employerCount > 0 
      ? (employerResponses.reduce((sum, r) => sum + r.finding_satisfaction, 0) / employerCount).toFixed(1)
      : 0;
    
    const avgBrokerLeadSatisfaction = brokerCount > 0
      ? (brokerResponses.reduce((sum, r) => sum + r.lead_gen_satisfaction, 0) / brokerCount).toFixed(1)
      : 0;

    const employerInterested = employerResponses.filter(r => r.platform_interest === 'yes' || r.platform_interest === 'maybe').length;
    const brokerInterested = brokerResponses.filter(r => r.platform_interest === 'yes' || r.platform_interest === 'maybe').length;

    return {
      employerCount,
      brokerCount,
      avgEmployerFindingSatisfaction,
      avgBrokerLeadSatisfaction,
      employerInterested,
      brokerInterested
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading responses...</div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Survey Analysis Dashboard</h1>
            <p className="text-gray-400">Real-time responses and hypothesis validation</p>
          </div>
          <Link 
            href="/admin/matching"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg flex items-center gap-2"
          >
            🤖 AI Matching Dashboard
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-purple-900 border border-purple-700 rounded-lg p-4">
            <div className="text-purple-300 text-sm mb-1">Employer Responses</div>
            <div className="text-3xl font-bold">{stats.employerCount}</div>
          </div>
          
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
            <div className="text-blue-300 text-sm mb-1">Broker Responses</div>
            <div className="text-3xl font-bold">{stats.brokerCount}</div>
          </div>

          <div className="bg-purple-900 border border-purple-700 rounded-lg p-4">
            <div className="text-purple-300 text-sm mb-1">Employer Finding Satisfaction</div>
            <div className="text-3xl font-bold">{stats.avgEmployerFindingSatisfaction}/10</div>
          </div>

          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
            <div className="text-blue-300 text-sm mb-1">Broker Lead Satisfaction</div>
            <div className="text-3xl font-bold">{stats.avgBrokerLeadSatisfaction}/10</div>
          </div>

          <div className="bg-green-900 border border-green-700 rounded-lg p-4">
            <div className="text-green-300 text-sm mb-1">Employer Interested</div>
            <div className="text-3xl font-bold">{stats.employerInterested}</div>
          </div>

          <div className="bg-green-900 border border-green-700 rounded-lg p-4">
            <div className="text-green-300 text-sm mb-1">Broker Interested</div>
            <div className="text-3xl font-bold">{stats.brokerInterested}</div>
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button onClick={() => setActiveTab('overview')} className={'px-6 py-3 font-semibold transition-colors ' + (activeTab === 'overview' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400 hover:text-white')}>Overview</button>
          <button onClick={() => setActiveTab('employer')} className={'px-6 py-3 font-semibold transition-colors ' + (activeTab === 'employer' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400 hover:text-white')}>Employer Responses ({stats.employerCount})</button>
          <button onClick={() => setActiveTab('broker')} className={'px-6 py-3 font-semibold transition-colors ' + (activeTab === 'broker' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white')}>Broker Responses ({stats.brokerCount})</button>
          <button onClick={() => setActiveTab('analysis')} className={'px-6 py-3 font-semibold transition-colors ' + (activeTab === 'analysis' ? 'border-b-2 border-green-500 text-green-400' : 'text-gray-400 hover:text-white')}>Analysis & Correlations</button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">📈 Quick Insights</h2>
              
              {stats.employerCount === 0 && stats.brokerCount === 0 ? (
                <div className="text-gray-400 text-center py-8">No responses yet. Share your survey links to start collecting data!</div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-400 mb-2">Employer Side</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• {stats.employerCount} responses collected</li>
                      <li>• Average finding satisfaction: {stats.avgEmployerFindingSatisfaction}/10</li>
                      <li>• {stats.employerInterested} interested in platform ({stats.employerCount > 0 ? Math.round((stats.employerInterested / stats.employerCount) * 100) : 0}%)</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-400 mb-2">Broker Side</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• {stats.brokerCount} responses collected</li>
                      <li>• Average lead gen satisfaction: {stats.avgBrokerLeadSatisfaction}/10</li>
                      <li>• {stats.brokerInterested} interested in platform ({stats.brokerCount > 0 ? Math.round((stats.brokerInterested / stats.brokerCount) * 100) : 0}%)</li>
                    </ul>
                  </div>

                  {stats.employerCount >= 10 && stats.brokerCount >= 10 && (
                    <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded-lg p-4">
                      <h3 className="font-semibold text-green-400 mb-2">✅ Ready for Analysis</h3>
                      <p className="text-gray-300">You have enough responses to start hypothesis testing. Check the Analysis tab!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">🔗 Survey Links</h2>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-purple-400 font-semibold mb-2">Employer Survey</div>
                  <code className="text-sm text-gray-300 bg-gray-800 px-3 py-2 rounded block">{typeof window !== 'undefined' ? window.location.origin : ''}/survey/employer</code>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold mb-2">Broker Survey</div>
                  <code className="text-sm text-gray-300 bg-gray-800 px-3 py-2 rounded block">{typeof window !== 'undefined' ? window.location.origin : ''}/survey/broker</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <AnalysisEngine employerResponses={employerResponses} brokerResponses={brokerResponses} />
        )}
      </div>
    </div>
  );
}
