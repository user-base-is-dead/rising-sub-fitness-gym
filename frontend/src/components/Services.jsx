import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/services.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: '01',
    icon: '🧘',
    title: 'Yoga',
    desc: 'Find your inner peace. Our yoga sessions blend traditional practices with modern techniques to build flexibility, strength, and mental clarity.',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  },
  {
    num: '02',
    icon: '🏋️',
    title: 'Personal Training',
    desc: 'One-on-one sessions with certified trainers who push you beyond your limits. Customized programs for maximum results.',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  },
  {
    num: '03',
    icon: '❤️‍🔥',
    title: 'Cardio Zone',
    desc: 'State-of-the-art cardio equipment engineered to torch calories and build endurance. From treadmills to battle ropes.',
    img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
  },
  {
    num: '04',
    icon: '💪',
    title: 'Bodybuilding',
    desc: 'Heavy iron, serious gains. Access to free weights, machines, and the aggressive environment you need to build a championship physique.',
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop only
      mm.add('(min-width: 769px)', () => {
        const track = trackRef.current;
        if (!track) return;

        const cards = track.querySelectorAll('.service-card');
        const totalScrollWidth = track.scrollWidth - window.innerWidth;
        const pauseDistance = window.innerHeight * 8; // 20 viewport heights of "pause"

        // Header reveal
        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        });

        headerTl.fromTo('.services-label', {
          y: 40,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        }, 0);

        headerTl.fromTo('.services-title', {
          y: 80,
          opacity: 0,
          skewY: 3,
        }, {
          y: 0,
          opacity: 1,
          skewY: 0,
          duration: 0.7,
          ease: 'power3.out',
        }, 0.1);

        // Main timeline: horizontal scroll + pause
        // The total pin distance = totalScrollWidth + pauseDistance
        // Timeline: 70% = horizontal scroll, 30% = nothing (hold)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalScrollWidth + pauseDistance}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Horizontal scroll — ~77% of physical scroll distance
        tl.to(track, {
          x: -totalScrollWidth,
          ease: 'none',
          duration: 10,
        }, 0);

        // Hold/pause — section stays pinned after last card (~23%)
        tl.to({}, { duration: 3 });

        // Card reveal + image parallax
        cards.forEach((card, i) => {
          const img = card.querySelector('.service-card-bg img');

          // Skip animation for first card — already visible when section pins
          if (i > 0) {
            gsap.fromTo(card, {
              opacity: 0,
              scale: 0.85,
            }, {
              opacity: 1,
              scale: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tl,
                start: 'left 100%',
                end: 'left 70%',
                scrub: true,
              },
            });
          }

          // Image parallax within card
          if (img) {
            gsap.to(img, {
              xPercent: -15,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tl,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            });
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services" id="services" ref={sectionRef}>
      {/* Header */}
      <div className="services-header">
        <div className="services-label">What We Offer</div>
        <h2 className="services-title">
          OUR <span className="outline-text">TRAINING</span> PROGRAMS
        </h2>
      </div>

      {/* Horizontal scroll track */}
      <div className="services-track" ref={trackRef}>
        {services.map((s, i) => (
          <div className="service-card" key={i}>
            <div className="service-card-bg">
              <img src={s.img} alt={s.title} />
            </div>
            <div className="service-card-number">{s.num}</div>
            <div className="service-card-content">
              <div className="service-card-icon">{s.icon}</div>
              <h3 className="service-card-title">{s.title}</h3>
              <p className="service-card-description">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
