'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function BrokerSurvey() {
  const supabase = createClientComponentClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firm_name: '',
    firm_size: '',
    client_size: '',
    years_in_business: '',
    annual_client_count: '',
    role: '',
    monthly_software_spend: '',
    tool_count: '',
    biggest_software_category: '',
    time_breakdown: {
      finding_leads: '',
      sales_meetings: '',
      managing_clients: '',
      renewal_prep: '',
      admin_work: ''
    },
    time_most_reduce: '',
    time_efficiency_satisfaction: 5,
    client_acquisition_cost: '',
    first_year_commission: '',
    lead_quality_breakdown: {
      highly_qualified: '',
      somewhat_qualified: '',
      unqualified: ''
    },
    lead_gen_satisfaction: 5,
    would_recommend_lead_method: '',
    biggest_lead_frustration: '',
    sales_cycle_length: '',
    sales_cycle_satisfaction: 3,
    last_deal_lost_reason: '',
    last_deal_lost_hours: '',
    service_level_post_sale: '',
    retention_satisfaction: 3,
    cost_projection_accuracy: '',
    multi_stakeholder_count: '',
    multi_stakeholder_fell_apart: '',
    priority_points: {
      employee_satisfaction: 2,
      multi_stakeholder_navigation: 2,
      cost_accuracy: 2,
      client_service: 2,
      value_demonstration: 2
    },
    qualified_lead_wtp: '',
    platform_monthly_wtp: '',
    platform_interest: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const total = Object.values(formData.priority_points).reduce((sum, val) => sum + Number(val), 0);
    if (total !== 10) {
      alert('Priority points must total exactly 10. Current total: ' + total);
      return;
    }
    
    try {
      const { error } = await supabase.from('broker_survey_responses').insert([formData]);
      if (error) throw error;
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('There was an error submitting your response. Please try again.');
    }
  };

  const handlePriorityChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      priority_points: {
        ...prev.priority_points,
        [field]: Number(value)
      }
    }));
  };

  const getPriorityTotal = () => {
    return Object.values(formData.priority_points).reduce((sum, val) => sum + Number(val), 0);
  };

  const getPriorityRemaining = () => {
    return 10 - getPriorityTotal();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700 mb-6">Your insights will help us build better tools for benefits brokers.</p>
          {(formData.platform_interest === 'yes' || formData.platform_interest === 'maybe') && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-blue-900 font-semibold mb-2">✨ We'll reach out to {formData.email} with early updates</p>
            </div>
          )}
          <button onClick={() => window.location.href = '/'} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const priorityTotal = getPriorityTotal();
  const priorityRemaining = getPriorityRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Benefits Broker Research Study</h1>
          <div className="flex items-center gap-6 text-gray-600 mb-4">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              7-9 minutes
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              13 questions
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">Help us understand the challenges benefits brokers face. Your insights will shape better solutions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Q1: Firm Profile */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Firm Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name <span className="text-gray-500">(Optional)</span></label>
                <input type="text" value={formData.firm_name} onChange={(e) => setFormData({...formData, firm_name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Your firm name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Size <span className="text-red-500">*</span></label>
                <select value={formData.firm_size} onChange={(e) => setFormData({...formData, firm_size: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                  <option value="">Select firm size</option>
                  <option value="Solo">Solo broker</option>
                  <option value="2-5">2-5 brokers</option>
                  <option value="6-20">6-20 brokers</option>
                  <option value="21-50">21-50 brokers</option>
                  <option value="50+">50+ brokers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Role <span className="text-red-500">*</span></label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                  <option value="">Select your role</option>
                  <option value="Owner/Principal">Owner/Principal</option>
                  <option value="Producer/Sales">Producer/Sales</option>
                  <option value="Account Manager">Account Manager</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Client Size (Employees) <span className="text-red-500">*</span></label>
                <select value={formData.client_size} onChange={(e) => setFormData({...formData, client_size: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                  <option value="">Select client size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business <span className="text-red-500">*</span></label>
                <select value={formData.years_in_business} onChange={(e) => setFormData({...formData, years_in_business: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                  <option value="">Select years</option>
                  <option value="Less than 2">Less than 2 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-20">11-20 years</option>
                  <option value="20+">20+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Client Count <span className="text-red-500">*</span></label>
                <select value={formData.annual_client_count} onChange={(e) => setFormData({...formData, annual_client_count: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                  <option value="">Select client count</option>
                  <option value="1-10">1-10 clients</option>
                  <option value="11-25">11-25 clients</option>
                  <option value="26-50">26-50 clients</option>
                  <option value="51-100">51-100 clients</option>
                  <option value="100+">100+ clients</option>
                </select>
              </div>
            </div>
          </div>

          {/* Q2: Software Spend + Tech Stack */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Current Software & Tools</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">What do you currently spend per month on business software/tools? <span className="text-gray-500">(Total all-in)</span> <span className="text-red-500">*</span></label>
              <select value={formData.monthly_software_spend} onChange={(e) => setFormData({...formData, monthly_software_spend: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select monthly spend</option>
                <option value="$0-250">$0-250</option>
                <option value="$250-500">$250-500</option>
                <option value="$500-1,000">$500-1,000</option>
                <option value="$1,000-2,000">$1,000-2,000</option>
                <option value="$2,000-3,500">$2,000-3,500</option>
                <option value="$3,500+">$3,500+</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">How many different software tools/systems do you use? <span className="text-red-500">*</span></label>
              <select value={formData.tool_count} onChange={(e) => setFormData({...formData, tool_count: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select tool count</option>
                <option value="1-2 tools">1-2 tools (mostly all-in-one)</option>
                <option value="3-4 tools">3-4 tools</option>
                <option value="5-7 tools">5-7 tools</option>
                <option value="8-10 tools">8-10 tools</option>
                <option value="10+ tools">10+ tools</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Which category takes the MOST of your software budget? <span className="text-red-500">*</span></label>
              <select value={formData.biggest_software_category} onChange={(e) => setFormData({...formData, biggest_software_category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select category</option>
                <option value="AMS (Agency Management System)">AMS (Agency Management System)</option>
                <option value="CRM/Pipeline Management">CRM/Pipeline Management</option>
                <option value="Benefits Administration Platform">Benefits Administration Platform</option>
                <option value="Quoting/Proposal Tools">Quoting/Proposal Tools</option>
                <option value="Marketing/Communication Tools">Marketing/Communication Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Q3: Time Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Time Breakdown - Last Week</h2>
            <p className="text-gray-700 mb-4">Approximately how many hours did you spend on each activity last week?</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Finding/qualifying new leads</label>
                <input type="number" min="0" max="168" value={formData.time_breakdown.finding_leads} onChange={(e) => setFormData({...formData, time_breakdown: {...formData.time_breakdown, finding_leads: e.target.value}})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Hours" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Sales meetings/presentations</label>
                <input type="number" min="0" max="168" value={formData.time_breakdown.sales_meetings} onChange={(e) => setFormData({...formData, time_breakdown: {...formData.time_breakdown, sales_meetings: e.target.value}})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Hours" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Managing existing clients</label>
                <input type="number" min="0" max="168" value={formData.time_breakdown.managing_clients} onChange={(e) => setFormData({...formData, time_breakdown: {...formData.time_breakdown, managing_clients: e.target.value}})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Hours" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Renewal preparation</label>
                <input type="number" min="0" max="168" value={formData.time_breakdown.renewal_prep} onChange={(e) => setFormData({...formData, time_breakdown: {...formData.time_breakdown, renewal_prep: e.target.value}})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Hours" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Administrative/manual work</label>
                <input type="number" min="0" max="168" value={formData.time_breakdown.admin_work} onChange={(e) => setFormData({...formData, time_breakdown: {...formData.time_breakdown, admin_work: e.target.value}})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Hours" required />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Which would you MOST like to reduce? <span className="text-red-500">*</span></label>
              <select value={formData.time_most_reduce} onChange={(e) => setFormData({...formData, time_most_reduce: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select one</option>
                <option value="Finding/qualifying new leads">Finding/qualifying new leads</option>
                <option value="Sales meetings/presentations">Sales meetings/presentations</option>
                <option value="Managing existing clients">Managing existing clients</option>
                <option value="Renewal preparation">Renewal preparation</option>
                <option value="Administrative/manual work">Administrative/manual work</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate satisfaction with your time efficiency (1-10) <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="10" value={formData.time_efficiency_satisfaction} onChange={(e) => setFormData({...formData, time_efficiency_satisfaction: parseInt(e.target.value)})} className="flex-1" required />
                <span className="text-2xl font-bold text-blue-600 w-12 text-center">{formData.time_efficiency_satisfaction}</span>
              </div>
            </div>
          </div>

          {/* Q4: Economics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Client Economics</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">All-in (time + money), what does it cost to acquire one new client? <span className="text-red-500">*</span></label>
              <select value={formData.client_acquisition_cost} onChange={(e) => setFormData({...formData, client_acquisition_cost: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select CAC</option>
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000-$2,500">$1,000-$2,500</option>
                <option value="$2,500-$5,000">$2,500-$5,000</option>
                <option value="$5,000-$10,000">$5,000-$10,000</option>
                <option value="$10,000+">$10,000+</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Average first-year commission per client <span className="text-red-500">*</span></label>
              <select value={formData.first_year_commission} onChange={(e) => setFormData({...formData, first_year_commission: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select commission</option>
                <option value="Under $5K">Under $5K</option>
                <option value="$5K-$15K">$5K-$15K</option>
                <option value="$15K-$30K">$15K-$30K</option>
                <option value="$30K-$50K">$30K-$50K</option>
                <option value="$50K+">$50K+</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>
          </div>

          {/* Rest of the survey continues... I'll include Q5-13 in the next part */}
          {/* Q5: Lead Gen Reality */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Lead Generation Reality</h2>
            <p className="text-gray-700 mb-4">Thinking about leads you worked LAST MONTH:</p>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Highly qualified (decision-ready, good fit)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max="100" value={formData.lead_quality_breakdown.highly_qualified} onChange={(e) => setFormData({...formData, lead_quality_breakdown: {...formData.lead_quality_breakdown, highly_qualified: e.target.value}})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="%" required />
                  <span className="text-gray-700">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Somewhat qualified (interested, not ready)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max="100" value={formData.lead_quality_breakdown.somewhat_qualified} onChange={(e) => setFormData({...formData, lead_quality_breakdown: {...formData.lead_quality_breakdown, somewhat_qualified: e.target.value}})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="%" required />
                  <span className="text-gray-700">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Unqualified (tire-kickers)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max="100" value={formData.lead_quality_breakdown.unqualified} onChange={(e) => setFormData({...formData, lead_quality_breakdown: {...formData.lead_quality_breakdown, unqualified: e.target.value}})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="%" required />
                  <span className="text-gray-700">%</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate satisfaction with your lead gen process (1-10) <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="10" value={formData.lead_gen_satisfaction} onChange={(e) => setFormData({...formData, lead_gen_satisfaction: parseInt(e.target.value)})} className="flex-1" required />
                <span className="text-2xl font-bold text-blue-600 w-12 text-center">{formData.lead_gen_satisfaction}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Would you recommend your current lead gen method to another broker? <span className="text-red-500">*</span></label>
              <select value={formData.would_recommend_lead_method} onChange={(e) => setFormData({...formData, would_recommend_lead_method: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select answer</option>
                <option value="Definitely yes">Definitely yes</option>
                <option value="Probably yes">Probably yes</option>
                <option value="Not sure">Not sure</option>
                <option value="Probably no">Probably no</option>
                <option value="Definitely no">Definitely no</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biggest lead gen frustration (Pick ONE) <span className="text-red-500">*</span></label>
              <select value={formData.biggest_lead_frustration} onChange={(e) => setFormData({...formData, biggest_lead_frustration: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select frustration</option>
                <option value="Not enough volume">Not enough volume</option>
                <option value="Poor quality (tire-kickers)">Poor quality (tire-kickers)</option>
                <option value="Too expensive">Too expensive relative to conversion</option>
                <option value="Takes too much time">Takes too much time to qualify</option>
                <option value="Not in my sweet spot">Leads not in my sweet spot</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Continue with remaining questions Q6-Q13 - keeping them exactly as before */}
          
          {/* Q6: Sales Cycle */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Sales Cycle</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Average time from first contact to closed deal <span className="text-red-500">*</span></label>
              <select value={formData.sales_cycle_length} onChange={(e) => setFormData({...formData, sales_cycle_length: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select timeframe</option>
                <option value="Less than 2 weeks">Less than 2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-2 months">1-2 months</option>
                <option value="2-3 months">2-3 months</option>
                <option value="3+ months">3+ months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate satisfaction with sales cycle length (1-5) <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="5" value={formData.sales_cycle_satisfaction} onChange={(e) => setFormData({...formData, sales_cycle_satisfaction: parseInt(e.target.value)})} className="flex-1" required />
                <span className="text-2xl font-bold text-blue-600 w-12 text-center">{formData.sales_cycle_satisfaction}</span>
              </div>
            </div>
          </div>

          {/* Q7: Last Deal Lost */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Last Deal You Lost</h2>
            <p className="text-gray-700 mb-4">Think about the LAST significant prospect you didn't close</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">What happened? <span className="text-red-500">*</span></label>
              <select value={formData.last_deal_lost_reason} onChange={(e) => setFormData({...formData, last_deal_lost_reason: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select reason</option>
                <option value="Price (went cheaper)">Price (went cheaper)</option>
                <option value="Multi-stakeholder alignment fell apart">Multi-stakeholder alignment fell apart</option>
                <option value="Timeline dragged, they gave up">Timeline dragged, they gave up</option>
                <option value="Lost to incumbent">Lost to incumbent</option>
                <option value="Went with PEO/bundled">Went with PEO/bundled</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours spent on that dead deal <span className="text-red-500">*</span></label>
              <select value={formData.last_deal_lost_hours} onChange={(e) => setFormData({...formData, last_deal_lost_hours: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select hours</option>
                <option value="<5 hours">&lt;5 hours</option>
                <option value="5-15 hours">5-15 hours</option>
                <option value="15-40 hours">15-40 hours</option>
                <option value="40+ hours">40+ hours</option>
              </select>
            </div>
          </div>

          {/* Q8: Service Level */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Service Level Post-Sale</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Between renewals, how often do you proactively reach out to clients? <span className="text-red-500">*</span></label>
              <select value={formData.service_level_post_sale} onChange={(e) => setFormData({...formData, service_level_post_sale: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select frequency</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually (at renewal)">Annually (at renewal time)</option>
                <option value="Only when they contact us">Only when they contact us</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How satisfied with your client retention rate? (1-5) <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="5" value={formData.retention_satisfaction} onChange={(e) => setFormData({...formData, retention_satisfaction: parseInt(e.target.value)})} className="flex-1" required />
                <span className="text-2xl font-bold text-blue-600 w-12 text-center">{formData.retention_satisfaction}</span>
              </div>
            </div>
          </div>

          {/* Q9: Cost Projection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Cost Projection Accuracy</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">When you project renewal costs for clients: <span className="text-red-500">*</span></label>
            <select value={formData.cost_projection_accuracy} onChange={(e) => setFormData({...formData, cost_projection_accuracy: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
              <option value="">Select accuracy</option>
              <option value="Very accurate (within 5%)">Very accurate (within 5%)</option>
              <option value="Somewhat accurate (5-10% variance)">Somewhat accurate (5-10% variance)</option>
              <option value="Often higher (10%+ gap)">Often higher than projected (10%+ gap)</option>
              <option value="Too many variables">Too many variables - I give ranges</option>
              <option value="Don't provide projections">I don't provide specific projections</option>
            </select>
          </div>

          {/* Q10: Multi-Stakeholder */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Multi-Stakeholder Deals</h2>
            <p className="text-gray-700 mb-4">Of your LAST 10 prospects:</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">How many had multiple decision-makers (HR + Finance + CEO)? <span className="text-red-500">*</span></label>
              <select value={formData.multi_stakeholder_count} onChange={(e) => setFormData({...formData, multi_stakeholder_count: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select count</option>
                <option value="0-2">0-2 (mostly single)</option>
                <option value="3-5">3-5 (some multi)</option>
                <option value="6-8">6-8 (majority multi)</option>
                <option value="9-10">9-10 (almost all)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How many fell apart due to stakeholder misalignment? <span className="text-red-500">*</span></label>
              <select value={formData.multi_stakeholder_fell_apart} onChange={(e) => setFormData({...formData, multi_stakeholder_fell_apart: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select count</option>
                <option value="None">None</option>
                <option value="1-2">1-2</option>
                <option value="3-4">3-4</option>
                <option value="5+">5+</option>
              </select>
            </div>
          </div>

          {/* Q11: 10-Point Priority Game */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">11. The 10-Point Priority Game</h2>
            <p className="text-gray-700 mb-4">You have <strong>10 points</strong> to invest in improving your business. Where would you allocate them?</p>
            
            <div className={`mb-4 p-4 rounded-lg ${priorityRemaining === 0 ? 'bg-green-50 border-2 border-green-500' : priorityRemaining > 0 ? 'bg-yellow-50 border-2 border-yellow-500' : 'bg-red-50 border-2 border-red-500'}`}>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Points Used: {priorityTotal}/10</span>
                <span className={`font-bold ${priorityRemaining === 0 ? 'text-green-600' : priorityRemaining > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {priorityRemaining === 0 ? '✓ Perfect!' : priorityRemaining > 0 ? `${priorityRemaining} remaining` : `${Math.abs(priorityRemaining)} over!`}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Delivering Employee Satisfaction for Clients</label>
                <p className="text-xs text-gray-600 mb-2">Helping clients keep employees happy</p>
                <select value={formData.priority_points.employee_satisfaction} onChange={(e) => handlePriorityChange('employee_satisfaction', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Multi-Stakeholder Navigation & Alignment</label>
                <p className="text-xs text-gray-600 mb-2">Getting all decision-makers aligned</p>
                <select value={formData.priority_points.multi_stakeholder_navigation} onChange={(e) => handlePriorityChange('multi_stakeholder_navigation', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Cost Management & Projection Accuracy</label>
                <p className="text-xs text-gray-600 mb-2">Hitting projected costs, managing budgets</p>
                <select value={formData.priority_points.cost_accuracy} onChange={(e) => handlePriorityChange('cost_accuracy', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Client Responsiveness & Service Quality</label>
                <p className="text-xs text-gray-600 mb-2">Staying proactive and responsive post-sale</p>
                <select value={formData.priority_points.client_service} onChange={(e) => handlePriorityChange('client_service', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Demonstrating Ongoing Value/ROI</label>
                <p className="text-xs text-gray-600 mb-2">Proving value between renewals</p>
                <select value={formData.priority_points.value_demonstration} onChange={(e) => handlePriorityChange('value_demonstration', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Q12: WTP */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">12. Willingness to Pay</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">A qualified lead: Decision-maker engaged, budget confirmed, 90-day renewal timeline, your specialty, stakeholders aligned. What would you pay? <span className="text-red-500">*</span></label>
              <select value={formData.qualified_lead_wtp} onChange={(e) => setFormData({...formData, qualified_lead_wtp: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select amount</option>
                <option value="Wouldn't pay">Wouldn't pay</option>
                <option value="$500-1,500">$500-1,500</option>
                <option value="$1,500-3,000">$1,500-3,000</option>
                <option value="$3,000-5,000">$3,000-5,000</option>
                <option value="Only pay on close">Only pay on close (% of commission)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">All-in-one platform (lead gen + client retention + performance tracking + renewal automation): What would you pay monthly? <span className="text-red-500">*</span></label>
              <select value={formData.platform_monthly_wtp} onChange={(e) => setFormData({...formData, platform_monthly_wtp: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" required>
                <option value="">Select amount</option>
                <option value="Wouldn't use">Wouldn't use it</option>
                <option value="$500-1,000/month">$500-1,000/month</option>
                <option value="$1,000-2,000/month">$1,000-2,000/month</option>
                <option value="$2,000-3,000/month">$2,000-3,000/month</option>
                <option value="$3,000+/month">$3,000+/month</option>
                <option value="Depends on features">Depends on features</option>
              </select>
            </div>
          </div>

          {/* Q13: Interest */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">13. Platform Interest</h2>
            <p className="text-gray-700 mb-4">We're researching broker challenges. Interested in early updates?</p>
            <div className="space-y-3 mb-4">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                <input type="radio" name="platform_interest" value="yes" checked={formData.platform_interest === 'yes'} onChange={(e) => setFormData({...formData, platform_interest: e.target.value})} required className="w-4 h-4 text-blue-600" />
                <span className="ml-3 text-gray-800 font-medium">Yes, show me when ready</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                <input type="radio" name="platform_interest" value="maybe" checked={formData.platform_interest === 'maybe'} onChange={(e) => setFormData({...formData, platform_interest: e.target.value})} required className="w-4 h-4 text-blue-600" />
                <span className="ml-3 text-gray-800">Maybe, send updates</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                <input type="radio" name="platform_interest" value="no" checked={formData.platform_interest === 'no'} onChange={(e) => setFormData({...formData, platform_interest: e.target.value})} required className="w-4 h-4 text-blue-600" />
                <span className="ml-3 text-gray-800">No thanks</span>
              </label>
            </div>
            {(formData.platform_interest === 'yes' || formData.platform_interest === 'maybe') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email <span className="text-red-500">*</span></label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="your@email.com" required />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
              Submit Survey
            </button>
            <p className="text-center text-gray-600 text-sm mt-4">Your responses are confidential and used for research purposes only.</p>
          </div>

        </form>
      </div>
    </div>
  );
}
