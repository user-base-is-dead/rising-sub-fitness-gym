import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSplitReveal } from '../hooks/useMotion';
import '../styles/trainers.css';

gsap.registerPlugin(ScrollTrigger);

const trainers = [
  {
    name: 'Amarjit Dixit',
    role: 'Cardio, Bodybuilding & HIIT Specialist',
    specialties: ['Cardio', 'Bodybuilding', 'HIIT'],
    img: '/amarjit.jpg',
  },
];

export default function Trainers() {
  const sectionRef = useRef(null);

  useSplitReveal(sectionRef);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animations
      gsap.fromTo('.trainers-label', {
        y: 30,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: '+=400', scrub: 1,
        },
      });

      // Feature cards — clip-path circle reveal on the photo, details rise in
      const cards = document.querySelectorAll('.trainer-card');
      cards.forEach((card) => {
        const imageWrap = card.querySelector('.trainer-image-wrap');
        const info = card.querySelectorAll('.trainer-info > *');

        gsap.fromTo(imageWrap, {
          clipPath: 'circle(0% at 50% 50%)',
        }, {
          clipPath: 'circle(75% at 50% 50%)',
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: '+=400', scrub: 1,
          },
        });

        gsap.fromTo(info, {
          y: 40,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            end: '+=360', scrub: 1,
          },
        });
      });

      // Magnetic hover — the photo leans toward the cursor
      cards.forEach((card) => {
        const imageWrap = card.querySelector('.trainer-image-wrap');

        card.addEventListener('mousemove', (e) => {
          const rect = imageWrap.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(imageWrap, {
            x: x * 0.05,
            y: y * 0.05,
            duration: 0.5,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(imageWrap, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="trainers" id="trainers" ref={sectionRef}>
      <div className="trainers-inner">
        <div className="trainers-header">
          <div className="trainers-label bold-eyebrow">Meet The Beasts</div>
          <h2 className="trainers-title bold-title" data-reveal>Our <em>Trainers</em></h2>
        </div>

        <div className="trainers-grid">
          {trainers.map((t, i) => (
            <div className="trainer-card" key={i}>
              <div className="trainer-image-wrap">
                <img src={t.img} alt={t.name} />
              </div>
              <div className="trainer-info">
                <div className="trainer-index">{String(i + 1).padStart(2, '0')}</div>
                <div className="trainer-tag">Expert Trainer</div>
                <h3 className="trainer-name">{t.name}</h3>
                <div className="trainer-role">{t.role}</div>
                <ul className="trainer-specialties">
                  {t.specialties.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <Link className="trainer-cta" to="/trainers">
                  <span>Meet the Team</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
