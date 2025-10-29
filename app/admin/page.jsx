'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [employers, setEmployers] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [allBrokers, setAllBrokers] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState(null);
  const [showAddBrokerModal, setShowAddBrokerModal] = useState(false);
  const [editingBroker, setEditingBroker] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employersData, brokersData, allBrokersData, matchHistoryData] = await Promise.all([
        supabase.from('employers').select('*').order('created_at', { ascending: false }),
        supabase.from('broker_responses').select('*').order('created_at', { ascending: false }),
        supabase.from('brokers').select('*').order('date_added', { ascending: false }),
        supabase.from('match_history').select('*').order('created_at', { ascending: false })
      ]);
      
      setEmployers(employersData.data || []);
      setBrokers(brokersData.data || []);
      setAllBrokers(allBrokersData.data || []);
      setMatchHistory(matchHistoryData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBroker = async (data) => {
    try {
      await supabase.from('brokers').insert([{
        company_name: data.companyName,
        contact_name: data.contactName,
        email: data.email,
        contact_email: data.email,
        phone: data.phone,
        website: data.website,
        location: data.location,
        state: data.state,
        company_size_min: parseInt(data.sizeMin),
        company_size_max: parseInt(data.sizeMax),
        specializes_in_startups: data.specializesStartups === 'yes',
        industries_served: data.industries ? data.industries.split(',').map(i => i.trim()) : [],
        source: data.source,
        source_url: data.sourceUrl,
        notes: data.notes,
        is_active: true
      }]);
      
      fetchData();
      setShowAddBrokerModal(false);
      alert('Broker added!');
    } catch (error) {
      console.error('Error adding broker:', error);
      alert('Error adding broker');
    }
  };

  const updateBroker = async (id, data) => {
    try {
      await supabase.from('brokers').update({
        company_name: data.companyName,
        contact_name: data.contactName,
        email: data.email,
        contact_email: data.email,
        phone: data.phone,
        website: data.website,
        location: data.location,
        state: data.state,
        company_size_min: parseInt(data.sizeMin),
        company_size_max: parseInt(data.sizeMax),
        specializes_in_startups: data.specializesStartups === 'yes',
        industries_served: data.industries ? data.industries.split(',').map(i => i.trim()) : [],
        source: data.source,
        source_url: data.sourceUrl,
        notes: data.notes
      }).eq('id', id);
      
      fetchData();
      setEditingBroker(null);
      alert('Broker updated!');
    } catch (error) {
      console.error('Error updating broker:', error);
      alert('Error updating broker');
    }
  };

  const deleteBroker = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    
    try {
      await supabase.from('brokers').delete().eq('id', id);
      fetchData();
      alert('Broker deleted!');
    } catch (error) {
      console.error('Error deleting broker:', error);
      alert('Error deleting broker');
    }
  };

  const logMatch = async (employer, brokerMatches) => {
    try {
      await supabase.from('match_history').insert([{
        employer_id: employer.id,
        employer_name: employer.company_name,
        broker_ids: brokerMatches.map(m => m.broker.id),
        broker_names: brokerMatches.map(m => m.broker.company_name),
        match_scores: brokerMatches.map(m => m.score),
        intro_sent_date: new Date().toISOString(),
        outcome: 'pending'
      }]);

      // Increment times_matched for each broker
      for (const match of brokerMatches) {
        await supabase.rpc('increment', {
          table_name: 'brokers',
          row_id: match.broker.id,
          column_name: 'times_matched'
        });
      }

      await supabase.from('employers').update({
        matched_brokers: brokerMatches.map(m => ({
          id: m.broker.id,
          name: m.broker.company_name,
          score: m.score,
          email: m.broker.email || m.broker.contact_email
        })),
        intro_sent_date: new Date().toISOString(),
        status: 'intro_sent'
      }).eq('id', employer.id);

      fetchData();
      alert('Match logged! Email opened.');
    } catch (error) {
      console.error('Error logging match:', error);
    }
  };

  const updateMatchOutcome = async (matchId, outcome, notes = '') => {
    try {
      await supabase.from('match_history').update({
        outcome,
        notes,
        meeting_scheduled: outcome === 'meeting' || outcome === 'closed',
        deal_closed: outcome === 'closed'
      }).eq('id', matchId);
      
      fetchData();
      alert('Outcome updated!');
    } catch (error) {
      console.error('Error updating outcome:', error);
    }
  };

  const addManualProspect = async (data) => {
    try {
      await supabase.from('employers').insert([{
        company_name: data.companyName,
        email: data.email,
        location: data.location,
        company_size: data.companySize,
        industry: data.industry,
        outreach_date: new Date().toISOString(),
        outreach_channel: data.channel,
        outreach_notes: data.notes,
        status: 'outreach'
      }]);
      
      fetchData();
      setShowAddModal(false);
      alert('Prospect added!');
    } catch (error) {
      console.error('Error adding prospect:', error);
      alert('Error adding prospect');
    }
  };

  const updateProspect = async (id, data) => {
    try {
      await supabase.from('employers').update(data).eq('id', id);
      fetchData();
      setEditingEmployer(null);
      alert('Updated!');
    } catch (error) {
      console.error('Error updating:', error);
      alert('Error updating');
    }
  };

  const deleteProspect = async (id, companyName) => {
    if (!confirm(`Delete ${companyName}? This cannot be undone.`)) return;
    
    try {
      await supabase.from('employers').delete().eq('id', id);
      fetchData();
      alert('Deleted!');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting');
    }
  };

  const updateField = async (employerId, field, value) => {
    try {
      await supabase.from('employers').update({ [field]: value }).eq('id', employerId);
      fetchData();
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const getMatchScore = (employer, broker) => {
    let score = 0;
    const stateMap = {
      'San Francisco': 'CA', 'San Diego': 'CA', 'Los Angeles': 'CA',
      'New York': 'NY', 'Chicago': 'IL',
      'Austin': 'TX', 'Houston': 'TX', 'Dallas': 'TX',
      'Seattle': 'WA', 'Boston': 'MA'
    };
    const employerState = stateMap[employer.location];
    if (broker.state === employerState) score += 30;
    
    const sizeMap = { '1-10': 10, '11-50': 50, '51-200': 200, '201-500': 500, '500+': 1000 };
    const empSize = sizeMap[employer.company_size] || 50;
    if (empSize >= broker.company_size_min && empSize <= broker.company_size_max) score += 25;
    if (broker.specializes_in_startups && employer.industry?.includes('Tech')) score += 20;
    if (employer.switching_consideration === 'Actively looking') score += 15;
    if (broker.industries_served?.includes(employer.industry)) score += 10;
    
    return score;
  };

  const getTopMatches = (employer) => {
    const matches = allBrokers.filter(b => b.is_active).map(broker => ({
      broker,
      score: getMatchScore(employer, broker)
    }));
    return matches.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  const pipelineStages = {
    outreach: employers.filter(e => e.status === 'outreach' || (!e.status && e.outreach_date)),
    survey: employers.filter(e => e.company_name && !e.intro_sent_date && (!e.status || e.status === 'new')),
    matched: employers.filter(e => e.intro_sent_date && !e.meeting_scheduled),
    meeting: employers.filter(e => e.meeting_scheduled && !e.deal_closed),
    closed: employers.filter(e => e.deal_closed || e.status === 'closed')
  };

  const stats = {
    total: employers.length,
    outreach: pipelineStages.outreach.length,
    survey: pipelineStages.survey.length,
    matched: pipelineStages.matched.length,
    meeting: pipelineStages.meeting.length,
    closed: pipelineStages.closed.length,
    totalMatches: matchHistory.length,
    pendingMatches: matchHistory.filter(m => m.outcome === 'pending').length,
    successfulMatches: matchHistory.filter(m => m.outcome === 'closed').length,
    totalBrokers: allBrokers.length,
    activeBrokers: allBrokers.filter(b => b.is_active).length
  };

  const brokersBySource = allBrokers.reduce((acc, broker) => {
    const source = broker.source || 'unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🎯 BrokerMatch CRM</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddBrokerModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
            >
              + Add Broker
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
            >
              + Add Prospect
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700 overflow-x-auto">
          {['pipeline', 'employers', 'matches', 'history', 'brokers'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-b-2 border-purple-500 text-purple-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
              {tab === 'history' && ` (${matchHistory.length})`}
              {tab === 'brokers' && ` (${allBrokers.length})`}
            </button>
          ))}
        </div>

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div>
            <div className="grid grid-cols-5 gap-4 mb-8">
              {['outreach', 'survey', 'matched', 'meeting', 'closed'].map(stage => (
                <div key={stage} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2 capitalize">{stage}</div>
                  <div className="text-4xl font-bold text-purple-400">{stats[stage]}</div>
                </div>
              ))}
            </div>

            {Object.entries(pipelineStages).map(([stage, stageEmployers]) => (
              <div key={stage} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 capitalize">
                  {stage} ({stageEmployers.length})
                </h2>
                <div className="space-y-3">
                  {stageEmployers.map(emp => (
                    <div key={emp.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{emp.company_name || 'Unnamed Company'}</h3>
                          <p className="text-sm text-gray-400">{emp.email}</p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>{emp.company_size}</span>
                            <span>{emp.location}</span>
                            <span>{emp.industry}</span>
                          </div>
                          
                          {emp.matched_brokers && emp.matched_brokers.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-900 rounded">
                              <div className="text-sm text-green-400 font-semibold mb-2">
                                ✅ Matched with {emp.matched_brokers.length} brokers:
                              </div>
                              {emp.matched_brokers.map((broker, idx) => (
                                <div key={idx} className="text-sm text-gray-300">
                                  • {broker.name} ({broker.score}% match)
                                </div>
                              ))}
                              {emp.intro_sent_date && (
                                <div className="text-xs text-gray-500 mt-2">
                                  Intro sent: {new Date(emp.intro_sent_date).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {emp.outreach_notes && (
                            <p className="text-sm text-gray-300 mt-2">📝 {emp.outreach_notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={emp.match_priority || 'medium'}
                            onChange={(e) => updateField(emp.id, 'match_priority', e.target.value)}
                            className="px-3 py-1 bg-gray-700 rounded text-xs"
                          >
                            <option value="high">🔥 High</option>
                            <option value="medium">⚡ Medium</option>
                            <option value="low">💤 Low</option>
                          </select>
                          <button
                            onClick={() => setEditingEmployer(emp)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteProspect(emp.id, emp.company_name)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stageEmployers.length === 0 && (
                    <div className="text-gray-500 text-center py-8">No companies in this stage</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Employers Tab */}
        {activeTab === 'employers' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />

            {employers.filter(e => 
              !searchTerm || 
              e.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              e.email?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((emp) => (
              <div key={emp.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{emp.company_name}</h3>
                    <p className="text-sm text-gray-400">{emp.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={emp.status || 'new'}
                      onChange={(e) => updateField(emp.id, 'status', e.target.value)}
                      className="px-3 py-1 bg-gray-700 rounded"
                    >
                      <option value="outreach">Outreach</option>
                      <option value="new">Survey Done</option>
                      <option value="intro_sent">Intro Sent</option>
                      <option value="meeting">Meeting</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => setEditingEmployer(emp)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteProspect(emp.id, emp.company_name)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div><span className="text-gray-400">Size:</span> {emp.company_size}</div>
                  <div><span className="text-gray-400">Location:</span> {emp.location}</div>
                  <div><span className="text-gray-400">Industry:</span> {emp.industry}</div>
                  <div><span className="text-gray-400">Priority:</span> {emp.match_priority || 'medium'}</div>
                </div>

                {emp.matched_brokers && emp.matched_brokers.length > 0 && (
                  <div className="mb-4 p-4 bg-gray-900 rounded">
                    <div className="font-semibold mb-2 text-green-400">✅ Matched Brokers:</div>
                    {emp.matched_brokers.map((broker, idx) => (
                      <div key={idx} className="text-sm mb-1">
                        {idx + 1}. {broker.name} ({broker.score}% match) - {broker.email}
                      </div>
                    ))}
                    {emp.intro_sent_date && (
                      <div className="text-xs text-gray-500 mt-2">
                        Intro sent: {new Date(emp.intro_sent_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                {emp.interview_notes && (
                  <div className="bg-gray-900 p-3 rounded text-sm mb-4">
                    <strong>Interview Notes:</strong> {emp.interview_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">🎯 Smart Match Suggestions</h2>
            {employers.filter(e => e.company_name && !e.intro_sent_date).map((emp) => {
              const matches = getTopMatches(emp);
              return (
                <div key={emp.id} className="bg-gray-800 border border-purple-700 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-purple-400">{emp.company_name}</h3>
                    <p className="text-sm text-gray-400">{emp.company_size} • {emp.location} • {emp.industry}</p>
                  </div>
                  <div className="space-y-3">
                    {matches.map((match, idx) => (
                      <div key={match.broker.id} className="bg-gray-900 rounded-lg p-4 flex justify-between">
                        <div>
                          <div className="font-semibold">{idx + 1}. {match.broker.company_name}</div>
                          <div className="text-sm text-gray-400">{match.broker.location} • Source: {match.broker.source}</div>
                        </div>
                        <div className={`text-2xl font-bold ${match.score >= 70 ? 'text-green-400' : match.score >= 50 ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {match.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => {
                        const emails = matches.map(m => m.broker.email || m.broker.contact_email).filter(Boolean);
                        logMatch(emp, matches);
                        window.open(`mailto:${emp.email}?cc=${emails.join(',')}&subject=Intro: ${emp.company_name} <> Brokers`);
                      }}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                    >
                      📧 Send Intro & Log Match
                    </button>
                  </div>
                </div>
              );
            })}
            {employers.filter(e => e.company_name && !e.intro_sent_date).length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No employers ready to match. All intros have been sent!
              </div>
            )}
          </div>
        )}

        {/* Match History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Total Matches</div>
                <div className="text-3xl font-bold">{stats.totalMatches}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Pending</div>
                <div className="text-3xl font-bold text-yellow-400">{stats.pendingMatches}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Closed</div>
                <div className="text-3xl font-bold text-green-400">{stats.successfulMatches}</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Match History</h2>
            {matchHistory.map((match) => (
              <div key={match.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{match.employer_name}</h3>
                    <p className="text-sm text-gray-400">
                      Intro sent: {new Date(match.intro_sent_date).toLocaleDateString()}
                    </p>
                  </div>
                  <select
                    value={match.outcome}
                    onChange={(e) => {
                      const notes = e.target.value !== 'pending' ? prompt('Add outcome notes:') : '';
                      updateMatchOutcome(match.id, e.target.value, notes || '');
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      match.outcome === 'closed' ? 'bg-green-700' :
                      match.outcome === 'meeting' ? 'bg-blue-700' :
                      match.outcome === 'no_response' ? 'bg-red-700' :
                      'bg-gray-700'
                    }`}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="meeting">📅 Meeting</option>
                    <option value="closed">✅ Closed</option>
                    <option value="no_response">❌ No Response</option>
                    <option value="not_interested">👎 Not Interested</option>
                  </select>
                </div>

                <div className="mb-3">
                  <div className="text-sm font-semibold mb-2">Matched Brokers:</div>
                  {match.broker_names?.map((name, idx) => (
                    <div key={idx} className="text-sm text-gray-300">
                      {idx + 1}. {name} ({match.match_scores?.[idx]}% match)
                    </div>
                  ))}
                </div>

                {match.notes && (
                  <div className="bg-gray-900 p-3 rounded text-sm">
                    <strong>Notes:</strong> {match.notes}
                  </div>
                )}
              </div>
            ))}
            {matchHistory.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No matches sent yet
              </div>
            )}
          </div>
        )}

        {/* Brokers Database Tab */}
        {activeTab === 'brokers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Total Brokers</div>
                <div className="text-3xl font-bold">{stats.totalBrokers}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Active</div>
                <div className="text-3xl font-bold text-green-400">{stats.activeBrokers}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Sources</div>
                <div className="text-3xl font-bold text-purple-400">{Object.keys(brokersBySource).length}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">Most Matched</div>
                <div className="text-lg font-bold text-blue-400">
                  {allBrokers.sort((a, b) => (b.times_matched || 0) - (a.times_matched || 0))[0]?.company_name?.substring(0, 15) || 'N/A'}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <div className="text-sm font-semibold mb-2">Brokers by Source:</div>
              <div className="flex flex-wrap gap-3">
                {Object.entries(brokersBySource).map(([source, count]) => (
                  <div key={source} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {source}: {count}
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Broker Database</h2>
            <div className="space-y-3">
              {allBrokers.map((broker) => (
                <div key={broker.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{broker.company_name}</h3>
                      <p className="text-sm text-gray-400">{broker.contact_name} • {broker.email}</p>
                      <div className="flex gap-3 mt-2 text-sm">
                        <span className="text-gray-300">{broker.location}, {broker.state}</span>
                        <span className="text-gray-300">Size: {broker.company_size_min}-{broker.company_size_max}</span>
                        {broker.specializes_in_startups && <span className="text-green-400">🚀 Startup specialist</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingBroker(broker)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteBroker(broker.id, broker.company_name)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm mb-2">
                    <span className="bg-purple-900 bg-opacity-30 px-2 py-1 rounded text-purple-300">
                      📍 Source: {broker.source}
                    </span>
                    {broker.times_matched > 0 && (
                      <span className="bg-blue-900 bg-opacity-30 px-2 py-1 rounded text-blue-300">
                        🤝 Matched {broker.times_matched}x
                      </span>
                    )}
                    {broker.website && (
                      <a href={broker.website} target="_blank" className="text-blue-400 hover:underline">
                        🌐 Website
                      </a>
                    )}
                  </div>

                  {broker.notes && (
                    <div className="text-sm text-gray-300 mt-2">
                      📝 {broker.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Employer Modal */}
      {(showAddModal || editingEmployer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingEmployer ? 'Edit Prospect' : 'Add Manual Prospect'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                company_name: formData.get('companyName'),
                email: formData.get('email'),
                location: formData.get('location'),
                company_size: formData.get('companySize'),
                industry: formData.get('industry'),
                outreach_channel: formData.get('channel'),
                outreach_notes: formData.get('notes')
              };
              
              if (editingEmployer) {
                updateProspect(editingEmployer.id, data);
              } else {
                addManualProspect({
                  companyName: data.company_name,
                  email: data.email,
                  location: data.location,
                  companySize: data.company_size,
                  industry: data.industry,
                  channel: data.outreach_channel,
                  notes: data.outreach_notes
                });
              }
            }} className="space-y-4">
              <input 
                name="companyName" 
                placeholder="Company Name" 
                defaultValue={editingEmployer?.company_name}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white" 
              />
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                defaultValue={editingEmployer?.email}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white" 
              />
              <input 
                name="location" 
                placeholder="Location (e.g. San Francisco)" 
                defaultValue={editingEmployer?.location}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white" 
              />
              <input 
                name="companySize" 
                placeholder="Company Size (e.g. 11-50)" 
                defaultValue={editingEmployer?.company_size}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white" 
              />
              <input 
                name="industry" 
                placeholder="Industry (e.g. Technology)" 
                defaultValue={editingEmployer?.industry}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white" 
              />
              <select 
                name="channel" 
                defaultValue={editingEmployer?.outreach_channel}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              >
                <option value="">Select Channel...</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email">Email</option>
                <option value="YC">YC Bookface</option>
                <option value="Referral">Referral</option>
              </select>
              <textarea 
                name="notes" 
                placeholder="Outreach notes..." 
                defaultValue={editingEmployer?.outreach_notes}
                className="w-full px-4 py-2 bg-gray-700 rounded h-24 text-white"
              ></textarea>
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
                >
                  {editingEmployer ? 'Update' : 'Add'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEmployer(null);
                  }} 
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Broker Modal */}
      {(showAddBrokerModal || editingBroker) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingBroker ? 'Edit Broker' : 'Add Broker'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                companyName: formData.get('companyName'),
                contactName: formData.get('contactName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                website: formData.get('website'),
                location: formData.get('location'),
                state: formData.get('state'),
                sizeMin: formData.get('sizeMin'),
                sizeMax: formData.get('sizeMax'),
                specializesStartups: formData.get('specializesStartups'),
                industries: formData.get('industries'),
                source: formData.get('source'),
                sourceUrl: formData.get('sourceUrl'),
                notes: formData.get('notes')
              };
              
              if (editingBroker) {
                updateBroker(editingBroker.id, data);
              } else {
                addBroker(data);
              }
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  name="companyName" 
                  placeholder="Company Name*" 
                  defaultValue={editingBroker?.company_name}
                  required 
                  className="px-4 py-2 bg-gray-700 rounded text-white" 
                />
                <input 
                  name="contactName" 
                  placeholder="Contact Name" 
                  defaultValue={editingBroker?.contact_name}
                  className="px-4 py-2 bg-gray-700 rounded text-white" 
                />
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email*" 
                  defaultValue={editingBroker?.email}
                  required 
                  className="px-4 py-2 bg-gray-700 rounded text-white" 
                />
                <input 
                  name="phone" 
                  placeholder="Phone" 
                  defaultValue={editingBroker?.phone}
                  className="px-4 py-2 bg-gray-700 rounded text-white" 
                />
                <input 
                  name="website" 
                  placeholder="Website" 
                  defaultValue={editingBroker?.website}
                  className="px-4 py-2 bg-gray-700 rounded text-white" 
                />
                <input 
                  name="location" 
                  placeholder="City*" 
                  defaultValue={editingBroker?.location}
                  required 
                  className="px-4 py-2 bg-gray-700 rounded text-white" 
                />
                <select 
                  name="state" 
                  defaultValue={editingBroker?.state}
                  required 
                  className="px-4 py-2 bg-gray-700 rounded text-white"
                >
                  <option value="">Select State*</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="WA">Washington</option>
                  <option value="IL">Illinois</option>
                  <option value="MA">Massachusetts</option>
                </select>
                <input 
                  name="sizeMin" 
                  type="number" 
                  placeholder="Min Company Size*" 
                  defaultValue={editingBroker?.company_size_min}
                  required 
                  className="px-4 py-2 bg-gray-700 rounded text-white" 
                />
                <input 
                  name="sizeMax" 
                  type="number" 
                  placeholder="Max Company Size*" 
                  defaultValue={editingBroker?.company_size_max}
                  required 
                  className="px-4 py-2 bg-gray-700 rounded text-white" 
                />
                <select 
                  name="specializesStartups" 
                  defaultValue={editingBroker?.specializes_in_startups ? 'yes' : 'no'}
                  className="px-4 py-2 bg-gray-700 rounded text-white"
                >
                  <option value="no">Regular Focus</option>
                  <option value="yes">🚀 Startup Specialist</option>
                </select>
              </div>

              <input 
                name="industries" 
                placeholder="Industries (comma-separated, e.g. Technology, Healthcare)" 
                defaultValue={editingBroker?.industries_served?.join(', ')}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white" 
              />

              <select 
                name="source" 
                defaultValue={editingBroker?.source || 'manual'}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              >
                <option value="manual">Manual Entry</option>
                <option value="mployer">Mployer Advisor</option>
                <option value="linkedin">LinkedIn Search</option>
                <option value="survey">Survey Response</option>
                <option value="referral">Referral</option>
                <option value="google">Google Search</option>
              </select>

              <input 
                name="sourceUrl" 
                placeholder="Source URL (if applicable)" 
                defaultValue={editingBroker?.source_url}
                className="w-full px-4 py-2 bg-gray-700 rounded text-white" 
              />

              <textarea 
                name="notes" 
                placeholder="Notes..." 
                defaultValue={editingBroker?.notes}
                className="w-full px-4 py-2 bg-gray-700 rounded h-24 text-white"
              ></textarea>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
                >
                  {editingBroker ? 'Update Broker' : 'Add Broker'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddBrokerModal(false);
                    setEditingBroker(null);
                  }} 
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
