import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/trainers.css';

gsap.registerPlugin(ScrollTrigger);

const trainers = [
  {
    name: 'Babu',
    role: 'Bodybuilding, Athlete & Strength',
    img: '/babu.jpg',
  },
  {
    name: 'Amarjit Dixit',
    role: 'Cardio, Bodybuilding & HIIT Specialist',
    img: '/amarjit.jpg',
  },
];

export default function Trainers() {
  const sectionRef = useRef(null);

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

      gsap.fromTo('.trainers-title', {
        y: 60,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: '+=400', scrub: 1,
        },
      });

      // Trainer cards — clip-path circle reveal
      const cards = document.querySelectorAll('.trainer-card');
      cards.forEach((card, i) => {
        const imageWrap = card.querySelector('.trainer-image-wrap');
        const info = card.querySelector('.trainer-info');

        gsap.fromTo(imageWrap, {
          clipPath: 'circle(0% at 50% 50%)',
        }, {
          clipPath: 'circle(75% at 50% 50%)',
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            end: '+=400', scrub: 1,
          },
          delay: i * 0.2,
        });

        gsap.fromTo(info, {
          y: 30,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            end: '+=400', scrub: 1,
          },
          delay: i * 0.2 + 0.5,
        });
      });

      // Magnetic hover effect
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(card, {
            x: x * 0.05,
            y: y * 0.05,
            duration: 0.5,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
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
          <div className="trainers-label">Meet The Beasts</div>
          <h2 className="trainers-title">OUR TRAINERS</h2>
        </div>

        <div className="trainers-grid">
          {trainers.map((t, i) => (
            <div className="trainer-card" key={i}>
              <div className="trainer-image-wrap">
                <img src={t.img} alt={t.name} />
              </div>
              <div className="trainer-info">
                <h3 className="trainer-name">{t.name}</h3>
                <div className="trainer-role">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
