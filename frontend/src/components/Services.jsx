import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/services.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 4c2.5 2 2.5 5 0 7s-2.5 5 0 7M8 7c1.5 1.2 1.5 3 0 4.2M16 7c-1.5 1.2-1.5 3 0 4.2"/></svg>
    ),
    title: 'Yoga & Mobility',
    desc: 'Restorative sessions that blend traditional practice with modern movement science to build flexibility, balance, and mental clarity.',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="6" r="2.4"/><path d="M12 8.4V14m0 0-4 6m4-6 4 6M7 11h10"/></svg>
    ),
    title: 'Personal Training',
    desc: 'One-to-one coaching with certified trainers. Programmes are tailored to your body, goals, and pace for measured, lasting results.',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 13h3l2-5 4 10 3-7 2 2h4"/></svg>
    ),
    title: 'Cardio & Conditioning',
    desc: 'A considered cardio floor engineered to build endurance and resilience — from treadmills and rowers to functional conditioning.',
    img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6.5 9.5h11v5h-11z"/><path d="M3 8v8M6.5 7v10M17.5 7v10M21 8v8"/></svg>
    ),
    title: 'Strength & Bodybuilding',
    desc: 'Serious iron, serious intent. Full access to free weights, machines, and the focused environment needed to build a complete physique.',
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop only
      mm.add('(min-width: 769px)', () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;

        // Sticky horizontal scroll — native CSS `position: sticky` (NOT GSAP pin).
        // The viewport stays in view so the cards slide all the way through
        // before the section releases, but the scroll never hard-locks or jerks.
        const getShift = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
        const setHeight = () => {
          pin.style.height = `${window.innerHeight + getShift()}px`;
        };
        setHeight();

        gsap.to(track, {
          x: () => -getShift(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: setHeight,
          },
        });

        // Header reveal as the section enters
        gsap.fromTo('.services-header', {
          y: 40,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top 90%',
            end: 'top 55%',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="services-pin" ref={pinRef}>
        <div className="services-viewport">
          {/* Header */}
          <div className="services-header">
            <div className="services-label">What We Offer</div>
            <h2 className="services-title">
              Training <span className="outline-text">Disciplines</span>
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
        </div>
      </div>
    </section>
  );
}
