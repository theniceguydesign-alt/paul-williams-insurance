import { Phone, Mail, MapPin, Clock, Facebook, Linkedin } from 'lucide-react';

const navLinks = [
  { label: 'Coverage', href: '#coverage' },
  { label: 'About', href: '#about' },
  { label: 'Quote', href: '#quote' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-[#F0F2F5]">
      {/* Main footer content */}
      <div className="max-w-[1344px] mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a
              href="#"
              className="font-display text-4xl tracking-wide text-void hover:text-brand-blue transition-colors duration-200 inline-block mb-4"
            >
              PW<span className="text-crimson">.</span>
            </a>
            <p className="font-body text-sm text-gray-600 leading-relaxed mb-6">
              Your Most Trusted Independent Insurance Agent in Mount Dora, FL.
              The Insurance Rebel — protecting what matters most for over 20
              years.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-void/5 flex items-center justify-center text-void hover:bg-brand-blue hover:text-[#F0F2F5] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-void/5 flex items-center justify-center text-void hover:bg-brand-blue hover:text-[#F0F2F5] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-[12px] font-medium uppercase tracking-[2.4px] text-void/60 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-body text-base text-void hover:text-brand-blue transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}

            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-body text-[12px] font-medium uppercase tracking-[2.4px] text-void/60 mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:4077910227"
                  className="flex items-center gap-3 text-void hover:text-brand-blue transition-colors"
                >
                  <Phone size={16} className="text-brand-blue flex-shrink-0" />
                  <span className="font-body text-sm">(407) 791-0227</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:paul@paulwilliamsinsurance.com"
                  className="flex items-center gap-3 text-void hover:text-brand-blue transition-colors"
                >
                  <Mail size={16} className="text-brand-blue flex-shrink-0" />
                  <span className="font-body text-sm">
                    paul@paulwilliamsinsurance.com
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-void">
                  <MapPin
                    size={16}
                    className="text-brand-blue flex-shrink-0 mt-0.5"
                  />
                  <span className="font-body text-sm">
                    2110 N Donnelly St. Ste 110
                    <br />
                    Mount Dora, FL 32757
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-body text-[12px] font-medium uppercase tracking-[2.4px] text-void/60 mb-6">
              Business Hours
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock
                  size={16}
                  className="text-brand-blue flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-body text-sm text-void">
                    Monday – Saturday
                  </p>
                  <p className="font-body text-sm text-void/60">
                    By Appointment Only
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock
                  size={16}
                  className="text-brand-blue flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-body text-sm text-void">Sunday</p>
                  <p className="font-body text-sm text-void/60">Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-[#E8E8EC] py-6">
        <div className="max-w-[1344px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-[12px] text-gray-500 text-center md:text-left">
            &copy; 2025 Paul Williams Insurance Agency. All Rights Reserved.
            Independent Insurance Agent.
          </p>
          <p className="font-body text-[12px] text-gray-500">
            Mount Dora, FL 32757
          </p>
        </div>
        <div className="max-w-[1344px] mx-auto px-6 pt-2">
          <a
            href="mailto:theniceguy.design@gmail.com"
            className="font-body text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            Built by Crestlake Studio
          </a>
        </div>
      </div>
    </footer>
  );
}
