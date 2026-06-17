import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import '../styles/contact-page.css';

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const pageRef = useRef(null);
  const [copiedText, setCopiedText] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // ── Swipe-panel pinning removed — it caused the magnet/stick scroll feel.
      //    Sections now scroll naturally; content still reveals on enter below.

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
            end: '+=400', scrub: 1,
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
          end: '+=400', scrub: 1,
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
          end: '+=400', scrub: 1,
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
            end: '+=400', scrub: 1,
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

      // ── Social Section ──
      gsap.fromTo('.cp-social-card', {
        y: 60, opacity: 0, scale: 0.95
      }, {
        y: 0, opacity: 1, scale: 1,
        duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cp-social-card',
          start: 'top 80%',
          end: '+=400', scrub: 1,
        },
      });

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
            <a 
              href="https://maps.app.goo.gl/1AR1nqgAJexV1XZZ9" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cp-info-card cp-info-link"
            >
              <div className="cp-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>
              </div>
              <h3 className="cp-info-title">Our Location</h3>
              <p className="cp-info-text">AT-Sanabazar, Near Ganjeswar Temple,<br />Jajpur Town, Odisha, India</p>
            </a>
            <div 
              className="cp-info-card cp-info-link"
              onClick={() => handleCopy('+91 63808 16041', 'phone')}
            >
              <div className="cp-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 4h3l1.5 4.5L7.5 10a11 11 0 0 0 6 6l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2z"/></svg>
              </div>
              <h3 className="cp-info-title">Phone</h3>
              <p className="cp-info-text">
                {copiedText === 'phone' ? <span style={{color: 'var(--bronze)'}}>Copied!</span> : '+91 63808 16041'}
              </p>
              <span className="cp-copy-hint">Click to copy</span>
            </div>
            <div 
              className="cp-info-card cp-info-link"
              onClick={() => handleCopy('risingsunofficial615@gmail.com', 'email')}
            >
              <div className="cp-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
              </div>
              <h3 className="cp-info-title">Email</h3>
              <p className="cp-info-text">
                {copiedText === 'email' ? <span style={{color: 'var(--bronze)'}}>Copied!</span> : 'risingsunofficial615@gmail.com'}
              </p>
              <span className="cp-copy-hint">Click to copy</span>
            </div>
            <div className="cp-info-card">
              <div className="cp-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
              </div>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.8!2d86.3387197!3d20.8521222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1be35742e28873%3A0xdfb7eee22e9610dd!2sRISING%20SUN%20FITNESS%20CENTER!5e0!3m2!1sen!2sin!4v1"
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

      {/* ── Social Media Section ── */}
      <section className="cp-swipe-panel cp-social">
        <div className="cp-social-inner">
          <div className="cp-section-label">Connect & Follow</div>
          <h2 className="cp-section-title">JOIN OUR <span className="highlight">COMMUNITY</span></h2>
          
          <div className="cp-social-card">
            <div className="cp-social-bg"></div>
            <div className="cp-social-content">
               <div className="cp-social-icon">
                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
               </div>
               <h3>@risingsun_fitness_center</h3>
               <p>Follow our journey, get daily motivation, and see what our champions are up to.</p>
               <a href="https://instagram.com/risingsun_fitness_center" target="_blank" rel="noopener noreferrer" className="cp-btn-instagram">
                  Follow on Instagram
               </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
