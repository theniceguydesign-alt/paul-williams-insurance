import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Menu, X, Phone, FileText } from 'lucide-react';

const scrollLinks = [
  { label: 'Coverage', href: '#coverage' },
  { label: 'About', href: '#about' },
  { label: 'Quote', href: '#quote' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage) return;
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHomePage]);

  const handleScrollClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const handleIntakeClick = () => {
    navigate('/intake');
    setMobileOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const navTextClass = "font-body text-[13px] font-normal uppercase tracking-[1.3px] transition-colors duration-200";
  const activeClass = "text-crimson";
  const inactiveClass = "text-white hover:text-crimson";

  return (
    <div>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 h-[60px] transition-all duration-300 ${
          scrolled ? 'bg-glass/90 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1344px] mx-auto px-6 h-full flex items-center justify-between">
          <a
            href="#"
            onClick={handleLogoClick}
            className="font-display text-2xl tracking-wide text-white hover:text-crimson transition-colors duration-200"
          >
            PW<span className="text-crimson">.</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {scrollLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollClick(e, link.href)}
                className={`${navTextClass} ${activeSection === link.href ? activeClass : inactiveClass}`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleIntakeClick}
              className={`${navTextClass} flex items-center gap-1.5 ${location.pathname === '/intake' ? activeClass : inactiveClass}`}
            >
              <FileText size={13} />
              Intake Form
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:4077910227"
              className="flex items-center gap-2 text-white hover:text-crimson transition-colors duration-200 font-body text-[13px] uppercase tracking-[1.3px]"
            >
              <Phone size={14} />
              <span>(407) 791-0227</span>
            </a>
            <a
              href="#quote"
              onClick={(e) => handleScrollClick(e, '#quote')}
              className="bg-crimson text-white font-body text-[14px] font-medium uppercase tracking-[2.8px] px-6 py-2.5 rounded-full hover:bg-arabian-red transition-colors"
            >
              Get a Quote
            </a>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] bg-void transition-transform duration-500 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full px-8 py-6">
          <div className="flex justify-between items-center mb-12">
            <span className="font-display text-3xl text-white">
              PW<span className="text-crimson">.</span>
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>
          <div className="flex flex-col gap-6 flex-1">
            {scrollLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollClick(e, link.href)}
                className="font-display text-5xl text-white hover:text-crimson transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleIntakeClick}
              className="font-display text-5xl text-white hover:text-crimson transition-colors duration-200 text-left flex items-center gap-3"
            >
              <FileText size={32} />
              Intake Form
            </button>
          </div>
          <a
            href="tel:4077910227"
            className="flex items-center gap-3 text-white font-body text-lg"
          >
            <Phone size={20} />
            <span>(407) 791-0227</span>
          </a>
        </div>
      </div>
    </div>
  );
}
