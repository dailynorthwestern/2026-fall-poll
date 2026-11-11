type FlourishController = {
  disable_autoload?: boolean;
  loadEmbed?: (placeholder: HTMLElement) => void;
};
declare global { interface Window { Flourish?: FlourishController; } }
let loading: Promise<FlourishController> | undefined;

function loadController() {
  if (window.Flourish?.loadEmbed) return Promise.resolve(window.Flourish);
  if (loading) return loading;
  window.Flourish = { ...window.Flourish, disable_autoload: true };
  loading = new Promise<FlourishController>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://public.flourish.studio/resources/embed.js';
    script.async = true;
    script.onload = () => window.Flourish?.loadEmbed
      ? resolve(window.Flourish)
      : reject(new Error('Flourish embed controller unavailable'));
    script.onerror = () => { script.remove(); reject(new Error('Flourish script failed to load')); };
    document.head.append(script);
  }).catch(error => { loading = undefined; throw error; });
  return loading;
}

export async function initializeVisibleFlourish(scope: ParentNode = document) {
  const placeholders = [...scope.querySelectorAll<HTMLElement>('.flourish-embed[data-src]')]
    .filter(element => !element.closest('[hidden]') && element.getClientRects().length > 0 && !element.querySelector('iframe'));
  if (!placeholders.length) return;
  try {
    const controller = await loadController();
    for (const element of placeholders) {
      if (element.closest('[hidden]') || !element.getClientRects().length || element.querySelector('iframe')) continue;
      element.querySelector('[data-flourish-error]')?.remove();
      controller.loadEmbed!(element);
    }
  } catch {
    for (const element of placeholders) {
      if (element.querySelector('[data-flourish-error]')) continue;
      const link = document.createElement('a');
      link.dataset.flourishError = '';
      link.href = `https://public.flourish.studio/${element.dataset.src}/`;
      link.textContent = 'Chart could not load. View this visualization on Flourish.';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      element.append(link);
    }
  }
}
