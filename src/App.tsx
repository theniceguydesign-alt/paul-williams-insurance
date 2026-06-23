import { Routes, Route } from 'react-router';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Introduction from './sections/Introduction';
import CoverageTypes from './sections/CoverageTypes';
import WhyChoose from './sections/WhyChoose';
import Testimonials from './sections/Testimonials';
import QuoteRequest from './sections/QuoteRequest';
import Footer from './sections/Footer';
import Login from './pages/Login';
import Admin from './pages/Admin';
import IntakeForm from './pages/IntakeForm';
import NotFound from './pages/NotFound';

gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    lenisRef.current.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <div className="relative bg-void">
      <Navigation />
      <main>
        <Hero />
        <Introduction />
        <CoverageTypes />
        <WhyChoose />
        <Testimonials />
        <QuoteRequest />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/intake" element={<IntakeForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
