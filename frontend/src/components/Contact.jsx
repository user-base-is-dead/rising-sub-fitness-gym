import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label + title
      gsap.fromTo('.contact-label', {
        x: -50, opacity: 0,
      }, {
        x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: '+=400', scrub: 1 },
      });

      gsap.fromTo('.contact-title', {
        y: 60, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: '+=400', scrub: 1 },
      });

      gsap.fromTo('.contact-text', {
        y: 30, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', end: '+=400', scrub: 1 },
      });

      // Contact detail items
      gsap.fromTo('.contact-detail-item', {
        x: -30, opacity: 0,
      }, {
        x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-details', start: 'top 80%', end: '+=400', scrub: 1 },
      });

      // Form inputs — sequential slide in
      gsap.fromTo('.form-group', {
        y: 40, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-form', start: 'top 80%', end: '+=400', scrub: 1 },
      });

      gsap.fromTo('.form-submit', {
        y: 30, opacity: 0,
      }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.form-submit', start: 'top 90%', end: '+=400', scrub: 1 },
      });

      // Magnetic effect on submit button
      const btn = document.querySelector('.form-submit');
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="contact-inner">
        {/* Left: Info */}
        <div className="contact-info">
          <div className="contact-label">Get In Touch</div>
          <h2 className="contact-title">
            READY TO<br />BEGIN?
          </h2>
          <p className="contact-text">
            Take the first step towards your transformation.
            Walk in, call us, or drop a message — we're ready when you are.
          </p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>
              </div>
              <div className="contact-detail-content">
                <h4>Location</h4>
                <p>AT-Sanabazar, Near Ganjeswar Temple, Jajpur Town, Odisha<br />India</p>
              </div>
            </div>
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 4h3l1.5 4.5L7.5 10a11 11 0 0 0 6 6l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2z"/></svg>
              </div>
              <div className="contact-detail-content">
                <h4>Phone</h4>
                <p>+91 63808 16041</p>
              </div>
            </div>
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
              </div>
              <div className="contact-detail-content">
                <h4>Email</h4>
                <p>risingsunofficial615@gmail.com</p>
              </div>
            </div>
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
              </div>
              <div className="contact-detail-content">
                <h4>Hours</h4>
                <p>All Days: 5 AM – 11 AM & 4 PM – 11 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="contact-form-wrap">
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <input type="text" placeholder="Your Name" />
              </div>
              <div className="form-group">
                <input type="tel" placeholder="Phone Number" />
              </div>
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email Address" />
            </div>
            <div className="form-group">
              <select defaultValue="">
                <option value="" disabled>Select Subject</option>
                <option value="membership">Membership Inquiry</option>
                <option value="training">Personal Training</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows={5}></textarea>
            </div>
            <button type="submit" className="form-submit">
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
