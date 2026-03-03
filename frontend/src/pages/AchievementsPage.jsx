import { useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import '../styles/achievements-page.css';

gsap.registerPlugin(ScrollTrigger);

// ── Achievements Data ──
const competitions = [
  {
    title: 'MR. INDIA 2025',
    subtitle: 'National Bodybuilding Championship',
    location: 'New Delhi, India',
    date: 'August 2025',
    img: '/public/babu-compi1.jpeg',
    result: '🥇 GOLD MEDAL',
    athlete: 'Babu',
    category: 'Men\'s Physique — Under 80kg',
    description:
      'Our star trainer Babu dominated the national stage at MR. INDIA 2025, earning the coveted Gold Medal in Men\'s Physique. Competing against 150+ athletes from across the country, his razor-sharp conditioning and flawless posing left the judges speechless. A proud moment for Rising Sun Fitness.',
  },
  {
    title: 'MR. ODISHA 2025',
    subtitle: 'State-Level Bodybuilding Championship',
    location: 'Bhubaneswar, Odisha',
    date: 'May 2025',
    img: '/public/babu-compi2.jpeg',
    result: '🥈 SILVER MEDAL',
    athlete: 'Babu',
    category: 'Men\'s Physique — Overall',
    description:
      'Babu secured a well-deserved Silver at the prestigious MR. ODISHA championship. His incredible symmetry and stage presence earned him a top finish among the state\'s finest athletes, setting the stage for his national-level triumph later that year.',
  },
  {
    title: 'LIFELOOM CLASSIC 2026',
    subtitle: 'International Fitness Expo & Championship',
    location: 'Mumbai, India',
    date: 'January 2026',
    img: '/public/babu-compi3.jpeg',
    result: '🥇 GOLD + 🥈🥈 DOUBLE SILVER',
    athlete: 'Babu',
    category: 'Men\'s Physique & Classic Physique',
    description:
      'A legendary triple-medal performance at the Lifeloom Classic 2026. Babu claimed Gold in Men\'s Physique and two Silver medals in Classic Physique categories. This multi-category dominance proved his versatility and cemented his reputation as one of India\'s top competitive bodybuilders.',
  },
  {
    title: 'IP CLASSIC 2025',
    subtitle: 'Iron Paradise Classic Championship',
    location: 'Hyderabad, India',
    date: 'June 2025',
    img: '/public/babu-compi4.jpeg',
    result: '🥉 BRONZE MEDAL',
    athlete: 'Babu',
    category: 'Men\'s Physique — Open',
    description:
      'Competing against seasoned veterans at the Iron Paradise Classic, Babu earned a hard-fought Bronze Medal. The competition featured some of the toughest athletes in the southern circuit, making this podium finish a testament to his relentless training.',
  },
  {
    title: 'BFO7 CLASSIC 2025',
    subtitle: 'Body Fitness Olympia Classic',
    location: 'Bangalore, India',
    date: 'July 2025',
    img: '/public/babu-compi1.jpeg',
    result: '🥉 BRONZE MEDAL',
    athlete: 'Babu',
    category: 'Men\'s Physique — Under 80kg',
    description:
      'Another podium finish at the prestigious BFO7 Classic. Babu showcased exceptional muscle maturity and conditioning, earning Bronze among a stacked lineup of national-caliber competitors.',
  },
  {
    title: 'LIFELOOM CLASSIC 2025',
    subtitle: 'International Fitness Expo & Championship',
    location: 'Mumbai, India',
    date: 'January 2025',
    img: '/public/babu-compi2.jpeg',
    result: '🥈 SILVER + 🥉 BRONZE',
    athlete: 'Babu',
    category: 'Men\'s Physique & Classic Physique',
    description:
      'Babu\'s debut at the Lifeloom stage was nothing short of spectacular. Earning a Silver and Bronze across two categories, he announced himself as a force to be reckoned with on the national and international competitive circuit.',
  },
];

const stats = [
  { value: '6+', label: 'Championships' },
  { value: '10+', label: 'Medals Won' },
  { value: '3', label: 'Gold Medals' },
  { value: '#1', label: 'In State Ranking' },
];

export default function AchievementsPage() {
  const pageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {


    const ctx = gsap.context(() => {
      // ── Hero Animations ──
      gsap.fromTo('.ach-hero-label', {
        y: 40, opacity: 0, skewY: 3,
      }, {
        y: 0, opacity: 1, skewY: 0,
        duration: 1, ease: 'power3.out', delay: 0.3,
      });

      gsap.fromTo('.ach-hero-title', {
        y: 80, opacity: 0,
      }, {
        y: 0, opacity: 1,
        duration: 1.2, ease: 'power3.out', delay: 0.5,
      });

      gsap.fromTo('.ach-hero-line', {
        scaleX: 0,
      }, {
        scaleX: 1,
        duration: 1.2, ease: 'power3.inOut', delay: 0.8,
      });

      // ── Stats Counter Animation ──
      const statItems = gsap.utils.toArray('.ach-stat-item');
      statItems.forEach((item, i) => {
        gsap.fromTo(item, {
          y: 50, opacity: 0, scale: 0.8,
        }, {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, ease: 'back.out(1.5)',
          delay: 0.9 + i * 0.15,
        });
      });

      // ── Competition Cards ──
      const cards = gsap.utils.toArray('.ach-comp-card');
      cards.forEach((card, i) => {
        const imgWrap = card.querySelector('.ach-comp-img-wrap');
        const info = card.querySelector('.ach-comp-info');
        const badge = card.querySelector('.ach-result-badge');

        // Image reveal
        gsap.fromTo(imgWrap, {
          clipPath: i % 2 === 0
            ? 'polygon(0 0, 0 0, 0 100%, 0 100%)'
            : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
        }, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });

        // Info slide in
        gsap.fromTo(info, {
          x: i % 2 === 0 ? 60 : -60, opacity: 0,
        }, {
          x: 0, opacity: 1,
          duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });

        // Result badge pop
        if (badge) {
          gsap.fromTo(badge, {
            scale: 0, rotation: -15,
          }, {
            scale: 1, rotation: 0,
            duration: 0.6, ease: 'back.out(2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });

      // ── Gallery Photos ──
      const galleryItems = gsap.utils.toArray('.ach-gallery-item');
      galleryItems.forEach((item, i) => {
        gsap.fromTo(item, {
          y: 60, opacity: 0, scale: 0.9,
        }, {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: '.ach-gallery',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // ── Section Titles ──
      gsap.utils.toArray('.ach-section-title').forEach((title) => {
        gsap.fromTo(title, {
          y: 50, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="achievements-page" ref={pageRef}>
      {/* ── Hero Banner ── */}
      <section className="ach-hero">
        <div className="ach-hero-bg" />
        <div className="ach-hero-overlay" />
        <div className="ach-hero-content">
          <div className="ach-hero-label">Glory Earned Through Iron & Sweat</div>
          <h1 className="ach-hero-title">OUR <span className="highlight">ACHIEVEMENTS</span></h1>
          <div className="ach-hero-line" />
        </div>

        {/* Stats Bar */}
        <div className="ach-stats-bar">
          {stats.map((s, i) => (
            <div className="ach-stat-item" key={i}>
              <div className="ach-stat-value">{s.value}</div>
              <div className="ach-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competitions Section ── */}
      <section className="ach-competitions">
        <div className="ach-competitions-inner">
          <div className="ach-section-label">Hall of Champions</div>
          <h2 className="ach-section-title">COMPETITION <span className="highlight">VICTORIES</span></h2>

          <div className="ach-comp-list">
            {competitions.map((comp, i) => (
              <div className={`ach-comp-card ${i % 2 === 0 ? 'left' : 'right'}`} key={i}>
                <div className="ach-comp-img-wrap">
                  <img src={comp.img} alt={comp.title} />
                  <div className="ach-comp-date-badge">{comp.date}</div>
                </div>
                <div className="ach-comp-info">
                  <div className="ach-comp-subtitle">{comp.subtitle}</div>
                  <h3 className="ach-comp-title">{comp.title}</h3>
                  <div className="ach-comp-meta">
                    <span className="ach-comp-location">📍 {comp.location}</span>
                    <span className="ach-comp-category">🏋️ {comp.category}</span>
                  </div>
                  <div className="ach-result-badge">{comp.result}</div>
                  <div className="ach-comp-athlete">
                    Athlete: <span>{comp.athlete}</span>
                  </div>
                  <p className="ach-comp-desc">{comp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Section ── */}
      <section className="ach-gallery-section">
        <div className="ach-gallery-inner">
          <div className="ach-section-label">Behind The Scenes</div>
          <h2 className="ach-section-title">COMPETITION <span className="highlight">GALLERY</span></h2>
          <div className="ach-gallery">
            <div className="ach-gallery-item tall">
              <img src="/achievement-stage.png" alt="Stage Performance" />
              <div className="ach-gallery-caption">Stage Domination</div>
            </div>
            <div className="ach-gallery-item">
              <img src="/achievement-winners.png" alt="Winners Podium" />
              <div className="ach-gallery-caption">Podium Glory</div>
            </div>
            <div className="ach-gallery-item">
              <img src="/achievement-backstage.png" alt="Backstage Prep" />
              <div className="ach-gallery-caption">Backstage Preparation</div>
            </div>
            <div className="ach-gallery-item wide">
              <img src="/achievement-winners.png" alt="Team Celebration" />
              <div className="ach-gallery-caption">Rising Sun Athletes</div>
            </div>
            <div className="ach-gallery-item">
              <img src="/achievement-stage.png" alt="Posing Routine" />
              <div className="ach-gallery-caption">Posing Routine</div>
            </div>
            <div className="ach-gallery-item">
              <img src="/achievement-backstage.png" alt="Training Camp" />
              <div className="ach-gallery-caption">Competition Prep Camp</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="ach-cta">
        <div className="ach-cta-inner">
          <h2 className="ach-cta-title">TRAIN WITH <span className="highlight">CHAMPIONS</span></h2>
          <p className="ach-cta-text">
            Our competition-winning trainers bring the same intensity and discipline to every training session.
            Ready to transform your physique? Join Rising Sun Fitness today.
          </p>
          <a className="ach-cta-btn" onClick={() => navigate('/contact')}>JOIN NOW →</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
