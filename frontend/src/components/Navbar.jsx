import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import logo from '../assets/images/logo.png';
import '../styles/navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const closeRef = useRef(null);
  const menuLinksRef = useRef(null);
  const menuTl = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 80);
      setHidden(current > lastScroll.current && current > 300);
      lastScroll.current = current;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animate nav links on load
    gsap.fromTo('.nav-link', {
      y: -20,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.5,
      ease: 'power3.out',
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openMenu = () => {
    setMenuOpen(true);

    // Kill any existing timeline
    if (menuTl.current) menuTl.current.kill();

    const tl = gsap.timeline();
    menuTl.current = tl;

    const menu = menuRef.current;
    const closeBtn = closeRef.current;
    const links = menuLinksRef.current?.querySelectorAll('.mobile-nav-link');

    // Show menu
    tl.set(menu, { visibility: 'visible' });
    tl.to(menu, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, 0);

    // Close button spins in with bounce
    tl.fromTo(closeBtn, {
      scale: 0,
      rotation: -180,
      opacity: 0,
    }, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(2)',
    }, 0.15);

    // Nav links stagger fly in
    if (links && links.length) {
      tl.fromTo(links, {
        y: 60,
        opacity: 0,
        skewY: 4,
      }, {
        y: 0,
        opacity: 1,
        skewY: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      }, 0.25);
    }
  };

  const closeMenu = () => {
    // Kill any existing timeline
    if (menuTl.current) menuTl.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        setMenuOpen(false);
        gsap.set(menuRef.current, { visibility: 'hidden', opacity: 0 });
      },
    });
    menuTl.current = tl;

    const closeBtn = closeRef.current;
    const links = menuLinksRef.current?.querySelectorAll('.mobile-nav-link');

    // Close button spins out
    tl.to(closeBtn, {
      scale: 0,
      rotation: 180,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 0);

    // Links fly out
    if (links && links.length) {
      tl.to(links, {
        y: -30,
        opacity: 0,
        duration: 0.25,
        stagger: 0.04,
        ease: 'power2.in',
      }, 0);
    }

    // Fade menu
    tl.to(menuRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 0.15);
  };

  // Navigate to a route or scroll to a section
  const navigateTo = (target) => {
    // Only close mobile menu if it's actually open
    const isOpen = menuOpen;
    if (isOpen) {
      closeMenu();
    }

    const delay = isOpen ? 400 : 0;

    // If target is a route (starts with /)
    if (target.startsWith('/')) {
      setTimeout(() => {
        navigate(target);
        window.scrollTo(0, 0);
      }, delay);
      return;
    }

    // If we're on the home page, scroll to section
    if (location.pathname === '/') {
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, delay);
    } else {
      // Navigate to home then scroll to section
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 600);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}
        ref={navRef}
      >
        <div className="navbar-inner">
          <a className="nav-logo" onClick={() => navigateTo('hero')}>
            <img src={logo} alt="Rising Sun Fitness" className="nav-logo-img" />
            RISING <span className="highlight">SUN</span>
          </a>

          <div className="nav-links">
            <a className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => navigateTo('hero')}>Home</a>
            <a className={`nav-link ${isActive('/trainers') ? 'active' : ''}`} onClick={() => navigateTo('/trainers')}>Trainers</a>
            <a className={`nav-link ${isActive('/pricing') ? 'active' : ''}`} onClick={() => navigateTo('/pricing')}>Pricing</a>
            <a className={`nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => navigateTo('/contact')}>Contact Us</a>
          </div>

          <button
            className={`nav-hamburger ${menuOpen ? 'active' : ''}`}
            onClick={openMenu}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="mobile-menu" ref={menuRef}>
        <button className="mobile-menu-close" ref={closeRef} onClick={closeMenu}>
          <span></span>
          <span></span>
        </button>
        <div ref={menuLinksRef}>
          <a className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => navigateTo('hero')}>Home</a>
          <a className={`mobile-nav-link ${isActive('/trainers') ? 'active' : ''}`} onClick={() => navigateTo('/trainers')}>Trainers</a>
          <a className={`mobile-nav-link ${isActive('/pricing') ? 'active' : ''}`} onClick={() => navigateTo('/pricing')}>Pricing</a>
          <a className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => navigateTo('/contact')}>Contact Us</a>
        </div>
      </div>
    </>
  );
}
