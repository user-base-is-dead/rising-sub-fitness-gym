import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/manifesto.css';

gsap.registerPlugin(ScrollTrigger);

/* Accent words are wrapped in *asterisks*. */
const STATEMENT =
  '*Strength* is not given. It is *forged* — rep by rep, day after day, ' +
  'in the quiet hours when no one is watching. This is where your *legacy* begins.';

const WORDS = STATEMENT.split(/\s+/).map((token) => ({
  text: token.replace(/\*/g, ''),
  accent: token.includes('*'),
}));

export default function Manifesto() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const words = gsap.utils.toArray('.manifesto-word', section);

      // Words illuminate one by one as the section scrolls past (scrubbed)
      gsap.fromTo(words,
        { opacity: 0.13 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.5,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        });

      // Side progress rail fills with scroll
      gsap.fromTo('.manifesto-rail-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });

      // Eyebrow + index fade in as the panel pins
      gsap.fromTo('.manifesto-meta',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="manifesto" id="manifesto" ref={sectionRef}>
      <div className="manifesto-sticky">
        <div className="manifesto-inner">
          <div className="manifesto-meta">
            <span className="manifesto-eyebrow">Our Ethos</span>
            <span className="manifesto-index">(01)</span>
          </div>

          <p className="manifesto-statement">
            {WORDS.map((w, i) => (
              <span
                className={`manifesto-word${w.accent ? ' accent' : ''}`}
                key={i}
              >
                {w.text}
                {i < WORDS.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </p>
        </div>

        {/* Progress rail */}
        <div className="manifesto-rail" aria-hidden="true">
          <div className="manifesto-rail-fill"></div>
        </div>
      </div>
    </section>
  );
}
