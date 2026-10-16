import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Velocity-reactive marquee.
 * - Base auto-scroll driven by GSAP (seamless via 6 identical copies + xPercent -50)
 * - Scroll velocity speeds it up and skews the type
 * - Scroll direction flips travel direction
 */
export default function SectionMarquee({ text, baseDirection = 1 }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const items = gsap.utils.toArray('.marquee-item', track);

      // Seamless infinite roll
      const roll = gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        ease: 'none',
        duration: 28,
      });
      roll.timeScale(baseDirection);

      const skewClamp = gsap.utils.clamp(-16, 16);
      const speedClamp = gsap.utils.clamp(1, 5);
      const skewSetters = items.map((it) =>
        gsap.quickTo(it, 'skewX', { duration: 0.4, ease: 'power3' })
      );

      let dir = baseDirection;
      let targetSkew = 0;

      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity();
          dir = (self.direction === 1 ? 1 : -1) * baseDirection;
          roll.timeScale(dir * speedClamp(1 + Math.abs(v) / 500));
          targetSkew = skewClamp(v / -170);
        },
      });

      // Per-frame settle: skew + speed ease back toward rest
      const settle = () => {
        targetSkew *= 0.9;
        skewSetters.forEach((set) => set(targetSkew));
        const ts = roll.timeScale();
        roll.timeScale(ts + (dir - ts) * 0.04);
      };
      gsap.ticker.add(settle);

      return () => {
        gsap.ticker.remove(settle);
        st.kill();
        roll.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [baseDirection]);

  return (
    <div className="section-divider-marquee" ref={rootRef}>
      <div className="marquee-track" ref={trackRef}>
        {[...Array(6)].map((_, i) => (
          <span className="marquee-item" key={i}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
