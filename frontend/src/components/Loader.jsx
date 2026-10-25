import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import logo from '../assets/images/logo.png';
import '../styles/loader.css';

// Status line that steps through the set as the bar is loaded
const stages = ['Chalk up', 'Grip the bar', 'Brace', 'Lift'];
const titleChars = 'RISING SUN'.split('');

// Barbell drawing (viewBox 0 0 1200 200, centre line y=100). Plates stack
// outward from the inner collars, biggest first; one pair lands every 25%.
const COLLAR_L = 250;
const COLLAR_R = 950;
const PLATES = [
  { w: 30, h: 170 },
  { w: 26, h: 142 },
  { w: 22, h: 114 },
  { w: 18, h: 88 },
];
const PLATE_GAP = 3;
const platesFor = (side) => {
  let edge = side < 0 ? COLLAR_L : COLLAR_R;
  return PLATES.map(({ w, h }) => {
    const x = side < 0 ? edge - w : edge;
    edge += side * (w + PLATE_GAP);
    return { x, y: 100 - h / 2, w, h };
  });
};
const PLATES_L = platesFor(-1);
const PLATES_R = platesFor(1);

export default function Loader({ onEnter }) {
  const [ready, setReady] = useState(false);
  const loaderRef = useRef(null);
  const barbellRef = useRef(null);
  const shakeRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const statusRef = useRef(null);

  // Loading: the bar draws out from the centre, then a pair of plates slides
  // on every 25% while the weight counts up.
  // Layout effect so the start positions are set before the first paint.
  useLayoutEffect(() => {
    let statusTween;
    let clankTween;
    const ctx = gsap.context(() => {
      const plates = PLATES.map((_, i) => ({
        left: loaderRef.current.querySelector(`.loader-plate.l${i}`),
        right: loaderRef.current.querySelector(`.loader-plate.r${i}`),
      }));
      plates.forEach(({ left, right }) => {
        gsap.set(left, { x: -320, opacity: 0 });
        gsap.set(right, { x: 320, opacity: 0 });
      });
      gsap.set('.loader-title-char', { yPercent: 110 });

      const tl = gsap.timeline();

      // autoRound off: dash values are fractions of pathLength=1, and GSAP would
      // otherwise snap them to whole pixels (the bar would jump, not draw)
      tl.fromTo('.loader-shaft', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power3.inOut', autoRound: false }, 0);
      tl.fromTo('.loader-hardware', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(2)' }, 0.7);
      tl.fromTo('.loader-lines span', { scaleY: 0 }, { scaleY: 1, duration: 1.4, stagger: 0.12, ease: 'power2.out' }, 0);
      tl.fromTo(['.loader-status-wrap', '.loader-weight'], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.4);

      // A pair lands: both plates slide on together, then the bar clanks
      const loadPair = (i) => {
        const { left, right } = plates[i];
        gsap.to([left, right], {
          x: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.in',
          onComplete: () => {
            clankTween?.kill();
            clankTween = gsap.fromTo(shakeRef.current, { y: 5 }, { y: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.35)' });
          },
        });
      };

      // The counter writes straight to the DOM — no React render per frame
      const statusEl = statusRef.current;
      let stage = -1;
      let loaded = 0;
      const progress = { val: 0 };
      tl.to(progress, {
        val: 100,
        duration: 3.6,
        ease: 'power1.inOut',
        onUpdate: () => {
          const v = progress.val;
          counterRef.current.textContent = String(Math.round(v)).padStart(3, '0');
          gsap.set(barRef.current, { scaleX: v / 100 });

          // Start each slide a little early so the plate lands on its mark
          while (loaded < PLATES.length && v >= (loaded + 1) * 25 - 10) loadPair(loaded++);

          const next = Math.min(stages.length - 1, Math.floor(v / 25));
          if (next !== stage) {
            stage = next;
            // Created mid-update, outside the context — tracked so cleanup can kill it
            statusTween?.kill();
            statusTween = gsap.fromTo(statusEl,
              { yPercent: 100, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out',
                onStart: () => { statusEl.textContent = stages[next]; } });
          }
        },
        onComplete: () => setReady(true),
      }, 1.1);
    }, loaderRef);

    return () => {
      statusTween?.kill();
      clankTween?.kill();
      gsap.killTweensOf('.loader-plate');
      ctx.revert();
    };
  }, []);

  // Fully loaded: dip, lift the bar to the top, then reveal the brand
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.25 });
      tl.to(['.loader-status-wrap', '.loader-weight'], { opacity: 0, y: -10, duration: 0.4 }, 0);
      tl.to(barbellRef.current, { y: 14, duration: 0.35, ease: 'power2.out' }, 0.1);
      tl.to(barbellRef.current, { y: () => -window.innerHeight * 0.24, duration: 0.9, ease: 'power3.inOut' }, 0.45);
      tl.fromTo('.loader-brand-logo', { opacity: 0, y: 30, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.9);
      tl.fromTo('.loader-title-char', { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'power4.out' }, 1.05);
      tl.fromTo('.loader-subtitle', { opacity: 0, letterSpacing: '1em' }, { opacity: 1, letterSpacing: '0.5em', duration: 1, ease: 'power3.out' }, 1.3);
      tl.fromTo('.loader-audio-choice', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.5);
    }, loaderRef);
    return () => ctx.revert();
  }, [ready]);

  const handleEnter = (withAudio) => {
    const q = gsap.utils.selector(loaderRef);
    const tl = gsap.timeline({ onComplete: () => onEnter(withAudio) });

    tl.to(q('.loader-audio-choice'), { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in' }, 0);
    tl.to(q('.loader-lines, .loader-bar'), { opacity: 0, duration: 0.3 }, 0.1);
    // The whole scene lifts away as one curtain, fading as it goes
    tl.to(q('.loader-barbell, .loader-brand'), { opacity: 0, duration: 0.7, ease: 'power2.in' }, 0.3);
    tl.to(loaderRef.current, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, 0.3);
  };

  const renderPlates = (plates, side) => plates.map((p, i) => (
    <g className={`loader-plate ${side}${i}`} key={`${side}${i}`}>
      <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="4" fill="url(#plateGold)" />
      <rect x={p.x + 4} y={p.y + 8} width={p.w - 8} height={p.h - 16} rx="2" className="loader-plate-inset" />
    </g>
  ));

  return (
    <div className="loader-screen" ref={loaderRef}>
      <div className="loader-lines" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span>
      </div>

      {/* Set status */}
      <div className="loader-status-wrap">
        <span className="loader-status-tag">Warm up</span>
        <span className="loader-status-mask">
          <span className="loader-status" ref={statusRef}>{stages[0]}</span>
        </span>
      </div>

      {/* Barbell */}
      <div className="loader-barbell" ref={barbellRef} aria-hidden="true">
        <div className="loader-barbell-glow"></div>
        <svg viewBox="0 0 1200 200" ref={shakeRef}>
          <defs>
            <linearGradient id="plateGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff1c4" />
              <stop offset="35%" stopColor="#f5cf7e" />
              <stop offset="70%" stopColor="#d9a648" />
              <stop offset="100%" stopColor="#a37a30" />
            </linearGradient>
            <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7f4ed" />
              <stop offset="100%" stopColor="#8d8778" />
            </linearGradient>
          </defs>

          {/* Shaft — two halves so it draws out from the centre */}
          <path className="loader-shaft" d="M600 100 H60" pathLength="1" />
          <path className="loader-shaft" d="M600 100 H1140" pathLength="1" />

          {/* Sleeves, collars and end caps */}
          <rect className="loader-hardware" x="60" y="92" width={COLLAR_L - 60} height="16" rx="3" fill="url(#steel)" />
          <rect className="loader-hardware" x={COLLAR_R} y="92" width={1140 - COLLAR_R} height="16" rx="3" fill="url(#steel)" />
          <rect className="loader-hardware" x={COLLAR_L} y="78" width="12" height="44" rx="3" fill="url(#steel)" />
          <rect className="loader-hardware" x={COLLAR_R - 12} y="78" width="12" height="44" rx="3" fill="url(#steel)" />
          <rect className="loader-hardware" x="52" y="88" width="10" height="24" rx="2" fill="url(#steel)" />
          <rect className="loader-hardware" x="1138" y="88" width="10" height="24" rx="2" fill="url(#steel)" />

          {renderPlates(PLATES_L, 'l')}
          {renderPlates(PLATES_R, 'r')}
        </svg>
      </div>

      {/* Weight on the bar */}
      <div className="loader-weight">
        <span ref={counterRef}>000</span>
        <small>KG</small>
      </div>

      {/* Brand — revealed under the lifted bar */}
      <div className="loader-brand">
        <img src={logo} alt="" className="loader-brand-logo" />
        <div className="loader-title" role="img" aria-label="Rising Sun">
          {titleChars.map((c, i) => (
            <span className="loader-title-mask" key={i} aria-hidden="true">
              <span className="loader-title-char">{c === ' ' ? ' ' : c}</span>
            </span>
          ))}
        </div>
        <div className="loader-subtitle">Fitness</div>
      </div>

      <div className="loader-bar"><span ref={barRef}></span></div>

      {/* Audio choice */}
      <div className="loader-audio-choice">
        <button className="audio-btn primary" onClick={() => handleEnter(true)}>
          Enter with Sound
        </button>
        <button className="audio-btn" onClick={() => handleEnter(false)}>
          Enter in Silence
        </button>
      </div>
    </div>
  );
}
