'use client';
import { useState } from 'react';

export default function BrokerProfile() {
  const [profile, setProfile] = useState({
    name: 'Strategic Benefits Group',
    email: 'contact@strategicbenefits.com',
    phone: '(555) 123-4567',
    yearsExp: 12,
    clientCount: 150,
    specialties: ['SMB Focus', 'Cost Optimization', 'Tech Industry'],
    clientSizeMin: 50,
    clientSizeMax: 200,
    industries: ['Technology', 'Healthcare', 'Professional Services'],
    responseTime: 'same-day',
    serviceModel: 'Full-Service',
    techStack: ['Modern Benefits Platform', 'Employee Portal', 'Analytics Dashboard']
  });

  return (
    <div className="min-h-screen bg-slate-950">
      
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Broker Profile</h1>
              <p className="text-slate-400 text-sm mt-1">Manage your network profile and matching preferences</p>
            </div>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        
        {/* Profile Completeness */}
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Profile 95% Complete</h3>
              <p className="text-green-200 text-sm mb-4">Great job! Complete profiles get 3x more qualified leads.</p>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 w-[95%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Firm Name *</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Years of Experience *</label>
              <input
                type="number"
                value={profile.yearsExp}
                onChange={(e) => setProfile({...profile, yearsExp: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Expertise & Specialization</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Specialties (Select all that apply)</label>
              <div className="grid grid-cols-3 gap-3">
                {['SMB Focus', 'Enterprise', 'Cost Optimization', 'Compliance', 'Tech Industry', 'Healthcare', 'Strategic Planning', 'Employee Engagement'].map(specialty => (
                  <button
                    key={specialty}
                    onClick={() => {
                      const newSpecialties = profile.specialties.includes(specialty)
                        ? profile.specialties.filter(s => s !== specialty)
                        : [...profile.specialties, specialty];
                      setProfile({...profile, specialties: newSpecialties});
                    }}
                    className={`px-4 py-2 rounded-lg border-2 transition text-sm ${
                      profile.specialties.includes(specialty)
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Industries You Serve</label>
              <div className="grid grid-cols-3 gap-3">
                {['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Professional Services'].map(industry => (
                  <button
                    key={industry}
                    onClick={() => {
                      const newIndustries = profile.industries.includes(industry)
                        ? profile.industries.filter(i => i !== industry)
                        : [...profile.industries, industry];
                      setProfile({...profile, industries: newIndustries});
                    }}
                    className={`px-4 py-2 rounded-lg border-2 transition text-sm ${
                      profile.industries.includes(industry)
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Ideal Client Size (Min Employees)</label>
                <input
                  type="number"
                  value={profile.clientSizeMin}
                  onChange={(e) => setProfile({...profile, clientSizeMin: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Ideal Client Size (Max Employees)</label>
                <input
                  type="number"
                  value={profile.clientSizeMax}
                  onChange={(e) => setProfile({...profile, clientSizeMax: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Model */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Service Model</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Response Time Commitment</label>
              <select
                value={profile.responseTime}
                onChange={(e) => setProfile({...profile, responseTime: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="same-day">Same Day</option>
                <option value="24-hours">Within 24 Hours</option>
                <option value="48-hours">Within 48 Hours</option>
                <option value="3-days">Within 3 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Service Approach</label>
              <select
                value={profile.serviceModel}
                onChange={(e) => setProfile({...profile, serviceModel: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Full-Service">Full-Service (Hands-on support)</option>
                <option value="Tech-Enabled">Tech-Enabled (Platform + advisory)</option>
                <option value="Strategic">Strategic (High-level guidance)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Current Client Count</label>
              <input
                type="number"
                value={profile.clientCount}
                onChange={(e) => setProfile({...profile, clientCount: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">How Employers See You</h2>
          
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  {profile.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                  <p className="text-sm text-slate-400">{profile.specialties.join(' • ')}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-900 rounded p-3">
                <p className="text-xs text-slate-400">Experience</p>
                <p className="font-bold text-white">{profile.yearsExp} years</p>
              </div>
              <div className="bg-slate-900 rounded p-3">
                <p className="text-xs text-slate-400">Active Clients</p>
                <p className="font-bold text-white">{profile.clientCount}+</p>
              </div>
              <div className="bg-slate-900 rounded p-3">
                <p className="text-xs text-slate-400">Response Time</p>
                <p className="font-bold text-white">{profile.responseTime}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.industries.map(industry => (
                <span key={industry} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
