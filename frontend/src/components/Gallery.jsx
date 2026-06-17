import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/gallery.css';

gsap.registerPlugin(ScrollTrigger);

const galleryItems = [
  {
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
    title: 'Competition Winners',
  },
  {
    img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
    title: 'Intense Training',
  },
  {
    img: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800&q=80',
    title: 'Transformation Stories',
  },
  {
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    title: 'Heavy Lifting',
  },
  {
    img: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80',
    title: 'Team Spirit',
  },
  {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    title: 'HIIT Sessions',
  },
];

export default function Gallery() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.gallery-label', {
        y: 30, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: '+=400', scrub: 1 },
      });

      gsap.fromTo('.gallery-title', {
        y: 60, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: '+=400', scrub: 1 },
      });

      // Gallery items — staggered scale + fade
      const items = document.querySelectorAll('.gallery-item');
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

      // Scroll-velocity skew effect
      let currentSkew = 0;
      let targetSkew = 0;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          targetSkew = self.getVelocity() / -300;
          targetSkew = gsap.utils.clamp(-5, 5, targetSkew);
        },
      });

      const skewTicker = () => {
        currentSkew += (targetSkew - currentSkew) * 0.1;
        items.forEach(item => {
          item.style.transform = `skewY(${currentSkew}deg)`;
        });
        targetSkew *= 0.9;
        requestAnimationFrame(skewTicker);
      };
      const rafId = requestAnimationFrame(skewTicker);

      return () => cancelAnimationFrame(rafId);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="gallery" id="gallery" ref={sectionRef}>
      <div className="gallery-inner">
        <div className="gallery-header">
          <div className="gallery-label">Inside The Floor</div>
          <h2 className="gallery-title">Moments In Motion</h2>
        </div>

        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <div className="gallery-item" key={i}>
              <img src={item.img} alt={item.title} />
              <div className="gallery-item-overlay">
                <div className="gallery-item-title">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
