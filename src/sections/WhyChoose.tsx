import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function WhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);
  const band1Ref = useRef<HTMLDivElement>(null);
  const band2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Band 1: image from left, text from right
      if (band1Ref.current) {
        const img = band1Ref.current.querySelector('.band-img');
        const text = band1Ref.current.querySelector('.band-text');

        gsap.set(img, { opacity: 0, x: -100 });
        gsap.set(text, { opacity: 0, x: 100 });

        gsap.to(img, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: band1Ref.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });

        gsap.to(text, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.15,
          scrollTrigger: {
            trigger: band1Ref.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Band 2: text from left, image from right
      if (band2Ref.current) {
        const img = band2Ref.current.querySelector('.band-img');
        const text = band2Ref.current.querySelector('.band-text');

        gsap.set(img, { opacity: 0, x: 100 });
        gsap.set(text, { opacity: 0, x: -100 });

        gsap.to(text, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: band2Ref.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });

        gsap.to(img, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.15,
          scrollTrigger: {
            trigger: band2Ref.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToQuote = () => {
    document.querySelector('#quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative bg-void py-[120px]">
      <div className="max-w-[1344px] mx-auto px-6">
        {/* Section number */}
        <span className="font-display text-[100px] md:text-[170px] leading-none text-crimson tracking-[-4px] block mb-8">
          (03)
        </span>

        {/* Band 1: Image left, text right */}
        <div
          ref={band1Ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-24"
        >
          <div className="band-img overflow-hidden rounded-2xl">
            <img
              src="/images/img-why-trust.jpg"
              alt="Paul Williams with happy clients"
              className="w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover"
            />
          </div>
          <div className="band-text flex flex-col justify-center">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="text-crimson fill-crimson"
                />
              ))}
              <span className="font-body text-sm text-mist ml-2">
                227+ Google Reviews — 4.8 Stars
              </span>
            </div>
            <h2 className="font-display text-[42px] md:text-[60px] lg:text-[72px] leading-[0.95] text-[#F0F2F5] mb-6">
              TRUSTED BY
              <br />
              FLORIDA
            </h2>
            <p className="font-body text-lg text-mist leading-relaxed mb-8 max-w-[480px]">
              With over 227 Google reviews and a 4.8-star rating, we've earned
              the trust of clients across the state. Our clients consistently
              report saving $500+ compared to their previous policies — without
              sacrificing coverage quality.{' '}
              <span className="text-crimson font-medium">The Insurance Rebel</span>{' '}
              fights for every discount and credit you deserve.
            </p>
            <button
              onClick={scrollToQuote}
              className="group inline-flex items-center gap-2 border border-crimson text-crimson font-body text-[13px] font-medium uppercase tracking-[2.6px] px-6 py-3 rounded-full hover:bg-crimson hover:text-[#F0F2F5] transition-all duration-300 w-fit"
            >
              Read Our Reviews
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Band 2: Text left, image right */}
        <div
          ref={band2Ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
        >
          <div className="band-text flex flex-col justify-center order-2 lg:order-1">
            <h2 className="font-display text-[42px] md:text-[60px] lg:text-[72px] leading-[0.95] text-[#F0F2F5] mb-6">
              WE COVER
              <br />
              WHAT OTHERS WON'T
            </h2>
            <p className="font-body text-lg text-mist leading-relaxed mb-8 max-w-[480px]">
              Animal liability coverage for homeowners with pets. Flood
              protection tailored to Florida's unique geography. RV, motor home,
              and mobile home coverage. Commercial and business insurance. Boat
              and watercraft protection.{' '}
              <span className="text-[#F0F2F5] font-medium">
                If you have a key for it, we can write you a quote.
              </span>{' '}
              <span className="text-crimson font-medium">That's the Rebel way.</span>
            </p>
            <button
              onClick={scrollToQuote}
              className="group inline-flex items-center gap-2 bg-crimson text-[#F0F2F5] font-body text-[13px] font-medium uppercase tracking-[2.6px] px-6 py-3 rounded-full hover:bg-arabian-red transition-all duration-300 w-fit"
            >
              Get a Custom Quote
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
          <div className="band-img overflow-hidden rounded-2xl order-1 lg:order-2">
            <img
              src="/images/img-why-coverage.jpg"
              alt="Florida waterfront home at dusk"
              className="w-full h-[300px] md:h-[400px] lg:h-[450px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
