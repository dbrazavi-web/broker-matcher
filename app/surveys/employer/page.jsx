'use client';
export const dynamic = 'force-dynamic'

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EmployerSurvey() {
  // Email (required)
  const [email, setEmail] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    companyName: '',
    companySize: '',
    location: '',
    industry: '',
    currentBroker: '',
    yearsWithBroker: '',
    switchingConsideration: '',
    decisionMakers: [],
    brokersEvaluated: '',
    selectionCriteria: [],
    painPoints: [],
    annualPremium: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  // UPDATED: Map location to state abbreviation for matching
  const getStateFromLocation = (location) => {
    const stateMap = {
      'San Francisco': 'CA',
      'San Diego': 'CA',
      'Los Angeles': 'CA',
      'New York': 'NY',
      'Boston': 'MA',
      'Austin': 'TX',
      'Houston': 'TX',
      'Dallas': 'TX',
      'Seattle': 'WA',
      'Chicago': 'IL',
      'Other': null
    };
    return stateMap[location] || null;
  };

  // UPDATED: Convert company size to number for matching
  const getCompanySizeNumber = (sizeRange) => {
    const sizeMap = {
      '1-10': 10,
      '11-50': 50,
      '51-200': 200,
      '201-500': 500,
      '500+': 1000
    };
    return sizeMap[sizeRange] || 50;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save employer submission
      const { data: employerData, error: employerError } = await supabase
        .from('employers')
        .insert([{
          company_name: formData.companyName,
          company_size: formData.companySize,
          location: formData.location,
          industry: formData.industry,
          email: email,
          current_broker: formData.currentBroker,
          years_with_broker: formData.yearsWithBroker,
          switching_consideration: formData.switchingConsideration,
          decision_makers: formData.decisionMakers,
          brokers_evaluated: formData.brokersEvaluated,
          selection_criteria: formData.selectionCriteria,
          pain_points: formData.painPoints,
          annual_premium: formData.annualPremium,
        }])
        .select();

      if (employerError) throw employerError;

      // UPDATED MATCHING LOGIC: Use real brokers with state and company_size
      const userState = getStateFromLocation(formData.location);
      const companySize = getCompanySizeNumber(formData.companySize);

      let brokersData = [];
      const seenBrokerIds = new Set();

      if (userState) {
        // Priority 1: State match + company size + startup focus
        const { data: priorityBrokers } = await supabase
          .from('brokers')
          .select('*')
          .eq('state', userState)
          .eq('is_active', true)
          .eq('specializes_in_startups', true)
          .lte('company_size_min', companySize)
          .gte('company_size_max', companySize)
          .limit(3);

        if (priorityBrokers) {
          priorityBrokers.forEach(broker => {
            if (!seenBrokerIds.has(broker.id)) {
              brokersData.push(broker);
              seenBrokerIds.add(broker.id);
            }
          });
        }

        // Priority 2: If <3 matches, drop startup filter
        if (brokersData.length < 3) {
          const { data: backupBrokers } = await supabase
            .from('brokers')
            .select('*')
            .eq('state', userState)
            .eq('is_active', true)
            .lte('company_size_min', companySize)
            .gte('company_size_max', companySize)
            .limit(5);

          if (backupBrokers) {
            backupBrokers.forEach(broker => {
              if (!seenBrokerIds.has(broker.id) && brokersData.length < 3) {
                brokersData.push(broker);
                seenBrokerIds.add(broker.id);
              }
            });
          }
        }

        // Priority 3: If still <3, just match by state
        if (brokersData.length < 3) {
          const { data: stateBrokers } = await supabase
            .from('brokers')
            .select('*')
            .eq('state', userState)
            .eq('is_active', true)
            .limit(5);

          if (stateBrokers) {
            stateBrokers.forEach(broker => {
              if (!seenBrokerIds.has(broker.id) && brokersData.length < 3) {
                brokersData.push(broker);
                seenBrokerIds.add(broker.id);
              }
            });
          }
        }
      } else {
        // If "Other" location, get any startup-focused brokers
        const { data: generalBrokers } = await supabase
          .from('brokers')
          .select('*')
          .eq('is_active', true)
          .eq('specializes_in_startups', true)
          .limit(3);

        brokersData = generalBrokers || [];
      }

      setMatches(brokersData);

      // TODO: Send matches via email
      console.log('Send email to:', email, 'with matches:', brokersData);

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">🎉 Your Broker Matches Are Ready!</h1>
            <p className="text-xl text-purple-200">
              Here are {matches.length} broker{matches.length !== 1 ? 's' : ''} who specialize in companies like yours
            </p>
          </div>

          <div className="space-y-6">
            {matches.length > 0 ? (
              matches.map((broker, index) => (
                <div key={broker.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        {index + 1}. {broker.company_name || broker.firm_name}
                      </h3>
                      {broker.specializes_in_startups && (
                        <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ✓ Startup Specialist
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-purple-100">
                    <p><strong className="text-white">Location:</strong> {broker.location}</p>
                    <p><strong className="text-white">Company Size Focus:</strong> {broker.company_size_min}-{broker.company_size_max} employees</p>
                    {broker.email && (
                      <p><strong className="text-white">Email:</strong> {broker.email}</p>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm text-purple-200">
                      <strong className="text-white">Why this match:</strong> {broker.company_name || broker.firm_name} specializes in companies with {broker.company_size_min}-{broker.company_size_max} employees in {broker.state}.
                      {broker.specializes_in_startups && ' They have deep expertise working with startups and high-growth companies.'}
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => alert('Introduction request sent! We\'ll connect you within 24 hours.')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Request Introduction
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
                <p className="text-xl">We're expanding our broker network in your area. We'll email you matches within 24 hours!</p>
              </div>
            )}
          </div>

          <div className="mt-12 bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
            <p className="text-lg">
              ✉️ Check your inbox at <strong>{email}</strong>
            </p>
            <p className="text-sm text-purple-200 mt-2">
              We've sent you <strong>detailed broker profiles</strong> with <strong>full contact information</strong> and <strong>next steps</strong>
            </p>
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Want to Help Shape This?</h3>
            <p className="text-purple-200 mb-6">
              I may reach out personally to learn more about your broker search experience. 
              Your insights help us build <strong>better matching</strong> for tech startups like yours.
            </p>
            <p className="text-sm text-purple-300">
              Keep an eye on your inbox - we'd love to hear your story
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            3 Minutes to Your Perfect Benefits Broker Match
          </h1>
          <p className="text-2xl text-purple-200">
            Answer 10 questions → Get 3 personalized matches <strong>instantly</strong>
          </p>
          <p className="text-xl text-purple-300 mt-2">
            Skip 3 months of research and $2,500 in consultant fees
          </p>
        </div>

        <div className="h-px bg-white/20 my-8"></div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Email - Required */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Where should we send your matches?
            </h3>
            
            <p className="text-purple-200 mb-4">
              We'll email you <strong>3 broker matches</strong> with <strong>full contact details</strong> and <strong>why each broker fits your company</strong>.
            </p>
            
            <input
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 placeholder-purple-400 font-medium"
            />
            
            <p className="text-sm text-purple-300 mt-3">
              We may personally reach out to learn more about your broker search experience. Your insights help us improve matching for everyone.
            </p>
          </div>

          <div className="h-px bg-white/20"></div>

          {/* Questions Grid */}
          <div className="space-y-6">

          {/* Question 1: Company Name */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              1. What's your company name?
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 placeholder-purple-400 font-medium"
              placeholder="Acme Inc."
            />
          </div>

          {/* Question 2: Company Size */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              2. How many employees do you have?
            </label>
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select size...</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>

          {/* Question 3: Location - UPDATED with more states */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              3. Where is your company headquartered?
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select location...</option>
              <option value="San Francisco">San Francisco, CA</option>
              <option value="San Diego">San Diego, CA</option>
              <option value="Los Angeles">Los Angeles, CA</option>
              <option value="New York">New York, NY</option>
              <option value="Chicago">Chicago, IL</option>
              <option value="Austin">Austin, TX</option>
              <option value="Houston">Houston, TX</option>
              <option value="Dallas">Dallas, TX</option>
              <option value="Seattle">Seattle, WA</option>
              <option value="Boston">Boston, MA</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Questions 4-11: Keep all existing questions unchanged */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              4. What industry are you in?
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select industry...</option>
              <option value="Technology/SaaS">Technology/SaaS</option>
              <option value="Fintech">Fintech</option>
              <option value="Healthcare Tech">Healthcare Tech</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Other Tech">Other Tech</option>
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              5. Do you currently have a benefits broker?
            </label>
            <select
              name="currentBroker"
              value={formData.currentBroker}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select...</option>
              <option value="Yes">Yes, we have a broker</option>
              <option value="No">No, we don't have a broker</option>
              <option value="We manage it ourselves">We manage benefits ourselves</option>
            </select>
          </div>

          {formData.currentBroker === 'Yes' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <label className="block text-lg font-semibold mb-3">
                6. How long have you worked with your current broker?
              </label>
              <select
                name="yearsWithBroker"
                value={formData.yearsWithBroker}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
              >
                <option value="">Select...</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              7. Are you considering switching brokers or finding one for the first time?
            </label>
            <select
              name="switchingConsideration"
              value={formData.switchingConsideration}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select...</option>
              <option value="Actively looking">Actively looking now</option>
              <option value="Exploring options">Exploring options (next 6 months)</option>
              <option value="Not currently">Not currently, but open to better options</option>
              <option value="First time">Looking for our first broker</option>
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              8. Who's involved in choosing your benefits broker? (Select all that apply)
            </label>
            <div className="space-y-2">
              {['CEO/Founder', 'CFO', 'HR/People Ops', 'Operations', 'Benefits Committee', 'Other'].map(role => (
                <label key={role} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.decisionMakers.includes(role)}
                    onChange={() => handleCheckboxChange('decisionMakers', role)}
                    className="w-5 h-5"
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              9. When you last searched for a broker, how many did you evaluate?
            </label>
            <select
              name="brokersEvaluated"
              value={formData.brokersEvaluated}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select...</option>
              <option value="None yet">Haven't started yet</option>
              <option value="1-2">1-2 brokers</option>
              <option value="3-5">3-5 brokers</option>
              <option value="6-10">6-10 brokers</option>
              <option value="10+">More than 10</option>
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              10. What matters most when choosing a broker? (Select top 3)
            </label>
            <div className="space-y-2">
              {[
                'Cost savings on premiums',
                'Broker expertise in our industry',
                'Broker local to our region',
                'Employee satisfaction with benefits',
                'Compliance and risk management',
                'Technology/platform quality',
                'Responsiveness and service'
              ].map(criteria => (
                <label key={criteria} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selectionCriteria.includes(criteria)}
                    onChange={() => handleCheckboxChange('selectionCriteria', criteria)}
                    disabled={formData.selectionCriteria.length >= 3 && !formData.selectionCriteria.includes(criteria)}
                    className="w-5 h-5"
                  />
                  <span className={formData.selectionCriteria.length >= 3 && !formData.selectionCriteria.includes(criteria) ? 'text-purple-400' : ''}>
                    {criteria}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              11. What are your biggest frustrations with benefits or brokers? (Select all that apply)
            </label>
            <div className="space-y-2">
              {[
                'Costs keep increasing',
                'Hard to find specialized brokers',
                'Too much time spent on research',
                'Broker isn\'t responsive',
                'Employees confused about benefits',
                'Compliance concerns',
                'Don\'t know if we\'re getting good value'
              ].map(pain => (
                <label key={pain} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.painPoints.includes(pain)}
                    onChange={() => handleCheckboxChange('painPoints', pain)}
                    className="w-5 h-5"
                  />
                  <span>{pain}</span>
                </label>
              ))}
            </div>
          </div>

          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Finding Your Matches...' : '🚀 Show Me My Broker Matches'}
            </button>
          </div>

          <p className="text-center text-sm text-purple-300">
            Your responses help us build <strong>better matching</strong> for the entire startup community
          </p>
        </form>
      </div>
    </div>
  );
}
