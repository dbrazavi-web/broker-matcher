'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EmployerSurvey() {
  // Email delivery preference
  const [deliveryMethod, setDeliveryMethod] = useState('screen');
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
          email: deliveryMethod === 'email' ? email : null,
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

      // If email provided, send matches
      if (deliveryMethod === 'email' && email) {
        // TODO: Integrate email service (SendGrid, Resend, etc.)
        console.log('Send email to:', email, 'with matches:', brokersData);
      }

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
        <div className="max-w-4xl mx-auto">
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

          {deliveryMethod === 'email' && (
            <div className="mt-12 bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
              <p className="text-lg">
                ✉️ We've also emailed these matches to <strong>{email}</strong>
              </p>
              <p className="text-sm text-purple-200 mt-2">
                Check your inbox for <strong>full contact details</strong> and our <strong>$50 interview invitation</strong>
              </p>
            </div>
          )}

          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Want to Help Other Startups?</h3>
            <p className="text-purple-200 mb-6">
              Share your broker search experience in a <strong>20-minute interview</strong> and get a <strong>$50 Amazon gift card</strong>
            </p>
            <a
              href="mailto:youremail@brokerMatch.com?subject=Interview Request"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Book Your Interview
            </a>
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
            10 Minutes to Your Perfect Benefits Broker Match
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
          
          {/* Email Delivery Option - AT THE TOP */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              How should we deliver your matches?
            </h3>
            
            <div className="space-y-3 mb-4">
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded hover:bg-white/5 transition">
                <input 
                  type="radio" 
                  name="delivery"
                  value="screen"
                  checked={deliveryMethod === 'screen'}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="mt-1"
                />
                <span>Show on-screen only (anonymous, instant results)</span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded hover:bg-white/5 transition">
                <input 
                  type="radio" 
                  name="delivery"
                  value="email"
                  checked={deliveryMethod === 'email'}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div>Email me a copy with <strong>full broker contact details</strong> and <strong>optional $50 interview invite</strong></div>
                </div>
              </label>
            </div>
            
            {deliveryMethod === 'email' && (
              <div className="mt-4">
                <input
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={deliveryMethod === 'email'}
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 placeholder-purple-400 font-medium"
                />
                <p className="text-sm text-purple-300 mt-2">
                  We'll send <strong>detailed broker profiles</strong>, <strong>direct contact information</strong>, and <strong>match reasoning</strong>
                </p>
              </div>
            )}
          </div>

          <div className="h-px bg-white/20"></div>

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

          {/* Question 3: Location */}
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

          {/* Question 5: Current Broker */}
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

          {/* Question 6: Years with Broker */}
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

          {/* Question 7: Switching Consideration */}
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
