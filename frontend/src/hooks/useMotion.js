import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const isTouch = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 768px)').matches;

/* ------------------------------------------------------------------ *
 * useSplitReveal
 * Finds every [data-reveal] element inside scopeRef and animates its
 * words rising out of a per-line mask as it scrolls into view.
 * The signature "GSAP showcase" heading reveal — mature, no flash.
 *
 *   data-reveal            -> default word rise
 *   data-reveal="chars"    -> character-level rise (use for big display)
 *   data-reveal-stagger    -> override stagger (seconds)
 * ------------------------------------------------------------------ */
export function useSplitReveal(scopeRef, deps = []) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    const splits = [];
    const triggers = [];
    let cancelled = false;

    const build = () => {
      if (cancelled || !scope) return;

      gsap.utils.toArray('[data-reveal]', scope).forEach((el) => {
        const mode = el.getAttribute('data-reveal') || 'words';
        const type = mode === 'chars' ? 'lines,words,chars' : 'lines,words';
        const stagger = parseFloat(el.getAttribute('data-reveal-stagger')) ||
          (mode === 'chars' ? 0.025 : 0.07);

        const split = new SplitText(el, { type, mask: 'lines' });
        splits.push(split);

        const targets = mode === 'chars' ? split.chars : split.words;
        gsap.set(el, { opacity: 1 });

        const anim = gsap.from(targets, {
          yPercent: 118,
          duration: 1.1,
          ease: 'power4.out',
          stagger,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
      });

      ScrollTrigger.refresh();
    };

    // Wait for fonts so SplitText measures line breaks correctly.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build);
    } else {
      build();
    }

    return () => {
      cancelled = true;
      triggers.forEach((t) => t.kill());
      splits.forEach((s) => s.revert());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ------------------------------------------------------------------ *
 * applyMagnetic — attaches a magnetic pull to a single element.
 * Returns a cleanup function.
 * ------------------------------------------------------------------ */
export function applyMagnetic(el, strength = 0.35) {
  if (!el) return () => {};

  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    xTo(relX * strength);
    yTo(relY * strength);
  };
  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
  };

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
  return () => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
  };
}

/* ------------------------------------------------------------------ *
 * useMagnetic — magnetises every [data-magnetic] element in scope.
 * Skipped on touch / small screens.
 * ------------------------------------------------------------------ */
export function useMagnetic(scopeRef, strength = 0.35, deps = []) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || isTouch()) return undefined;

    const cleanups = gsap.utils
      .toArray('[data-magnetic]', scope)
      .map((el) => applyMagnetic(el, strength));

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
