import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import '../styles/contact-page.css';

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // ── Swipe Slider / Layered Pinning Effect (Desktop Only) ──
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1025px)', () => {
        const swipeSections = gsap.utils.toArray('section.cp-swipe-panel');
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

      // ── Hero Animations ──
      gsap.fromTo('.cp-hero-label', {
        y: 40, opacity: 0, skewY: 3,
      }, {
        y: 0, opacity: 1, skewY: 0,
        duration: 1, ease: 'power3.out', delay: 0.3,
      });

      gsap.fromTo('.cp-hero-title', {
        y: 80, opacity: 0,
      }, {
        y: 0, opacity: 1,
        duration: 1.2, ease: 'power3.out', delay: 0.5,
      });

      gsap.fromTo('.cp-hero-line', {
        scaleX: 0,
      }, {
        scaleX: 1,
        duration: 1.2, ease: 'power3.inOut', delay: 0.8,
      });

      // ── Contact Info Items ──
      gsap.utils.toArray('.cp-info-card').forEach((card, i) => {
        gsap.fromTo(card, {
          y: 60, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 0.8, ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // ── Form Animation ──
      gsap.fromTo('.cp-form-wrap', {
        y: 60, opacity: 0,
      }, {
        y: 0, opacity: 1,
        duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cp-form-wrap',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // ── Map Section ──
      gsap.fromTo('.cp-map-wrap', {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
      }, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.cp-map',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // ── Section Titles ──
      gsap.utils.toArray('.cp-section-title').forEach((title) => {
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

      // ── Magnetic Submit Button ──
      const btn = document.querySelector('.cp-form-submit');
      if (btn) {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
      }

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="contact-page" ref={pageRef}>
      {/* ── Hero Banner ── */}
      <section className="cp-swipe-panel cp-hero">
        <div className="cp-hero-bg" />
        <div className="cp-hero-content">
          <div className="cp-hero-label">We'd Love To Hear From You</div>
          <h1 className="cp-hero-title">CONTACT <span className="highlight">US</span></h1>
          <div className="cp-hero-line" />
        </div>
      </section>

      {/* ── Contact Info + Form Section ── */}
      <section className="cp-swipe-panel cp-main">
        <div className="cp-main-inner">
          {/* Info Cards */}
          <div className="cp-info-grid">
            <div className="cp-info-card">
              <div className="cp-info-icon">📍</div>
              <h3 className="cp-info-title">Our Location</h3>
              <p className="cp-info-text">AT-Sanabazar, Near Ganjeswar Temple,<br />Jajpur Town, Odisha, India</p>
            </div>
            <div className="cp-info-card">
              <div className="cp-info-icon">📞</div>
              <h3 className="cp-info-title">Phone</h3>
              <p className="cp-info-text">+91 63808 16041</p>
            </div>
            <div className="cp-info-card">
              <div className="cp-info-icon">✉️</div>
              <h3 className="cp-info-title">Email</h3>
              <p className="cp-info-text">risingsunofficial615@gmail.com</p>
            </div>
            <div className="cp-info-card">
              <div className="cp-info-icon">🕐</div>
              <h3 className="cp-info-title">Working Hours</h3>
              <p className="cp-info-text">All Days: 5 AM – 11 AM<br />& 4 PM – 11 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="cp-form-wrap">
            <div className="cp-section-label">Drop A Message</div>
            <h2 className="cp-section-title">SEND US A <span className="highlight">MESSAGE</span></h2>
            <form className="cp-form" onSubmit={(e) => e.preventDefault()}>
              <div className="cp-form-row">
                <div className="cp-form-group">
                  <input type="text" placeholder="Your Name" />
                </div>
                <div className="cp-form-group">
                  <input type="tel" placeholder="Phone Number" />
                </div>
              </div>
              <div className="cp-form-group">
                <input type="email" placeholder="Email Address" />
              </div>
              <div className="cp-form-group">
                <select defaultValue="">
                  <option value="" disabled>Select Subject</option>
                  <option value="membership">Membership Inquiry</option>
                  <option value="training">Personal Training</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="cp-form-group">
                <textarea placeholder="Your Message" rows={5}></textarea>
              </div>
              <button type="submit" className="cp-form-submit">
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Map Section ── */}
      <section className="cp-swipe-panel cp-map">
        <div className="cp-map-inner">
          <div className="cp-section-label">Find Us</div>
          <h2 className="cp-section-title">OUR <span className="highlight">LOCATION</span></h2>
          <div className="cp-map-wrap">
            <iframe
              title="Rising Sun Fitness Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.8!2d86.34!3d20.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJajpur+Town!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="450"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
