import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function IntakeForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, unknown>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    coverage_types: [] as string[],
    current_insurance: '',
    household_size: '',
    preferred_contact: 'phone',
    additional_notes: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => {
        const current = (prev.coverage_types as string[]) || []
        return {
          ...prev,
          coverage_types: checked ? [...current, value] : current.filter((v) => v !== value),
        }
      })
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.from('intake_submissions').insert({
      first_name: formData.first_name as string,
      last_name: formData.last_name as string,
      email: formData.email as string,
      phone: formData.phone as string,
      coverage_types: (formData.coverage_types as string[]) || [],
      data: formData,
      status: 'pending',
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[rgba(19,22,27,0.10)] p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[rgba(45,212,191,0.12)] flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#13161B] mb-2">Form Submitted Successfully</h2>
          <p className="text-sm text-[#5B6472] mb-6">Thank you! We've received your information and will reach out within 24 hours.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-xl bg-[#2DD4BF] text-[#13161B] font-semibold text-sm hover:bg-[#14B8A6] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] py-12 px-6">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-sm text-[#5B6472] hover:text-[#13161B] transition-colors flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-2xl border border-[rgba(19,22,27,0.10)] p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#13161B] mb-1">Insurance Intake</h1>
          <p className="text-sm text-[#5B6472] mb-6">Step {step} of 2 — Help us understand your needs.</p>

          {status === 'error' && (
            <div className="mb-5 p-3.5 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] text-[#dc2626] text-sm font-medium">
              {errorMsg || 'Something went wrong. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#13161B] mb-1.5">First Name</label>
                    <input
                      name="first_name"
                      type="text"
                      required
                      value={formData.first_name as string}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#13161B] mb-1.5">Last Name</label>
                    <input
                      name="last_name"
                      type="text"
                      required
                      value={formData.last_name as string}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#13161B] mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email as string}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#13161B] mb-1.5">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone as string}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-xl bg-[#2DD4BF] text-[#13161B] font-semibold text-sm hover:bg-[#14B8A6] transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#13161B] mb-2">Coverage Needed</label>
                  <div className="space-y-2">
                    {['Auto', 'Home', 'Life', 'Commercial', 'Umbrella', 'Other'].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="coverage_types"
                          value={type.toLowerCase()}
                          checked={((formData.coverage_types as string[]) || []).includes(type.toLowerCase())}
                          onChange={handleChange}
                          className="w-4 h-4 rounded border-[rgba(19,22,27,0.20)] text-[#2DD4BF] accent-[#2DD4BF]"
                        />
                        <span className="text-sm text-[#13161B]">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#13161B] mb-1.5">Current Insurance Provider (optional)</label>
                  <input
                    name="current_insurance"
                    type="text"
                    value={formData.current_insurance as string}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors"
                    placeholder="e.g. State Farm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#13161B] mb-1.5">Preferred Contact Method</label>
                  <select
                    name="preferred_contact"
                    value={formData.preferred_contact as string}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors appearance-none"
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="text">Text</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#13161B] mb-1.5">Additional Notes (optional)</label>
                  <textarea
                    name="additional_notes"
                    rows={3}
                    value={formData.additional_notes as string}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F5F0] border border-[rgba(19,22,27,0.10)] text-[#13161B] text-sm outline-none focus:border-[#2DD4BF] transition-colors resize-none"
                    placeholder="Anything else we should know..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl border border-[rgba(19,22,27,0.15)] text-[#13161B] font-semibold text-sm hover:bg-[#F7F5F0] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex-1 py-3.5 rounded-xl bg-[#2DD4BF] text-[#13161B] font-semibold text-sm hover:bg-[#14B8A6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
