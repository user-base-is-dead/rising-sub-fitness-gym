import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import '../styles/pricing-page.css';

gsap.registerPlugin(ScrollTrigger);

// ── Plans Data ──
const plans = [
  {
    name: 'Monthly',
    price: 700,
    period: 'per month',
    badge: 'Popular',
    featured: true,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      'Morning & Evening Slots',
    ],
    cta: 'Start Training',
  },
  {
    name: 'Quarterly',
    price: 1800,
    period: 'per 3 months',
    badge: 'Save 14%',
    featured: false,
    features: [
      'Full Gym Access',
      'All Training Zones',
      'Cardio Equipment',
      'Free Weights Area',
      '1 Free PT Session',
      'Diet Consultation',
    ],
    cta: 'Choose Plan',
  },
  {
    name: 'Yearly',
    price: 6000,
    period: 'per year',
    badge: 'Best Value',
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
  },
  {
    name: 'Admission',
    price: 1500,
    period: 'one-time',
    badge: null,
    featured: false,
    features: [
      'Registration & Onboarding',
      'Fitness Assessment',
      'Training Plan Setup',
      'Gym Orientation Tour',
      'Lifetime Membership',
    ],
    cta: 'Register Now',
  },
];

// ── Comparison Data ──
const compareFeatures = [
  { name: 'Full Gym Access', monthly: true, quarterly: true, yearly: true },
  { name: 'All Training Zones', monthly: true, quarterly: true, yearly: true },
  { name: 'Cardio Equipment', monthly: true, quarterly: true, yearly: true },
  { name: 'Free Weights Area', monthly: true, quarterly: true, yearly: true },
  { name: 'Free PT Sessions', monthly: false, quarterly: '1 Session', yearly: '4 Sessions' },
  { name: 'Diet Consultation', monthly: false, quarterly: true, yearly: true },
  { name: 'Diet Plan Included', monthly: false, quarterly: false, yearly: true },
  { name: 'Priority Support', monthly: false, quarterly: false, yearly: true },
  { name: 'Locker Facility', monthly: false, quarterly: true, yearly: true },
];

// ── FAQ Data ──
const faqs = [
  {
    q: 'What are the gym timings?',
    a: 'We are open Monday to Saturday from 5:00 AM to 10:00 PM, and Sundays from 6:00 AM to 12:00 PM.',
  },
  {
    q: 'Can I freeze or pause my membership?',
    a: 'Yes, you can freeze your membership for up to 15 days per quarter. Contact the front desk to avail this.',
  },
  {
    q: 'Is the admission fee refundable?',
    a: 'No, the admission fee is a one-time, non-refundable payment that covers your registration, fitness assessment, and lifetime membership.',
  },
  {
    q: 'Do I need to pay the admission fee again if I rejoin?',
    a: 'No. Once you pay the admission fee, your membership is for life. You only need to renew your monthly/quarterly/yearly plan.',
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
        const obj = { v: 0 };

        ScrollTrigger.create({
          trigger: val,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              v: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                val.textContent = Math.round(obj.v);
              },
            });
          },
        });
      });

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
                  <span className="pp-price-value" data-value={plan.price}>0</span>
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
                <button className="pp-plan-cta">{plan.cta}</button>
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
              <div className="pp-compare-cell">Monthly</div>
              <div className="pp-compare-cell">Quarterly</div>
              <div className="pp-compare-cell">Yearly</div>
            </div>
            {/* Rows */}
            {compareFeatures.map((cf, i) => (
              <div className="pp-compare-row" key={i}>
                <div className="pp-compare-cell pp-compare-feature">{cf.name}</div>
                <div className="pp-compare-cell">
                  {cf.monthly === true ? <span className="pp-yes">✓</span> : cf.monthly === false ? <span className="pp-no">✕</span> : <span className="pp-text">{cf.monthly}</span>}
                </div>
                <div className="pp-compare-cell">
                  {cf.quarterly === true ? <span className="pp-yes">✓</span> : cf.quarterly === false ? <span className="pp-no">✕</span> : <span className="pp-text">{cf.quarterly}</span>}
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
