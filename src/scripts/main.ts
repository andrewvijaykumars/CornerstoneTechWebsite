import { $, html, reducedMotion } from './util';
import { initNav, initDock } from './nav';
import { initFx } from './fx';
import { initFaq, initIndustries, initCopy, initFinder } from './ui';
import { initPwa } from './pwa';

function boot() {
  initNav();
  initDock();
  initFx();
  initFaq();
  initIndustries();
  initFinder();
  initCopy();
  initPwa();

  const startGlobe = () => {
    const canvas = $<HTMLCanvasElement>('.hero__canvas');
    if (!canvas) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    const run = () =>
      import('./globe')
        .then((m) => m.startGlobe({ canvas, reducedMotion }))
        .catch(() => null);
    // Keep the main thread free for the intro.
    if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1500 });
    else setTimeout(run, 400);
  };

  import('./motion')
    .then((m) => m.initMotion(startGlobe))
    .catch(() => {
      html.classList.add('failsafe');
      html.classList.remove('preload');
      startGlobe();
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
