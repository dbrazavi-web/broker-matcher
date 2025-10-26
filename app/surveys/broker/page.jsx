'use client';
export const dynamic = 'force-dynamic'

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BrokerSurvey() {
  // Email (required)
  const [email, setEmail] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    firmName: '',
    contactName: '',
    location: '',
    serviceArea: [],
    companySizeFocus: '',
    industriesServed: [],
    specializations: [],
    yearsInBusiness: '',
    techStartupClients: '',
    leadSources: [],
    challengesWinning: [],
    idealClient: '',
  });

  const [requestedIntros, setRequestedIntros] = useState(new Set());
  const [requestedIntros, setRequestedIntros] = useState(new Set());
  const [requestedIntros, setRequestedIntros] = useState(new Set());
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

  const handleRequestIntro = async (lead) => {
    try {
      const { error } = await supabase
        .from("intro_requests")
        .insert([{
          broker_email: email,
          broker_name: formData.contactName,
          lead_company: lead.company_name,
          lead_details: lead
        }]);
      
      if (error) throw error;
      
      setRequestedIntros(prev => new Set([...prev, lead.id]));
      alert("Request sent! We will connect you with this employer soon.");
    } catch (error) {
      console.error("Error requesting intro:", error);
      alert("Error sending request. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save broker submission to a separate "broker_responses" table
      const { error: brokerError } = await supabase
        .from('broker_responses')
        .insert([{
          firm_name: formData.firmName,
          contact_name: formData.contactName,
          location: formData.location,
          email: email, // Always required now
          service_area: formData.serviceArea,
          company_size_focus: formData.companySizeFocus,
          industries_served: formData.industriesServed,
          specializations: formData.specializations,
          years_in_business: formData.yearsInBusiness,
          tech_startup_clients: formData.techStartupClients,
          lead_sources: formData.leadSources,
          challenges_winning: formData.challengesWinning,
          ideal_client: formData.idealClient,
        }]);

      if (brokerError) throw brokerError;

      // Get matching employers (mock data for now - in production, match based on criteria)
      // For MVP, show example matched leads
      setMatches([
        {
          id: 1,
          company_name: 'TechStartup Inc.',
          company_size: '51-200',
          location: formData.serviceArea[0] || formData.location,
          industry: formData.industriesServed[0] || 'Technology/SaaS',
          status: 'Actively looking',
          match_reason: 'Looking for a broker in your service area with tech startup experience'
        },
        {
          id: 2,
          company_name: 'Growth Co.',
          company_size: '11-50',
          location: formData.serviceArea[1] || formData.location,
          industry: formData.industriesServed[1] || 'Fintech',
          status: 'Exploring options',
          match_reason: 'Needs broker specializing in their company size and industry'
        },
        {
          id: 3,
          company_name: 'Scale Systems',
          company_size: '201-500',
          location: formData.location,
          industry: formData.industriesServed[0] || 'Technology/SaaS',
          status: 'First time buyer',
          match_reason: 'First time seeking broker, perfect for your specialization'
        }
      ]);

      // If email provided, send matches
      // Email is now always required
      // TODO: Integrate email service
      console.log('Send email to:', email, 'with matches');

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
            <h1 className="text-4xl font-bold mb-4">🎯 Your Qualified Lead Matches Are Ready!</h1>
            <p className="text-xl text-purple-200">
              Here are 3 tech startups actively seeking brokers like you
            </p>
          </div>

          <div className="space-y-6">
            {matches.map((lead, index) => (
              <div key={lead.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {index + 1}. {lead.company_name}
                    </h3>
                    <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {lead.status}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-purple-100">
                  <p><strong className="text-white">Company Size:</strong> {lead.company_size} employees</p>
                  <p><strong className="text-white">Location:</strong> {lead.location}</p>
                  <p><strong className="text-white">Industry:</strong> {lead.industry}</p>
                  <p><strong className="text-white">Timeline:</strong> {lead.status}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-purple-200">
                    <strong className="text-white">Why this match:</strong> {lead.match_reason}
                  </p>
                </div>

                <div className="mt-6">
                  <button onClick={() => handleRequestIntro(lead)} disabled={requestedIntros.has(lead.id)} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition disabled:cursor-not-allowed">
                    {requestedIntros.has(lead.id) ? '✓ Request Sent' : 'Request Introduction'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-green-500/20 border border-green-500/50 rounded-lg p-6 text-center">
            <p className="text-lg">
              ✉️ Check your inbox at <strong>{email}</strong>
            </p>
            <p className="text-sm text-purple-200 mt-2">
              We've sent you <strong>detailed company profiles</strong> and <strong>contact instructions</strong>
            </p>
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Want More Qualified Leads?</h3>
            <p className="text-purple-200 mb-6">
              I may reach out personally to learn how you win tech startup clients. 
              Your insights help us send you <strong>better-matched leads</strong> that actually convert.
            </p>
            <p className="text-sm text-purple-300">
              Keep an eye on your inbox - we'd love to understand your process
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
            Get Qualified Tech Startup Leads in 3 Minutes
          </h1>
          <p className="text-2xl text-purple-200">
            Answer 11 questions → Get 3 matched leads <strong>instantly</strong>
          </p>
          <p className="text-xl text-purple-300 mt-2">
            Skip cold outreach and expensive lead lists ($200-500 per lead)
          </p>
        </div>

        <div className="h-px bg-white/20 my-8"></div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Email - Required */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Where should we send your leads?
            </h3>
            
            <p className="text-purple-200 mb-4">
              We'll email you <strong>3 qualified startup leads</strong> with <strong>company details</strong> and <strong>contact pathways</strong>.
            </p>
            
            <input
              type="email"
              placeholder="your.email@brokerage.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 placeholder-purple-400 font-medium"
            />
            
            <p className="text-sm text-purple-300 mt-3">
              We may reach out to understand how you win tech startup clients. Your insights help us send you better-matched leads.
            </p>
          </div>

          <div className="h-px bg-white/20"></div>

          {/* Questions Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
          <div className="space-y-6">

          {/* Question 1: Firm Name */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              1. What's your brokerage firm name?
            </label>
            <input
              type="text"
              name="firmName"
              value={formData.firmName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 placeholder-purple-400 font-medium"
              placeholder="Smith Benefits Group"
            />
          </div>

          {/* Question 2: Contact Name */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              2. What's your name?
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 placeholder-purple-400 font-medium"
              placeholder="Jane Smith"
            />
          </div>

          {/* Question 3: Location */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              3. Where is your firm located?
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

          {/* Question 4: Service Area */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              4. What regions do you serve? (Select all that apply)
            </label>
            <div className="space-y-2">
              {['San Francisco Bay Area', 'Southern California', 'New York/NYC', 'Boston/New England', 'National', 'Other'].map(area => (
                <label key={area} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.serviceArea.includes(area)}
                    onChange={() => handleCheckboxChange('serviceArea', area)}
                    className="w-5 h-5"
                  />
                  <span>{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 5: Company Size Focus */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              5. What company size do you specialize in?
            </label>
            <select
              name="companySizeFocus"
              value={formData.companySizeFocus}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select size...</option>
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-500 employees">201-500 employees</option>
              <option value="500+ employees">500+ employees</option>
              <option value="All sizes">All sizes</option>
            </select>
          </div>

          {/* Question 6: Industries Served */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              6. Which industries do you specialize in? (Select all that apply)
            </label>
            <div className="space-y-2">
              {['Technology/SaaS', 'Fintech', 'Healthcare Tech', 'E-commerce', 'Professional Services', 'Other'].map(industry => (
                <label key={industry} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.industriesServed.includes(industry)}
                    onChange={() => handleCheckboxChange('industriesServed', industry)}
                    className="w-5 h-5"
                  />
                  <span>{industry}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 7: Specializations */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              7. What are your key specializations? (Select all that apply)
            </label>
            <div className="space-y-2">
              {[
                'High-growth startups',
                'Multi-state compliance',
                'Cost containment strategies',
                'Self-funded plans',
                'Executive benefits',
                'Point solutions (fertility, mental health, etc.)',
                'Benefits technology platforms'
              ].map(spec => (
                <label key={spec} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specializations.includes(spec)}
                    onChange={() => handleCheckboxChange('specializations', spec)}
                    className="w-5 h-5"
                  />
                  <span>{spec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 8: Years in Business */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              8. How long have you been in the benefits brokerage business?
            </label>
            <select
              name="yearsInBusiness"
              value={formData.yearsInBusiness}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select...</option>
              <option value="Less than 2 years">Less than 2 years</option>
              <option value="2-5 years">2-5 years</option>
              <option value="6-10 years">6-10 years</option>
              <option value="10-20 years">10-20 years</option>
              <option value="20+ years">20+ years</option>
            </select>
          </div>

          {/* Question 9: Tech Startup Clients */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              9. How many tech startup clients do you currently serve?
            </label>
            <select
              name="techStartupClients"
              value={formData.techStartupClients}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-purple-900 font-medium"
            >
              <option value="">Select...</option>
              <option value="None yet">None yet (but interested)</option>
              <option value="1-5">1-5 clients</option>
              <option value="6-15">6-15 clients</option>
              <option value="16-30">16-30 clients</option>
              <option value="30+">30+ clients</option>
            </select>
          </div>

          {/* Question 10: Lead Sources */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              10. How do you currently find tech startup clients? (Select all that apply)
            </label>
            <div className="space-y-2">
              {[
                'Referrals from existing clients',
                'Networking events',
                'LinkedIn outreach',
                'Partnerships with HR platforms',
                'Cold calling/emailing',
                'Lead generation services',
                'Word of mouth'
              ].map(source => (
                <label key={source} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.leadSources.includes(source)}
                    onChange={() => handleCheckboxChange('leadSources', source)}
                    className="w-5 h-5"
                  />
                  <span>{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 11: Challenges Winning Clients */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <label className="block text-lg font-semibold mb-3">
              11. What are your biggest challenges winning tech startup clients? (Select all that apply)
            </label>
            <div className="space-y-2">
              {[
                'Finding qualified leads',
                'Competing with larger brokerages',
                'Proving ROI/value',
                'Getting past gatekeepers',
                'Startups want to DIY benefits',
                'Long sales cycles',
                'Price sensitivity'
              ].map(challenge => (
                <label key={challenge} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.challengesWinning.includes(challenge)}
                    onChange={() => handleCheckboxChange('challengesWinning', challenge)}
                    className="w-5 h-5"
                  />
                  <span>{challenge}</span>
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
              {loading ? 'Finding Your Leads...' : '🎯 Show Me My Qualified Leads'}
            </button>
          </div>

          <p className="text-center text-sm text-purple-300">
            Your insights help us send you <strong>better-matched leads</strong> that convert
          </p>
        </form>
      </div>
    </div>
  );
}
