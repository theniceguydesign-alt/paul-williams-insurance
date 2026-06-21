import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Target, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    title: '20+ YEARS OF EXPERIENCE',
    desc: "Over two decades in the insurance industry means we've seen it all. We know exactly what coverage you need — and what you don't. No fluff, no filler, just proper protection.",
    icon: Shield,
  },
  {
    title: 'THE INSURANCE REBEL',
    desc: "We don't play by the old rules. We fight hard to ensure you have the highest quality proper coverage at a rate that actually makes sense. We shop every angle so you don't have to.",
    icon: Target,
  },
  {
    title: 'MOUNT DORA & STATEWIDE',
    desc: "Located in Mount Dora by appointment only — we are strategic specialists in our field. While we're proud to serve our local community, we're known statewide as your Most Trusted Independent Insurance Agent.",
    icon: MapPin,
  },
];

export default function Introduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [
        numberRef.current,
        heading1Ref.current,
        heading2Ref.current,
      ];

      gsap.set(elements, { opacity: 0, y: 60 });
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      gsap.set(bodyRef.current, { opacity: 0, y: 60 });
      gsap.to(bodyRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bodyRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Value propositions stagger
      if (valuesRef.current) {
        const items = valuesRef.current.querySelectorAll('.value-item');
        gsap.set(items, { opacity: 0, y: 40 });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-void py-[120px]"
    >
      <div className="max-w-[1344px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column */}
          <div>
            <span
              ref={numberRef}
              className="font-display text-[100px] md:text-[170px] leading-none text-crimson tracking-[-4px] block mb-4"
            >
              (01)
            </span>
            <h2
              ref={heading1Ref}
              className="font-display text-[48px] md:text-[72px] leading-[0.95] text-[#F0F2F5]"
            >
              OUR STORY
            </h2>
            <h2
              ref={heading2Ref}
              className="font-display text-[48px] md:text-[72px] leading-[0.95] text-[#F0F2F5]"
            >
              THE REBEL WAY
            </h2>
          </div>

          {/* Right column */}
          <div ref={bodyRef}>
            <p className="font-body text-lg md:text-xl text-mist leading-relaxed mb-6">
              As a longtime Florida resident, I'm proud to serve the state of
              Florida — locally Mount Dora, FL and the surrounding areas — and
              emphatically known statewide as your{' '}
              <span className="text-[#F0F2F5] font-medium">
                Most Trusted Independent Insurance Agent
              </span>
              .
            </p>

            <p className="font-body text-lg text-mist leading-relaxed mb-6">
              At The Paul Williams Insurance Agency —{' '}
              <span className="text-crimson font-medium">The Insurance Rebel</span>{' '}
              — we pride ourselves on providing outstanding customer service and
              ensuring each client is educated on their specific coverage
              options. I bring over{' '}
              <span className="text-[#F0F2F5] font-medium">
                20 years of insurance industry experience
              </span>{' '}
              to help with all your needs for auto, home, life, RVs, motor and
              mobile home, commercial-business, boat insurance and much more!
            </p>

            <p className="font-body text-lg text-mist leading-relaxed mb-12">
              We will fight hard to ensure you have the highest quality proper
              coverage. We are located in Mount Dora{' '}
              <span className="text-[#F0F2F5] font-medium">
                by appointment only
              </span>{' '}
              as we are strategic specialists in our field.
            </p>

            <div className="mb-12 p-6 border border-dark-mist rounded-lg">
              <p className="font-body text-[12px] uppercase tracking-[2.4px] text-crimson mb-2">
                CALL PAUL DIRECTLY
              </p>
              <a
                href="tel:+1-407-791-0227"
                className="font-display text-[48px] md:text-[60px] text-[#F0F2F5] hover:text-crimson transition-colors leading-none"
              >
                (407) 791-0227
              </a>
              <p className="font-body text-sm text-mist mt-2">
                I'll be happy to answer any questions and provide a quote.
              </p>
            </div>

            <div ref={valuesRef} className="space-y-6">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="value-item border-t border-dark-mist pt-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <v.icon
                      size={18}
                      className="text-brand-blue"
                      strokeWidth={1.5}
                    />
                    <h3 className="font-body text-[12px] font-medium uppercase tracking-[2.4px] text-crimson">
                      {v.title}
                    </h3>
                  </div>
                  <p className="font-body text-base text-mist leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
