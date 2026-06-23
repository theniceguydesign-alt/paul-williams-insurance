import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Car,
  Home,
  Umbrella,
  Heart,
  Briefcase,
  Anchor,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const coverageTypes = [
  {
    icon: Car,
    name: 'AUTO INSURANCE',
    desc: 'Full coverage, liability, collision, and comprehensive options. We find you every discount you qualify for.',
  },
  {
    icon: Home,
    name: 'HOME INSURANCE',
    desc: 'Protect your biggest investment. Coverage for dwelling, personal property, liability, and additional living expenses.',
  },
  {
    icon: Umbrella,
    name: 'RENTERS INSURANCE',
    desc: "Affordable protection for your belongings and liability — even if you don't own the property.",
  },
  {
    icon: Heart,
    name: 'LIFE INSURANCE',
    desc: 'Term and whole life policies to protect your family\'s financial future. Peace of mind that lasts.',
  },
  {
    icon: Briefcase,
    name: 'BUSINESS INSURANCE',
    desc: 'General liability, workers\' comp, and commercial property coverage tailored to your operation.',
  },
  {
    icon: Anchor,
    name: 'BOAT & RECREATIONAL',
    desc: "Coverage for boats, RVs, motorcycles, and more. If it has keys, we can insure it.",
  },
];

export default function CoverageTypes() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headingEls = [numberRef.current, heading1Ref.current, heading2Ref.current];
      gsap.set(headingEls, { opacity: 0, y: 60 });
      gsap.to(headingEls, {
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

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.coverage-card');
        gsap.set(cards, { opacity: 0, y: 80 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = () => {
    document.querySelector('#quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="coverage"
      className="relative bg-void py-[120px]"
    >
      <div className="max-w-[1344px] mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <span
            ref={numberRef}
            className="font-display text-[100px] md:text-[170px] leading-none text-crimson tracking-[-4px] block"
          >
            (02)
          </span>
          <div className="text-center -mt-8 md:-mt-16">
            <h2
              ref={heading1Ref}
              className="font-display text-[48px] md:text-[72px] leading-[0.95] text-[#F0F2F5]"
            >
              COMPREHENSIVE
            </h2>
            <h2
              ref={heading2Ref}
              className="font-display text-[48px] md:text-[72px] leading-[0.95] text-[#F0F2F5]"
            >
              PROTECTION
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {coverageTypes.map((coverage) => {
            const Icon = coverage.icon;
            return (
              <div
                key={coverage.name}
                onClick={handleCardClick}
                className="coverage-card group bg-midnight border border-dark-mist rounded-lg p-10 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-crimson-glow"
              >
                <Icon
                  size={32}
                  className="text-brand-blue mb-6 group-hover:text-crimson transition-colors duration-300"
                  strokeWidth={1.5}
                />
                <h3 className="font-display text-[32px] md:text-[36px] text-[#F0F2F5] mb-3 leading-tight">
                  {coverage.name}
                </h3>
                <p className="font-body text-base text-mist leading-relaxed mb-6">
                  {coverage.desc}
                </p>
                <span className="inline-flex items-center gap-2 font-body text-[12px] uppercase tracking-[2px] text-crimson group-hover:gap-3 transition-all duration-300">
                  Get a Quote
                  <ArrowRight size={14} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
