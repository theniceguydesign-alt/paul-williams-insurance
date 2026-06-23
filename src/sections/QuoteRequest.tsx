import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const insuranceTypes = [
  'Auto',
  'Home',
  'Renters',
  'Life',
  'Business',
  'Boat/Recreational',
  'Other',
];

export default function QuoteRequest() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    insuranceType: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(leftRef.current, { opacity: 0, scale: 1.05 });
      gsap.to(leftRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      gsap.set(rightRef.current, { opacity: 0, y: 60 });
      gsap.to(rightRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.insuranceType) {
      newErrors.insuranceType = 'Please select an insurance type';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(false);
    const { error } = await supabase.from('leads').insert({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      coverage_type: formData.insuranceType,
      message: formData.message || null,
      status: 'new',
      source: 'website',
    });
    setIsSubmitting(false);
    if (error) {
      setSubmitError(true);
    } else {
      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', insuranceType: '', message: '' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="quote"
      className="relative bg-void min-h-screen"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left panel - Image + overlay text */}
        <div ref={leftRef} className="relative overflow-hidden">
          <img
            src="/images/img-quote-family.jpg"
            alt="Family protected by insurance"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10, 14, 26, 0.95) 0%, rgba(10, 14, 26, 0.7) 50%, rgba(10, 14, 26, 0.5) 100%)',
            }}
          />
          <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-12 lg:p-16">
            <h2 className="font-display text-[60px] md:text-[80px] lg:text-[100px] leading-[0.9] text-[#F0F2F5] mb-4">
              READY WHEN
              <br />
              YOU ARE
            </h2>
            <p className="font-body text-lg md:text-xl text-mist mb-8 max-w-[400px]">
              Free quotes. No obligation. Real protection.
            </p>

            <div className="space-y-4">
              <a
                href="tel:+1-407-791-0227"
                className="flex items-center gap-3 text-[#F0F2F5] hover:text-crimson transition-colors"
              >
                <Phone size={18} />
                <span className="font-body text-base">(407) 791-0227</span>
              </a>
              <a
                href="mailto:pwilliams3@farmersagent.com"
                className="flex items-center gap-3 text-[#F0F2F5] hover:text-crimson transition-colors"
              >
                <Mail size={18} />
                <span className="font-body text-base">
                  pwilliams3@farmersagent.com
                </span>
              </a>
              <div className="flex items-start gap-3 text-mist">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="font-body text-base">
                  6551 N Orange Blossom Trl Ste 105
                  <br />
                  Mount Dora, FL 32757
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Form */}
        <div
          ref={rightRef}
          className="bg-midnight flex items-center justify-center p-8 md:p-12 lg:p-16"
        >
          <div className="w-full max-w-[480px]">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-brand-blue/20 flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-brand-blue" />
                </div>
                <h3 className="font-display text-[36px] text-[#F0F2F5] mb-4">
                  THANK YOU!
                </h3>
                <p className="font-body text-lg text-mist">
                  We'll be in touch within 5 minutes during business hours.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-[36px] md:text-[48px] text-[#F0F2F5] mb-2">
                  GET YOUR QUOTE
                </h3>
                <p className="font-body text-base text-mist mb-8">
                  Fill out the form and our team will contact you shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block font-body text-[12px] uppercase tracking-[2.4px] text-mist mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className={`w-full bg-void border ${
                        errors.fullName ? 'border-crimson' : 'border-dark-mist'
                      } rounded-lg px-4 py-3 font-body text-[#F0F2F5] placeholder:text-mist/40 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all`}
                    />
                    {errors.fullName && (
                      <p className="text-crimson text-xs mt-1 font-body">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-body text-[12px] uppercase tracking-[2.4px] text-mist mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full bg-void border ${
                          errors.email ? 'border-crimson' : 'border-dark-mist'
                        } rounded-lg px-4 py-3 font-body text-[#F0F2F5] placeholder:text-mist/40 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all`}
                      />
                      {errors.email && (
                        <p className="text-crimson text-xs mt-1 font-body">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-body text-[12px] uppercase tracking-[2.4px] text-mist mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(407) 555-0123"
                        className={`w-full bg-void border ${
                          errors.phone ? 'border-crimson' : 'border-dark-mist'
                        } rounded-lg px-4 py-3 font-body text-[#F0F2F5] placeholder:text-mist/40 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all`}
                      />
                      {errors.phone && (
                        <p className="text-crimson text-xs mt-1 font-body">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-[12px] uppercase tracking-[2.4px] text-mist mb-2">
                      Insurance Type *
                    </label>
                    <select
                      name="insuranceType"
                      value={formData.insuranceType}
                      onChange={handleChange}
                      className={`w-full bg-void border ${
                        errors.insuranceType
                          ? 'border-crimson'
                          : 'border-dark-mist'
                      } rounded-lg px-4 py-3 font-body text-[#F0F2F5] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all appearance-none cursor-pointer`}
                    >
                      <option value="" className="bg-void">
                        Select insurance type
                      </option>
                      {insuranceTypes.map((type) => (
                        <option key={type} value={type} className="bg-void">
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.insuranceType && (
                      <p className="text-crimson text-xs mt-1 font-body">
                        {errors.insuranceType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-[12px] uppercase tracking-[2.4px] text-mist mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your insurance needs..."
                      className="w-full bg-void border border-dark-mist rounded-lg px-4 py-3 font-body text-[#F0F2F5] placeholder:text-mist/40 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-crimson text-[#F0F2F5] font-body text-[14px] font-medium uppercase tracking-[2.8px] py-4 rounded-lg hover:bg-arabian-red transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send My Quote Request'
                    )}
                  </button>

                  {submitError && (
                    <p className="text-crimson text-sm text-center font-body">
                      Something went wrong. Please try again or call us directly.
                    </p>
                  )}

                  <p className="font-body text-[12px] text-mist text-center">
                    Your information is secure and never shared. We respond
                    within 5 minutes during business hours.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
