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

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const lenisRef = useRef(null);
  const location = useLocation();

  // Force scroll to top on reload/refresh
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Disable right-click and inspect shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // F12
      if (e.key === 'F12') e.preventDefault();
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) e.preventDefault();
      // Ctrl+U (view source)
      if (e.ctrlKey && e.key === 'u') e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
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

    // Scroll progress bar
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.width = `${self.progress * 100}%`;
        }
      },
    });

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loaded]);

  // Reset scroll & clean up ScrollTrigger on every route change
  useEffect(() => {
    if (!loaded) return;

    // Kill all stale ScrollTrigger instances left over from the
    // previous route (component cleanup via ctx.revert already ran
    // because React unmounts children before parent effects fire,
    // but pinned triggers can leave residual inline styles on body).
    ScrollTrigger.getAll().forEach((t) => t.kill(true));
    ScrollTrigger.clearScrollMemory();

    // Reset scroll position
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    // Re-create the scroll progress bar (we just killed it above)
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.width = `${self.progress * 100}%`;
        }
      },
    });

    // After new page's component effects have set up their
    // ScrollTriggers, refresh to recalculate all positions.
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname, loaded]);

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

      {/* Scroll progress bar */}
      <div className="scroll-progress" ref={progressRef}></div>

      {/* Main Page */}
      <div className="page-wrapper">
        <Navbar />

        <div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<HomePage loaded={loaded} />} />
            <Route path="/trainers" element={<TrainersPage />} />
          </Routes>
        </div>
      </div>

      {/* Music Toggle */}
      {loaded && <MusicToggle isPlaying={musicPlaying} onToggle={toggleMusic} />}
    </>
  );
}
