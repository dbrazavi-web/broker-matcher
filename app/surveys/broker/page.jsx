'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function BrokerSurvey() {
  const supabase = createClientComponentClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firm_name: '',
    firm_size: '',
    specializations: [],
    regions_served: [],
    years_in_business: '',
    client_count: '',
    role: '',
    avg_client_size: '',
    commission_structure: '',
    cac: '',
    lead_sources: [],
    lead_challenge: '',
    retention_rate: '',
    retention_challenge: '',
    multi_stakeholder: '',
    qualified_criteria: [],
    payment_model: '',
    service_model: '',
    last_win: '',
    ideal_client: '',
    biggest_challenge: '',
    response_time: '',
    magic_wand: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('broker_responses')
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
                We'll send qualified employer leads to <strong>{formData.email}</strong> as they come in.
              </p>
            )}
            
            <div className="bg-purple-800/50 rounded-lg p-6 mb-6">
              <p className="text-lg font-semibold mb-2">Want early access to our platform?</p>
              <a 
                href="https://calendly.com/dbrazavi/15-minute-discovery-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-purple-900 px-6 py-3 rounded-lg font-semibold hover:bg-purple-100 transition"
              >
                Book a 15-Minute Call
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Clean Intro Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            How do brokers find new clients?
          </h1>
          <p className="text-xl text-purple-200">
            3 minutes | Share your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Question */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Email (optional)
            </label>
            <p className="text-sm text-gray-600 mb-4">
              We'll email you qualified employer leads as they come in. Want to discuss partnership opportunities for customized matching? Book a quick 15-minute call:{' '}
              <a 
                href="https://calendly.com/dbrazavi/15-minute-discovery-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline hover:text-purple-800"
              >
                https://calendly.com/dbrazavi/15-minute-discovery-meeting
              </a>
            </p>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="your@email.com"
            />
          </div>

          {/* Firm Name */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Firm Name (optional)
            </label>
            <input
              type="text"
              value={formData.firm_name}
              onChange={(e) => setFormData({...formData, firm_name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Your firm name"
            />
          </div>

          {/* Firm Size */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Firm Size
            </label>
            <select
              value={formData.firm_size}
              onChange={(e) => setFormData({...formData, firm_size: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              required
            >
              <option value="">Select size</option>
              <option value="solo">Solo broker</option>
              <option value="2-5">2-5 people</option>
              <option value="6-20">6-20 people</option>
              <option value="21-50">21-50 people</option>
              <option value="50+">50+ people</option>
            </select>
          </div>

          {/* Years in Business */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Years in Business
            </label>
            <select
              value={formData.years_in_business}
              onChange={(e) => setFormData({...formData, years_in_business: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              required
            >
              <option value="">Select range</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-20">11-20 years</option>
              <option value="20+">20+ years</option>
            </select>
          </div>

          {/* Average Client Size */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Average Client Size (employees)
            </label>
            <select
              value={formData.avg_client_size}
              onChange={(e) => setFormData({...formData, avg_client_size: e.target.value})}
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

          {/* Last Client Win - Mom Test Question */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Tell me about the last time you won a new client in the 10-200 employee range. How did you find them? What was the process?
            </label>
            <textarea
              value={formData.last_win}
              onChange={(e) => setFormData({...formData, last_win: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Tell your story..."
            />
          </div>

          {/* Lead Sources */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Where do most of your new clients come from? (Select all that apply)
            </label>
            <div className="space-y-2">
              {[
                'Referrals from existing clients',
                'Referrals from CPAs/attorneys/other professionals',
                'Inbound leads (website, content marketing)',
                'Outbound prospecting (cold outreach)',
                'Industry events/networking',
                'Carrier referrals',
                'Other'
              ].map((source) => (
                <label key={source} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={formData.lead_sources.includes(source)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, lead_sources: [...formData.lead_sources, source]});
                      } else {
                        setFormData({...formData, lead_sources: formData.lead_sources.filter(s => s !== source)});
                      }
                    }}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-gray-700">{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Biggest Challenge */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              What's your biggest challenge in finding and winning new clients in the 10-200 employee range?
            </label>
            <textarea
              value={formData.biggest_challenge}
              onChange={(e) => setFormData({...formData, biggest_challenge: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="What's the hardest part?"
            />
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              What's your typical response time for new prospect inquiries?
            </label>
            <select
              value={formData.response_time}
              onChange={(e) => setFormData({...formData, response_time: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select option</option>
              <option value="same_day">Same day</option>
              <option value="24_hours">Within 24 hours</option>
              <option value="2-3_days">Within 2-3 days</option>
              <option value="varies">Depends on the season</option>
            </select>
          </div>

          {/* Ideal Client */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Describe your ideal client. What size, industry, and characteristics make for the best fit with your practice?
            </label>
            <textarea
              value={formData.ideal_client}
              onChange={(e) => setFormData({...formData, ideal_client: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              placeholder="Describe your ideal client..."
            />
          </div>

          {/* Magic Wand */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              If you could change ONE thing about how you find and win new clients, what would it be?
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
              Want early access to our platform?{' '}
              <a 
                href="https://calendly.com/dbrazavi/15-minute-discovery-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline hover:text-purple-800"
              >
                Book a 15-min call
              </a>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
