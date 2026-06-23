import { useState } from 'react'
import { Menu, X, Phone, Shield } from 'lucide-react'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <Shield className="text-[#c9a227]" size={28} />
          <div>
            <div className="text-white font-bold text-lg leading-tight">Paul Williams</div>
            <div className="text-[#c9a227] text-xs tracking-widest uppercase">Insurance Agency</div>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-gray-300 hover:text-white text-sm transition-colors">About</a>
          <a href="#services" className="text-gray-300 hover:text-white text-sm transition-colors">Coverage</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white text-sm transition-colors">Reviews</a>
          <a href="#contact" className="text-gray-300 hover:text-white text-sm transition-colors">Contact</a>
          <a
            href="tel:4077910227"
            className="flex items-center gap-2 bg-[#c9a227] text-[#0a1628] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e8c547] transition-colors"
          >
            <Phone size={14} />
            (407) 791-0227
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#0a1628] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          <a href="#about" className="text-gray-300 py-2" onClick={() => setOpen(false)}>About</a>
          <a href="#services" className="text-gray-300 py-2" onClick={() => setOpen(false)}>Coverage</a>
          <a href="#testimonials" className="text-gray-300 py-2" onClick={() => setOpen(false)}>Reviews</a>
          <a href="#contact" className="text-gray-300 py-2" onClick={() => setOpen(false)}>Contact</a>
          <a
            href="tel:4077910227"
            className="flex items-center gap-2 bg-[#c9a227] text-[#0a1628] px-4 py-3 rounded-lg font-bold justify-center"
          >
            <Phone size={16} />
            (407) 791-0227
          </a>
        </div>
      )}
    </nav>
  )
}
