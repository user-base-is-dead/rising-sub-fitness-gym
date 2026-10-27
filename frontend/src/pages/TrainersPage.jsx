import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSplitReveal, useMagnetic } from '../hooks/useMotion';
import Footer from '../components/Footer';
import SectionMarquee from '../components/SectionMarquee';
import PageHero from '../components/PageHero';
import '../styles/home-bold.css';
import '../styles/trainers-page.css';

gsap.registerPlugin(ScrollTrigger);

// ── Team Data ──
const owner = {
  name: 'Susanta Mishra',
  role: 'Founder & Owner',
  tag: 'Founder',
  img: '/owner.jpg',
  bio: 'A former national-level powerlifter with 20+ years in the fitness industry, Susanta founded Rising Sun Fitness with a single mission — to build the most hardcore training facility in Jajpur. His no-excuses philosophy and relentless work ethic have shaped the gym\'s identity and inspired hundreds of athletes to push beyond their limits.',
};

const management = [
  {
    name: 'Barsha Priyadarsini Nanda',
    role: 'Manager',
    tag: 'Leadership',
    img: '/manager-barsha.jpg',
    bio: 'Keeps the operations running seamlessly. With 6 years in fitness management, Barsha ensures every member gets the best possible experience.',
  },
];

const trainers = [
  {
    name: 'Amarjit Dixit',
    role: 'Cardio, Bodybuilding & HIIT Specialist',
    tag: 'Expert Trainer',
    img: '/amarjit.jpg',
    bio: 'The energy machine of Rising Sun. Amarjit\'s HIIT sessions are legendary — high-intensity, zero rest, maximum burn. Not for the faint-hearted.',
    specialties: ['Cardio', 'Bodybuilding', 'HIIT'],
  },
];

// One running number across the whole roster: founder 01, then management, then trainers
const people = [owner, ...management, ...trainers];
const indexOf = (p) => String(people.indexOf(p) + 1).padStart(2, '0');

export default function TrainersPage() {
  const pageRef = useRef(null);

  useSplitReveal(pageRef);
  useMagnetic(pageRef, 0.35);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Section eyebrows
      gsap.utils.toArray('.tp-head .bold-eyebrow').forEach((el) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      // ── Feature rows: photo opens in a circle, details rise in, number drifts ──
      const rows = gsap.utils.toArray('.tp-feature');
      const cleanups = [];
      rows.forEach((row) => {
        const imageWrap = row.querySelector('.tp-feature-img');
        const info = row.querySelectorAll('.tp-feature-info > :not(.tp-feature-index)');
        const index = row.querySelector('.tp-feature-index');

        gsap.fromTo(imageWrap, { clipPath: 'circle(0% at 50% 50%)' }, {
          clipPath: 'circle(75% at 50% 50%)', ease: 'power3.inOut',
          scrollTrigger: { trigger: row, start: 'top 80%', end: '+=400', scrub: 1 },
        });
        gsap.fromTo(info, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 75%', end: '+=360', scrub: 1 },
        });
        gsap.fromTo(index, { yPercent: 40 }, {
          yPercent: -40, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
        });

        // The photo leans toward the cursor (mouse only)
        if (window.matchMedia('(hover: hover)').matches) {
          const onMove = (e) => {
            const rect = imageWrap.getBoundingClientRect();
            gsap.to(imageWrap, {
              x: (e.clientX - rect.left - rect.width / 2) * 0.04,
              y: (e.clientY - rect.top - rect.height / 2) * 0.04,
              duration: 0.5, ease: 'power2.out',
            });
          };
          const onLeave = () => gsap.to(imageWrap, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
          row.addEventListener('mousemove', onMove);
          row.addEventListener('mouseleave', onLeave);
          cleanups.push(() => {
            row.removeEventListener('mousemove', onMove);
            row.removeEventListener('mouseleave', onLeave);
          });
        }
      });

      // ── Closing call to action ──
      gsap.fromTo('.tp-cta-inner > :not(.tp-cta-title)', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.tp-cta', start: 'top 75%', once: true },
      });

      return () => cleanups.forEach((fn) => fn());
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const renderFeature = (p, reverse) => (
    <article className={`tp-feature${reverse ? ' is-reverse' : ''}`} key={p.name}>
      <div className="tp-feature-img">
        <img src={p.img} alt={p.name} />
      </div>
      <div className="tp-feature-info">
        <div className="tp-feature-index" aria-hidden="true">{indexOf(p)}</div>
        <div className="tp-feature-tag">{p.tag}</div>
        <h3 className="tp-feature-name">{p.name}</h3>
        <div className="tp-feature-role">{p.role}</div>
        <p className="tp-feature-bio">{p.bio}</p>
        {p.specialties && (
          <ul className="tp-feature-specialties">
            {p.specialties.map((s) => <li key={s}>{s}</li>)}
          </ul>
        )}
      </div>
    </article>
  );

  return (
    <div className="trainers-page home-bold" ref={pageRef}>
      {/* ── Hero ── */}
      <PageHero
        img="/gallery/team.webp"
        ghost="IRON"
        eyebrow="The Warriors Behind The Iron"
        title={<>Our <em>Team</em></>}
        tagline="The people who run the floor, set the standard and push you past your limits."
      />

      <SectionMarquee text="DISCIPLINE • COACHING • STRENGTH • NO EXCUSES • RESULTS" baseDirection={1} variant="gold" />

      {/* ── Founder ── */}
      <section className="tp-section tp-owner">
        <div className="tp-inner">
          <div className="tp-head">
            <div className="bold-eyebrow">The Visionary</div>
            <h2 className="tp-section-title bold-title" data-reveal>The <em>Founder</em></h2>
          </div>
          {renderFeature(owner, false)}
        </div>
      </section>

      {/* ── Management ── */}
      <section className="tp-section tp-management">
        <div className="tp-inner">
          <div className="tp-head">
            <div className="bold-eyebrow">Leadership</div>
            <h2 className="tp-section-title bold-title" data-reveal>Management <em>Team</em></h2>
          </div>
          {management.map((m) => renderFeature(m, true))}
        </div>
      </section>

      <SectionMarquee text="TRAIN HARD • STAY CONSISTENT • EARN IT • RISE" baseDirection={-1} />

      {/* ── Trainers ── */}
      <section className="tp-section tp-trainers">
        <div className="tp-inner">
          <div className="tp-head">
            <div className="bold-eyebrow">Meet The Beasts</div>
            <h2 className="tp-section-title bold-title" data-reveal>Our <em>Trainers</em></h2>
          </div>
          {trainers.map((t, i) => renderFeature(t, i % 2 === 1))}
        </div>
      </section>

      {/* ── Call to action ── */}
      <section className="tp-cta">
        <div className="tp-cta-inner">
          <div className="bold-eyebrow">Your Turn</div>
          <h2 className="tp-cta-title bold-title" data-reveal>Train With <em>The Team</em></h2>
          <p className="tp-cta-text">Walk in, meet the crew, and start your first session this week.</p>
          <div className="tp-cta-actions">
            <Link to="/pricing" className="tp-cta-btn gold-btn" data-magnetic>
              <span>View Plans</span>
            </Link>
            <Link to="/contact" className="tp-cta-btn tp-cta-btn--ghost" data-magnetic>
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
