import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

// Share of the foil that must be cleared before the offer auto-reveals
const REVEAL_AT = 45;
const FOIL_COLORS = ['#e3c189', '#dcb87c', '#b9935a', '#8a6b3c'];
const CONFETTI_COLORS = ['#e3c189', '#dcb87c', '#b9935a', '#8a6b3c', '#ece9e2'];

const rand = (min, max) => min + Math.random() * (max - min);
const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function drawScratchOverlay(ctx, w, h) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, w, h);

  // Bronze foil base
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#5a4526');
  grad.addColorStop(0.28, '#b9935a');
  grad.addColorStop(0.5, '#e3c189');
  grad.addColorStop(0.72, '#a07c45');
  grad.addColorStop(1, '#5a4526');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Brushed-metal grain
  for (let y = 0; y < h; y += 2) {
    ctx.fillStyle = Math.random() > 0.5
      ? `rgba(255,255,255,${rand(0.02, 0.07)})`
      : `rgba(0,0,0,${rand(0.02, 0.06)})`;
    ctx.fillRect(0, y, w, 1);
  }

  // Diamond dot pattern
  ctx.fillStyle = 'rgba(40,28,12,0.14)';
  for (let y = 12; y < h; y += 18) {
    for (let x = (y / 18) % 2 ? 12 : 21; x < w; x += 18) {
      ctx.beginPath();
      ctx.arc(x, y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Dashed inner frame
  ctx.save();
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = 'rgba(40,28,12,0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(12.5, 12.5, w - 25, h - 25);
  ctx.restore();

  // Rising sun emblem
  const cx = w / 2;
  const cy = h / 2 - 12;
  ctx.save();
  ctx.strokeStyle = 'rgba(40,28,12,0.6)';
  ctx.fillStyle = 'rgba(40,28,12,0.6)';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, 11, Math.PI, 0);
  ctx.fill();
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI + (Math.PI * i) / 8;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15);
    ctx.lineTo(cx + Math.cos(a) * 21, cy + Math.sin(a) * 21);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx - 28, cy + 0.5);
  ctx.lineTo(cx + 28, cy + 0.5);
  ctx.stroke();
  ctx.restore();

  // Embossed label
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 15px "Archivo", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillStyle = 'rgba(255,240,210,0.35)';
  ctx.fillText('SCRATCH HERE', cx + 2.5, cy + 27);
  ctx.fillStyle = 'rgba(30,20,8,0.85)';
  ctx.fillText('SCRATCH HERE', cx + 2.5, cy + 26);

  ctx.font = '500 11px "Inter", sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillStyle = 'rgba(30,20,8,0.65)';
  ctx.fillText('Your admission offer is hidden underneath', cx, cy + 48);
  ctx.restore();
}

export default function ScratchCard({ onReveal, revealed: externalRevealed }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fxRef = useRef(null);
  const [localRevealed, setLocalRevealed] = useState(false);
  // Revealed either by scratching here or by the parent
  const revealed = localRevealed || !!externalRevealed;
  const [started, setStarted] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isScratching = useRef(false);
  const startedRef = useRef(false);
  const lastPos = useRef(null);
  const lastCheck = useRef(0);
  const lastFlake = useRef(0);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScratchOverlay(ctx, rect.width, rect.height);
    };
    paint();

    // Repaint once web fonts arrive, unless the visitor already started scratching
    document.fonts?.ready.then(() => {
      if (!startedRef.current) paint();
    });
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // Tiny foil shavings that fall off where the visitor scratches
  const spawnFlakes = (pos) => {
    const fx = fxRef.current;
    const now = performance.now();
    if (!fx || now - lastFlake.current < 35 || prefersReducedMotion()) return;
    lastFlake.current = now;

    for (let i = 0; i < 3; i++) {
      const flake = document.createElement('span');
      const size = rand(2, 5);
      flake.className = 'scratch-flake';
      Object.assign(flake.style, {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${size}px`,
        height: `${size * rand(0.5, 1)}px`,
        background: FOIL_COLORS[Math.floor(Math.random() * FOIL_COLORS.length)],
      });
      fx.appendChild(flake);
      gsap.to(flake, {
        x: rand(-28, 28),
        y: rand(30, 80),
        rotation: rand(-200, 200),
        opacity: 0,
        duration: rand(0.5, 0.9),
        ease: 'power1.in',
        onComplete: () => flake.remove(),
      });
    }
  };

  const burstConfetti = () => {
    const fx = fxRef.current;
    const card = containerRef.current;
    if (!fx || !card || prefersReducedMotion()) return;

    const { width, height } = card.getBoundingClientRect();
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('span');
      const isDot = Math.random() > 0.6;
      piece.className = 'scratch-confetti';
      Object.assign(piece.style, {
        left: `${width / 2}px`,
        top: `${height / 2}px`,
        width: `${isDot ? 6 : rand(6, 11)}px`,
        height: `${isDot ? 6 : rand(3, 5)}px`,
        borderRadius: isDot ? '50%' : '1px',
        background: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      });
      fx.appendChild(piece);
      gsap.timeline({ onComplete: () => piece.remove() })
        .to(piece, {
          x: rand(-width * 0.7, width * 0.7),
          y: rand(-height * 0.9, -height * 0.2),
          rotation: rand(-360, 360),
          duration: rand(0.5, 0.75),
          ease: 'power3.out',
        })
        .to(piece, {
          y: `+=${rand(height * 0.8, height * 1.3)}`,
          rotation: `+=${rand(-180, 180)}`,
          opacity: 0,
          duration: rand(1, 1.5),
          ease: 'power1.in',
        });
    }
  };

  const revealOffer = useCallback(() => {
    if (revealed) return;
    setLocalRevealed(true);
    isScratching.current = false;

    const canvas = canvasRef.current;
    const card = containerRef.current;
    if (canvas) {
      gsap.to(canvas, { opacity: 0, scale: 1.06, duration: 0.7, ease: 'power2.out' });
    }
    const free = card?.querySelector('.scratch-free-text');
    if (free) {
      gsap.fromTo(free, { scale: 0.7 }, { scale: 1, duration: 1, ease: 'elastic.out(1, 0.45)' });
    }
    burstConfetti();
    navigator.vibrate?.([25, 40, 60]);

    if (onReveal) onReveal();
  }, [revealed, onReveal]);

  // Measure how much foil is really gone by sampling the canvas alpha
  const measureCleared = () => {
    const canvas = canvasRef.current;
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let samples = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      samples++;
      if (data[i] < 128) cleared++;
    }
    return (cleared / samples) * 100;
  };

  const scratch = (pos) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;

    const ctx = canvas.getContext('2d');
    const radius = Math.max(18, canvas.clientWidth * 0.055);
    ctx.globalCompositeOperation = 'destination-out';

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineWidth = radius * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Main dab plus a few jittered ones for a rough, coin-scratched edge
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(pos.x + rand(-radius, radius), pos.y + rand(-radius, radius), radius * rand(0.25, 0.5), 0, Math.PI * 2);
      ctx.fill();
    }

    lastPos.current = pos;
    spawnFlakes(pos);

    const now = performance.now();
    if (now - lastCheck.current > 90) {
      lastCheck.current = now;
      const percent = measureCleared();
      setScratchPercent(percent);
      if (percent >= REVEAL_AT) revealOffer();
    }
  };

  const handleStart = (e) => {
    if (revealed) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    isScratching.current = true;
    if (!startedRef.current) {
      startedRef.current = true;
      setStarted(true);
    }
    lastPos.current = null;
    scratch(getPos(e));
  };

  const handleMove = (e) => {
    if (!isScratching.current || revealed) return;
    e.preventDefault();
    scratch(getPos(e));
  };

  const handleEnd = () => {
    isScratching.current = false;
    lastPos.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      revealOffer();
    }
  };

  return (
    <div className="scratch-card-shell">
      <div className={`scratch-card${revealed ? ' is-revealed' : ''}`} ref={containerRef}>
        {/* Content underneath the scratch surface */}
        <div className={`scratch-content ${revealed ? 'revealed' : ''}`}>
          <div className="scratch-offer-text">Admission Fee</div>
          <div className="scratch-free-wrapper">
            <div className="scratch-free-text">FREE</div>
            <div className="scratch-rupee-zero">₹0</div>
          </div>
          <div className="scratch-offer-sub">Zero Admission Fee. Forever.</div>
        </div>

        {/* Canvas scratch overlay */}
        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          role="button"
          tabIndex={revealed ? -1 : 0}
          aria-label="Scratch card. Scratch it, or press Enter to reveal your admission offer."
          onPointerDown={handleStart}
          onPointerMove={handleMove}
          onPointerUp={handleEnd}
          onPointerCancel={handleEnd}
          onKeyDown={handleKeyDown}
        />

        {/* Idle hints, gone as soon as scratching starts */}
        {!started && !revealed && (
          <>
            <div className="scratch-shimmer" aria-hidden="true" />
            <div className="scratch-coin-hint" aria-hidden="true">₹</div>
          </>
        )}

        {/* Scratch progress */}
        {started && !revealed && (
          <div className="scratch-progress" aria-hidden="true">
            <div
              className="scratch-progress-bar"
              style={{ width: `${Math.min(100, (scratchPercent / REVEAL_AT) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Foil shavings and confetti live outside the clipped card */}
      <div className="scratch-fx" ref={fxRef} aria-hidden="true" />
    </div>
  );
}
