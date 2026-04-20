import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

export default function ScratchCard({ onReveal, revealed: externalRevealed }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const lastPos = useRef(null);
  const scratchedPixels = useRef(0);
  const totalPixels = useRef(0);
  const animFrameRef = useRef(null);

  // Sync with external revealed state
  useEffect(() => {
    if (externalRevealed) setRevealed(true);
  }, [externalRevealed]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Draw the scratch overlay
    drawScratchOverlay(ctx, rect.width, rect.height);

    totalPixels.current = rect.width * rect.height;
    scratchedPixels.current = 0;
  }, []);

  const drawScratchOverlay = (ctx, w, h) => {
    // Gradient metallic background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#2a2a2a');
    grad.addColorStop(0.3, '#4a4a4a');
    grad.addColorStop(0.5, '#3a3a3a');
    grad.addColorStop(0.7, '#555555');
    grad.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Metallic shine streaks
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      const x = Math.random() * w;
      const y = Math.random() * h;
      const length = 30 + Math.random() * 80;
      ctx.moveTo(x, y);
      ctx.lineTo(x + length, y + length * 0.3);
      ctx.strokeStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.06})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.stroke();
    }

    // Scratch pattern dots
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.beginPath();
      ctx.arc(x, y, 0.5 + Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.05})`;
      ctx.fill();
    }

    // Text
    ctx.save();
    ctx.fillStyle = '#999';
    ctx.font = 'bold 14px "Oswald", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '4px';
    ctx.fillText('✦  SCRATCH HERE  ✦', w / 2, h / 2 - 14);
    
    ctx.fillStyle = '#666';
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillText('Reveal your offer', w / 2, h / 2 + 14);
    ctx.restore();

    // Animated shimmer line
    const shimmerGrad = ctx.createLinearGradient(0, 0, w, 0);
    shimmerGrad.addColorStop(0, 'rgba(255,255,255,0)');
    shimmerGrad.addColorStop(0.4, 'rgba(255,255,255,0)');
    shimmerGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
    shimmerGrad.addColorStop(0.6, 'rgba(255,255,255,0)');
    shimmerGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shimmerGrad;
    ctx.fillRect(0, 0, w, h);
  };

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const scratch = useCallback((pos) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';

    // Draw scratch stroke
    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineWidth = 45;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Also draw circle at current position for better coverage
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
    ctx.fill();

    lastPos.current = pos;

    // Track scratched area
    scratchedPixels.current += 45 * 2;

    // Calculate percentage
    const percent = Math.min(100, (scratchedPixels.current / totalPixels.current) * 100 * 8);
    setScratchPercent(percent);

    // Auto-reveal at 40%
    if (percent >= 40 && !revealed) {
      revealOffer();
    }
  }, [revealed]);

  const revealOffer = useCallback(() => {
    if (revealed) return;
    setRevealed(true);

    const canvas = canvasRef.current;
    if (canvas) {
      // Animate the canvas fading away
      gsap.to(canvas, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    if (onReveal) onReveal();
  }, [revealed, onReveal]);

  const handleStart = useCallback((e) => {
    if (revealed) return;
    e.preventDefault();
    setIsScratching(true);
    lastPos.current = getPos(e);
  }, [revealed, getPos]);

  const handleMove = useCallback((e) => {
    if (!isScratching || revealed) return;
    e.preventDefault();
    const pos = getPos(e);
    scratch(pos);
  }, [isScratching, revealed, getPos, scratch]);

  const handleEnd = useCallback(() => {
    setIsScratching(false);
    lastPos.current = null;
  }, []);

  return (
    <div className="scratch-card" ref={containerRef}>
      {/* Content underneath the scratch surface */}
      <div className={`scratch-content ${revealed ? 'revealed' : ''}`}>
        <div className="scratch-offer-text">ADMISSION FEE</div>
        <div className="scratch-free-wrapper">
          <div className="scratch-free-text">FREE</div>
          <div className="scratch-rupee-zero">₹0</div>
        </div>
        <div className="scratch-offer-sub">Zero Admission Fee. Forever.</div>
        {revealed && (
          <>
            <div className="scratch-particles">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="scratch-particle" style={{
                  '--delay': `${i * 0.05}s`,
                  '--x': `${(Math.random() - 0.5) * 300}px`,
                  '--y': `${(Math.random() - 0.5) * 200}px`,
                  '--rot': `${Math.random() * 720}deg`,
                  '--size': `${4 + Math.random() * 8}px`,
                  '--color': ['#d4a017', '#f0c040', '#ff6b35', '#fff', '#d4a017'][Math.floor(Math.random() * 5)],
                }} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Canvas scratch overlay */}
      <canvas
        ref={canvasRef}
        className="scratch-canvas"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {/* Scratch progress hint */}
      {!revealed && scratchPercent > 0 && scratchPercent < 40 && (
        <div className="scratch-progress">
          <div className="scratch-progress-bar" style={{ width: `${(scratchPercent / 40) * 100}%` }} />
        </div>
      )}
    </div>
  );
}
