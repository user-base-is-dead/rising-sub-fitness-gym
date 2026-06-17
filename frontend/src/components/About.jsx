import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/about.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const mm = gsap.matchMedia();

      // Desktop / tablet — pinned scroll animation
      mm.add('(min-width: 769px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            end: 'center 55%',
            scrub: 1,
          },
        });

        // Stage 1: Image sweeps in from far left with rotation
        tl.fromTo('.about-image-wrap', {
          x: '-120%',
          rotateY: 25,
          opacity: 0,
          scale: 0.85,
        }, {
          x: '0%',
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        }, 0);

        // Image inner parallax — slides opposite
        tl.fromTo('.about-image-wrap img', {
          x: '30%',
          scale: 1.4,
        }, {
          x: '0%',
          scale: 1.1,
          duration: 1,
          ease: 'power2.out',
        }, 0);

        // Frame sweeps in slightly delayed
        tl.fromTo('.about-image-frame', {
          x: '-100%',
          opacity: 0,
        }, {
          x: '0%',
          opacity: 0.4,
          duration: 1,
          ease: 'power2.out',
        }, 0.15);

        // Stage 2: Content sweeps in from the right
        tl.fromTo('.about-content', {
          x: '120%',
          rotateY: -20,
          opacity: 0,
        }, {
          x: '0%',
          rotateY: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        }, 0.15);

        // Label slides from right with line drawing
        tl.fromTo('.about-label', {
          x: 80,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
        }, 0.4);

        // Title chars reveal with stagger
        tl.fromTo('.about-title', {
          y: 80,
          opacity: 0,
          skewY: 5,
        }, {
          y: 0,
          opacity: 1,
          skewY: 0,
          duration: 0.7,
          ease: 'power3.out',
        }, 0.5);

        // Text paragraphs cascade in
        tl.fromTo('.about-text', {
          x: 60,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }, 0.6);

        // Features pop in with scale
        tl.fromTo('.about-feature', {
          scale: 0,
          opacity: 0,
          rotation: -10,
        }, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
        }, 0.75);

        // Overlay glow pulse
        tl.fromTo('.about-image-overlay', {
          opacity: 0,
        }, {
          opacity: 1,
          duration: 0.5,
        }, 0.5);

        // Decorative line draws in
        tl.fromTo('.about-accent-line', {
          scaleX: 0,
        }, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power4.inOut',
        }, 0.65);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-inner">
        {/* Left: Image */}
        <div className="about-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80"
            alt="Rising Sun Fitness Interior"
          />
          <div className="about-image-overlay"></div>
          <div className="about-image-frame"></div>
        </div>

        {/* Right: Content */}
        <div className="about-content">
          <div className="about-label">Who We Are</div>
          <h2 className="about-title">
            More than a gym.<br />
            A <span className="gold">standard</span>.
          </h2>
          <p className="about-text">
            Rising Sun Fitness was built for those who refuse to settle for average.
            In the heart of Jajpur Town, Odisha, we have created a training environment
            where discipline is the culture and progress is the only currency.
          </p>
          <p className="about-text">
            From the first lift at dawn to the final set at night, the floor runs on one
            principle — consistent, deliberate effort. No shortcuts. No noise.
            Only the quiet work that builds lasting strength.
          </p>

          {/* Accent line */}
          <div className="about-accent-line"></div>

          <div className="about-features">
            <div className="about-feature">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6.5 6.5h11v11h-11z"/><path d="M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21"/></svg>
              </div>
              <span>Premium Strength Floor</span>
            </div>
            <div className="about-feature">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="7" r="3.2"/><path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2"/></svg>
              </div>
              <span>Certified Trainers</span>
            </div>
            <div className="about-feature">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg>
              </div>
              <span>Modern Equipment</span>
            </div>
            <div className="about-feature">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 2.5M17 6h2.5A2.5 2.5 0 0 1 17 8.5M9.5 13.5h5M10 17h4M9 20h6"/></svg>
              </div>
              <span>Champion Mindset</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-divider"></div>
    </section>
  );
}
