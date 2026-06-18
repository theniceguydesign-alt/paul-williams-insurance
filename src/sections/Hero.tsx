import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headline1Ref = useRef<HTMLHeadingElement>(null);
  const headline2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline skew entrance
      gsap.set([headline1Ref.current, headline2Ref.current], {
        skewX: 8,
        opacity: 0,
        y: 40,
      });
      gsap.to([headline1Ref.current, headline2Ref.current], {
        skewX: 0,
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.3,
      });

      // Subheadline
      gsap.set(subRef.current, { opacity: 0, y: 30 });
      gsap.to(subRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.8,
      });

      // CTA buttons
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      gsap.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.0,
      });

      // Scroll line
      gsap.set(scrollLineRef.current, { opacity: 0 });
      gsap.to(scrollLineRef.current, {
        opacity: 1,
        duration: 0.6,
        delay: 1.4,
      });

      // Video parallax on scroll
      gsap.to(videoRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/hero-vid.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(10, 14, 26, 0.92) 0%, rgba(10, 14, 26, 0.5) 40%, rgba(10, 14, 26, 0.3) 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute z-[2] bottom-[15vh] left-[8vw] max-w-[600px]">
        <h1
          ref={headline1Ref}
          className="font-display text-[64px] md:text-[100px] lg:text-[120px] leading-[0.85] text-[#F0F2F5]"
        >
          PROTECT WHAT
        </h1>
        <h1
          ref={headline2Ref}
          className="font-display text-[64px] md:text-[100px] lg:text-[120px] leading-[0.85] text-[#F0F2F5] mb-6"
        >
          MATTERS MOST
        </h1>

        <p
          ref={subRef}
          className="font-body text-lg md:text-xl text-mist max-w-[540px] mb-8 leading-relaxed"
        >
          The Paul Williams Insurance Agency — The Insurance Rebel. Over 20
          years of experience fighting for the highest quality coverage for
          auto, home, life, RV, motor home, commercial and boat insurance
          across Florida. By appointment only — we are strategic specialists
          in our field.
        </p>

        <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
          <a
            href="#quote"
            onClick={handleQuoteClick}
            className="group relative inline-flex items-center gap-2 bg-crimson text-[#F0F2F5] font-body text-[14px] font-medium uppercase tracking-[2.8px] px-8 py-4 rounded-full overflow-hidden transition-all duration-400 hover:bg-arabian-red"
          >
            <span className="relative z-10">Get Your Free Quote</span>
            <ChevronRight
              size={16}
              className="relative z-10 group-hover:translate-x-1 transition-transform"
            />
          </a>

          <a
            href="tel:4077910227"
            className="inline-flex items-center gap-2 border border-dark-mist text-[#F0F2F5] font-body text-[14px] font-medium uppercase tracking-[2.8px] px-6 py-4 rounded-full hover:border-crimson hover:text-crimson transition-all duration-300"
          >
            <Phone size={16} />
            <span>(407) 791-0227</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollLineRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-3"
      >
        <span className="font-body text-[11px] uppercase tracking-[2px] text-mist">
          Scroll
        </span>
        <div className="w-[1px] h-[60px] bg-mist animate-pulse-line" />
      </div>
    </section>
  );
}
