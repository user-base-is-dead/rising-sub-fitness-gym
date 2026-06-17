import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ loaded }) {
  const heroRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1 });

      // Subtitle characters reveal
      tl.fromTo('.hero-subtitle span', {
        y: 40,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      }, 0);

      // Title lines reveal
      tl.to('.hero-title .line span', {
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
      }, 0.3);

      // Tagline reveal
      tl.fromTo('.hero-tagline span', {
        y: 30,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, 1);

      // CTA buttons reveal
      tl.fromTo('.hero-cta .cta-btn', {
        y: 30,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      }, 1.2);

      // Stats counter
      tl.fromTo('.stat-item', {
        y: 20,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      }, 1.5);

      // Animate stat numbers
      const stats = document.querySelectorAll('.stat-number');
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const suffix = stat.getAttribute('data-suffix') || '';
        const obj = { val: 0 };
        tl.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            stat.textContent = Math.round(obj.val) + suffix;
          },
        }, 1.5);
      });

      // Background image scale
      tl.fromTo('.hero-bg img', {
        scale: 1.3,
      }, {
        scale: 1.1,
        duration: 2,
        ease: 'power2.out',
      }, 0);

      // Scroll indicator
      tl.fromTo('.hero-scroll-indicator', {
        opacity: 0,
        y: 20,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, 2);

      // Parallax on scroll
      gsap.to('.hero-bg img', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Fade out hero content on scroll
      gsap.to('.hero-content', {
        yPercent: -30,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: '60% top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Background */}
      <div className="hero-bg" ref={bgRef}>
        <img
          src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=1920&q=80"
          alt="Gym"
        />
      </div>

      {/* Decorative lines */}
      <div className="hero-lines">
        <div className="h-line"></div>
        <div className="h-line"></div>
        <div className="h-line"></div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-subtitle">
          <span>Jajpur Town, Odisha &nbsp;·&nbsp; Established 2018</span>
        </div>

        <h1 className="hero-title">
          <div className="line"><span>Forge</span></div>
          <div className="line"><span className="serif-italic">your</span></div>
          <div className="line"><span className="fire">Legacy</span></div>
        </h1>

        <div className="hero-tagline">
          <span>A discipline. A craft. A way of life — where strength is built with intent.</span>
        </div>

        <div className="hero-cta">
          <a
            className="cta-btn primary"
            href="https://wa.me/916380816041?text=Hello!%20I%20am%20interested%20in%20joining%20Rising%20Sun%20Fitness.%20Can%20I%20get%20more%20details%3F"
            target="_blank"
            rel="noopener noreferrer"
          >
            Begin Your Journey
          </a>
          <Link className="cta-btn secondary" to="/trainers">Meet the Team</Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <div className="scroll-mouse"></div>
        <span className="scroll-text">Scroll</span>
      </div>

      {/* Stats bar */}
      <div className="hero-stats">
        <div className="hero-stats-inner">
          <div className="stat-item">
            <div className="stat-number" data-target="500" data-suffix="+">0</div>
            <div className="stat-label">Members</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="5" data-suffix="+">0</div>
            <div className="stat-label">Expert Trainers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="4" data-suffix="">0</div>
            <div className="stat-label">Achievements</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="3" data-suffix="+">0</div>
            <div className="stat-label">Years Strong</div>
          </div>
        </div>
      </div>
    </section>
  );
}
