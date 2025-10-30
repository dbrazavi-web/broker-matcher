'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function EmployerSurvey() {
  const supabase = createClientComponentClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    company_name: '',
    employee_count: '',
    state: '',
    industry: '',
    current_situation: '',
    last_interaction: '',
    how_found_broker: '',
    setup_process: '',
    alternative_solution: '',
    switched_brokers: '',
    switch_reason: '',
    response_time: '',
    referred_broker: '',
    referral_reason: '',
    priority_question: '',
    magic_wand: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('employers')
        .insert([formData])
        .select();

      if (error) throw error;

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Thank you! 🙏</h2>
            <p className="text-xl mb-6">Your insights are incredibly valuable.</p>
            
            {formData.email && (
              <p className="mb-6">
                We'll send your 3 matched broker recommendations to <strong>{formData.email}</strong> within 24 hours.
              </p>
            )}
            
            <div className="bg-purple-800/50 rounded-lg p-6 mb-6">
              <p className="text-lg font-semibold mb-2">Want to discuss your benefits challenges?</p>
              <a 
                href="https://calendly.com/dbrazavi/15-minute-discovery-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-purple-900 px-6 py-3 rounded-lg font-semibold hover:bg-purple-100 transition"
              >
                Book a 15-Minute Call
              </a>
            </div>
            
            <p className="text-sm text-purple-300">
              Your responses help us build better matching for the entire startup community.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Updated Intro Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Help Shape Better Benefits Broker Matching
          </h1>
          <p className="text-xl text-purple-200 mb-4">
            Share your experience → Get 3 vetted broker recommendations
          </p>
          <p className="text-lg text-purple-300">
            3 minutes | No sales pitch, just research
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <p className="text-center text-purple-100">
            <strong>I'm D, former Intuit financial analyst</strong>, building a platform to connect employers with vetted benefits brokers. This survey helps me understand what's broken in how companies find brokers today.
          </p>
          <p className="text-center text-purple-200 mt-3 text-sm">
            Want to discuss your situation directly?{' '}
            <a 
              href="https://calendly.com/dbrazavi/15-minute-discovery-meeting" 
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Book a 15-min call here
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Updated Email Question */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Want your matched broker recommendations via email?
            </label>
            <p className="text-sm text-gray-600 mb-4">
              We'll send you 3 broker profiles with full contact info and why they're a good fit for your company size and industry. Or you can view recommendations on-screen at the end (anonymous).
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Interested in discussing your benefits challenges?{' '}
              <a 
                href="https://calendly.com/dbrazavi/15-minute-discovery-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline hover:text-purple-800"
              >
                calendly.com/dbrazavi/15-minute-discovery-meeting
              </a>
            </p>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="your@email.com (optional)"
            />
            <p className="text-xs text-gray-500 mt-2">
              Optional - skip if you prefer anonymous on-screen results
            </p>
          </div>

          {/* Company Name */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Your company name"
              required
            />
          </div>

          {/* Employee Count */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              How many employees do you have?
            </label>
            <select
              value={formData.employee_count}
              onChange={(e) => setFormData({...formData, employee_count: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              required
            >
              <option value="">Select range</option>
              <option value="1-10">1-10</option>
              <option value="11-25">11-25</option>
              <option value="26-50">26-50</option>
              <option value="51-100">51-100</option>
              <option value="101-200">101-200</option>
              <option value="200+">200+</option>
            </select>
          </div>

          {/* State */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              What state is your company based in?
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="CA, NY, TX, etc."
              required
            />
          </div>

          {/* Industry */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              What industry are you in?
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              required
            >
              <option value="">Select industry</option>
              <option value="SaaS/Software">SaaS/Software</option>
              <option value="Fintech">Fintech</option>
              <option value="Healthcare/Biotech">Healthcare/Biotech</option>
              <option value="E-commerce/Marketplace">E-commerce/Marketplace</option>
              <option value="Consumer Tech">Consumer Tech</option>
              <option value="Enterprise Software">Enterprise Software</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Current Situation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              What's your current benefits situation?
            </label>
            <select
              value={formData.current_situation}
              onChange={(e) => setFormData({...formData, current_situation: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              required
            >
              <option value="">Select situation</option>
              <option value="no_benefits">We don't offer benefits yet</option>
              <option value="with_broker">We work with a benefits broker</option>
              <option value="manage_ourselves">We manage it ourselves (no broker)</option>
              <option value="peo">We use a PEO (Justworks, Rippling, etc.)</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Last Interaction - Mom Test Question */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Tell me about the last time you had to interact with your benefits broker (or search for one). What happened?
            </label>
            <textarea
              value={formData.last_interaction}
              onChange={(e) => setFormData({...formData, last_interaction: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Tell your story..."
            />
          </div>

          {/* How Found Broker */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              How did you find your current broker (or last broker you worked with)?
            </label>
            <select
              value={formData.how_found_broker}
              onChange={(e) => setFormData({...formData, how_found_broker: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select option</option>
              <option value="referral">Referral from friend/colleague/investor</option>
              <option value="broker_outreach">Broker reached out to us</option>
              <option value="google">Found them through Google search</option>
              <option value="peo">Came with our PEO</option>
              <option value="inherited">Inherited from previous role</option>
              <option value="still_searching">Still haven't found one</option>
              <option value="no_broker">N/A - don't use a broker</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Setup Process */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              If you've set up benefits before, walk me through what that process looked like. How long did it take? What were the steps?
            </label>
            <textarea
              value={formData.setup_process}
              onChange={(e) => setFormData({...formData, setup_process: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Describe the process..."
            />
          </div>

          {/* Alternative Solution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Before you had a broker (or if you don't have one now), how did you handle benefits? What did you do instead?
            </label>
            <textarea
              value={formData.alternative_solution}
              onChange={(e) => setFormData({...formData, alternative_solution: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="What was your alternative?"
            />
          </div>

          {/* Switched Brokers */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Have you ever switched benefits brokers?
            </label>
            <select
              value={formData.switched_brokers}
              onChange={(e) => setFormData({...formData, switched_brokers: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 mb-4"
            >
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="na">N/A - never had a broker</option>
            </select>

            {formData.switched_brokers === 'yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What triggered the switch?
                </label>
                <textarea
                  value={formData.switch_reason}
                  onChange={(e) => setFormData({...formData, switch_reason: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  placeholder="What made you switch?"
                />
              </div>
            )}
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Think about the last 2-3 times you reached out to your broker. How long did it typically take them to respond?
            </label>
            <select
              value={formData.response_time}
              onChange={(e) => setFormData({...formData, response_time: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select option</option>
              <option value="same_day">Same day</option>
              <option value="1-2_days">1-2 days</option>
              <option value="3-5_days">3-5 days</option>
              <option value="week_plus">More than a week</option>
              <option value="varies">Varies a lot</option>
              <option value="na">N/A</option>
            </select>
          </div>

          {/* Referral Behavior */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Have you referred your broker to another company?
            </label>
            <select
              value={formData.referred_broker}
              onChange={(e) => setFormData({...formData, referred_broker: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 mb-4"
            >
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="na">N/A</option>
            </select>

            {formData.referred_broker === 'no' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why not?
                </label>
                <textarea
                  value={formData.referral_reason}
                  onChange={(e) => setFormData({...formData, referral_reason: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  placeholder="What's the reason?"
                />
              </div>
            )}
          </div>

          {/* Priority Question */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              If you were looking for a broker today, what's the #1 thing you'd want to know about them before choosing?
            </label>
            <textarea
              value={formData.priority_question}
              onChange={(e) => setFormData({...formData, priority_question: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="What matters most?"
            />
          </div>

          {/* Magic Wand */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              If you had a magic wand and could change ONE thing about your benefits setup (broker, process, cost, anything), what would it be?
            </label>
            <textarea
              value={formData.magic_wand}
              onChange={(e) => setFormData({...formData, magic_wand: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="What would you change?"
            />
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl"
            >
              Submit Survey
            </button>
            <p className="text-center text-gray-600 text-sm mt-4">
              Your responses help us build better matching for the entire startup community.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
