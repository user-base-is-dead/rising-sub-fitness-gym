import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import '../styles/achievements-page.css';

gsap.registerPlugin(ScrollTrigger);

// ── Filter buttons config ──
const FILTERS = [
  { key: 'gym', label: 'Gym' },
  { key: 'susanta', label: 'Susanta' },
  { key: 'babu', label: 'Babu' },
  { key: 'masum', label: 'Masum' },
  { key: 'amarjit', label: 'Amarjit' },
];

// ── Babu's Achievements Data ──
const babuCompetitions = [
  {
    title: 'MR. INDIA 2025',
    subtitle: 'National Bodybuilding Championship',
    location: 'New Delhi, India',
    date: 'August 2025',
    img: '/babu-compi1.jpeg',
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
    img: '/babu-compi2.jpeg',
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
    img: '/babu-compi3.jpeg',
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
    img: '/babu-compi4.jpeg',
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
    img: '/babu-compi1.jpeg',
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
    img: '/babu-compi2.jpeg',
    result: '🥈 SILVER + 🥉 BRONZE',
    athlete: 'Babu',
    category: 'Men\'s Physique & Classic Physique',
    description:
      'Babu\'s debut at the Lifeloom stage was nothing short of spectacular. Earning a Silver and Bronze across two categories, he announced himself as a force to be reckoned with on the national and international competitive circuit.',
  },
];

// ── Susanta's Dummy Achievements (using Babu's photos) ──
const susantaCompetitions = [
  {
    title: 'MR. EAST INDIA 2025',
    subtitle: 'Eastern Zone Bodybuilding Championship',
    location: 'Kolkata, India',
    date: 'March 2025',
    img: '/babu-compi1.jpeg',
    result: '🥇 GOLD MEDAL',
    athlete: 'Susanta',
    category: 'Men\'s Physique — Under 75kg',
    description:
      'Susanta made his mark at the MR. EAST INDIA championship, delivering an outstanding performance that earned him the Gold. His disciplined posing and incredible stage confidence left the audience in awe.',
  },
  {
    title: 'ODISHA CLASSIC 2025',
    subtitle: 'State Classic Bodybuilding Championship',
    location: 'Cuttack, Odisha',
    date: 'April 2025',
    img: '/babu-compi2.jpeg',
    result: '🥈 SILVER MEDAL',
    athlete: 'Susanta',
    category: 'Classic Physique — Open',
    description:
      'At the Odisha Classic, Susanta showcased his elegant proportions and symmetry. Competing in the Classic Physique division, he earned a Silver medal with a routine that highlighted his aesthetic build.',
  },
  {
    title: 'IRON WARRIOR CUP 2025',
    subtitle: 'National Fitness Competition',
    location: 'Pune, India',
    date: 'September 2025',
    img: '/babu-compi3.jpeg',
    result: '🥇 GOLD MEDAL',
    athlete: 'Susanta',
    category: 'Men\'s Physique — Overall',
    description:
      'Susanta dominated the Iron Warrior Cup with sheer determination and peak conditioning. His overall package was unmatched, earning him another Gold medal and solidifying his position among the top athletes.',
  },
  {
    title: 'SUNRISE CHAMPIONSHIP 2025',
    subtitle: 'Inter-State Bodybuilding Event',
    location: 'Raipur, India',
    date: 'November 2025',
    img: '/babu-compi4.jpeg',
    result: '🥉 BRONZE MEDAL',
    athlete: 'Susanta',
    category: 'Men\'s Physique — Under 80kg',
    description:
      'A tough competition at the Sunrise Championship saw Susanta earning a Bronze among national-level talent. His dedication and sportsmanship shone through in every round.',
  },
];

// ── Masum's Dummy Achievements (using Babu's photos) ──
const masumCompetitions = [
  {
    title: 'EASTERN CLASSIC 2025',
    subtitle: 'Regional Bodybuilding Championship',
    location: 'Patna, India',
    date: 'February 2025',
    img: '/babu-compi1.jpeg',
    result: '🥇 GOLD MEDAL',
    athlete: 'Masum',
    category: 'Men\'s Physique — Under 70kg',
    description:
      'Masum kicked off 2025 with a dominating Gold at the Eastern Classic. His incredible definition and stage presence earned him the top spot in a highly competitive category.',
  },
  {
    title: 'BHARAT MUSCLE FEST 2025',
    subtitle: 'National Muscle & Fitness Expo',
    location: 'Lucknow, India',
    date: 'June 2025',
    img: '/babu-compi2.jpeg',
    result: '🥈 SILVER MEDAL',
    athlete: 'Masum',
    category: 'Classic Physique — Under 75kg',
    description:
      'Masum\'s balanced physique and confident posing earned him a Silver medal at the Bharat Muscle Fest. Competing against some of the best in the nation, he proved he belongs on the big stage.',
  },
  {
    title: 'STEEL CITY SHOWDOWN 2025',
    subtitle: 'East Zone Fitness Championship',
    location: 'Jamshedpur, India',
    date: 'August 2025',
    img: '/babu-compi3.jpeg',
    result: '🥇 GOLD + 🥉 BRONZE',
    athlete: 'Masum',
    category: 'Men\'s Physique & Classic Physique',
    description:
      'A dual-category performance at the Steel City Showdown. Masum claimed Gold in Men\'s Physique and added a Bronze in Classic, showcasing his versatility and determination.',
  },
  {
    title: 'KONARK CLASSIC 2025',
    subtitle: 'Odisha State Bodybuilding Championship',
    location: 'Bhubaneswar, Odisha',
    date: 'October 2025',
    img: '/babu-compi4.jpeg',
    result: '🥈 SILVER MEDAL',
    athlete: 'Masum',
    category: 'Men\'s Physique — Open',
    description:
      'Masum impressed everyone at the Konark Classic with his sharp conditioning and aesthetic proportions. His Silver medal finish was well-deserved among stiff competition from across the state.',
  },
];

// ── Amarjit's "Achievements" (Roasts 😂) ──
const amarjitRoasts = [
  { emoji: '🏆', title: 'Aura in Debt', desc: 'Negative aura balance since birth. Owes the universe 10,000 aura points. Every room he enters loses its vibe instantly.' },
  { emoji: '🎯', title: 'No Goal', desc: 'Successfully avoided setting any goals since day 1. Planning is overrated when you can just wing it and still fail.' },
  { emoji: '💪', title: 'No Gain Only Pain', desc: 'World record holder in suffering without any visible gains. 3 years of gym, body still says "beginner."' },
  { emoji: '💉', title: 'Steroid Enjoyer', desc: 'Honorary lifetime member of the supplement aisle. Knows every pre-workout flavor but can\'t bench his bodyweight.' },
  { emoji: '🥇', title: 'Gym Selfie Champion', desc: 'More selfies than reps. Instagram game strong, bicep game non-existent. Filter does more work than he does.' },
  { emoji: '🏋️', title: 'Warm-Up Set Champion', desc: 'Never made it past the warm-up in 3 years of "training." Thinks 5kg dumbbells are heavy. The bar is literally his max.' },
  { emoji: '📱', title: 'Phone Marathon Winner', desc: '2 hours scrolling reels on the bench, 10 minutes of actual lifting. Has seen every gym meme but never applied any of them.' },
  { emoji: '🍕', title: 'Cheat Day CEO', desc: 'Every day is cheat day. Has a diet plan that he\'s been starting "next Monday" for 14 months. Biryani is his pre-workout.' },
  { emoji: '😤', title: 'Excuses Hall of Fame', desc: '"Bro I\'ll start Monday" — said every Monday since 2023. Also: "I\'m on a bulk" (forever). "Genetics bro" is his favorite phrase.' },
  { emoji: '🪞', title: 'Mirror Flexing Gold Medalist', desc: 'Only flexes when nobody is watching. Bathroom mirror has seen more poses than any stage. Still can\'t see any abs.' },
  { emoji: '😴', title: 'Rest Day Specialist', desc: 'Takes rest days between rest days. Recovery game is elite — if only he had something to recover from.' },
  { emoji: '🧃', title: 'Protein Shake Poser', desc: 'Carries shaker bottle everywhere but it\'s always empty. The shaker is just a fashion accessory at this point.' },
];

// ── Stats data ──
const babuStats = [
  { value: '6+', label: 'Championships' },
  { value: '10+', label: 'Medals Won' },
  { value: '3', label: 'Gold Medals' },
  { value: '#1', label: 'In State Ranking' },
];

const susantaStats = [
  { value: '4+', label: 'Championships' },
  { value: '5+', label: 'Medals Won' },
  { value: '2', label: 'Gold Medals' },
  { value: 'Top 5', label: 'In State Ranking' },
];

const masumStats = [
  { value: '4+', label: 'Championships' },
  { value: '5+', label: 'Medals Won' },
  { value: '2', label: 'Gold Medals' },
  { value: 'Top 5', label: 'In State Ranking' },
];

const gymStats = [
  { value: '14+', label: 'Championships' },
  { value: '20+', label: 'Medals Won' },
  { value: '7', label: 'Gold Medals' },
  { value: '#1', label: 'Gym In State' },
];

function getStats(filter) {
  switch (filter) {
    case 'babu': return babuStats;
    case 'susanta': return susantaStats;
    case 'masum': return masumStats;
    default: return gymStats;
  }
}

function getCompetitions(filter) {
  switch (filter) {
    case 'babu': return babuCompetitions;
    case 'susanta': return susantaCompetitions;
    case 'masum': return masumCompetitions;
    case 'gym': return [...babuCompetitions, ...susantaCompetitions, ...masumCompetitions];
    default: return [];
  }
}

export default function AchievementsPage() {
  const pageRef = useRef(null);
  const contentRef = useRef(null);
  const filterBarRef = useRef(null);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('gym');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFilters = useCallback(() => {
    if (filterBarRef.current) {
      const offset = filterBarRef.current.offsetTop;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, []);

  // Re-run GSAP animations when filter changes
  useEffect(() => {
    // Small delay so DOM updates first
    const timeout = setTimeout(() => {
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

        // ── Amarjit Roast Cards ──
        const roastCards = gsap.utils.toArray('.amarjit-roast-card');
        roastCards.forEach((card, i) => {
          gsap.fromTo(card, {
            y: 60, opacity: 0, scale: 0.85, rotateX: 15,
          }, {
            y: 0, opacity: 1, scale: 1, rotateX: 0,
            duration: 0.7, ease: 'back.out(1.4)',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: '.amarjit-roast-grid',
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
        });

        // ── Amarjit Hero ──
        gsap.fromTo('.amarjit-hero-photo', {
          scale: 0.7, opacity: 0, rotation: -10,
        }, {
          scale: 1, opacity: 1, rotation: 0,
          duration: 1.2, ease: 'elastic.out(1, 0.5)',
          delay: 0.3,
        });

        gsap.fromTo('.amarjit-hero-title', {
          y: 60, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 1, ease: 'power3.out',
          delay: 0.5,
        });

      }, contentRef);

      // Refresh ScrollTrigger so Footer animations recalculate positions
      setTimeout(() => ScrollTrigger.refresh(), 100);

      return () => ctx.revert();
    }, 50);

    return () => clearTimeout(timeout);
  }, [activeFilter]);

  const competitions = getCompetitions(activeFilter);
  const stats = getStats(activeFilter);

  return (
    <div className="achievements-page" ref={pageRef}>
      <div ref={contentRef}>
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
        {activeFilter !== 'amarjit' && (
          <div className="ach-stats-bar">
            {stats.map((s, i) => (
              <div className="ach-stat-item" key={i}>
                <div className="ach-stat-value">{s.value}</div>
                <div className="ach-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Filter Buttons ── */}
      <div className="ach-filter-bar" ref={filterBarRef}>
        <div className="ach-filter-inner">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`ach-filter-btn ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Amarjit Roast Section ── */}
      {activeFilter === 'amarjit' && (
        <section className="amarjit-section">
          <div className="amarjit-hero">
            <div className="amarjit-hero-photo-wrap">
              <img className="amarjit-hero-photo" src="/amarjit.jpg" alt="Amarjit — The Legend" />
              <div className="amarjit-photo-glow" />
            </div>
            <h2 className="amarjit-hero-title">
              THE LEGEND OF <span className="highlight-red">AMARJIT</span>
            </h2>
            <p className="amarjit-hero-subtitle">⚠️ Viewer Discretion Advised — These "achievements" are 100% certified real ⚠️</p>
          </div>

          <div className="amarjit-roast-grid">
            {amarjitRoasts.map((roast, i) => (
              <div className="amarjit-roast-card" key={i}>
                <div className="amarjit-roast-emoji">{roast.emoji}</div>
                <h3 className="amarjit-roast-title">{roast.title}</h3>
                <p className="amarjit-roast-desc">{roast.desc}</p>
                <div className="amarjit-roast-badge">Certified Moment™</div>
              </div>
            ))}
          </div>

          <div className="amarjit-bottom-banner">
            <p>🫡 Despite all this, Amarjit still shows up. Respect the grind (or whatever he's doing).</p>
          </div>
        </section>
      )}

      {/* ── Competitions Section (for gym, babu, susanta, masum) ── */}
      {activeFilter !== 'amarjit' && competitions.length > 0 && (
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
      )}

      {/* ── Gallery Section (only for gym view) ── */}
      {activeFilter === 'gym' && (
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
      )}

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

      {/* ── Scroll-to-Top Arrow ── */}
      <button
        className={`ach-scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToFilters}
        aria-label="Scroll to filter buttons"
      >
        ↑
      </button>
      </div>

      <Footer />
    </div>
  );
}
