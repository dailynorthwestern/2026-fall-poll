import { pairOpacity } from './pair-opacity';

export function initializePairedStories() {
  for (const root of document.querySelectorAll<HTMLElement>('[data-paired-story]')) {
    if (root.dataset.ready) continue;
    root.dataset.ready = 'true';
    const pairs = [...root.querySelectorAll<HTMLElement>(':scope > .story-step')];
    const headers = document.querySelector<HTMLElement>('[data-scrolling-headers]');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let queued = false;
    let firstEntranceStarted = false;
    // The first pair may already be in the reading area when this script runs.
    // Establish a rendered zero state so its initial update can visibly fade in.
    if (pairs[0] && !reducedMotion.matches) {
      pairs[0].setAttribute('data-first-entrance', '');
      pairs[0].style.setProperty('--pair-opacity', '0');
      void getComputedStyle(pairs[0]).opacity;
    }
    function update() {
      queued = false;
      if (!root.getClientRects().length || root.closest('[hidden]')) return;
      if (reducedMotion.matches) {
        pairs.forEach(pair => pair.style.removeProperty('--pair-opacity'));
        return;
      }
      const styles = getComputedStyle(root);
      const fadeIn = Math.max(0.01, Math.min(1, parseFloat(styles.getPropertyValue('--pair-fade-in-distance')) || 0.30));
      const fadeOut = Math.max(0.01, Math.min(1, parseFloat(styles.getPropertyValue('--pair-fade-out-distance')) || 0.32));
      const minimum = Math.max(0, Math.min(1, parseFloat(styles.getPropertyValue('--pair-min-opacity')) || 0));
      const readingTop = Math.max(0, headers?.getBoundingClientRect().bottom ?? 0);
      const readingBottom = window.innerHeight;
      pairs.forEach(pair => {
        const rect = pair.getBoundingClientRect();
        const opacity = pairOpacity(rect.top, rect.bottom, readingTop, readingBottom, fadeIn, fadeOut, minimum);
        pair.style.setProperty('--pair-opacity', String(opacity));
        if (pair === pairs[0] && opacity > 0 && !firstEntranceStarted) {
          firstEntranceStarted = true;
          const duration = parseFloat(styles.getPropertyValue('--first-pair-fade-duration')) || 600;
          window.setTimeout(() => pair.removeAttribute('data-first-entrance'), duration);
        }
      });
    }
    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }
    // A single passive, frame-throttled scroll listener updates whole pairs only.
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    reducedMotion.addEventListener('change', schedule);
    const observer = new ResizeObserver(schedule);
    pairs.forEach(pair => observer.observe(pair));
    if (headers) observer.observe(headers);
    // Header transforms do not emit resize events; read their live edge on each frame.
    root.addEventListener('focusin', schedule);
    schedule();
  }
}
