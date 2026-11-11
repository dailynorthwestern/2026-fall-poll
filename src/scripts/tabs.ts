import { initializeVisibleFlourish } from './flourish';

export function enhanceTabs(root: HTMLElement) {
  if (root.dataset.tabsReady) return;
  root.dataset.tabsReady = 'true';
  const own = (selector: string) => [...root.querySelectorAll<HTMLElement>(selector)]
    .filter(element => element.closest('[data-tabs]') === root);
  const buttons = own('[data-tab-button]') as HTMLButtonElement[];
  const panels = own('[data-tab-panel]');
  let active = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function select(index: number, scroll = false) {
    if (!panels[index]) return;
    active = index;
    buttons.forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
      panels[i].getAnimations().forEach(animation => animation.cancel());
    });
    const panel = panels[index];
    if (!root.closest('[hidden]')) {
      void initializeVisibleFlourish(panel);
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    }
    if (!reducedMotion.matches && scroll) panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180 });
    if (scroll && root.hasAttribute('data-scroll-tabs')) {
      const top = root.getBoundingClientRect().top;
      const headers = document.querySelector<HTMLElement>('[data-scrolling-headers]');
      const offset = (headers?.offsetHeight ?? 154) + 16;
      if (top < offset) window.scrollTo({ top: Math.max(0, window.scrollY + top - offset), behavior: 'instant' });
    }
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index, true));
    button.addEventListener('keydown', event => {
      let next = active;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      select(next, true);
      buttons[next].focus({ preventScroll: true });
    });
  });
  select(0);
}
