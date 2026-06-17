import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/section-transition.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned overscroll transition — the "reveal" panel slides up
 * and covers the viewport like a new page arriving.
 * Desktop only.
 */
export default function SectionTransition() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const reveal = wrap.querySelector('.st-reveal');
        const line = wrap.querySelector('.st-line');
        const tagline = wrap.querySelector('.st-tagline');

        // Pin the wrapper while the reveal panel slides up
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

        // Reveal panel slides up from below
        tl.fromTo(reveal, {
          yPercent: 100,
        }, {
          yPercent: 0,
          ease: 'power2.inOut',
          duration: 1,
        }, 0);

        // Horizontal accent line expands
        tl.fromTo(line, {
          scaleX: 0,
        }, {
          scaleX: 1,
          ease: 'power3.out',
          duration: 0.6,
        }, 0.5);

        // Tagline fades in
        tl.fromTo(tagline, {
          y: 30,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          duration: 0.5,
        }, 0.65);
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="section-transition" ref={wrapRef}>
      {/* Current content stays visible behind */}
      <div className="st-reveal">
        <div className="st-content">
          <div className="st-line"></div>
          <p className="st-tagline">EXPERT TRAINERS • CHAMPIONSHIP MINDSET</p>
        </div>
      </div>
    </div>
  );
}
