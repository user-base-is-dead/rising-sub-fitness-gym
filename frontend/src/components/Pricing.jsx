import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/pricing.css';

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.pricing-label', {
        y: 30, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      });

      gsap.fromTo('.pricing-title', {
        y: 60, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      });

      // Cards — 3D flip-in
      const cards = document.querySelectorAll('.pricing-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card, {
          rotateX: 30,
          y: 80,
          opacity: 0,
          transformPerspective: 800,
        }, {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          delay: i * 0.2,
        });
      });

      // Counter animation for pricing values
      const vals = document.querySelectorAll('.pricing-value');
      vals.forEach(val => {
        const target = parseInt(val.getAttribute('data-value'));
        const prefix = val.getAttribute('data-prefix') || '';
        const obj = { v: 0 };

        ScrollTrigger.create({
          trigger: val,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              v: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                val.textContent = prefix + Math.round(obj.v);
              },
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="pricing" id="pricing" ref={sectionRef}>
      <div className="pricing-inner">
        <div className="pricing-header">
          <div className="pricing-label">Investment In Yourself</div>
          <h2 className="pricing-title">MEMBERSHIP PLANS</h2>
        </div>

        <div className="pricing-cards">
          {/* Monthly Plan */}
          <div className="pricing-card featured">
            <div className="pricing-badge">Popular</div>
            <div className="pricing-card-type">Monthly</div>
            <div className="pricing-amount">
              <span className="pricing-currency">₹</span>
              <span className="pricing-value" data-value="800" data-prefix="">0</span>
            </div>
            <div className="pricing-period">per month</div>
            <div className="pricing-features">
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>Full Gym Access</span>
              </div>
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>All Training Zones</span>
              </div>
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>Cardio Equipment</span>
              </div>
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>Free Weights Area</span>
              </div>
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>Morning & Evening Slots</span>
              </div>
            </div>
            <button className="pricing-cta">Start Training</button>
          </div>

          {/* Admission */}
          <div className="pricing-card">
            <div className="pricing-card-type">Admission Fee</div>
            <div className="pricing-amount">
              <span className="pricing-currency">₹</span>
              <span className="pricing-value" data-value="0" data-prefix="">0</span>
            </div>
            <div className="pricing-period">one-time payment</div>
            <div className="pricing-features">
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>Registration & Onboarding</span>
              </div>
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>Fitness Assessment</span>
              </div>
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>Training Plan Setup</span>
              </div>
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>Gym Orientation Tour</span>
              </div>
              <div className="pricing-feature">
                <span className="check">✓</span>
                <span>Lifetime Membership</span>
              </div>
            </div>
            <button className="pricing-cta">Register Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
