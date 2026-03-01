import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import MusicToggle from './components/MusicToggle';
import HomePage from './pages/HomePage';
import TrainersPage from './pages/TrainersPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import AchievementsPage from './pages/AchievementsPage';
import PageTransition from './components/PageTransition';
import WhatsAppButton from './components/WhatsAppButton';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const lenisRef = useRef(null);
  const location = useLocation();

  // Force scroll to top on reload/refresh
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);



  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (!loaded) return;

    window.scrollTo(0, 0); // Double check before lenis starts

    const lenis = new Lenis({
      duration: 2.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Standard expo out
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.scrollTo(0, { immediate: true }); // Force lenis to top

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after Lenis is ready so all triggers sync properly
    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loaded]);

  // Handle page swap (called by PageTransition when screen is fully covered)
  const handlePageSwap = () => {
    if (!loaded) return;

    // Kill all stale ScrollTrigger instances left over from the
    // previous route
    ScrollTrigger.getAll().forEach((t) => t.kill(true));
    ScrollTrigger.clearScrollMemory();

    // Reset scroll position
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    // After new page's component effects have set up their
    // ScrollTriggers, refresh to recalculate all positions.
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 400);
  };

  const handleEnter = (withAudio) => {
    setLoaded(true);

    // Reveal page
    setTimeout(() => {
      const wrapper = document.querySelector('.page-wrapper');
      if (wrapper) {
        wrapper.classList.add('visible');
        gsap.fromTo(wrapper, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });
      }
    }, 100);

    // Audio
    if (withAudio && audioRef.current) {
      audioRef.current.play().then(() => {
        setMusicPlaying(true);
      }).catch(() => {
        // Browser blocked autoplay
        setMusicPlaying(false);
      });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setMusicPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <>
      {/* Audio element — user will add their mp3 file here */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/bg-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Custom Cursor */}
      <Cursor />

      {/* Loader */}
      {!loaded && <Loader onEnter={handleEnter} />}

      {/* Main Page */}
      <div className="page-wrapper">
        <Navbar />

        <PageTransition onPageSwap={handlePageSwap}>
          <Routes location={location}>
            <Route path="/" element={<HomePage loaded={loaded} />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/trainers" element={<TrainersPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </PageTransition>
      </div>

      {/* Global WhatsApp Button */}
      {loaded && <WhatsAppButton />}

      {/* Music Toggle */}
      {loaded && <MusicToggle isPlaying={musicPlaying} onToggle={toggleMusic} />}
    </>
  );
}
