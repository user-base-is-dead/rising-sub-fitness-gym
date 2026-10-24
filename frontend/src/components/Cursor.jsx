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

    // One delegated listener instead of re-binding every element on each DOM change
    const INTERACTIVE = 'a, button, .cta-btn, .service-card, .trainer-card, .gallery-item, .nav-link, [data-magnetic]';
    const handleOver = (e) => {
      const isHover = !!e.target.closest?.(INTERACTIVE);
      cursor.classList.toggle('hover', isHover);
      follower.classList.toggle('hover', isHover);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleOver);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor" ref={cursorRef}></div>
      <div className="cursor-follower" ref={followerRef}></div>
    </>
  );
}
