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
    unit: '/day',
    bestFor: 'Trying the gym out or dropping in once',
    icon: '⚡',
    badge: null,
    featured: false,
    perMonth: null,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      'First Visit FREE for Newcomers',
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
    unit: '/mo',
    bestFor: 'Getting started without a long commitment',
    icon: '🔥',
    badge: 'Popular',
    featured: true,
    perMonth: 800,
    extraOffer: {
      price: 1000,
      period: '45 days',
      bonus: '+ 15 Days EXTRA',
      label: 'Upgrade to 45 Days',
      totalMonths: 1.5,
      timeline: { paid: 2, free: 1, label: '30 days paid + 15 days FREE' },
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
    unit: '/3 mo',
    bestFor: 'Building a steady training habit',
    bonus: '+ 1 Month FREE',
    totalMonths: 4,
    timeline: { paid: 3, free: 1, label: '3 months paid + 1 month FREE' },
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
    unit: '/6 mo',
    bestFor: 'Serious transformation at the lowest monthly cost',
    bonus: '+ 2 Months FREE',
    totalMonths: 8,
    timeline: { paid: 6, free: 2, label: '6 months paid + 2 months FREE' },
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
    unit: '/yr',
    bestFor: 'Long-term members who want PT and a diet plan',
    bonus: '+ 4 Months FREE',
    totalMonths: 16,
    timeline: { paid: 12, free: 4, label: '12 months paid + 4 months FREE' },
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
    unit: '/mo',
    bestFor: 'One-on-one coaching and the fastest results',
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
const MONTHLY_PRICE = 800;
const COMPARE_KEYS = ['daily', 'monthly', 'quarterly', 'sixMonth', 'yearly']; // plans[0..4]
const compareGroups = [
  {
    title: 'Gym Access',
    rows: [
      { name: 'Full Gym Access', daily: true, monthly: true, quarterly: true, sixMonth: true, yearly: true },
      { name: 'All Training Zones', daily: true, monthly: true, quarterly: true, sixMonth: true, yearly: true },
      { name: 'Cardio Equipment', daily: true, monthly: true, quarterly: true, sixMonth: true, yearly: true },
      { name: 'Free Weights Area', daily: true, monthly: true, quarterly: true, sixMonth: true, yearly: true },
    ],
  },
  {
    title: 'Bonuses & Extras',
    rows: [
      { name: 'Free Bonus Time', daily: false, monthly: '+15 days option', quarterly: '+1 month', sixMonth: '+2 months', yearly: '+4 months' },
      { name: 'Free PT Sessions', daily: false, monthly: false, quarterly: '1 session', sixMonth: '2 sessions', yearly: '4 sessions' },
      { name: 'Diet Consultation', daily: false, monthly: false, quarterly: true, sixMonth: true, yearly: true },
      { name: 'Diet Plan Included', daily: false, monthly: false, quarterly: false, sixMonth: false, yearly: true },
      { name: 'Locker Facility', daily: false, monthly: false, quarterly: true, sixMonth: true, yearly: true },
      { name: 'Priority Support', daily: false, monthly: false, quarterly: false, sixMonth: false, yearly: true },
    ],
  },
];

// Monthly-plan equivalent minus what the plan costs
const getSavings = (price, months) => (months ? Math.round(MONTHLY_PRICE * months - price) : 0);
const formatINR = (n) => n.toLocaleString('en-IN');

// Plans whose effective monthly cost is worth comparing (excludes day pass and PT)
const costPlans = plans.slice(1, 5);
const lowestPerMonth = Math.min(...costPlans.map((p) => p.perMonth));

// ── FAQ Data ──
const faqs = [
  {
    q: 'What are the gym timings?',
    a: 'We are open all days from 5:00 AM to 11:00 AM, and 4:00 PM to 11:00 PM.',
  },
  {
    q: 'Can I freeze or pause my membership?',
    a: 'No, you cannot freeze your membership.',
  },
  {
    q: 'Is there any other secret admission fee?',
    a: 'No, there are no hidden charges or admission fees.',
  },
  {
    q: 'Do I need to pay the admission fee again if I rejoin?',
    a: 'No. The admission fee is ₹0, so you pay nothing extra when you rejoin.',
  },
  {
    q: 'Are personal training sessions included?',
    a: 'The monthly plan uses group coaching. Quarterly includes 1 free PT session, and Yearly includes 4. Additional PT sessions can be purchased separately.',
  },
  {
    q: 'Is there a trial class available?',
    a: 'Yes! If you are new to Rising Sun Fitness, your first visit is completely FREE — just walk in during gym hours with a valid ID. After that, a 1 Day Pass costs ₹100 per day.',
  },
];

const renderCompareValue = (v) => {
  if (v === true) return <span className="pp-yes" aria-label="Included">✓</span>;
  if (v === false) return <span className="pp-no" aria-label="Not included">—</span>;
  return <span className="pp-text">{v}</span>;
};

const WHATSAPP_NUMBER = '916380816041';

const getWhatsAppUrl = (msg) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export default function PricingPage() {
  const pageRef = useRef(null);
  const [activePlan, setActivePlan] = useState(1); // Monthly by default
  const [openFaq, setOpenFaq] = useState(null);
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

  // Switching plans also resets the extra offer
  const selectPlan = (i) => {
    setActivePlan(i);
    setExtraOfferActive(false);
  };

  // Animate price counter when plan changes or extra offer toggles
  useEffect(() => {
    if (!priceRef.current) return;

    const plan = plans[activePlan];
    const el = priceRef.current;
    const target = (extraOfferActive && plan.extraOffer) ? plan.extraOffer.price : plan.price;

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: target,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.v).toLocaleString('en-IN');
      },
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
  const offer = extraOfferActive ? currentPlan.extraOffer : null;
  const displayPrice = offer ? offer.price : currentPlan.price;
  const timeline = offer ? offer.timeline : currentPlan.timeline;
  const perMonth = offer ? null : currentPlan.perMonth;
  const savings = offer
    ? getSavings(offer.price, offer.totalMonths)
    : getSavings(currentPlan.price, currentPlan.totalMonths);

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
            <div className="pp-tabs" role="tablist">
              {plans.map((plan, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activePlan === i}
                  className={`pp-tab ${activePlan === i ? 'active' : ''} ${plan.featured ? 'tab-popular' : ''}`}
                  onClick={() => selectPlan(i)}
                >
                  {plan.badge && <span className="pp-tab-badge">{plan.badge}</span>}
                  <span className="pp-tab-name">{plan.name}</span>
                  <span className="pp-tab-price">₹{formatINR(plan.price)}<small>{plan.unit}</small></span>
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
                <div className="pp-showcase-head">
                  <span className="pp-showcase-icon" aria-hidden="true">{currentPlan.icon}</span>
                  <h3 className="pp-showcase-name">{currentPlan.fullName}</h3>
                  {currentPlan.badge && <span className="pp-showcase-badge">{currentPlan.badge}</span>}
                </div>
                <p className="pp-showcase-bestfor"><span>Best for</span> {currentPlan.bestFor}</p>

                <div className="pp-showcase-price-block">
                  <div className="pp-showcase-price">
                    <span className="pp-showcase-currency">₹</span>
                    <span className="pp-showcase-amount-val" ref={priceRef}>0</span>
                    <span className="pp-showcase-period">
                      {offer ? offer.period : currentPlan.period}
                    </span>
                  </div>

                  {/* Paid vs free time, one block per month (or 15 days) */}
                  {timeline && (
                    <div className="pp-timeline">
                      <div className="pp-timeline-bar">
                        {[...Array(timeline.paid + timeline.free)].map((_, j) => (
                          <span
                            key={j}
                            className={`pp-timeline-seg ${j >= timeline.paid ? 'free' : ''}`}
                            style={{ '--i': j }}
                          />
                        ))}
                      </div>
                      <div className="pp-timeline-label">
                        {timeline.label.split('FREE')[0]}<strong>FREE</strong>
                      </div>
                    </div>
                  )}

                  {(perMonth || savings > 0) && (
                    <div className="pp-showcase-stats">
                      {perMonth && perMonth !== displayPrice && (
                        <div className="pp-stat">
                          <span className="pp-stat-label">Works out to</span>
                          <span className="pp-stat-value">₹{formatINR(perMonth)}<small>/month</small></span>
                        </div>
                      )}
                      {savings > 0 && (
                        <div className="pp-stat pp-stat-save">
                          <span className="pp-stat-label">You save</span>
                          <span className="pp-stat-value">₹{formatINR(savings)}<small> vs monthly</small></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Extra Offer Toggle */}
                {currentPlan.extraOffer && (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={extraOfferActive}
                    className={`pp-extra-offer ${extraOfferActive ? 'active' : ''}`}
                    onClick={() => setExtraOfferActive(!extraOfferActive)}
                  >
                    <div className="pp-extra-offer-toggle">
                      <div className="pp-extra-toggle-track">
                        <div className="pp-extra-toggle-thumb" />
                      </div>
                    </div>
                    <div className="pp-extra-offer-info">
                      <div className="pp-extra-offer-label">{currentPlan.extraOffer.label}</div>
                      <div className="pp-extra-offer-detail">
                        Pay ₹{formatINR(currentPlan.extraOffer.price)} → Get {currentPlan.extraOffer.period}
                      </div>
                    </div>
                    <div className="pp-extra-offer-tag">{extraOfferActive ? '✨ Active' : '+15 Days'}</div>
                  </button>
                )}

                <button
                  className="pp-showcase-cta"
                  onClick={() => window.open(getWhatsAppUrl(offer ? offer.whatsappMsg : currentPlan.whatsappMsg), '_blank')}
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
                    <div className="pp-showcase-feature" key={j} style={{ '--i': j }}>
                      <span className="pp-feature-check">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                  {currentPlan.excluded && currentPlan.excluded.map((f, j) => (
                    <div className="pp-showcase-feature excluded" key={`ex-${j}`} style={{ '--i': currentPlan.features.length + j }}>
                      <span className="pp-feature-cross">✕</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Effective monthly cost — longer plans cost less per month */}
          <div className="pp-cost">
            <div className="pp-cost-head">
              <span className="pp-cost-title">Cost per month</span>
              <span className="pp-cost-note">Free bonus months included</span>
            </div>
            <div className="pp-cost-bars">
              {costPlans.map((plan) => {
                const i = plans.indexOf(plan);
                const lowest = plan.perMonth === lowestPerMonth;
                return (
                  <button
                    type="button"
                    className={`pp-cost-row ${i === activePlan ? 'active' : ''} ${lowest ? 'lowest' : ''}`}
                    key={plan.name}
                    onClick={() => selectPlan(i)}
                  >
                    <span className="pp-cost-name">{plan.name}</span>
                    <span className="pp-cost-track">
                      <span className="pp-cost-fill" style={{ width: `${(plan.perMonth / MONTHLY_PRICE) * 100}%` }} />
                    </span>
                    <span className="pp-cost-value">
                      ₹{formatINR(plan.perMonth)}
                      {lowest && <em>Lowest</em>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison Section ── */}
      <section className="pp-swipe-panel pp-compare">
        <div className="pp-compare-inner">
          <div className="pp-section-label">Side By Side</div>
          <h2 className="pp-section-title">COMPARE <span className="highlight">PLANS</span></h2>
          <p className="pp-compare-swipe" aria-hidden="true">Swipe to see all plans →</p>
          <div className="pp-compare-table">
            {/* Header */}
            <div className="pp-compare-row pp-compare-header">
              <div className="pp-compare-cell pp-compare-feature">Plan</div>
              {COMPARE_KEYS.map((key, i) => (
                <button
                  type="button"
                  key={key}
                  className={`pp-compare-cell pp-compare-plan ${activePlan === i ? 'is-active' : ''}`}
                  onClick={() => selectPlan(i)}
                >
                  {plans[i].badge && <span className="pp-compare-badge">{plans[i].badge}</span>}
                  <span className="pp-compare-plan-name">{plans[i].name}</span>
                  <span className="pp-compare-plan-price">₹{formatINR(plans[i].price)}<small>{plans[i].unit}</small></span>
                </button>
              ))}
            </div>

            {compareGroups.map((group) => (
              <div className="pp-compare-group" key={group.title}>
                <div className="pp-compare-row pp-compare-group-title">
                  <div className="pp-compare-cell pp-compare-feature">{group.title}</div>
                </div>
                {group.rows.map((row) => (
                  <div className="pp-compare-row" key={row.name}>
                    <div className="pp-compare-cell pp-compare-feature">{row.name}</div>
                    {COMPARE_KEYS.map((key, i) => (
                      <div className={`pp-compare-cell ${activePlan === i ? 'is-active' : ''}`} key={key}>
                        {renderCompareValue(row[key])}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* Per month + CTA */}
            <div className="pp-compare-row pp-compare-total">
              <div className="pp-compare-cell pp-compare-feature">Cost per month</div>
              {COMPARE_KEYS.map((key, i) => (
                <div className={`pp-compare-cell ${activePlan === i ? 'is-active' : ''}`} key={key}>
                  {plans[i].perMonth ? <span className="pp-compare-permonth">₹{formatINR(plans[i].perMonth)}</span> : <span className="pp-no">—</span>}
                </div>
              ))}
            </div>
            <div className="pp-compare-row pp-compare-cta-row">
              <div className="pp-compare-cell pp-compare-feature" />
              {COMPARE_KEYS.map((key, i) => (
                <div className={`pp-compare-cell ${activePlan === i ? 'is-active' : ''}`} key={key}>
                  <button
                    type="button"
                    className="pp-compare-join"
                    onClick={() => window.open(getWhatsAppUrl(plans[i].whatsappMsg), '_blank')}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
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
              <div className={`pp-faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                <button
                  type="button"
                  className="pp-faq-question"
                  aria-expanded={openFaq === i}
                  onClick={() => toggleFaq(i)}
                >
                  <span className="pp-faq-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pp-faq-q">{faq.q}</span>
                  <span className="pp-faq-icon" aria-hidden="true" />
                </button>
                <div className="pp-faq-answer">
                  <div>
                    <p>{faq.a}</p>
                  </div>
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
