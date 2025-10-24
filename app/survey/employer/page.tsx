'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function EmployerSurvey() {
  const supabase = createClientComponentClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    employee_count: '',
    industry: '',
    region: '',
    years_in_business: '',
    role: '',
    next_decision_timing: '',
    renewals_completed: '',
    annual_spend: '',
    how_found_broker: '',
    time_to_find: '',
    brokers_evaluated: '',
    finding_satisfaction: 5,
    would_recommend_process: '',
    broker_experience_rating: 5,
    broker_recommendation_likelihood: 5,
    broker_proactive_contact: '',
    cost_vs_projection: '',
    decision_structure: '',
    renewal_satisfaction: 3,
    priority_points: {
      employee_satisfaction: 2,
      stakeholder_alignment: 2,
      cost_control: 2,
      broker_responsiveness: 2,
      cost_predictability: 2
    },
    switching_reality: '',
    biggest_challenge: '',
    time_managing_broker: '',
    time_satisfaction: 3,
    willingness_to_pay: '',
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
      const { error } = await supabase.from('employer_survey_responses').insert([formData]);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700 mb-6">Your insights are incredibly valuable and will help us understand the benefits broker market.</p>
          {(formData.platform_interest === 'yes' || formData.platform_interest === 'maybe') && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
              <p className="text-purple-900 font-semibold mb-2">✨ We'll reach out to {formData.email} with our findings</p>
            </div>
          )}
          <button onClick={() => window.location.href = '/'} className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const priorityTotal = getPriorityTotal();
  const priorityRemaining = getPriorityRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Benefits Broker Research Study</h1>
          <div className="flex items-center gap-6 text-gray-600 mb-4">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              6-8 minutes
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              11 questions
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">Help us understand how companies find and work with benefits brokers. Your experience will shape better solutions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Q1: Company Profile */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Company Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name <span className="text-gray-500">(Optional)</span></label>
                <input type="text" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" placeholder="Your company name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Employees <span className="text-red-500">*</span></label>
                <select value={formData.employee_count} onChange={(e) => setFormData({...formData, employee_count: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select employee count</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry <span className="text-red-500">*</span></label>
                <select value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance & Insurance</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Education">Education</option>
                  <option value="Hospitality">Hospitality & Food Service</option>
                  <option value="Construction">Construction</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Location <span className="text-red-500">*</span></label>
                <select value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select region</option>
                  <option value="West Coast">West Coast (CA, OR, WA)</option>
                  <option value="Mountain West">Mountain West (CO, UT, AZ, NV)</option>
                  <option value="Midwest">Midwest (IL, OH, MI, MN)</option>
                  <option value="Southwest">Southwest (TX, OK)</option>
                  <option value="Southeast">Southeast (FL, GA, NC)</option>
                  <option value="Northeast">Northeast (NY, NJ, PA)</option>
                  <option value="New England">New England (MA, CT, RI, VT, NH, ME)</option>
                  <option value="Multiple/National">Multiple states/National</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years in Business <span className="text-red-500">*</span></label>
                <select value={formData.years_in_business} onChange={(e) => setFormData({...formData, years_in_business: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select years</option>
                  <option value="Less than 1">Less than 1 year</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Q2: Role + Context */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Your Role & Context</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your role in benefits decisions <span className="text-red-500">*</span></label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select your role</option>
                  <option value="Final decision maker">Final decision maker (can sign contracts)</option>
                  <option value="Budget owner">Budget owner (control spending)</option>
                  <option value="Key influencer">Key influencer (make recommendations)</option>
                  <option value="Administrator">Administrator (implement decisions)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">When is your next broker evaluation? <span className="text-red-500">*</span></label>
                <select value={formData.next_decision_timing} onChange={(e) => setFormData({...formData, next_decision_timing: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select timing</option>
                  <option value="Within 3 months">Within 3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="12+ months">12+ months</option>
                  <option value="Not planning">Not planning to evaluate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits renewals completed <span className="text-red-500">*</span></label>
                <select value={formData.renewals_completed} onChange={(e) => setFormData({...formData, renewals_completed: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select number</option>
                  <option value="First time">This is our first time</option>
                  <option value="1-2">1-2 times</option>
                  <option value="3-5">3-5 times</option>
                  <option value="6+">6+ times</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current annual benefits spend <span className="text-red-500">*</span></label>
                <select value={formData.annual_spend} onChange={(e) => setFormData({...formData, annual_spend: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select spend range</option>
                  <option value="Under $100K">Under $100K</option>
                  <option value="$100K-$500K">$100K-$500K</option>
                  <option value="$500K-$1M">$500K-$1M</option>
                  <option value="$1M-$5M">$1M-$5M</option>
                  <option value="$5M+">$5M+</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>
            </div>
          </div>

          {/* Q3: Broker Finding Process */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. How You Found Your Broker</h2>
            <p className="text-sm text-gray-600 mb-4">Think about the LAST TIME you selected a benefits broker</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How did you find them? <span className="text-red-500">*</span></label>
                <select value={formData.how_found_broker} onChange={(e) => setFormData({...formData, how_found_broker: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select method</option>
                  <option value="N/A - Haven't selected broker">N/A - Haven't selected a broker yet</option>
                  <option value="Referral from colleague/friend">Referral from colleague/friend</option>
                  <option value="Referral from CPA/attorney">Referral from CPA/attorney/consultant</option>
                  <option value="Google search">Google search / online research</option>
                  <option value="Broker reached out">Broker reached out to me</option>
                  <option value="Through payroll/PEO">Through payroll/PEO</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.how_found_broker && formData.how_found_broker !== "N/A - Haven't selected broker" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How long from search to signing contract? <span className="text-red-500">*</span></label>
                    <select value={formData.time_to_find} onChange={(e) => setFormData({...formData, time_to_find: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                      <option value="">Select timeframe</option>
                      <option value="Less than 1 week">Less than 1 week</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="3-4 weeks">3-4 weeks</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="2-3 months">2-3 months</option>
                      <option value="3+ months">3+ months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How many brokers did you seriously evaluate? <span className="text-red-500">*</span></label>
                    <select value={formData.brokers_evaluated} onChange={(e) => setFormData({...formData, brokers_evaluated: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                      <option value="">Select number</option>
                      <option value="1 (took first option)">1 (took first option)</option>
                      <option value="2-3">2-3</option>
                      <option value="4-5">4-5</option>
                      <option value="6+">6+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate your satisfaction with THIS process (1-10) <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="1" max="10" value={formData.finding_satisfaction} onChange={(e) => setFormData({...formData, finding_satisfaction: parseInt(e.target.value)})} className="flex-1" required />
                      <span className="text-2xl font-bold text-purple-600 w-12 text-center">{formData.finding_satisfaction}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Very unsatisfied</span>
                      <span>Very satisfied</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Would you recommend this process to a colleague? <span className="text-red-500">*</span></label>
                    <select value={formData.would_recommend_process} onChange={(e) => setFormData({...formData, would_recommend_process: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                      <option value="">Select answer</option>
                      <option value="Definitely yes">Definitely yes</option>
                      <option value="Probably yes">Probably yes</option>
                      <option value="Not sure">Not sure</option>
                      <option value="Probably no">Probably no</option>
                      <option value="Definitely no">Definitely no</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Q4: Current Broker Experience */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Current Broker Experience</h2>
            <p className="text-sm text-gray-600 mb-4">If you don't have a broker yet, rate based on expectations or skip</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate overall experience with your broker (1-10) <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <input type="range" min="1" max="10" value={formData.broker_experience_rating} onChange={(e) => setFormData({...formData, broker_experience_rating: parseInt(e.target.value)})} className="flex-1" required />
                  <span className="text-2xl font-bold text-purple-600 w-12 text-center">{formData.broker_experience_rating}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How likely to recommend your broker? (1-10) <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <input type="range" min="1" max="10" value={formData.broker_recommendation_likelihood} onChange={(e) => setFormData({...formData, broker_recommendation_likelihood: parseInt(e.target.value)})} className="flex-1" required />
                  <span className="text-2xl font-bold text-purple-600 w-12 text-center">{formData.broker_recommendation_likelihood}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How often does your broker proactively reach out between renewals? <span className="text-red-500">*</span></label>
                <select value={formData.broker_proactive_contact} onChange={(e) => setFormData({...formData, broker_proactive_contact: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select frequency</option>
                  <option value="N/A - No broker yet">N/A - No broker yet</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually (at renewal)">Annually (at renewal time)</option>
                  <option value="Only when we contact them">Only when we contact them</option>
                </select>
              </div>
            </div>
          </div>

          {/* Q5: Last Renewal Reality */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Last Renewal Reality</h2>
            <p className="text-sm text-gray-600 mb-4">Think about your MOST RECENT renewal</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How did costs compare to broker's projection? <span className="text-red-500">*</span></label>
                <select value={formData.cost_vs_projection} onChange={(e) => setFormData({...formData, cost_vs_projection: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select comparison</option>
                  <option value="N/A - First renewal">N/A - First renewal</option>
                  <option value="Matched expectations (within 5%)">Matched expectations (within 5%)</option>
                  <option value="Slightly higher (5-10%)">Slightly higher (5-10%)</option>
                  <option value="Significantly higher (10%+)">Significantly higher (10%+)</option>
                  <option value="No projection provided">No projection provided</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Decision structure? <span className="text-red-500">*</span></label>
                <select value={formData.decision_structure} onChange={(e) => setFormData({...formData, decision_structure: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select structure</option>
                  <option value="N/A - First renewal">N/A - First renewal</option>
                  <option value="Simple (one person)">Simple (one person decided)</option>
                  <option value="Moderate (2-3 people)">Moderate (2-3 people aligned easily)</option>
                  <option value="Complex (multiple stakeholders)">Complex (multiple stakeholders, hard to align)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate satisfaction with renewal process (1-5) <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <input type="range" min="1" max="5" value={formData.renewal_satisfaction} onChange={(e) => setFormData({...formData, renewal_satisfaction: parseInt(e.target.value)})} className="flex-1" required />
                  <span className="text-2xl font-bold text-purple-600 w-12 text-center">{formData.renewal_satisfaction}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Q6: 10-Point Priority Game */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. The 10-Point Priority Game</h2>
            <p className="text-gray-700 mb-4">You have <strong>10 points</strong> to invest in improving your benefits program. Where would you allocate them?</p>
            
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
                <label className="block text-sm font-medium text-gray-800 mb-1">Employee Satisfaction & Retention</label>
                <p className="text-xs text-gray-600 mb-2">Keeping employees happy with their benefits</p>
                <select value={formData.priority_points.employee_satisfaction} onChange={(e) => handlePriorityChange('employee_satisfaction', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Stakeholder Alignment</label>
                <p className="text-xs text-gray-600 mb-2">Getting HR, Finance, and Leadership on the same page</p>
                <select value={formData.priority_points.stakeholder_alignment} onChange={(e) => handlePriorityChange('stakeholder_alignment', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Cost Control & Budget Management</label>
                <p className="text-xs text-gray-600 mb-2">Keeping benefits costs within budget</p>
                <select value={formData.priority_points.cost_control} onChange={(e) => handlePriorityChange('cost_control', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Broker Responsiveness & Service Quality</label>
                <p className="text-xs text-gray-600 mb-2">Having a responsive, proactive broker</p>
                <select value={formData.priority_points.broker_responsiveness} onChange={(e) => handlePriorityChange('broker_responsiveness', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Cost Predictability & Transparency</label>
                <p className="text-xs text-gray-600 mb-2">Knowing what you'll pay with no surprises</p>
                <select value={formData.priority_points.cost_predictability} onChange={(e) => handlePriorityChange('cost_predictability', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} points</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Q7: Switching Reality */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Switching Reality</h2>
            <p className="text-gray-700 mb-4">Which is MOST true for you TODAY?</p>
            <div className="space-y-3">
              {[
                { value: 'actively_shopping', label: 'Actively shopping for new broker now' },
                { value: 'would_switch', label: 'Would switch for better value/service' },
                { value: 'open_but_not_active', label: 'Open to switching but not actively looking' },
                { value: 'satisfied', label: 'Not considering switching - satisfied' },
                { value: 'too_much_effort', label: 'Not considering switching - too much effort' },
                { value: 'no_broker', label: 'N/A - Don\'t have a broker yet' }
              ].map(option => (
                <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                  <input type="radio" name="switching_reality" value={option.value} checked={formData.switching_reality === option.value} onChange={(e) => setFormData({...formData, switching_reality: e.target.value})} required className="w-4 h-4 text-purple-600 mt-1" />
                  <span className="ml-3 text-gray-800">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q8: Biggest Challenge */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Biggest Post-Selection Challenge</h2>
            <p className="text-gray-700 mb-4">After selecting your broker, what's been the BIGGEST challenge? (Pick ONE)</p>
            <div className="space-y-3">
              {[
                { value: 'no_broker', label: 'N/A - Don\'t have a broker yet' },
                { value: 'know_value', label: 'Hard to know if getting best value' },
                { value: 'responsiveness', label: 'Broker responsiveness/service declined' },
                { value: 'renewal_prep', label: 'Difficult to prepare for renewals' },
                { value: 'stakeholder_alignment', label: 'Multi-stakeholder alignment challenges' },
                { value: 'satisfied', label: 'Very satisfied - no major challenges' }
              ].map(option => (
                <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                  <input type="radio" name="biggest_challenge" value={option.value} checked={formData.biggest_challenge === option.value} onChange={(e) => setFormData({...formData, biggest_challenge: e.target.value})} required className="w-4 h-4 text-purple-600 mt-1" />
                  <span className="ml-3 text-gray-800">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q9: Time & Money */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Time Investment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">In the past 12 months, how much time spent managing broker relationship? <span className="text-red-500">*</span></label>
                <select value={formData.time_managing_broker} onChange={(e) => setFormData({...formData, time_managing_broker: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                  <option value="">Select time</option>
                  <option value="N/A - No broker">N/A - No broker yet</option>
                  <option value="Less than 5 hours">Less than 5 hours</option>
                  <option value="5-15 hours">5-15 hours</option>
                  <option value="15-40 hours">15-40 hours</option>
                  <option value="40+ hours">40+ hours</option>
                </select>
              </div>

              {formData.time_managing_broker && formData.time_managing_broker !== "N/A - No broker" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How satisfied with this time investment? (1-5) <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-4">
                    <input type="range" min="1" max="5" value={formData.time_satisfaction} onChange={(e) => setFormData({...formData, time_satisfaction: parseInt(e.target.value)})} className="flex-1" required />
                    <span className="text-2xl font-bold text-purple-600 w-12 text-center">{formData.time_satisfaction}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Q10: WTP */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Value Proposition</h2>
            <p className="text-gray-700 mb-4">If a platform matched you with 3-5 pre-vetted brokers based on your needs, saving you weeks of searching - what would you pay?</p>
            <select value={formData.willingness_to_pay} onChange={(e) => setFormData({...formData, willingness_to_pay: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
              <option value="">Select payment approach</option>
              <option value="Free only">Wouldn't use it / Free only</option>
              <option value="One-time: $500-1,000">One-time: $500-1,000</option>
              <option value="One-time: $1,000-2,000">One-time: $1,000-2,000</option>
              <option value="Monthly: $200-500">Monthly subscription: $200-500/month</option>
              <option value="Performance: 10-20% savings">Performance-based: 10-20% of savings</option>
              <option value="Other">Other approach</option>
            </select>
          </div>

          {/* Q11: Interest */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">11. Stay Connected</h2>
            <p className="text-gray-700 mb-4">Interested in learning about our findings or early access?</p>
            <div className="space-y-3 mb-4">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                <input type="radio" name="platform_interest" value="yes" checked={formData.platform_interest === 'yes'} onChange={(e) => setFormData({...formData, platform_interest: e.target.value})} required className="w-4 h-4 text-purple-600" />
                <span className="ml-3 text-gray-800 font-medium">Yes, contact me for early access</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                <input type="radio" name="platform_interest" value="maybe" checked={formData.platform_interest === 'maybe'} onChange={(e) => setFormData({...formData, platform_interest: e.target.value})} required className="w-4 h-4 text-purple-600" />
                <span className="ml-3 text-gray-800">Maybe, send updates</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                <input type="radio" name="platform_interest" value="no" checked={formData.platform_interest === 'no'} onChange={(e) => setFormData({...formData, platform_interest: e.target.value})} required className="w-4 h-4 text-purple-600" />
                <span className="ml-3 text-gray-800">No thanks</span>
              </label>
            </div>
            {(formData.platform_interest === 'yes' || formData.platform_interest === 'maybe') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email <span className="text-red-500">*</span></label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" placeholder="your@email.com" required />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <button type="submit" className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl">
              Submit Survey
            </button>
            <p className="text-center text-gray-600 text-sm mt-4">Your responses are confidential and used for research purposes only.</p>
          </div>

        </form>
      </div>
    </div>
  );
}
