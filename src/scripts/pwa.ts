import { $, toast } from './util';

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function initPwa() {
  const secure = location.protocol === 'https:' || location.hostname === 'localhost';
  if ('serviceWorker' in navigator && secure) {
    addEventListener('load', async () => {
      const hadController = !!navigator.serviceWorker.controller;
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        const prompt = (w: ServiceWorker) =>
          toast('A new version of the site is available.', 'Refresh', () => w.postMessage({ type: 'SKIP_WAITING' }));
        if (reg.waiting && navigator.serviceWorker.controller) prompt(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const w = reg.installing;
          w?.addEventListener('statechange', () => {
            if (w.state === 'installed' && navigator.serviceWorker.controller) prompt(w);
          });
        });
        let reloading = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (reloading || !hadController) return;
          reloading = true;
          location.reload();
        });
      } catch {
        /* registration is a progressive enhancement */
      }
    });
  }

  let deferred: InstallEvent | null = null;
  const btn = $<HTMLButtonElement>('[data-install]');
  addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as InstallEvent;
    if (btn) btn.hidden = false;
  });
  btn?.addEventListener('click', async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    btn.hidden = true;
  });
  addEventListener('appinstalled', () => {
    if (btn) btn.hidden = true;
  });
}
