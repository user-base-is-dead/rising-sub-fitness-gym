import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useMagnetic } from '../hooks/useMotion';
import '../styles/hero.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Hero({ loaded }) {
  const heroRef = useRef(null);

  // Magnetic CTAs (skipped on touch)
  useMagnetic(heroRef, 0.4, [loaded]);

  useEffect(() => {
    if (!loaded) return undefined;

    const hero = heroRef.current;
    let split = null;
    let onMove = null;

    const ctx = gsap.context(() => {
      const build = () => {
        // Character split with per-line mask for the headline
        split = new SplitText('.hero-title-line', { type: 'lines,chars', mask: 'lines' });
        gsap.set('.hero-title', { opacity: 1 });

        const tl = gsap.timeline({ delay: 0.25 });

        // Background image: slow cinematic scale settle
        tl.fromTo('.hero-bg img',
          { scale: 1.3 },
          { scale: 1, duration: 2.4, ease: 'power3.out' }, 0);

        // Vertical hairlines draw down
        tl.fromTo('.hero-lines .h-line',
          { scaleY: 0, transformOrigin: 'top' },
          { scaleY: 1, duration: 1.4, stagger: 0.12, ease: 'power3.inOut' }, 0.1);

        // Eyebrow rises out of its mask
        tl.fromTo('.hero-eyebrow',
          { yPercent: 130, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.3);

        // Headline — character cascade out of the line mask
        tl.from(split.chars, {
          yPercent: 120,
          duration: 1.15,
          ease: 'power4.out',
          stagger: 0.022,
        }, 0.4);

        // Tagline
        tl.fromTo('.hero-tagline',
          { y: 34, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, 0.95);

        // CTA wrapper (buttons themselves stay free for magnetic transform)
        tl.fromTo('.hero-cta',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 1.1);

        // Scroll cue + stats
        tl.fromTo('.hero-scroll-indicator',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 1.4);
        tl.fromTo('.stat-item',
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 1.25);

        // Animated stat counters
        gsap.utils.toArray('.stat-number').forEach((stat) => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          const obj = { val: 0 };
          tl.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => { stat.textContent = Math.round(obj.val) + suffix; },
          }, 1.35);
        });

        /* ---------- Scroll parallax (yPercent — composes with mouse y) ---------- */
        gsap.to('.hero-bg img', {
          yPercent: 16,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero-content', {
          yPercent: -26,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: '38% top', end: 'bottom top', scrub: true },
        });

        /* ---------- Layered mouse parallax (px — composes with scroll) ---------- */
        const bgX = gsap.quickTo('.hero-bg img', 'x', { duration: 1.4, ease: 'power3' });
        const bgY = gsap.quickTo('.hero-bg img', 'y', { duration: 1.4, ease: 'power3' });
        const titleX = gsap.quickTo('.hero-title', 'x', { duration: 1, ease: 'power3' });
        const titleY = gsap.quickTo('.hero-title', 'y', { duration: 1, ease: 'power3' });
        const eyebrowX = gsap.quickTo('.hero-eyebrow', 'x', { duration: 1.2, ease: 'power3' });

        onMove = (e) => {
          const nx = (e.clientX / window.innerWidth) - 0.5;
          const ny = (e.clientY / window.innerHeight) - 0.5;
          bgX(nx * -24);
          bgY(ny * -24);
          titleX(nx * 26);
          titleY(ny * 18);
          eyebrowX(nx * 14);
        };
        window.addEventListener('mousemove', onMove);

        ScrollTrigger.refresh();
      };

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(build);
      } else {
        build();
      }
    }, heroRef);

    return () => {
      if (onMove) window.removeEventListener('mousemove', onMove);
      ctx.revert();
      if (split) split.revert();
    };
  }, [loaded]);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Background */}
      <div className="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=1920&q=80"
          alt="Rising Sun Fitness training floor"
        />
      </div>

      {/* Film grain + vignette */}
      <div className="hero-grain" aria-hidden="true"></div>
      <div className="hero-vignette" aria-hidden="true"></div>

      {/* Decorative vertical hairlines */}
      <div className="hero-lines" aria-hidden="true">
        <div className="h-line"></div>
        <div className="h-line"></div>
        <div className="h-line"></div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-eyebrow-mask">
          <div className="hero-eyebrow">Jajpur Town, Odisha &nbsp;·&nbsp; Established 2018</div>
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line">Forge</span>
          <span className="hero-title-line serif-italic">your</span>
          <span className="hero-title-line fire">Legacy</span>
        </h1>

        <p className="hero-tagline">
          A discipline. A craft. A way of life — where strength is built with intent.
        </p>

        <div className="hero-cta">
          <a
            className="cta-btn primary"
            data-magnetic
            href="https://wa.me/916380816041?text=Hello!%20I%20am%20interested%20in%20joining%20Rising%20Sun%20Fitness.%20Can%20I%20get%20more%20details%3F"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Begin Your Journey</span>
          </a>
          <Link className="cta-btn secondary" data-magnetic to="/trainers">
            <span>Meet the Team</span>
          </Link>
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
            <div className="stat-number" data-target="1">0</div>
            <div className="stat-label">Expert Trainer</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target="8" data-suffix="+">0</div>
            <div className="stat-label">Years Strong</div>
          </div>
        </div>
      </div>
    </section>
  );
}
