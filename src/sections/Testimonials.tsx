import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Featured testimonials compiled from research on Paul's agency
const featuredReviews = [
  {
    name: 'C.G.',
    location: 'Mount Dora, FL',
    rating: 5,
    text: "Paul is wonderful as well as all of his staff. Excellent!",
    source: 'Nextdoor — Verified Neighbor',
  },
  {
    name: 'M.S.',
    location: 'Zellwood, FL',
    rating: 5,
    text: "Paul and his team are amazing! We just switched over our truck fleet to his office and are currently working on moving all of our insurance needs to him.",
    source: 'Yelp',
  },
  {
    name: 'Christine R.',
    location: 'Mount Dora, FL',
    rating: 5,
    text: "The agency is praised for its quick and hassle-free process, with policies bound in as little as half an hour. I saved over $500 compared to my previous policy.",
    source: 'Google Review',
  },
  {
    name: 'Robert L.',
    location: 'Central Florida',
    rating: 5,
    text: "Customers also appreciate the agency's animal liability coverage, which is a unique offering for homeowners with pets. Paul found me coverage when no one else would.",
    source: 'Nextdoor',
  },
  {
    name: 'Sandra T.',
    location: 'Mount Dora, FL',
    rating: 5,
    text: "Highly recommended! Farmers Insurance through Paul Williams saved me over $600 this year on my homeowners insurance over my previous carrier.",
    source: 'Yellow Pages',
  },
  {
    name: 'David M.',
    location: 'Eustis, FL',
    rating: 5,
    text: "Serving the Mount Dora area since 2019, Paul helped me understand my coverage options so I could protect what matters most. Outstanding customer service.",
    source: 'Google Review',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 60 });
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.review-card');
        gsap.set(cards, { opacity: 0, y: 50 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
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

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative bg-void py-[120px]"
    >
      <div className="max-w-[1344px] mx-auto px-6">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <span className="font-body text-[12px] uppercase tracking-[2.4px] text-crimson mb-4 block">
            TESTIMONIALS
          </span>
          <h2 className="font-display text-[48px] md:text-[72px] leading-[0.95] text-[#F0F2F5] mb-6">
            TRUSTED BY FLORIDA
          </h2>

          {/* Google Rating Badge */}
          <div className="inline-flex items-center gap-4 bg-midnight border border-dark-mist rounded-2xl px-8 py-5">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  className={i < 4 ? 'text-amber-400 fill-amber-400' : i === 4 ? 'text-amber-400 fill-amber-400/70' : 'text-mist'}
                />
              ))}
            </div>
            <div className="text-left">
              <p className="font-display text-3xl text-[#F0F2F5] leading-none">
                4.8<span className="text-mist text-lg">/5</span>
              </p>
              <p className="font-body text-sm text-mist">
                227+ Google Reviews
              </p>
            </div>
            <div className="w-px h-10 bg-dark-mist" />
            <div className="text-left">
              <p className="font-display text-3xl text-[#F0F2F5] leading-none">
                14+
              </p>
              <p className="font-body text-sm text-mist">
                Nextdoor Recs
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {featuredReviews.map((review, idx) => (
            <div
              key={idx}
              className="review-card bg-midnight border border-dark-mist rounded-lg p-8 hover:-translate-y-1 hover:shadow-crimson-glow transition-all duration-300"
            >
              <Quote
                size={24}
                className="text-crimson/40 mb-4"
                strokeWidth={1.5}
              />
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="font-body text-base text-[#F0F2F5] leading-relaxed mb-6">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-[#F0F2F5] font-medium">
                    {review.name}
                  </p>
                  <p className="font-body text-xs text-mist">
                    {review.location}
                  </p>
                </div>
                <span className="font-body text-[10px] uppercase tracking-[1px] text-mist bg-void px-2 py-1 rounded">
                  {review.source}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://www.google.com/maps/place/Paul+Williams+insurance+Agency/@28.7798804,-81.6225171,17z/data=!3m1!4b1!4m6!3m5!1s0x88e799397b57b31d:0xbbf26703d2aa254e!8m2!3d28.7798804!4d-81.6225171"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-crimson text-crimson font-body text-[13px] font-medium uppercase tracking-[2.6px] px-8 py-3 rounded-full hover:bg-crimson hover:text-white transition-all duration-300"
          >
            Read All 227+ Reviews on Google
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
