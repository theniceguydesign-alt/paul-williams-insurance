import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Phone, Mail, MapPin, CheckCircle, Star, Shield, Car, Home as HomeIcon, Anchor, Briefcase, ChevronRight, Send } from 'lucide-react'
import Nav from '@/components/Nav'
import { supabase } from '@/lib/supabase'

gsap.registerPlugin(ScrollTrigger)

const COVERAGE_TYPES = [
  { icon: Car, label: 'Auto Insurance', desc: 'Full coverage, liability, and more' },
  { icon: HomeIcon, label: 'Home Insurance', desc: 'Protect your most valuable asset' },
  { icon: Shield, label: 'Life Insurance', desc: 'Secure your family\'s future' },
  { icon: Anchor, label: 'Boat & RV', desc: 'On the water or the open road' },
  { icon: Briefcase, label: 'Commercial', desc: 'Business and fleet coverage' },
  { icon: CheckCircle, label: 'Mobile Home', desc: 'Specialized mobile home policies' },
]

const TESTIMONIALS = [
  { name: 'Sandra K.', text: 'Paul saved me $400/year on my auto policy and got me better coverage. He knows insurance inside and out.', stars: 5 },
  { name: 'James R.', text: 'After Hurricane Ian, I was worried. Paul walked me through everything and my claim was handled fast. Incredible service.', stars: 5 },
  { name: 'Maria L.', text: 'I called 3 agents before Paul. He was the only one who actually explained what I was buying. That\'s rare.', stars: 5 },
  { name: 'David T.', text: 'Been with Paul for 6 years — home, two cars, and a boat. He always finds a way to save me money.', stars: 5 },
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement[]>([])
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', coverage_type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Hero entrance
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    )

    // Scroll sections
    sectionsRef.current.forEach((el) => {
      if (!el) return
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true }
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const addSection = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { error: dbError } = await supabase.from('leads').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        coverage_type: formData.coverage_type,
        message: formData.message,
        status: 'new',
      }])

      if (dbError) throw dbError
      setSubmitted(true)
    } catch {
      // Fallback: Formspree
      try {
        const formspreeId = import.meta.env.VITE_FORMSPREE_ID
        if (formspreeId) {
          const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })
          if (res.ok) { setSubmitted(true); return }
        }
        setError('Unable to submit right now. Please call (407) 791-0227.')
      } catch {
        setError('Unable to submit right now. Please call (407) 791-0227.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen bg-[#0a1628] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#122040] to-[#0a1628]" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #c9a227 0%, transparent 60%)' }}
        />

        <div ref={heroRef} className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#c9a227]/20 border border-[#c9a227]/40 rounded-full px-4 py-2 mb-6">
              <Star size={14} className="text-[#c9a227] fill-[#c9a227]" />
              <span className="text-[#c9a227] text-sm font-medium">200+ Five-Star Reviews · Mount Dora, FL</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Florida's Most Trusted<br />
              <span className="text-[#c9a227]">Independent</span><br />
              Insurance Agent
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              20+ years protecting Florida families and businesses. I fight for the coverage you deserve — not what's easiest to sell.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:4077910227"
                className="flex items-center justify-center gap-2 bg-[#c9a227] text-[#0a1628] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e8c547] transition-all hover:scale-105"
              >
                <Phone size={20} />
                Call (407) 791-0227
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:border-[#c9a227] hover:text-[#c9a227] transition-all"
              >
                Get a Free Quote
                <ChevronRight size={18} />
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl">
            {[
              { value: '20+', label: 'Years Experience' },
              { value: '200+', label: 'Five-Star Reviews' },
              { value: 'Independent', label: 'No Carrier Bias' },
            ].map(stat => (
              <div key={stat.label} className="border border-white/10 rounded-xl p-4 bg-white/5">
                <div className="text-[#c9a227] font-bold text-2xl">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white">
        <div ref={addSection} className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[#c9a227] font-semibold tracking-wider uppercase text-sm mb-4">Our Story</div>
              <h2 className="text-4xl font-bold text-[#0a1628] mb-6 leading-tight">
                The Insurance Rebel — Fighting for You, Not the Carriers
              </h2>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                As a longtime Florida resident, I'm proud to serve Mount Dora and the surrounding areas — and known statewide as your Most Trusted Independent Insurance Agent.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At The Paul Williams Insurance Agency, we pride ourselves on outstanding customer service and ensuring every client is educated on their specific coverage options. I bring over 20 years of industry experience to help with all your needs — auto, home, life, RVs, motor and mobile homes, commercial, boat, and more.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We're located in Mount Dora by appointment only — because we're strategic specialists, not order-takers. We will fight hard to ensure you have the highest quality, proper coverage.
              </p>
              <a
                href="tel:4077910227"
                className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#122040] transition-colors"
              >
                <Phone size={16} />
                Let's Talk — (407) 791-0227
              </a>
            </div>
            <div className="bg-[#0a1628] rounded-2xl p-10 text-white">
              <div className="text-[#c9a227] font-semibold mb-6 tracking-wider uppercase text-sm">Why Independent?</div>
              {[
                'I work for YOU — not a single carrier',
                'I shop dozens of companies to find your best rate',
                'I explain what you\'re actually buying',
                'I answer the phone when you have a claim',
                'I\'ve been here 20+ years — I\'m not going anywhere',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 mb-4">
                  <CheckCircle className="text-[#c9a227] flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-[#f4f6f9]">
        <div ref={addSection} className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[#c9a227] font-semibold tracking-wider uppercase text-sm mb-4">What I Cover</div>
            <h2 className="text-4xl font-bold text-[#0a1628]">Coverage for Every Part of Your Life</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {COVERAGE_TYPES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow border border-gray-100 group">
                <div className="bg-[#0a1628] rounded-xl w-12 h-12 flex items-center justify-center mb-5 group-hover:bg-[#c9a227] transition-colors">
                  <Icon className="text-[#c9a227] group-hover:text-[#0a1628] transition-colors" size={22} />
                </div>
                <h3 className="text-[#0a1628] font-bold text-lg mb-2">{label}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-[#0a1628]">
        <div ref={addSection} className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[#c9a227] font-semibold tracking-wider uppercase text-sm mb-4">Client Reviews</div>
            <h2 className="text-4xl font-bold text-white">200+ Five-Star Reviews</h2>
            <p className="text-gray-400 mt-3">Real clients. Real results.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-[#c9a227] fill-[#c9a227]" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="text-white font-semibold">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / QUOTE FORM */}
      <section id="contact" className="py-24 bg-white">
        <div ref={addSection} className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="text-[#c9a227] font-semibold tracking-wider uppercase text-sm mb-4">Get a Quote</div>
              <h2 className="text-4xl font-bold text-[#0a1628] mb-6">Start a Conversation Today</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Fill out the form and I'll personally reach out to review your coverage options. No pressure. No jargon. Just honest advice.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="text-[#c9a227]" size={18} />
                  <a href="tel:4077910227" className="hover:text-[#0a1628] font-medium">(407) 791-0227</a>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="text-[#c9a227]" size={18} />
                  <a href="mailto:paul@paulwilliamsinsurance.com" className="hover:text-[#0a1628]">paul@paulwilliamsinsurance.com</a>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="text-[#c9a227]" size={18} />
                  <span>Mount Dora, FL — By Appointment</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f4f6f9] rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-bold text-[#0a1628] mb-2">Got it — thanks!</h3>
                  <p className="text-gray-600">Paul will personally reach out to you within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-1">Full Name *</label>
                      <input
                        required type="text" value={formData.name}
                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a227] bg-white"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-1">Phone *</label>
                      <input
                        required type="tel" value={formData.phone}
                        onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a227] bg-white"
                        placeholder="(407) 000-0000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-1">Email *</label>
                    <input
                      required type="email" value={formData.email}
                      onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a227] bg-white"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-1">Coverage Needed</label>
                    <select
                      value={formData.coverage_type}
                      onChange={e => setFormData(f => ({ ...f, coverage_type: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a227] bg-white"
                    >
                      <option value="">Select coverage type...</option>
                      <option>Auto Insurance</option>
                      <option>Home Insurance</option>
                      <option>Life Insurance</option>
                      <option>Boat / RV</option>
                      <option>Commercial / Business</option>
                      <option>Mobile Home</option>
                      <option>Multiple / Bundle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-1">Message (optional)</label>
                    <textarea
                      rows={3} value={formData.message}
                      onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a227] bg-white resize-none"
                      placeholder="Tell Paul what you're looking for..."
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <button
                    type="submit" disabled={submitting}
                    className="w-full bg-[#c9a227] text-[#0a1628] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e8c547] transition-colors disabled:opacity-60"
                  >
                    <Send size={16} />
                    {submitting ? 'Sending...' : 'Request My Free Quote'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a1628] border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-[#c9a227]" size={22} />
                <span className="text-white font-bold">Paul Williams Insurance</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Insurance Rebel — Your Most Trusted Independent Insurance Agent in Mount Dora, FL.
              </p>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Coverage</div>
              <div className="space-y-2 text-sm text-gray-400">
                {['Auto', 'Home', 'Life', 'Boat & RV', 'Commercial', 'Mobile Home'].map(c => (
                  <div key={c}>{c} Insurance</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Contact</div>
              <div className="space-y-2 text-sm text-gray-400">
                <div><a href="tel:4077910227" className="hover:text-[#c9a227]">(407) 791-0227</a></div>
                <div><a href="mailto:paul@paulwilliamsinsurance.com" className="hover:text-[#c9a227]">paul@paulwilliamsinsurance.com</a></div>
                <div>Mount Dora, FL — By Appointment</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 Paul Williams Insurance Agency. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="/intake" className="hover:text-[#c9a227]">Insurance Intake Form</a>
              <a href="/admin" className="hover:text-[#c9a227]">Agent Portal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
