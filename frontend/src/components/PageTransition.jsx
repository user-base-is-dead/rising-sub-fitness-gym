import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/page-transition.css';

export default function PageTransition({ children, onPageSwap }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitioning, setTransitioning] = useState(false);
  
  const overlayRef = useRef(null);
  const pathRef = useRef(null);
  const brandRef = useRef(null);

  useEffect(() => {
    // If location changes, and we aren't already transitioning to that location
    if (location.pathname !== displayLocation.pathname && !transitioning) {
      setTransitioning(true);

      const overlay = overlayRef.current;
      const path = pathRef.current;
      const brand = brandRef.current;
      
      if (!overlay || !path) {
        setDisplayLocation(location);
        if (onPageSwap) onPageSwap();
        setTransitioning(false);
        return;
      }

      const tl = gsap.timeline();

      // Ensure overlay is visible and brand text is hidden initially
      gsap.set(overlay, { display: 'block' });
      gsap.set(path, { attr: { d: "M 0 100 L 0 100 Q 50 100 100 100 L 100 100 Z" } });
      gsap.set(brand, { opacity: 0, y: 20 });

      // 1. Cover: Curve bulge up
      tl.to(path, {
        duration: 0.4,
        ease: "power3.in",
        attr: { d: "M 0 100 L 0 50 Q 50 0 100 50 L 100 100 Z" }
      });

      // 2. Cover: Flat top
      tl.to(path, {
        duration: 0.3,
        ease: "power3.out",
        attr: { d: "M 0 100 L 0 0 Q 50 0 100 0 L 100 100 Z" }
      });

      // Fade in brand text when covered
      tl.to(brand, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out",
      }, "-=0.2");

      // Give a slight pause before swapping route
      tl.to({}, { duration: 0.2 });

      // 3. Swap route and change path orientation for uncover
      tl.call(() => {
        setDisplayLocation(location);
        if (onPageSwap) onPageSwap();
        
        // Change path so it draws from top down (fills same visual area)
        gsap.set(path, { attr: { d: "M 0 0 L 0 100 Q 50 100 100 100 L 100 0 Z" } });
      });

      // Fade out brand text
      tl.to(brand, {
        opacity: 0,
        y: -20,
        duration: 0.2,
        ease: "power2.in"
      });

      // 4. Uncover: Bottom edge moves up with bulge up
      tl.to(path, {
        duration: 0.3,
        ease: "power3.in",
        attr: { d: "M 0 0 L 0 50 Q 50 0 100 50 L 100 0 Z" }
      }, "-=0.1");

      // 5. Uncover: Complete
      tl.to(path, {
        duration: 0.4,
        ease: "power3.out",
        attr: { d: "M 0 0 L 0 0 Q 50 0 100 0 L 100 0 Z" },
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setTransitioning(false);
        }
      });
      
    } else if (!transitioning) {
      // Catch-all to keep in sync if not transitioning
      setDisplayLocation(location);
    }
  }, [location, displayLocation.pathname, transitioning]);

  // Clone the children (Routes) but inject the delayed display location
  // So it doesn't change until the halfway point of the animation
  return (
    <>
      <div className="page-transition-overlay" ref={overlayRef}>
        <svg
          className="page-transition-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            className="page-transition-path"
            d="M 0 100 L 0 100 Q 50 100 100 100 L 100 100 Z"
          />
        </svg>
        <div className="page-transition-brand" ref={brandRef}>
          <span className="transition-brand-text">RISING <span className="highlight">SUN</span></span>
        </div>
      </div>

      <div key={displayLocation.pathname}>
        {/* We need React Router to respect displayLocation. 
            Because App.jsx renders: <Routes location={location}>,
            we must override it if the child is a React element.
            However, we can just use React.cloneElement if we know the prop name. 
            Better yet, `<Routes>` does respect the `location` prop we pass it! */}
        {React.cloneElement(children, { location: displayLocation })}
      </div>
    </>
  );
}
