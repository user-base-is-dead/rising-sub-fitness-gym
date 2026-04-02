import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import '../styles/pricing-page.css';

gsap.registerPlugin(ScrollTrigger);

// ── Plans Data ──
const plans = [
  {
    name: '1 Day Pass',
    price: 100,
    period: 'per day',
    badge: null,
    featured: false,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      'Morning & Evening Slots',
    ],
    cta: 'Try Now',
    whatsappMsg: `Hi! I'd like to try a *1 Day Pass* at Rising Sun Fitness for ₹100. When can I come in for my session?`,
  },
  {
    name: 'Monthly',
    price: 800,
    period: 'per month',
    badge: null,
    featured: true,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      'Morning & Evening Slots',
    ],
    cta: 'Start Training',
    whatsappMsg: `Hello! I want to start my fitness journey with the *Monthly Plan* at ₹800/month. How do I sign up?`,
  },
  {
    name: 'Quarterly',
    price: 2500,
    period: 'per 3 months (+ 1 month free)',
    badge: null,
    featured: false,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      'Morning & Evening Slots',
      '1 Month Free Membership'
    ],
    cta: 'Choose Plan',
    whatsappMsg: `Hey! I'm interested in the *Quarterly Plan* (₹2500 for 3 months + 1 month free). Please let me know how to get started!`,
  },
  {
    name: '6 Months',
    price: 4000,
    period: 'per 6 months (+ 2 month free)',
    badge: null,
    featured: false,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      'Morning & Evening Slots',
      '1 Month Free Membership'
    ],
    cta: 'Choose Plan',
    whatsappMsg: `Hello! I'd like to go with the *6 Months Plan* at ₹4000 (+ 2 months free). Can you share the registration details?`,
  },
  {
    name: 'Yearly',
    price: 9000,
    period: 'per year (+ 4 month free)',
    badge: null,
    featured: false,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      '4 Free PT Sessions',
      'Diet Plan Included',
      'Priority Support',
    ],
    cta: 'Choose Plan',
    whatsappMsg: `Hi! I'm ready to commit to the *Yearly Plan* at ₹9000 (+ 4 months free) with PT sessions and diet plan included. How do I register?`,
  },
  {
    name: 'Personal Trainer',
    price: 3500,
    period: 'per month',
    badge: null,
    featured: false,
    features: [
      'From Diet to Training, Everything will be cared',
      
    ],
    cta: 'Hire Now',
    whatsappMsg: `Hello! I want to hire a *Personal Trainer* at ₹3500/month. Can you tell me more about the trainers and schedule?`,
  },
];

// ── Comparison Data ──
const compareFeatures = [
  { name: 'Full Gym Access', daily: true, monthly: true, quarterly: true, sixMonth: true, yearly: true },
  { name: 'All Training Zones', daily: true, monthly: true, quarterly: true, sixMonth: true, yearly: true },
  { name: 'Cardio Equipment', daily: true, monthly: true, quarterly: true, sixMonth: true, yearly: true },
  { name: 'Free Weights Area', daily: true, monthly: true, quarterly: true, sixMonth: true, yearly: true },
  { name: 'Free PT Sessions', daily: false, monthly: false, quarterly: '1 Session', sixMonth: '2 Sessions', yearly: '4 Sessions' },
  { name: 'Diet Consultation', daily: false, monthly: false, quarterly: true, sixMonth: true, yearly: true },
  { name: 'Diet Plan Included', daily: false, monthly: false, quarterly: false, sixMonth: false, yearly: true },
  { name: 'Priority Support', daily: false, monthly: false, quarterly: false, sixMonth: false, yearly: true },
  { name: 'Locker Facility', daily: false, monthly: false, quarterly: true, sixMonth: true, yearly: true },
];

// ── FAQ Data ──
const faqs = [
  {
    q: 'What are the gym timings?',
    a: 'We are open All days from 5:00 AM to 12:00 PM, and 4:00 PM to 11:00 PM.',
  },
  {
    q: 'Can I freeze or pause my membership?',
    a: 'No, you cannot freeze your membership.',
  },
  {
    q: 'Is there any other secret admission fee?',
    a: 'No, there is no secret charges or admission fees',
  },
  {
    q: 'Do I need to pay the admission fee again if I rejoin?',
    a: 'No, as the admission cost is 0 rupees so you need not pay any price on rejoin',
  },
  {
    q: 'Are personal training sessions included?',
    a: 'The monthly plan uses group coaching. Quarterly includes 1 free PT session, and Yearly includes 4. Additional PT sessions can be purchased separately.',
  },
  {
    q: 'Is there a trial class available?',
    a: 'Yes! We offer a free 1-day trial. Walk in anytime during gym hours with a valid ID to try us out.',
  },
];

const WHATSAPP_NUMBER = '916380816041';

const getWhatsAppUrl = (msg) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export default function PricingPage() {
  const pageRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (i) => {
    setOpenFaq(openFaq === i ? null : i);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // ── Swipe Slider / Layered Pinning Effect (Desktop Only) ──
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1025px)', () => {
        const swipeSections = gsap.utils.toArray('section.pp-swipe-panel');
        swipeSections.forEach((section, i) => {
          if (i !== swipeSections.length - 1) {
            section.style.marginBottom = '50vh';

            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              pin: true,
              pinSpacing: false,
              end: () => `+=${window.innerHeight * 1.5}`,
            });
          }
        });

        return () => {
          swipeSections.forEach((section) => {
            section.style.marginBottom = '';
          });
        };
      });

      // ── Hero Title Animation ──
      gsap.fromTo('.pp-hero-label', {
        y: 40, opacity: 0, skewY: 3,
      }, {
        y: 0, opacity: 1, skewY: 0,
        duration: 1, ease: 'power3.out', delay: 0.3,
      });

      gsap.fromTo('.pp-hero-title', {
        y: 80, opacity: 0,
      }, {
        y: 0, opacity: 1,
        duration: 1.2, ease: 'power3.out', delay: 0.5,
      });

      gsap.fromTo('.pp-hero-line', {
        scaleX: 0,
      }, {
        scaleX: 1,
        duration: 1.2, ease: 'power3.inOut', delay: 0.8,
      });

      // ── Section Titles ──
      gsap.utils.toArray('.pp-section-title').forEach((title) => {
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

      // ── Plan Cards — 3D Flip-in ──
      const cards = document.querySelectorAll('.pp-plan-card');
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
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          delay: i * 0.15,
        });
      });

      // ── Counter Animation for Prices ──
      const vals = document.querySelectorAll('.pp-price-value');
      vals.forEach((val) => {
        const target = parseInt(val.getAttribute('data-value'));
        const start = parseInt(val.getAttribute('data-start') || '0');
        const obj = { v: start };
        let counterTween = null;

        val.textContent = start;

        ScrollTrigger.create({
          trigger: val,
          start: 'top 85%',
          onEnter: () => {
            if (counterTween) counterTween.kill();
            counterTween = gsap.to(obj, {
              v: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                val.textContent = Math.round(obj.v);
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
                val.textContent = Math.round(obj.v);
              },
            });
          },
        });
      });

      // ── Surprise Admission Reveal ──
      const surpriseSection = document.querySelector('.pp-surprise');
      if (surpriseSection) {
        gsap.fromTo('.pp-surprise-label', {
          y: 30, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: surpriseSection, start: 'top 75%', toggleActions: 'play none none reverse' },
        });

        gsap.fromTo('.pp-surprise-question', {
          y: 50, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: surpriseSection, start: 'top 75%', toggleActions: 'play none none reverse' },
          delay: 0.2,
        });

        // Counter drops from 1500 to 0 (and reverses back)
        const surpriseVal = document.querySelector('.pp-surprise-number');
        if (surpriseVal) {
          const obj = { v: 1500 };
          let surpriseTween = null;

          ScrollTrigger.create({
            trigger: surpriseVal,
            start: 'top 80%',
            onEnter: () => {
              if (surpriseTween) surpriseTween.kill();
              surpriseTween = gsap.to(obj, {
                v: 0,
                duration: 2.5,
                ease: 'power3.inOut',
                onUpdate: () => {
                  surpriseVal.textContent = Math.round(obj.v);
                },
                onComplete: () => {
                  surpriseVal.textContent = '0';
                  // Show the FREE badge with a burst
                  gsap.fromTo('.pp-surprise-free', {
                    scale: 0, opacity: 0, rotation: -15,
                  }, {
                    scale: 1, opacity: 1, rotation: 0,
                    duration: 0.6, ease: 'back.out(2)',
                  });
                  // Glow pulse on the number
                  gsap.fromTo('.pp-surprise-amount', {
                    boxShadow: '0 0 0px rgba(212, 160, 23, 0)',
                  }, {
                    boxShadow: '0 0 80px rgba(212, 160, 23, 0.5), 0 0 120px rgba(212, 160, 23, 0.2)',
                    duration: 0.8, ease: 'power2.out',
                    yoyo: true, repeat: 1,
                  });
                  // Show the subtext
                  gsap.fromTo('.pp-surprise-subtext', {
                    y: 20, opacity: 0,
                  }, {
                    y: 0, opacity: 1,
                    duration: 0.6, ease: 'power3.out', delay: 0.3,
                  });
                  // Show the CTA
                  gsap.fromTo('.pp-surprise-cta', {
                    y: 20, opacity: 0,
                  }, {
                    y: 0, opacity: 1,
                    duration: 0.6, ease: 'power3.out', delay: 0.5,
                  });
                },
              });
            },
            onLeaveBack: () => {
              if (surpriseTween) surpriseTween.kill();
              // Reset everything back
              gsap.to('.pp-surprise-free', { scale: 0, opacity: 0, duration: 0.3 });
              gsap.to('.pp-surprise-subtext', { y: 20, opacity: 0, duration: 0.3 });
              gsap.to('.pp-surprise-cta', { y: 20, opacity: 0, duration: 0.3 });
              gsap.to('.pp-surprise-amount', { boxShadow: '0 0 0px rgba(212, 160, 23, 0)', duration: 0.3 });
              surpriseTween = gsap.to(obj, {
                v: 1500,
                duration: 1,
                ease: 'power2.in',
                onUpdate: () => {
                  surpriseVal.textContent = Math.round(obj.v);
                },
              });
            },
          });
        }
      }

      // ── Compare Table Rows ──
      const rows = document.querySelectorAll('.pp-compare-row');
      rows.forEach((row, i) => {
        gsap.fromTo(row, {
          x: -40, opacity: 0,
        }, {
          x: 0, opacity: 1,
          duration: 0.6, ease: 'power3.out',
          delay: i * 0.05,
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // ── FAQ Items ──
      const faqItems = document.querySelectorAll('.pp-faq-item');
      faqItems.forEach((item, i) => {
        gsap.fromTo(item, {
          y: 30, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 0.6, ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pricing-page" ref={pageRef}>
      {/* ── Hero Banner ── */}
      <section className="pp-swipe-panel pp-hero">
        <div className="pp-hero-bg" />
        <div className="pp-hero-content">
          <div className="pp-hero-label">Investment In Yourself</div>
          <h1 className="pp-hero-title">OUR <span className="highlight">PLANS</span></h1>
          <div className="pp-hero-line" />
        </div>
      </section>

      {/* ── Surprise Admission Reveal ── */}
      <section className="pp-swipe-panel pp-surprise">
        <div className="pp-surprise-inner">
          <div className="pp-surprise-label">Before We Begin...</div>
          <h2 className="pp-surprise-question">What's Our <span className="highlight">Admission Fee</span>?</h2>
          <div className="pp-surprise-reveal">
            <div className="pp-surprise-amount">
              <span className="pp-surprise-currency">₹</span>
              <span className="pp-surprise-number">1500</span>
              <div className="pp-surprise-free">FREE!</div>
            </div>
            <p className="pp-surprise-subtext">Zero admission fee. Zero hidden charges. Just walk in and start your journey.</p>
            <button className="pp-surprise-cta" onClick={() => window.open(getWhatsAppUrl(`Hi! I'm interested in joining Rising Sun Fitness. I'd like to know about the admission process and get registered.`), '_blank')}>Register Now — It's Free</button>
          </div>
        </div>
      </section>

      {/* ── Plans Section ── */}
      <section className="pp-swipe-panel pp-plans">
        <div className="pp-plans-inner">
          <div className="pp-section-label">Choose Your Path</div>
          <h2 className="pp-section-title">MEMBERSHIP <span className="highlight">PLANS</span></h2>
          <div className="pp-plans-grid">
            {plans.map((plan, i) => (
              <div className={`pp-plan-card ${plan.featured ? 'featured' : ''}`} key={i}>
                {plan.badge && <div className="pp-plan-badge">{plan.badge}</div>}
                <div className="pp-plan-type">{plan.name}</div>
                <div className="pp-plan-amount">
                  <span className="pp-plan-currency">₹</span>
                  <span className="pp-price-value" data-value={plan.price} data-start={plan.startFrom || 0}>{plan.startFrom || 0}</span>
                </div>
                <div className="pp-plan-period">{plan.period}</div>
                <div className="pp-plan-features">
                  {plan.features.map((f, j) => (
                    <div className="pp-plan-feature" key={j}>
                      <span className="pp-check">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button className="pp-plan-cta" onClick={() => window.open(getWhatsAppUrl(plan.whatsappMsg), '_blank')}>{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Section ── */}
      <section className="pp-swipe-panel pp-compare">
        <div className="pp-compare-inner">
          <div className="pp-section-label">Side By Side</div>
          <h2 className="pp-section-title">COMPARE <span className="highlight">PLANS</span></h2>
          <div className="pp-compare-table">
            {/* Header */}
            <div className="pp-compare-row pp-compare-header">
              <div className="pp-compare-cell pp-compare-feature">Feature</div>
              <div className="pp-compare-cell">1 Day</div>
              <div className="pp-compare-cell">Monthly</div>
              <div className="pp-compare-cell">Quarterly</div>
              <div className="pp-compare-cell">6 Months</div>
              <div className="pp-compare-cell">Yearly</div>
            </div>
            {/* Rows */}
            {compareFeatures.map((cf, i) => (
              <div className="pp-compare-row" key={i}>
                <div className="pp-compare-cell pp-compare-feature">{cf.name}</div>
                <div className="pp-compare-cell">
                  {cf.daily === true ? <span className="pp-yes">✓</span> : cf.daily === false ? <span className="pp-no">✕</span> : <span className="pp-text">{cf.daily}</span>}
                </div>
                <div className="pp-compare-cell">
                  {cf.monthly === true ? <span className="pp-yes">✓</span> : cf.monthly === false ? <span className="pp-no">✕</span> : <span className="pp-text">{cf.monthly}</span>}
                </div>
                <div className="pp-compare-cell">
                  {cf.quarterly === true ? <span className="pp-yes">✓</span> : cf.quarterly === false ? <span className="pp-no">✕</span> : <span className="pp-text">{cf.quarterly}</span>}
                </div>
                <div className="pp-compare-cell">
                  {cf.sixMonth === true ? <span className="pp-yes">✓</span> : cf.sixMonth === false ? <span className="pp-no">✕</span> : <span className="pp-text">{cf.sixMonth}</span>}
                </div>
                <div className="pp-compare-cell">
                  {cf.yearly === true ? <span className="pp-yes">✓</span> : cf.yearly === false ? <span className="pp-no">✕</span> : <span className="pp-text">{cf.yearly}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="pp-swipe-panel pp-faq">
        <div className="pp-faq-inner">
          <div className="pp-section-label">Got Questions?</div>
          <h2 className="pp-section-title">FREQUENTLY <span className="highlight">ASKED</span></h2>
          <div className="pp-faq-list">
            {faqs.map((faq, i) => (
              <div
                className={`pp-faq-item ${openFaq === i ? 'open' : ''}`}
                key={i}
                onClick={() => toggleFaq(i)}
              >
                <div className="pp-faq-question">
                  <span>{faq.q}</span>
                  <span className="pp-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </div>
                <div className="pp-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
