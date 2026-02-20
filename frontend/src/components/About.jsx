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
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
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
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(1.7)',
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
            NOT JUST A GYM.<br />
            A <span className="gold">BATTLEFIELD</span>.
          </h2>
          <p className="about-text">
            Rising Sun Fitness isn't for everyone — it's for those who refuse to stay average. 
            Located in the heart of Jajpur Town, Odisha, we are the training ground where 
            raw discipline meets unbreakable spirit.
          </p>
          <p className="about-text">
            From dawn warriors crushing it at 5 AM to late-night grinders pushing past their 
            limits, our gym runs on one fuel — pure, relentless dedication. No shortcuts. 
            No excuses. Only results.
          </p>

          {/* Accent line */}
          <div className="about-accent-line"></div>

          <div className="about-features">
            <div className="about-feature">
              <div className="icon">🔥</div>
              <span>Hardcore Training Zone</span>
            </div>
            <div className="about-feature">
              <div className="icon">💪</div>
              <span>Expert Trainers</span>
            </div>
            <div className="about-feature">
              <div className="icon">⚡</div>
              <span>Premium Equipment</span>
            </div>
            <div className="about-feature">
              <div className="icon">🏆</div>
              <span>Champion Mindset</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-divider"></div>
    </section>
  );
}
