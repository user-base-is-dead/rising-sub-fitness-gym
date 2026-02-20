import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/page-transition.css';

export default function PageTransition({ children }) {
  const location = useLocation();
  const overlayRef = useRef(null);
  const isFirstRender = useRef(true);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPath.current = location.pathname;
      return;
    }

    // Same route - nothing to do
    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;

    const overlay = overlayRef.current;
    if (!overlay) return;

    // Scroll to top immediately
    window.scrollTo(0, 0);

    // Play overlay sweep animation (purely visual - content already swapped by React Router)
    const tl = gsap.timeline();

    // Overlay sweeps in from right
    tl.set(overlay, { display: 'block', xPercent: 100 });
    tl.to(overlay, {
      xPercent: 0,
      duration: 0.5,
      ease: 'power3.inOut',
    });

    // Brief pause at full cover
    tl.to({}, { duration: 0.25 });

    // Overlay sweeps out to left
    tl.to(overlay, {
      xPercent: -100,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(overlay, { display: 'none', xPercent: 100 });
      },
    });

  }, [location.pathname]);

  return (
    <>
      {/* Curve wipe overlay - purely visual, does NOT control content */}
      <div className="page-transition-overlay" ref={overlayRef}>
        <svg
          className="page-transition-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,0 L 100,0 L 100,100 L 0,100 Z"
            className="page-transition-path"
          />
        </svg>
        <div className="page-transition-brand">
          <span className="transition-brand-text">RISING <span className="highlight">SUN</span></span>
        </div>
      </div>

      {/* Always render children directly - React Router handles the content swap */}
      {children}
    </>
  );
}
