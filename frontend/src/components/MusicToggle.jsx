import { useRef, useEffect } from 'react';
import '../styles/footer.css';

export default function MusicToggle({ isPlaying, onToggle }) {
  const btnRef = useRef(null);

  useEffect(() => {
    // Magnetic hover effect (desktop only)
    const btn = btnRef.current;
    if (!btn) return;

    // Skip magnetic effect on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    };

    const handleLeave = () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    };

    btn.addEventListener('mousemove', handleMove);
    btn.addEventListener('mouseleave', handleLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMove);
      btn.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <button
      className={`music-toggle ${isPlaying ? 'playing' : 'muted'}`}
      onClick={onToggle}
      ref={btnRef}
      aria-label={isPlaying ? 'Mute music' : 'Click to play music'}
      title={isPlaying ? '🔊 Mute' : '🔇 Play Music'}
    >
      {isPlaying ? (
        <div className="bars">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      ) : (
        <svg className="mute-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" />
          <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

