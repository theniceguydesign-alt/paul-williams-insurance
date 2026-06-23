import { useState, FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export default function QuoteRequest() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    coverage_type: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.from('leads').insert({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      coverage_type: formData.coverage_type,
      message: formData.message,
      status: 'new',
      source: 'website',
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('success')
      setFormData({ full_name: '', email: '', phone: '', coverage_type: '', message: '' })
    }
  }

  return (
    <section id="quote" className="py-20 px-6 bg-white">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2 text-[#13161B]">Request a Quote</h2>
        <p className="text-center text-[#5B6472] mb-10">Tell us what you need and we'll get back to you within 24 hours.</p>

        {status === 'success' && (
          <div className="mb-6 p-4 rounded-xl bg-[rgba(45,212,191,0.10)] border border-[rgba(45,212,191,0.30)] text-[#0D9488] text-sm font-medium">
            Thank you! Your quote request has been submitted. We'll contact you soon.
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] text-[#dc2626] text-sm font-medium">
            {errorMsg || 'Something went wrong. Please try again.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#13161B] mb-1.5">Full Name</label>
            <input
              name="full_name"
              type="text"
              required
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors"
              placeholder="John Smith"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#13161B] mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors"
                placeholder="john@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13161B] mb-1.5">Phone</label>
              <input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors"
                placeholder="(352) 555-0100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#13161B] mb-1.5">Coverage Type</label>
            <select
              name="coverage_type"
              required
              value={formData.coverage_type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors appearance-none"
            >
              <option value="">Select coverage type</option>
              <option value="auto">Auto Insurance</option>
              <option value="home">Home Insurance</option>
              <option value="life">Life Insurance</option>
              <option value="commercial">Commercial Insurance</option>
              <option value="other">Other / Not Sure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#13161B] mb-1.5">Message (optional)</label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors resize-none"
              placeholder="Any details about your insurance needs..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3.5 rounded-xl bg-[#2DD4BF] text-[#13161B] font-semibold text-sm hover:bg-[#14B8A6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Submitting...' : 'Get My Quote'}
          </button>
        </form>
      </div>
    </section>
  )
}
