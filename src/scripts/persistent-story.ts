import { activeSection } from './story-boundaries';
import { initializeVisibleFlourish } from './flourish';

export function initializePersistentStories() {
  for (const root of document.querySelectorAll<HTMLElement>('[data-persistent-story]')) {
    if (root.dataset.ready) continue;
    root.dataset.ready = 'true';
    const steps = [...root.querySelectorAll<HTMLElement>('[data-persistent-step]')];
    const charts = [...root.querySelectorAll<HTMLElement>('[data-persistent-chart]')];
    if (!steps.length) continue;
    const desktop = matchMedia('(min-width: 901px)');
    const headers = document.querySelector<HTMLElement>('[data-scrolling-headers]');
    let current = 0;
    let queued = false;

    function select(index: number) {
      current = index;
      steps.forEach((step, i) => step.toggleAttribute('data-future', desktop.matches && i > current));
      charts.forEach((chart, i) => {
        chart.toggleAttribute('data-active', i === current);
        chart.inert = desktop.matches && i !== current;
        if (desktop.matches && i !== current) chart.setAttribute('aria-hidden', 'true');
        else chart.removeAttribute('aria-hidden');
      });
    }

    function update() {
      queued = false;
      if (!root.getClientRects().length || root.closest('[hidden]')) return;
      const top = (headers?.offsetHeight ?? 154) + 16;
      const available = Math.max(1, window.innerHeight - top - 16);
      root.style.setProperty('--persistent-top', `${top}px`);
      root.style.setProperty('--persistent-available', `${available}px`);
      if (!desktop.matches) { select(current); return; }
      charts.forEach(chart => {
        const naturalHeight = chart.offsetHeight;
        chart.style.setProperty('--chart-fit-scale', `${Math.min(1, available / Math.max(1, naturalHeight))}`);
      });
      // Match the stage to the first rendered chart, instead of centering it
      // inside a viewport-height box before sticky positioning begins.
      const firstHeight = Math.min(available, charts[0].offsetHeight);
      root.style.setProperty('--persistent-stage-height', `${firstHeight}px`);
      root.style.setProperty('--persistent-centered-top', `${top + (available - firstHeight) / 2}px`);
      const paragraphs = steps.map(step => step.querySelector<HTMLElement>('.story-copy p:last-child') ?? step.querySelector<HTMLElement>('.story-copy')!);
      const bottoms = paragraphs.map(paragraph => paragraph.getBoundingClientRect().bottom);
      const heights = paragraphs.map(paragraph => parseFloat(getComputedStyle(paragraph).lineHeight) || 32);
      select(activeSection(bottoms, heights, top, current));
      const lastHeight = steps.at(-1)!.offsetHeight;
      root.style.setProperty('--persistent-tail', `${Math.max(0, available - lastHeight)}px`);
    }
    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }
    root.dataset.enhanced = '';
    select(0);
    const observer = new ResizeObserver(schedule);
    steps.forEach(step => observer.observe(step));
    charts.forEach(chart => observer.observe(chart));
    if (headers) observer.observe(headers);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    desktop.addEventListener('change', () => { select(current); schedule(); void initializeVisibleFlourish(root); });
    // Tab selection already emits resize; ResizeObserver also handles returning from hidden panels.
    schedule();
    void initializeVisibleFlourish(root);
  }
}
