import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import ScratchCard from '../components/ScratchCard';
import '../styles/pricing-page.css';
import '../styles/scratch-card.css';

gsap.registerPlugin(ScrollTrigger);

// ── Plans Data ──
const plans = [
  {
    name: '1 Day',
    fullName: '1 Day Pass',
    price: 100,
    period: 'per day',
    icon: '⚡',
    badge: null,
    featured: false,
    perMonth: null,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      'Morning & Evening Slots',
    ],
    excluded: ['Free PT Sessions', 'Diet Consultation', 'Priority Support'],
    cta: 'Try Now',
    whatsappMsg: `Hi! I'd like to try a *1 Day Pass* at Rising Sun Fitness for ₹100. When can I come in for my session?`,
  },
  {
    name: 'Monthly',
    fullName: 'Monthly Plan',
    price: 800,
    period: 'per month',
    icon: '🔥',
    badge: 'Popular',
    featured: true,
    perMonth: 800,
    extraOffer: {
      price: 1000,
      period: '45 days',
      bonus: '+ 15 Days EXTRA',
      label: 'Upgrade to 45 Days',
      whatsappMsg: `Hello! I want the *Monthly Plan Upgrade* — ₹1000 for 45 days (30 + 15 extra days). How do I sign up?`,
    },
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      'Morning & Evening Slots',
    ],
    excluded: ['Free PT Sessions', 'Diet Plan', 'Priority Support'],
    cta: 'Start Training',
    whatsappMsg: `Hello! I want to start my fitness journey with the *Monthly Plan* at ₹800/month. How do I sign up?`,
  },
  {
    name: 'Quarterly',
    fullName: 'Quarterly Plan',
    price: 2500,
    period: '3 months',
    bonus: '+ 1 Month FREE',
    icon: '💪',
    badge: null,
    featured: false,
    perMonth: 625,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio & Free Weights',
      '1 Free PT Session',
      'Diet Consultation',
      '1 Month Free Membership',
    ],
    excluded: ['Priority Support'],
    cta: 'Choose Plan',
    whatsappMsg: `Hey! I'm interested in the *Quarterly Plan* (₹2500 for 3 months + 1 month free). Please let me know how to get started!`,
  },
  {
    name: '6 Months',
    fullName: '6 Months Plan',
    price: 4000,
    period: '6 months',
    bonus: '+ 2 Months FREE',
    icon: '🎯',
    badge: null,
    featured: false,
    perMonth: 500,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio & Free Weights',
      '2 Free PT Sessions',
      'Diet Consultation',
      'Locker Facility',
    ],
    excluded: [],
    cta: 'Choose Plan',
    whatsappMsg: `Hello! I'd like to go with the *6 Months Plan* at ₹4000 (+ 2 months free). Can you share the registration details?`,
  },
  {
    name: 'Yearly',
    fullName: 'Yearly Plan',
    price: 9000,
    period: '12 months',
    bonus: '+ 4 Months FREE',
    icon: '👑',
    badge: 'Best Value',
    featured: false,
    perMonth: 563,
    features: [
      'Full Gym Access',
      'All Training & Cardio Zones',
      '4 Free PT Sessions',
      'Diet Plan Included',
      'Priority Support',
      'Locker Facility',
    ],
    excluded: [],
    cta: 'Choose Plan',
    whatsappMsg: `Hi! I'm ready to commit to the *Yearly Plan* at ₹9000 (+ 4 months free) with PT sessions and diet plan included. How do I register?`,
  },
  {
    name: 'Personal',
    fullName: 'Personal Trainer',
    price: 3500,
    period: 'per month',
    icon: '🏋️',
    badge: 'Premium',
    featured: false,
    perMonth: 3500,
    features: [
      'Dedicated Personal Trainer',
      'Custom Training Plan',
      'Diet Plan Included',
      'Progress Tracking',
      'Flexible Scheduling',
    ],
    excluded: [],
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
  const [activePlan, setActivePlan] = useState(1); // Monthly by default
  const [openFaq, setOpenFaq] = useState(null);
  const [animatingPrice, setAnimatingPrice] = useState(false);
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const [extraOfferActive, setExtraOfferActive] = useState(false);
  const priceRef = useRef(null);
  const cardRef = useRef(null);

  const handleScratchReveal = useCallback(() => {
    setScratchRevealed(true);
  }, []);

  const toggleFaq = (i) => {
    setOpenFaq(openFaq === i ? null : i);
  };

  // Reset extra offer when switching plans
  useEffect(() => {
    setExtraOfferActive(false);
  }, [activePlan]);

  // Animate price counter when plan changes or extra offer toggles
  useEffect(() => {
    if (!priceRef.current) return;

    const plan = plans[activePlan];
    const el = priceRef.current;
    const target = (extraOfferActive && plan.extraOffer) ? plan.extraOffer.price : plan.price;

    setAnimatingPrice(true);
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: target,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.v).toLocaleString('en-IN');
      },
      onComplete: () => setAnimatingPrice(false),
    });

    // Animate card entrance (only on plan switch, not toggle)
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.97,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
      });
    }

    return () => tween.kill();
  }, [activePlan, extraOfferActive]);

  // Page-level GSAP animations
  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // ── Swipe-panel pinning removed — it caused the magnet/stick scroll feel.
      //    Sections now scroll naturally; content still reveals on enter below.

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
            end: '+=400', scrub: 1,
          },
        });
      });

      // ── Surprise / Scratch Card Section ──
      const surpriseSection = document.querySelector('.pp-surprise');
      if (surpriseSection) {
        gsap.fromTo('.pp-surprise-label', {
          y: 30, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: surpriseSection, start: 'top 75%', end: '+=400', scrub: 1 },
        });

        gsap.fromTo('.pp-surprise-question', {
          y: 50, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: surpriseSection, start: 'top 75%', end: '+=400', scrub: 1 },
          delay: 0.2,
        });

        gsap.fromTo('.pp-scratch-wrapper', {
          y: 40, opacity: 0, scale: 0.95,
        }, {
          y: 0, opacity: 1, scale: 1,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: surpriseSection, start: 'top 70%', end: '+=400', scrub: 1 },
          delay: 0.4,
        });
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
            end: '+=400', scrub: 1,
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
            end: '+=400', scrub: 1,
          },
        });
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  const currentPlan = plans[activePlan];

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

      {/* ── Scratch Card — Admission Fee Reveal ── */}
      <section className="pp-swipe-panel pp-surprise">
        <div className="pp-surprise-inner">
          <div className="pp-surprise-label">Special Offer Inside</div>
          <h2 className="pp-surprise-question">Scratch To Reveal Your <span className="highlight">Admission Fee</span></h2>
          <div className="pp-scratch-wrapper">
            <div className="pp-scratch-hint">
              <span className="pp-scratch-coin"></span>
              Use your finger or mouse to scratch
            </div>
            <ScratchCard onReveal={handleScratchReveal} revealed={scratchRevealed} />
            {scratchRevealed && (
              <div className="pp-scratch-revealed-content">
                <p className="pp-scratch-sub">Zero admission fee. Zero hidden charges. Just walk in and start.</p>
                <button className="pp-scratch-cta" onClick={() => window.open(getWhatsAppUrl(`Hi! I'm interested in joining Rising Sun Fitness. I'd like to know about the admission process and get registered.`), '_blank')}>
                  Register Now — It's Free
                  <span className="pp-cta-arrow">→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Plans Section — Interactive Tab Selector ── */}
      <section className="pp-swipe-panel pp-plans">
        <div className="pp-plans-inner">
          <div className="pp-section-label">Choose Your Path</div>
          <h2 className="pp-section-title">MEMBERSHIP <span className="highlight">PLANS</span></h2>

          {/* Tab Navigation */}
          <div className="pp-tabs-wrapper">
            <div className="pp-tabs">
              {plans.map((plan, i) => (
                <button
                  key={i}
                  className={`pp-tab ${activePlan === i ? 'active' : ''} ${plan.featured ? 'tab-popular' : ''}`}
                  onClick={() => setActivePlan(i)}
                >
                  <span className="pp-tab-name">{plan.name}</span>
                  {plan.badge && <span className="pp-tab-badge">{plan.badge}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Active Plan Card — Single Showcase */}
          <div className="pp-showcase" ref={cardRef} key={activePlan}>
            <div className="pp-showcase-glow" />
            <div className="pp-showcase-content">
              {/* Left — Plan Info */}
              <div className="pp-showcase-left">
                <h3 className="pp-showcase-name">{currentPlan.fullName}</h3>
                <div className="pp-showcase-price-block">
                  <div className="pp-showcase-price">
                    <span className="pp-showcase-currency">₹</span>
                    <span className="pp-showcase-amount-val" ref={priceRef}>0</span>
                  </div>
                  <div className="pp-showcase-period">
                    {(extraOfferActive && currentPlan.extraOffer) ? currentPlan.extraOffer.period : currentPlan.period}
                  </div>
                  {/* Bonus free months */}
                  {currentPlan.bonus && !extraOfferActive && (
                    <div className="pp-showcase-bonus">
                      <span className="pp-bonus-plus">+</span>
                      <span className="pp-bonus-text">{currentPlan.bonus.replace('+ ', '')}</span>
                    </div>
                  )}
                  {/* Extra offer bonus when toggled */}
                  {extraOfferActive && currentPlan.extraOffer && (
                    <div className="pp-showcase-bonus">
                      <span className="pp-bonus-plus">+</span>
                      <span className="pp-bonus-text">{currentPlan.extraOffer.bonus.replace('+ ', '')}</span>
                    </div>
                  )}
                  {currentPlan.perMonth && currentPlan.perMonth !== currentPlan.price && !extraOfferActive && (
                    <div className="pp-showcase-per-month">
                      That's just ₹{currentPlan.perMonth}/month
                    </div>
                  )}
                </div>

                {/* Extra Offer Toggle */}
                {currentPlan.extraOffer && (
                  <div className={`pp-extra-offer ${extraOfferActive ? 'active' : ''}`} onClick={() => setExtraOfferActive(!extraOfferActive)}>
                    <div className="pp-extra-offer-toggle">
                      <div className="pp-extra-toggle-track">
                        <div className="pp-extra-toggle-thumb" />
                      </div>
                    </div>
                    <div className="pp-extra-offer-info">
                      <div className="pp-extra-offer-label">{currentPlan.extraOffer.label}</div>
                      <div className="pp-extra-offer-detail">
                        Pay ₹{currentPlan.extraOffer.price} → Get {currentPlan.extraOffer.period}
                      </div>
                    </div>
                    {extraOfferActive && <div className="pp-extra-offer-tag">✨ ACTIVE</div>}
                  </div>
                )}

                {currentPlan.badge && (
                  <div className="pp-showcase-badge">{currentPlan.badge}</div>
                )}
                <button
                  className="pp-showcase-cta"
                  onClick={() => window.open(getWhatsAppUrl(
                    (extraOfferActive && currentPlan.extraOffer) ? currentPlan.extraOffer.whatsappMsg : currentPlan.whatsappMsg
                  ), '_blank')}
                >
                  {currentPlan.cta}
                  <span className="pp-cta-arrow">→</span>
                </button>
              </div>

              {/* Right — Features */}
              <div className="pp-showcase-right">
                <div className="pp-showcase-features-title">What's Included</div>
                <div className="pp-showcase-features">
                  {currentPlan.features.map((f, j) => (
                    <div className="pp-showcase-feature" key={j}>
                      <span className="pp-feature-check">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                  {currentPlan.excluded && currentPlan.excluded.map((f, j) => (
                    <div className="pp-showcase-feature excluded" key={`ex-${j}`}>
                      <span className="pp-feature-cross">✕</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Price Comparison Strip */}
          <div className="pp-quick-compare">
            {plans.filter(p => p.perMonth).map((plan, i) => (
              <div
                className={`pp-quick-item ${plans.indexOf(plan) === activePlan ? 'active' : ''}`}
                key={i}
                onClick={() => setActivePlan(plans.indexOf(plan))}
              >
                <div className="pp-quick-name">{plan.name}</div>
                <div className="pp-quick-price">₹{plan.perMonth}<span>/mo</span></div>
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
