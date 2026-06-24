import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import '../styles/trainers-page.css';

gsap.registerPlugin(ScrollTrigger);

// ── Team Data ──
const owner = {
  name: 'Susanta Mishra',
  role: 'Founder & Owner',
  img: '/owner.jpg',
  bio: 'A former national-level powerlifter with 20+ years in the fitness industry, Susanta founded Rising Sun Fitness with a single mission — to build the most hardcore training facility in Jaipur. His no-excuses philosophy and relentless work ethic have shaped the gym\'s identity and inspired hundreds of athletes to push beyond their limits.',
};

const management = [
  {
    name: 'Barsha Priyadarsini Nanda',
    role: 'Manager',
    img: '/manager-barsha.jpg',
    bio: 'Keeps the operations running seamlessly. With 6 years in fitness management, Barsha ensures every member gets a best to best experience.',
  },
];

const trainers = [
  {
    name: 'Babu',
    specialty: 'Bodybuilding, Athlete & Strength',
    img: '/babu.jpg',
    bio: 'Babu is a bodybuilding coach and competitive athlete known for his disciplined training style. He helps beginners and athletes build strength, improve physique, and prepare for competitions through structured workout and nutrition guidance.',
    achievements: ['MR.INDIA 2025🥇🥇', 'MR.ODISHA 2025🥈🥈', 'LIFELOOM CLASSIC 2026🥇🥈🥈', 'IP CLASSIC 2025🥉', 'BFO7 CLASSIC 2025 🥉', 'LIFELOOM CLASSIC 2025🥈🥉'],
  },
  {
    name: 'Amarjit Dixit',
    specialty: 'Cardio, Bodybuilding & HIIT Specialist',
    img: '/amarjit.jpg',
    bio: 'The energy machine of Rising Sun. Amarjit\'s HIIT sessions are legendary — high-intensity, zero rest, maximum burn. Not for the faint-hearted.',
    // achievements: ['None'],
  },
  {
    name: 'Swarnaprava Senapati',
    specialty: 'Fitness Trainer',
    img: '/swarnaprava-senapati.jpg',
    bio: 'Swarnaprava guides members with focused workout support, clean movement, and consistent training discipline to help them build strength and confidence.',
  },
  {
    name: 'Satyajit Jena',
    specialty: 'Fitness Trainer',
    img: '/satyajit-jena.jpg',
    bio: 'Satyajit helps members train with proper form, steady progression, and practical strength routines built around their fitness goals.',
  },
];

export default function TrainersPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // ── Swipe-panel pinning removed — it caused the magnet/stick scroll feel.
      //    Sections now scroll naturally; content still reveals on enter below.

      // ── Hero Title Animation ──
      gsap.fromTo('.tp-hero-label', {
        y: 40, opacity: 0, skewY: 3,
      }, {
        y: 0, opacity: 1, skewY: 0,
        duration: 1, ease: 'power3.out', delay: 0.3,
      });

      gsap.fromTo('.tp-hero-title', {
        y: 80, opacity: 0,
      }, {
        y: 0, opacity: 1,
        duration: 1.2, ease: 'power3.out', delay: 0.5,
      });

      gsap.fromTo('.tp-hero-line', {
        scaleX: 0,
      }, {
        scaleX: 1,
        duration: 1.2, ease: 'power3.inOut', delay: 0.8,
      });

      // ── Owner Section ──
      gsap.fromTo('.tp-owner-image-wrap', {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
      }, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.tp-owner',
          start: 'top 70%',
          end: '+=400', scrub: 1,
        },
      });

      gsap.fromTo('.tp-owner-info', {
        x: 60, opacity: 0,
      }, {
        x: 0, opacity: 1,
        duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.tp-owner',
          start: 'top 65%',
          end: '+=400', scrub: 1,
        },
      });

      // ── Management Section Title ──
      gsap.fromTo('.tp-section-title', {
        y: 50, opacity: 0,
      }, {
        y: 0, opacity: 1,
        duration: 1, ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.tp-management',
          start: 'top 75%',
          end: '+=400', scrub: 1,
        },
      });

      // ── Management Cards (Static Entrance) ──
      // Removed ScrollTrigger entrance animations per request.

      // ── Trainer Cards — Staggered clip-path reveal ──
      const trainerCards = gsap.utils.toArray('.tp-trainer-card');
      trainerCards.forEach((card, i) => {
        const imgWrap = card.querySelector('.tp-trainer-img-wrap');
        const info = card.querySelector('.tp-trainer-info');

        // Image circle reveal
        gsap.fromTo(imgWrap, {
          clipPath: 'circle(0% at 50% 50%)',
        }, {
          clipPath: 'circle(75% at 50% 50%)',
          duration: 1.3, ease: 'power3.inOut',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: '+=400', scrub: 1,
          },
          delay: i * 0.1,
        });

        // Info slide up
        gsap.fromTo(info, {
          y: 40, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            end: '+=400', scrub: 1,
          },
          delay: i * 0.1 + 0.4,
        });
      });

      // ── Magnetic Hover on trainer cards only ──
      const cleanups = [];
      trainerCards.forEach(card => {
        const handleMouseMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(card, {
            x: x * 0.04,
            y: y * 0.04,
            duration: 0.5,
            ease: 'power2.out',
          });
        };
        const handleMouseLeave = () => {
          gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
        };
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        cleanups.push(() => {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
        });
      });

      return () => {
        cleanups.forEach(cleanup => cleanup());
      };

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="trainers-page" ref={pageRef}>
      {/* ── Hero Banner ── */}
      <section className="swipe-panel tp-hero">
        <div className="tp-hero-bg" />
        <div className="tp-hero-content">
          <div className="tp-hero-label">The Warriors Behind The Iron</div>
          <h1 className="tp-hero-title">OUR <span className="highlight">TEAM</span></h1>
          <div className="tp-hero-line" />
        </div>
      </section>

      {/* ── Owner Section ── */}
      <section className="swipe-panel tp-owner">
        <div className="tp-owner-inner">
          <div className="tp-owner-image-wrap">
            <img src={owner.img} alt={owner.name} />
            <div className="tp-owner-badge">FOUNDER</div>
          </div>
          <div className="tp-owner-info">
            <div className="tp-owner-label">The Visionary</div>
            <h2 className="tp-owner-name">{owner.name}</h2>
            <div className="tp-owner-role">{owner.role}</div>
            <p className="tp-owner-bio">{owner.bio}</p>
          </div>
        </div>
      </section>

      {/* ── Management Team ── */}
      <section className="swipe-panel tp-management">
        <div className="tp-management-inner">
          <div className="tp-section-label">Leadership</div>
          <h2 className="tp-section-title">MANAGEMENT <span className="highlight">TEAM</span></h2>
          <div className="tp-mgmt-grid">
            {management.map((m, i) => (
              <div className="tp-mgmt-card" key={i}>
                <div className="tp-mgmt-img-wrap">
                  <img src={m.img} alt={m.name} />
                </div>
                <div className="tp-mgmt-info">
                  <h3 className="tp-mgmt-name">{m.name}</h3>
                  <div className="tp-mgmt-role">{m.role}</div>
                  <p className="tp-mgmt-bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trainers Section ── */}
      <section className="swipe-panel tp-trainers">
        <div className="tp-trainers-inner">
          <div className="tp-section-label">Meet The Beasts</div>
          <h2 className="tp-section-title">OUR <span className="highlight">TRAINERS</span></h2>
          <div className="tp-trainers-grid">
            {trainers.map((t, i) => (
              <div className="tp-trainer-card" key={i}>
                <div className="tp-trainer-img-wrap">
                  <img src={t.img} alt={t.name} />
                </div>
                <div className="tp-trainer-info">
                  <h3 className="tp-trainer-name">{t.name}</h3>
                  <div className="tp-trainer-specialty">{t.specialty}</div>
                  <p className="tp-trainer-bio">{t.bio}</p>
                  <div className="tp-trainer-achievements">
                    {t.achievements && t.achievements.map((a, j) => (
                      <span className="tp-badge" key={j}>{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
