import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import '../styles/trainers-page.css';

gsap.registerPlugin(ScrollTrigger);

// ── Team Data ──
const owner = {
  name: 'Vikram Singh Rathore',
  role: 'Founder & Owner',
  img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  bio: 'A former national-level powerlifter with 20+ years in the fitness industry, Vikram founded Rising Sun Fitness with a single mission — to build the most hardcore training facility in Jaipur. His no-excuses philosophy and relentless work ethic have shaped the gym\'s identity and inspired hundreds of athletes to push beyond their limits.',
};

const management = [
  {
    name: 'Ankit Mehra',
    role: 'General Manager',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    bio: 'Keeps the operations running seamlessly. With 10 years in fitness management, Ankit ensures every member gets a world-class experience.',
  },
  {
    name: 'Sneha Kapoor',
    role: 'Head of Programs',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    bio: 'Designs all training programs and class schedules. A certified strength & conditioning specialist with a passion for functional fitness.',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Operations Lead',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
    bio: 'Handles member relations, equipment maintenance, and daily operations. The backbone that keeps Rising Sun running 365 days a year.',
  },
];

const trainers = [
  {
    name: 'Rahul Sharma',
    specialty: 'Bodybuilding & Strength',
    img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&q=80',
    bio: 'IFBB-certified bodybuilding coach with 8 years of competitive experience. Known for his brutal leg day routines and transforming beginners into beasts.',
    achievements: ['IFBB Pro Card Holder', '500+ Client Transformations'],
  },
  {
    name: 'Priya Patel',
    specialty: 'Yoga & Flexibility',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    bio: 'A 200-hour RYT certified yoga instructor who blends traditional Hatha yoga with power stretching. Helps athletes recover faster and move better.',
    achievements: ['RYT-200 Certified', 'Former National Gymnast'],
  },
  {
    name: 'Arjun Das',
    specialty: 'Cardio & HIIT',
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
    bio: 'The energy machine of Rising Sun. Arjun\'s HIIT sessions are legendary — high-intensity, zero rest, maximum burn. Not for the faint-hearted.',
    achievements: ['ACE Certified Trainer', 'Marathon Runner'],
  },
  {
    name: 'Kavita Nair',
    specialty: 'CrossFit & Functional Training',
    img: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=600&q=80',
    bio: 'CrossFit Level 2 trainer who believes in building real-world strength. Her WODs (Workouts of the Day) push every boundary you thought you had.',
    achievements: ['CrossFit L2 Certified', 'Regional CF Champion'],
  },
  {
    name: 'Sameer Khan',
    specialty: 'Martial Arts & Combat',
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
    bio: 'Black belt in Taekwondo and MMA fighter. Teaches kickboxing, self-defense, and combat conditioning classes that build both skill and savage conditioning.',
    achievements: ['3rd Dan Black Belt', 'State MMA Champion'],
  },
];

export default function TrainersPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
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
          toggleActions: 'play none none reverse',
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
          toggleActions: 'play none none reverse',
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
          toggleActions: 'play none none reverse',
        },
      });

      // ── Management Cards ──
      const mgmtCards = document.querySelectorAll('.tp-mgmt-card');
      mgmtCards.forEach((card, i) => {
        gsap.fromTo(card, {
          y: 80, opacity: 0, rotateY: -15,
        }, {
          y: 0, opacity: 1, rotateY: 0,
          duration: 1, ease: 'power3.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // ── Trainer Cards — Staggered clip-path reveal ──
      const trainerCards = document.querySelectorAll('.tp-trainer-card');
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
            toggleActions: 'play none none reverse',
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
            toggleActions: 'play none none reverse',
          },
          delay: i * 0.1 + 0.4,
        });
      });

      // ── Magnetic Hover on all cards ──
      document.querySelectorAll('.tp-trainer-card, .tp-mgmt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(card, {
            x: x * 0.04,
            y: y * 0.04,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
        });
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="trainers-page" ref={pageRef}>
      {/* ── Hero Banner ── */}
      <section className="tp-hero">
        <div className="tp-hero-bg" />
        <div className="tp-hero-content">
          <div className="tp-hero-label">The Warriors Behind The Iron</div>
          <h1 className="tp-hero-title">OUR <span className="highlight">TEAM</span></h1>
          <div className="tp-hero-line" />
        </div>
      </section>

      {/* ── Owner Section ── */}
      <section className="tp-owner">
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
      <section className="tp-management">
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
      <section className="tp-trainers">
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
                    {t.achievements.map((a, j) => (
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
