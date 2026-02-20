import { useEffect, useRef } from 'react';
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
          toggleActions: 'play none none reverse',
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
          toggleActions: 'play none none reverse',
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
            <a className="footer-link" href="#about">About Us</a>
            <a className="footer-link" href="#services">Services</a>
            <a className="footer-link" href="#trainers">Trainers</a>
            <a className="footer-link" href="#pricing">Plans</a>
            <a className="footer-link" href="#contact">Contact</a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Programs</h4>
          <div className="footer-links">
            <a className="footer-link" href="#services">Yoga</a>
            <a className="footer-link" href="#services">Personal Training</a>
            <a className="footer-link" href="#services">Cardio Zone</a>
            <a className="footer-link" href="#services">Bodybuilding</a>
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
          <a className="footer-social" href="#" aria-label="Instagram">📸</a>
          <a className="footer-social" href="#" aria-label="Facebook">📘</a>
          <a className="footer-social" href="#" aria-label="YouTube">▶️</a>
          <a className="footer-social" href="#" aria-label="WhatsApp">💬</a>
        </div>
      </div>
    </footer>
  );
}
