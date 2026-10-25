import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSplitReveal } from '../hooks/useMotion';
import '../styles/gallery.css';

gsap.registerPlugin(ScrollTrigger);

// First item fills the 2x2 feature tile
const galleryItems = [
  { img: '/gallery/team.webp', title: 'Team Spirit' },
  { img: '/gallery/leg-day.webp', title: 'Leg Day' },
  { img: '/gallery/heavy-squat.webp', title: 'Heavy Lifting' },
  { img: '/gallery/cardio.webp', title: 'Cardio Grind' },
  { img: '/gallery/focus.webp', title: 'Locked In' },
  { img: '/gallery/strength-floor.webp', title: 'Strength Floor' },
];

// Phones and tablets get a swipeable carousel instead of the bento grid
const CAROUSEL_QUERY = '(max-width: 1024px)';

function useIsCarousel() {
  const [isCarousel, setIsCarousel] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(CAROUSEL_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(CAROUSEL_QUERY);
    const onChange = (e) => setIsCarousel(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isCarousel;
}

export default function Gallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const isCarousel = useIsCarousel();

  useSplitReveal(sectionRef);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.gallery-label', {
        y: 30, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: '+=400', scrub: 1 },
      });

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1025px)', () => {
        // Gallery items — staggered scale + fade
        const items = gsap.utils.toArray('.gallery-item');
        items.forEach((item, i) => {
          gsap.fromTo(item, {
            scale: 0.8,
            opacity: 0,
            rotateZ: i % 2 === 0 ? -3 : 3,
          }, {
            scale: 1,
            opacity: 1,
            rotateZ: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: '+=400', scrub: 1,
            },
            delay: i * 0.1,
          });
        });

        // Scroll-velocity skew effect — only ticking while the section is on
        // screen. Set through GSAP so it composes with the reveal.
        const setSkew = gsap.quickSetter(items, 'skewY', 'deg');
        let currentSkew = 0;
        let targetSkew = 0;

        const skewTicker = () => {
          currentSkew += (targetSkew - currentSkew) * 0.1;
          targetSkew *= 0.9;
          setSkew(currentSkew);
        };

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            targetSkew = gsap.utils.clamp(-5, 5, self.getVelocity() / -300);
          },
          onToggle: (self) => {
            if (self.isActive) gsap.ticker.add(skewTicker);
            else gsap.ticker.remove(skewTicker);
          },
        });

        return () => gsap.ticker.remove(skewTicker);
      });

      // Carousel — the strip slides in from the right once
      mm.add(CAROUSEL_QUERY, () => {
        gsap.from('.gallery-carousel', {
          x: 80,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gallery-carousel', start: 'top 88%', once: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isCarousel]);

  // Endless loop: the strip holds three copies of the photos. Start in the
  // middle copy, and whenever a swipe settles in an outer copy, jump by one
  // copy's width — the same photo is under the finger, so the jump is invisible.
  useEffect(() => {
    if (!isCarousel) return;
    const track = trackRef.current;
    if (!track) return;

    // Distance from the first photo to its twin in the middle copy
    const setWidth = () => {
      const items = track.children;
      return items[galleryItems.length].offsetLeft - items[0].offsetLeft;
    };
    track.scrollLeft = setWidth();

    let settleTimer;
    const recentre = () => {
      const w = setWidth();
      if (track.scrollLeft < w * 0.5) track.scrollLeft += w;
      else if (track.scrollLeft >= w * 1.5) track.scrollLeft -= w;
    };
    // `scrollend` isn't in every mobile browser yet; a short idle timer covers the rest
    const onScroll = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(recentre, 140);
    };
    const onResize = () => { track.scrollLeft = setWidth(); };

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(settleTimer);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [isCarousel]);

  const renderItem = (item, key, hidden) => (
    <div className="gallery-item" key={key} aria-hidden={hidden || undefined}>
      <img src={item.img} alt={hidden ? '' : item.title} loading="lazy" decoding="async" />
      <div className="gallery-item-overlay">
        <div className="gallery-item-title">{item.title}</div>
      </div>
    </div>
  );

  return (
    <section className="gallery" id="gallery" ref={sectionRef}>
      <div className="gallery-inner">
        <div className="gallery-header">
          <div className="gallery-label bold-eyebrow">Inside The Floor</div>
          <h2 className="gallery-title bold-title" data-reveal>Moments <em>In Motion</em></h2>
        </div>

        {isCarousel ? (
          <div className="gallery-carousel">
            <div className="gallery-track" ref={trackRef}>
              {[0, 1, 2].flatMap((copy) =>
                galleryItems.map((item, i) => renderItem(item, `${copy}-${i}`, copy !== 1)),
              )}
            </div>
            <div className="gallery-swipe-hint" aria-hidden="true">
              <span>Swipe</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h16m-5-5 5 5-5 5"/></svg>
            </div>
          </div>
        ) : (
          <div className="gallery-grid">
            {galleryItems.map((item, i) => renderItem(item, i, false))}
          </div>
        )}
      </div>
    </section>
  );
}
