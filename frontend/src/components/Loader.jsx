import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import logo from '../assets/images/logo.png';
import '../styles/loader.css';

export default function Loader({ onEnter }) {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const brandRef = useRef(null);
  const audioChoiceRef = useRef(null);
  const loadingTextRef = useRef(null);
  const counterRef = useRef(null);
  const circumference = 2 * Math.PI * 90; // r=90

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate lines
    tl.fromTo('.loader-lines span', {
      scaleY: 0,
    }, {
      scaleY: 1,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power2.out',
    }, 0);

    // Show loading text
    tl.to(loadingTextRef.current, {
      opacity: 1,
      duration: 0.5,
    }, 0.3);

    // Counter animation
    const counterAnim = { val: 0 };
    tl.to(counterAnim, {
      val: 100,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counterAnim.val);
        setCount(v);
        // Update SVG circle
        if (progressRef.current) {
          const offset = circumference - (v / 100) * circumference;
          progressRef.current.style.strokeDashoffset = offset;
        }
      },
      onComplete: () => setReady(true),
    }, 0.5);

    return () => tl.kill();
  }, []);

  useEffect(() => {
    if (ready) {
      const tl = gsap.timeline();

      // Hide loading text and counter
      tl.to(loadingTextRef.current, { opacity: 0, duration: 0.3 }, 0);

      // Show brand
      tl.to(brandRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.2);

      tl.to('.loader-brand::after', {
        width: '60px',
        duration: 0.6,
        ease: 'power2.out',
      }, 0.4);

      // Show audio choice
      tl.to(audioChoiceRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.6);
    }
  }, [ready]);

  const handleEnter = (withAudio) => {
    const tl = gsap.timeline({
      onComplete: () => onEnter(withAudio),
    });

    // Exit animation
    tl.to(audioChoiceRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
    }, 0);

    tl.to(brandRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
    }, 0.1);

    tl.to('.loader-progress-wrap', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
    }, 0.1);

    // Wipe out
    tl.to(loaderRef.current, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      duration: 1,
      ease: 'power4.inOut',
    }, 0.4);
  };

  return (
    <div className="loader-screen" ref={loaderRef}>
      {/* Decorative lines */}
      <div className="loader-lines">
        <span></span><span></span><span></span><span></span>
      </div>

      {/* Circular progress */}
      <div className="loader-progress-wrap">
        <svg className="loader-progress-svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4500" />
              <stop offset="100%" stopColor="#dc143c" />
            </linearGradient>
          </defs>
          <circle className="loader-progress-track" cx="100" cy="100" r="90" />
          <circle
            className="loader-progress-fill"
            cx="100" cy="100" r="90"
            ref={progressRef}
            style={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          />
        </svg>
        <div className="loader-counter" ref={counterRef}>
          {count}<span>%</span>
        </div>
      </div>

      {/* Brand name */}
      <div className="loader-brand" ref={brandRef}>
        <img src={logo} alt="Rising Sun Fitness" className="loader-brand-logo" />
        RISING SUN FITNESS
      </div>

      {/* Audio choice */}
      <div className="loader-audio-choice" ref={audioChoiceRef}>
        <button className="audio-btn primary" onClick={() => handleEnter(true)}>
          ▶ Enter with Audio
        </button>
        <button className="audio-btn" onClick={() => handleEnter(false)}>
          Enter without Audio
        </button>
      </div>

      {/* Loading text */}
      <div className="loader-loading-text" ref={loadingTextRef}>
        Loading Experience...
      </div>
    </div>
  );
}
