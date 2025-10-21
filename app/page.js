'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function Home() {
const [formData, setFormData] = useState({
company_name: '',
employee_count: '',
industry: '',
location_state: '',
contact_name: '',
contact_email: '',
budget_per_employee_min: '',
budget_per_employee_max: '',
})
const [submitted, setSubmitted] = useState(false)
const [loading, setLoading] = useState(false)
const handleSubmit = async (e) => {
e.preventDefault()
setLoading(true)
try {
  const { data, error } = await supabase
    .from('employers')
    .insert([{
      company_name: formData.company_name,
      employee_count: parseInt(formData.employee_count),
      industry: formData.industry,
      location_state: formData.location_state,
      contact_name: formData.contact_name,
      contact_email: formData.contact_email,
      budget_per_employee_min: parseFloat(formData.budget_per_employee_min),
      budget_per_employee_max: parseFloat(formData.budget_per_employee_max),
      status: 'pending',
      form_completed_at: new Date().toISOString(),
    }])
  
  if (error) throw error
  
  setSubmitted(true)
} catch (error) {
  console.error('Error:', error)
  alert('Error submitting form. Check console.')
} finally {
  setLoading(false)
}
}
const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value
})
}
if (submitted) {
return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
<div className="bg-slate-800 p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
<div className="text-6xl mb-4">🎉</div>
<h1 className="text-3xl font-bold text-white mb-4">Success!</h1>
<p className="text-slate-300 mb-6">
We have received your information and will match you with the perfect benefits broker within 24 hours.
</p>
<button
onClick={() => {
setSubmitted(false)
setFormData({
company_name: '',
employee_count: '',
industry: '',
location_state: '',
contact_name: '',
contact_email: '',
budget_per_employee_min: '',
budget_per_employee_max: '',
})
}}
className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
>
Submit Another
</button>
</div>
</div>
)
}
return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
<div className="max-w-2xl mx-auto py-12">
<div className="text-center mb-12">
<h1 className="text-5xl font-bold text-white mb-4">
Find Your Perfect Benefits Broker
</h1>
<p className="text-xl text-slate-300">
AI-powered matching in 2 minutes
</p>
</div>
    <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg shadow-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-slate-300 font-semibold mb-2">
            Company Name
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">
            Number of Employees
          </label>
          <input
            type="number"
            name="employee_count"
            value={formData.employee_count}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            placeholder="150"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">
            Industry
          </label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="">Select industry...</option>
            <option value="technology">Technology</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="retail">Retail</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">
            State
          </label>
          <input
            type="text"
            name="location_state"
            value={formData.location_state}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            placeholder="California"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Min Budget ($/employee/month)
            </label>
            <input
              type="number"
              name="budget_per_employee_min"
              value={formData.budget_per_employee_min}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              placeholder="500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Max Budget ($/employee/month)
            </label>
            <input
              type="number"
              name="budget_per_employee_max"
              value={formData.budget_per_employee_max}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              placeholder="700"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">
            Your Name
          </label>
          <input
            type="text"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            placeholder="john@acmecorp.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Finding Your Match...' : 'Find My Broker →'}
        </button>
      </div>
    </form>
  </div>
</div>
)
}