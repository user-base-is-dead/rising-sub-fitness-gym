import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from '../assets/images/logo.png';
import '../styles/footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Footer content stagger
      gsap.fromTo('.footer-content > div', {
        y: 40,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.footer-content',
          start: 'top 85%',
          end: '+=400', scrub: 1,
        },
      });

      // Social links stagger
      gsap.fromTo('.footer-social', {
        scale: 0,
        opacity: 0,
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: '.footer-bottom',
          start: 'top 90%',
          end: '+=400', scrub: 1,
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      {/* Infinite Marquee */}
      <div className="footer-marquee">
        <div className="footer-marquee-track">
          {[...Array(4)].map((_, i) => (
            <span className="footer-marquee-text" key={i}>
              RISING SUN FITNESS <span className="dot"></span> FORGE YOUR LEGACY <span className="dot"></span> NO EXCUSES <span className="dot"></span> ONLY RESULTS <span className="dot"></span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer Content */}
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-brand-name">
            <img src={logo} alt="Rising Sun Fitness" className="footer-brand-logo" />
            RISING <span className="highlight">SUN</span> FITNESS
          </div>
          <p className="footer-brand-text">
            Jajpur Town's most hardcore gym. Where discipline meets dedication
            and champions are forged in fire.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <div className="footer-links">
            <Link className="footer-link" to="/">Home</Link>
            <Link className="footer-link" to="/trainers">Trainers</Link>
            <Link className="footer-link" to="/pricing">Pricing</Link>
            <Link className="footer-link" to="/contact">Contact Us</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Gym Hours</h4>
          <div className="footer-hours">
            <div className="footer-hour-row">
              <span>Morning</span>
              <span className="time">5 AM – 1 PM</span>
            </div>
            <div className="footer-hour-row">
              <span>Evening</span>
              <span className="time">4 PM – 11 PM</span>
            </div>
            <div className="footer-hour-row">
              <span>Days</span>
              <span className="time">All 7 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          © 2026 Rising Sun Fitness. All rights reserved.
        </div>
        <div className="footer-socials">
          <a className="footer-social" href="https://instagram.com/risingsun_fitness_center" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a className="footer-social" href="https://wa.me/916380816041?text=Hello!%20I%20am%20interested%20in%20joining%20Rising%20Sun%20Fitness.%20Can%20I%20get%20more%20details%3F" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </a>
          <a className="footer-social" href="mailto:info@risingsunfitness.com" aria-label="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
