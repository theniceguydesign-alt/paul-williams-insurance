import { useState } from 'react'
import { Shield, CheckCircle, Phone, ChevronRight, ChevronLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const STEPS = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Coverage Needs' },
  { id: 3, label: 'Current Coverage' },
  { id: 4, label: 'Submit' },
]

interface IntakeData {
  first_name: string; last_name: string; email: string; phone: string
  address: string; city: string; zip: string
  coverage_types: string[]; property_value: string
  vehicle_year: string; vehicle_make: string; vehicle_model: string
  current_carrier: string; current_premium: string; renewal_date: string
  reason_for_switch: string; additional_notes: string
}

type StringField = Exclude<keyof IntakeData, 'coverage_types'>

export default function Intake() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState<IntakeData>({
    first_name: '', last_name: '', email: '', phone: '', address: '', city: '', zip: '',
    coverage_types: [], property_value: '',
    vehicle_year: '', vehicle_make: '', vehicle_model: '',
    current_carrier: '', current_premium: '', renewal_date: '',
    reason_for_switch: '', additional_notes: '',
  })

  const update = (field: StringField, value: string) =>
    setData(d => ({ ...d, [field]: value }))

  const toggleCoverage = (c: string) => setData(d => ({
    ...d,
    coverage_types: d.coverage_types.includes(c)
      ? d.coverage_types.filter(x => x !== c)
      : [...d.coverage_types, c]
  }))

  const submit = async () => {
    setSubmitting(true)
    try {
      const { error } = await supabase.from('intake_submissions').insert([{ data, status: 'pending' }])
      if (error) throw error
    } catch {
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID
      if (formspreeId) {
        await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, form_type: 'intake' }),
        })
      }
    }
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <CheckCircle className="text-[#c9a227] mx-auto mb-6" size={64} />
        <h1 className="text-3xl font-bold text-white mb-4">Intake Complete</h1>
        <p className="text-gray-300 mb-8">
          Paul has your information. He'll personally reach out within one business day to review your coverage options.
        </p>
        <a href="tel:4077910227" className="inline-flex items-center gap-2 bg-[#c9a227] text-[#0a1628] px-6 py-3 rounded-xl font-bold">
          <Phone size={16} />
          Need it faster? Call (407) 791-0227
        </a>
      </div>
    </div>
  )

  const inputCls = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#c9a227]"

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="bg-[#0a1628] border-b border-white/10 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-[#c9a227]" size={24} />
            <span className="text-white font-bold">Paul Williams Insurance</span>
          </div>
          <a href="/" className="text-gray-400 text-sm hover:text-white">← Back to site</a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s.id ? 'bg-[#c9a227] text-[#0a1628]' : 'bg-white/10 text-gray-400'
              }`}>
                {step > s.id ? '✓' : s.id}
              </div>
              <span className={`text-sm hidden sm:block ${step === s.id ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px w-8 ${step > s.id ? 'bg-[#c9a227]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
              <p className="text-gray-400 mb-8">Let's start with the basics.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                  <input className={inputCls} value={data.first_name} onChange={e => update('first_name', e.target.value)} placeholder="First name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                  <input className={inputCls} value={data.last_name} onChange={e => update('last_name', e.target.value)} placeholder="Last name" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input type="email" className={inputCls} value={data.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <input type="tel" className={inputCls} value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="(407) 000-0000" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Street Address</label>
                  <input className={inputCls} value={data.address} onChange={e => update('address', e.target.value)} placeholder="123 Main St" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                  <input className={inputCls} value={data.city} onChange={e => update('city', e.target.value)} placeholder="Mount Dora" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">ZIP</label>
                  <input className={inputCls} value={data.zip} onChange={e => update('zip', e.target.value)} placeholder="32757" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Coverage Needs</h2>
              <p className="text-gray-400 mb-8">Select everything you'd like to protect.</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['Auto Insurance', 'Home Insurance', 'Life Insurance', 'Boat / RV', 'Commercial', 'Mobile Home'].map(c => (
                  <button key={c} onClick={() => toggleCoverage(c)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium border transition-all text-left ${
                      data.coverage_types.includes(c)
                        ? 'bg-[#c9a227] border-[#c9a227] text-[#0a1628]'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:border-[#c9a227]/50'
                    }`}
                  >{c}</button>
                ))}
              </div>
              {data.coverage_types.some(c => c.includes('Home')) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Estimated Home Value</label>
                  <input className={inputCls} value={data.property_value} onChange={e => update('property_value', e.target.value)} placeholder="e.g. $350,000" />
                </div>
              )}
              {data.coverage_types.some(c => c.includes('Auto')) && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                    <input className={inputCls} value={data.vehicle_year} onChange={e => update('vehicle_year', e.target.value)} placeholder="2022" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Make</label>
                    <input className={inputCls} value={data.vehicle_make} onChange={e => update('vehicle_make', e.target.value)} placeholder="Toyota" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                    <input className={inputCls} value={data.vehicle_model} onChange={e => update('vehicle_model', e.target.value)} placeholder="Camry" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Current Coverage</h2>
              <p className="text-gray-400 mb-8">This helps Paul find you a better deal fast.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Insurance Carrier</label>
                  <input className={inputCls} value={data.current_carrier} onChange={e => update('current_carrier', e.target.value)} placeholder="e.g. State Farm, Allstate..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Monthly Premium</label>
                  <input className={inputCls} value={data.current_premium} onChange={e => update('current_premium', e.target.value)} placeholder="e.g. $180/month" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Policy Renewal Date</label>
                  <input className={inputCls} value={data.renewal_date} onChange={e => update('renewal_date', e.target.value)} placeholder="MM/DD/YYYY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Why are you looking for new coverage?</label>
                  <textarea rows={3} className={`${inputCls} resize-none`} value={data.reason_for_switch} onChange={e => update('reason_for_switch', e.target.value)} placeholder="Price, service, coverage gaps..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Anything else Paul should know?</label>
                  <textarea rows={2} className={`${inputCls} resize-none`} value={data.additional_notes} onChange={e => update('additional_notes', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Submit</h2>
              <p className="text-gray-400 mb-8">Paul will personally reach out within one business day.</p>
              <div className="space-y-3 mb-8">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-[#c9a227] text-xs font-semibold uppercase mb-2">Contact</div>
                  <div className="text-white text-sm">{data.first_name} {data.last_name} · {data.phone} · {data.email}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-[#c9a227] text-xs font-semibold uppercase mb-2">Coverage Requested</div>
                  <div className="text-white text-sm">{data.coverage_types.join(', ') || 'None selected'}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-[#c9a227] text-xs font-semibold uppercase mb-2">Current Carrier</div>
                  <div className="text-white text-sm">{data.current_carrier || 'Not provided'} {data.current_premium ? `· ${data.current_premium}` : ''}</div>
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-gray-400 hover:text-white">
                <ChevronLeft size={16} /> Back
              </button>
            ) : <div />}
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 bg-[#c9a227] text-[#0a1628] px-6 py-3 rounded-xl font-bold hover:bg-[#e8c547]">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={submit} disabled={submitting} className="bg-[#c9a227] text-[#0a1628] px-8 py-3 rounded-xl font-bold hover:bg-[#e8c547] disabled:opacity-60">
                {submitting ? 'Submitting...' : 'Submit Intake Form'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
