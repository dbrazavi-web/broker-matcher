'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function EmployersPage() {
  const supabase = createClientComponentClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    employee_count: '',
    timeline: '',
    biggest_pain: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from('match_requests').insert([{
        ...formData,
        request_type: 'employer',
        status: 'pending'
      }]);
      
      if (error) throw error;
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">We're On It!</h1>
          <p className="text-lg text-gray-700 mb-6">We'll manually match you with 3 perfect brokers within 48 hours.</p>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <p className="text-green-900 font-semibold">📧 Check: {formData.email}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Stop Wasting Months Finding a Benefits Broker
          </h1>
          <p className="text-2xl text-purple-200 mb-8">
            Get matched with 3 vetted brokers in 48 hours, not 3 months.
          </p>
        </div>

        {/* Problems */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sound Familiar?</h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-red-50 rounded-lg">
              <div className="text-3xl">😤</div>
              <div>
                <div className="font-bold text-gray-900">Drowning in Google searches</div>
                <div className="text-gray-600">2-3 months just to find someone</div>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-red-50 rounded-lg">
              <div className="text-3xl">💸</div>
              <div>
                <div className="font-bold text-gray-900">Costs exceed projections</div>
                <div className="text-gray-600">Broker said $X, renewal came in 10%+ higher</div>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-red-50 rounded-lg">
              <div className="text-3xl">🤯</div>
              <div>
                <div className="font-bold text-gray-900">Multi-stakeholder nightmare</div>
                <div className="text-gray-600">HR, Finance, CEO all want different things</div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-bold text-lg">Fill out form (2 min)</div>
                <div className="text-gray-600">Tell us your needs</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-bold text-lg">We match you (48 hours)</div>
                <div className="text-gray-600">Hand-picked brokers for YOUR situation</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-bold text-lg">Get warm intros</div>
                <div className="text-gray-600">Pick who to talk to</div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-500">
            <div className="font-bold text-yellow-900">🎁 First Match: FREE</div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Get Your Free Match</h2>
          <p className="text-gray-600 text-center mb-6">3 perfect brokers in 48 hours</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input type="text" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <input type="text" value={formData.contact_name} onChange={(e) => setFormData({...formData, contact_name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size *</label>
              <select value={formData.employee_count} onChange={(e) => setFormData({...formData, employee_count: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">When do you need a broker? *</label>
              <select value={formData.timeline} onChange={(e) => setFormData({...formData, timeline: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" required>
                <option value="">Select timeline</option>
                <option value="Immediately">Immediately</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="Just exploring">Just exploring</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biggest pain point? *</label>
              <textarea value={formData.biggest_pain} onChange={(e) => setFormData({...formData, biggest_pain: e.target.value})} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900" placeholder="e.g., Costs keep exceeding projections..." required />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all shadow-lg">
              Get My Free Match →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
