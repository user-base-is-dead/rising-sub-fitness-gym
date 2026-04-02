import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/pricing.css';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_NUMBER = '916380816041';

const getWhatsAppUrl = (msg) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

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
        const start = parseInt(val.getAttribute('data-start') || '0');
        const prefix = val.getAttribute('data-prefix') || '';
        const obj = { v: start };
        let counterTween = null;

        val.textContent = prefix + start;

        ScrollTrigger.create({
          trigger: val,
          start: 'top 80%',
          onEnter: () => {
            if (counterTween) counterTween.kill();
            counterTween = gsap.to(obj, {
              v: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                val.textContent = prefix + Math.round(obj.v);
              },
            });
          },
          onLeaveBack: () => {
            if (counterTween) counterTween.kill();
            counterTween = gsap.to(obj, {
              v: start,
              duration: 1,
              ease: 'power2.in',
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
          {/* Admission — Surprise! */}
          <div className="pricing-card">
            <div className="pricing-badge">Surprise!</div>
            <div className="pricing-card-type">Admission Fee</div>
            <div className="pricing-amount">
              <span className="pricing-currency">₹</span>
              <span className="pricing-value" data-value="0" data-start="1500" data-prefix="">1500</span>
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
            <button className="pricing-cta" onClick={() => window.open(getWhatsAppUrl(`Hi! I'm interested in joining Rising Sun Fitness. I'd like to know about the admission process and get registered.`), '_blank')}>Register Now</button>
          </div>

          {/* 1 Day Pass */}
          <div className="pricing-card">
            <div className="pricing-card-type">1 Day Pass</div>
            <div className="pricing-amount">
              <span className="pricing-currency">₹</span>
              <span className="pricing-value" data-value="100" data-prefix="">0</span>
            </div>
            <div className="pricing-period">per day</div>
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
            <button className="pricing-cta" onClick={() => window.open(getWhatsAppUrl(`Hi! I'd like to try a *1 Day Pass* at Rising Sun Fitness for ₹100. When can I come in for my session?`), '_blank')}>Try Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
