import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import '../styles/page-hero.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Full-screen hero for the inner pages, in the home page's bold voice:
 * dark photo, hairlines, a huge outlined ghost word, gold eyebrow and a
 * heavy title whose <em> part turns gold serif. Used inside `.home-bold`.
 * tone="alert" swaps gold for warning red; compact makes it shorter.
 */
export default function PageHero({ img, ghost, eyebrow, title, tagline, tone, compact }) {
  const heroRef = useRef(null);

  useEffect(() => {
    let split = null;
    let cancelled = false;

    const ctx = gsap.context(() => {
      gsap.set('.ph-title', { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo('.ph-bg img', { scale: 1.25 }, { scale: 1, duration: 2.4, ease: 'power3.out' }, 0);
      tl.fromTo('.ph-lines span', { scaleY: 0 }, { scaleY: 1, duration: 1.4, stagger: 0.12, ease: 'power3.inOut' }, 0.1);
      tl.fromTo('.ph-eyebrow', { yPercent: 130, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.3);
      tl.fromTo('.ph-ghost', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.6, ease: 'power3.out' }, 0.4);
      tl.fromTo('.ph-tagline', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.9);
      tl.fromTo('.ph-scroll', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 1.3);

      // Title: characters rise out of a line mask once fonts have loaded,
      // so SplitText measures the real glyphs
      const build = () => {
        if (cancelled) return;
        ctx.add(() => {
          split = new SplitText('.ph-title', { type: 'lines,chars', mask: 'lines' });
          gsap.set('.ph-title', { opacity: 1 });
          gsap.from(split.chars, { yPercent: 120, duration: 1.15, ease: 'power4.out', stagger: 0.03, delay: 0.25 });
        });
      };
      if (document.fonts?.ready) document.fonts.ready.then(build);
      else build();

      // Content drifts up and fades as you leave the hero
      gsap.to('.ph-content', {
        yPercent: -18, opacity: 0.2, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, heroRef);

    return () => {
      cancelled = true;
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      className={`ph${tone ? ` is-${tone}` : ''}${compact ? ' is-compact' : ''}`}
      ref={heroRef}
    >
      <div className="ph-bg">
        {img && <img src={img} alt="" />}
      </div>
      <div className="ph-lines" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      {ghost && <div className="ph-ghost" aria-hidden="true">{ghost}</div>}

      <div className="ph-content">
        <div className="ph-eyebrow-mask">
          <div className="ph-eyebrow bold-eyebrow">
            {tone === 'alert' && (
              <svg className="ph-eyebrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4.5M12 17.2v.3" strokeLinecap="round" />
              </svg>
            )}
            {eyebrow}
          </div>
        </div>
        <h1 className="ph-title bold-title">{title}</h1>
        {tagline && <p className="ph-tagline">{tagline}</p>}
      </div>

      <div className="ph-scroll" aria-hidden="true">
        <span>Scroll</span>
        <i></i>
      </div>
    </section>
  );
}
