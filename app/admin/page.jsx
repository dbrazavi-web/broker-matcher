'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [employers, setEmployers] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [allBrokers, setAllBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employersData, brokersData, allBrokersData] = await Promise.all([
        supabase.from('employers').select('*').order('created_at', { ascending: false }),
        supabase.from('broker_responses').select('*').order('created_at', { ascending: false }),
        supabase.from('brokers').select('*').eq('is_active', true)
      ]);
      
      setEmployers(employersData.data || []);
      setBrokers(brokersData.data || []);
      setAllBrokers(allBrokersData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
      await supabase
        .from('employers')
        .update(data)
        .eq('id', id);
      
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
      await supabase
        .from('employers')
        .update({ [field]: value })
        .eq('id', employerId);
      
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
    const matches = allBrokers.map(broker => ({
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
    survey: employers.filter(e => e.company_name && !e.interview_requested && (!e.status || e.status === 'new')),
    interview: employers.filter(e => e.interview_requested || e.interview_date),
    matched: employers.filter(e => e.status === 'matched' || e.status === 'intro_sent'),
    closed: employers.filter(e => e.status === 'closed' || e.status === 'meeting')
  };

  const stats = {
    total: employers.length,
    outreach: pipelineStages.outreach.length,
    survey: pipelineStages.survey.length,
    interview: pipelineStages.interview.length,
    matched: pipelineStages.matched.length,
    closed: pipelineStages.closed.length
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🎯 BrokerMatch CRM</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
          >
            + Add Prospect
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {['pipeline', 'employers', 'matches', 'brokers'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize ${
                activeTab === tab 
                  ? 'border-b-2 border-purple-500 text-purple-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div>
            <div className="grid grid-cols-5 gap-4 mb-8">
              {Object.entries(stats).filter(([key]) => key !== 'total').map(([stage, count]) => (
                <div key={stage} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="text-gray-400 text-sm mb-2 capitalize">{stage}</div>
                  <div className="text-4xl font-bold text-purple-400">{count}</div>
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
                            ✏️ Edit
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
                      <option value="matched">Matched</option>
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
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div><span className="text-gray-400">Size:</span> {emp.company_size}</div>
                  <div><span className="text-gray-400">Location:</span> {emp.location}</div>
                  <div><span className="text-gray-400">Industry:</span> {emp.industry}</div>
                  <div><span className="text-gray-400">Priority:</span> {emp.match_priority || 'medium'}</div>
                </div>

                {emp.outreach_channel && (
                  <div className="mb-2 text-sm">
                    <span className="text-gray-400">Outreach:</span> {emp.outreach_channel} on {new Date(emp.outreach_date).toLocaleDateString()}
                  </div>
                )}

                {emp.interview_date && (
                  <div className="mb-2 text-sm">
                    <span className="text-gray-400">Interview:</span> {new Date(emp.interview_date).toLocaleDateString()}
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      const notes = prompt('Add interview notes:');
                      if (notes) updateField(emp.id, 'interview_notes', notes);
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    📝 Add Interview Notes
                  </button>
                  {emp.interview_notes && (
                    <div className="bg-gray-900 p-3 rounded text-sm">
                      <strong>Notes:</strong> {emp.interview_notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">🎯 Smart Match Suggestions</h2>
            {employers.filter(e => e.company_name && (!e.status || e.status === 'new' || e.status === 'survey')).map((emp) => {
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
                          <div className="text-sm text-gray-400">{match.broker.location}</div>
                        </div>
                        <div className={`text-2xl font-bold ${match.score >= 70 ? 'text-green-400' : match.score >= 50 ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {match.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const emails = matches.map(m => m.broker.email || m.broker.contact_email).filter(Boolean);
                      window.open(`mailto:${emp.email}?cc=${emails.join(',')}&subject=Intro: ${emp.company_name} <> Brokers`);
                    }}
                    className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    📧 Send Intro
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Brokers Tab */}
        {activeTab === 'brokers' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Broker Responses ({brokers.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Firm</th>
                    <th className="px-4 py-3 text-left">Contact</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {brokers.map(b => (
                    <tr key={b.id} className="border-t border-gray-700">
                      <td className="px-4 py-3">{b.firm_name}</td>
                      <td className="px-4 py-3">{b.contact_name}</td>
                      <td className="px-4 py-3">{b.location}</td>
                      <td className="px-4 py-3">{b.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
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
                className="w-full px-4 py-2 bg-gray-700 rounded" 
              />
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                defaultValue={editingEmployer?.email}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded" 
              />
              <input 
                name="location" 
                placeholder="Location (e.g. San Francisco)" 
                defaultValue={editingEmployer?.location}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded" 
              />
              <input 
                name="companySize" 
                placeholder="Company Size (e.g. 11-50)" 
                defaultValue={editingEmployer?.company_size}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded" 
              />
              <input 
                name="industry" 
                placeholder="Industry (e.g. Technology)" 
                defaultValue={editingEmployer?.industry}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded" 
              />
              <select 
                name="channel" 
                defaultValue={editingEmployer?.outreach_channel}
                required 
                className="w-full px-4 py-2 bg-gray-700 rounded"
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
                className="w-full px-4 py-2 bg-gray-700 rounded h-24"
              ></textarea>
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  {editingEmployer ? 'Update' : 'Add'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEmployer(null);
                  }} 
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
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
