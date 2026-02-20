import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/cursor.css';

export default function Cursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleHover = () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    };

    const handleUnhover = () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    };

    window.addEventListener('mousemove', moveCursor);

    // Add hover effect to all interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, .cta-btn, .service-card, .trainer-card, .gallery-item, .nav-link');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleHover);
        el.addEventListener('mouseleave', handleUnhover);
      });
    };

    // Use MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addHoverListeners();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="custom-cursor" ref={cursorRef}></div>
      <div className="cursor-follower" ref={followerRef}></div>
    </>
  );
}
