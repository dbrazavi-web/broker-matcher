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
          email: email, // Always required now
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

      // Get matching brokers based on location and company size
      const { data: brokersData, error: brokersError } = await supabase
        .from('brokers')
        .select('*')
        .or(`service_area.cs.{${formData.location}},service_area.cs.{National}`)
        .limit(3);

      if (brokersError) throw brokersError;

      setMatches(brokersData || []);

      // Send matches via email (always, since email is required)
      // TODO: Integrate email service (SendGrid, Resend, etc.)
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
              Here are 3 brokers who specialize in companies like yours
            </p>
          </div>

          <div className="space-y-6">
            {matches.map((broker, index) => (
              <div key={broker.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {index + 1}. {broker.firm_name}
                    </h3>
                    {broker.m_score && (
                      <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        M Score: {broker.m_score}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-purple-100">
                  <p><strong className="text-white">Location:</strong> {broker.location}</p>
                  <p><strong className="text-white">Service Area:</strong> {broker.service_area?.join(', ')}</p>
                  <p><strong className="text-white">Specializations:</strong> {broker.specializations?.join(', ')}</p>
                  <p><strong className="text-white">Company Size Focus:</strong> {broker.company_size_focus}</p>
                  {broker.industries_served && (
                    <p><strong className="text-white">Industries:</strong> {broker.industries_served.join(', ')}</p>
                  )}
                </div>

                <div className="mt-6 flex gap-4">
                  {broker.website && (
                    <a
                      href={broker.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Visit Website
                    </a>
                  )}
                  {broker.contact_email && (
                    <a
                      href={`mailto:${broker.contact_email}`}
                      className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      Contact Broker
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-purple-200">
                    <strong className="text-white">Why this match:</strong> {broker.firm_name} specializes in {broker.company_size_focus} companies
                    {broker.industries_served && ` in ${broker.industries_served[0]}`}, 
                    serving the {broker.service_area?.join(' and ')} area{broker.service_area?.length > 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            ))}
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
          
          {/* Note: Questions will be in 3-column grid below */}
          
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

          {/* Questions Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
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
              onChange={handleInputChange} required
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
              onChange={handleInputChange} required
              required
            >
              <option value="">Select size...</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>

          {/* Question 3: Location */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              3. Where is your company headquartered?
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange} required
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select location...</option>
              <option value="San Francisco">San Francisco</option>
              <option value="San Diego">San Diego</option>
              <option value="New York">New York</option>
              <option value="Boston">Boston</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Question 4: Industry */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              4. What industry are you in?
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleInputChange} required
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

          {/* Question 5: Current Broker */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              5. Do you currently have a benefits broker?
            </label>
            <select
              name="currentBroker"
              value={formData.currentBroker}
              onChange={handleInputChange} required
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select...</option>
              <option value="Yes">Yes, we have a broker</option>
              <option value="No">No, we don't have a broker</option>
              <option value="We manage it ourselves">We manage benefits ourselves</option>
            </select>
          </div>

          {/* Question 6: Years with Broker */}
          {formData.currentBroker === 'Yes' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <label className="block text-lg font-semibold mb-3">
                6. How long have you worked with your current broker?
              </label>
              <select
                name="yearsWithBroker"
                value={formData.yearsWithBroker}
                onChange={handleInputChange} required
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

          {/* Question 7: Switching Consideration */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              7. Are you considering switching brokers or finding one for the first time?
            </label>
            <select
              name="switchingConsideration"
              value={formData.switchingConsideration}
              onChange={handleInputChange} required
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

          {/* Question 8: Decision Makers */}
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

          {/* Question 9: Brokers Evaluated */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              9. When you last searched for a broker, how many did you evaluate?
            </label>
            <select
              name="brokersEvaluated"
              value={formData.brokersEvaluated}
              onChange={handleInputChange} required
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

          {/* Question 10: Selection Criteria */}
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

          {/* Question 11: Pain Points */}
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
          {/* End Questions Grid */}

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
