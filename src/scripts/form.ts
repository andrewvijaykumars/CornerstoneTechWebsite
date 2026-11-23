import { $, $$ } from './util';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initForm() {
  const form = $<HTMLFormElement>('[data-form]');
  if (!form) return;
  const note = $('.form__note', form)!;
  const submit = $<HTMLButtonElement>('button[type=submit]', form)!;
  const sitekey = form.dataset.sitekey ?? '';
  const holder = $<HTMLElement>('[data-turnstile]', form);
  let widget: string | undefined;
  let token = '';

  const loadTurnstile = () => {
    if (!sitekey || !holder || document.getElementById('cf-turnstile')) return;
    const s = document.createElement('script');
    s.id = 'cf-turnstile';
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => {
      widget = window.turnstile?.render(holder, {
        sitekey,
        theme: 'dark',
        callback: (t: string) => (token = t),
        'expired-callback': () => (token = ''),
        'error-callback': () => (token = ''),
      });
    };
    document.head.append(s);
  };
  form.addEventListener('focusin', loadTurnstile, { once: true });

  const setNote = (msg: string, kind: '' | 'ok' | 'err' = '') => {
    note.textContent = msg;
    note.className = `form__note${kind ? ` is-${kind}` : ''}`;
  };
  const fail = (field: HTMLElement, msg: string) => {
    const wrap = field.closest('.field');
    wrap?.classList.add('is-invalid');
    const err = wrap?.querySelector('.field__err');
    if (err) err.textContent = msg;
  };

  $$<HTMLInputElement | HTMLTextAreaElement>('input,textarea', form).forEach((el) =>
    el.addEventListener('input', () => el.closest('.field')?.classList.remove('is-invalid')),
  );

  const mailtoFallback = (data: Record<string, string>) => {
    const to = data.dept === 'support' ? 'wecare@cornerstonetech.co.in' : 'letsconnect@cornerstonetech.co.in';
    const body = `${data.message}\n\n${data.name}${data.company ? `, ${data.company}` : ''}\n${data.email}`;
    return `mailto:${to}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, String(v).trim()])) as Record<string, string>;
    $$('.field', form).forEach((f) => f.classList.remove('is-invalid'));
    let ok = true;
    if (data.name.length < 2) (fail(form.elements.namedItem('name') as HTMLElement, 'Please enter your name.'), (ok = false));
    if (!EMAIL.test(data.email)) (fail(form.elements.namedItem('email') as HTMLElement, 'Please enter a valid email address.'), (ok = false));
    if (data.message.length < 10) (fail(form.elements.namedItem('message') as HTMLElement, 'Please tell us a little more (10+ characters).'), (ok = false));
    if (!ok) {
      setNote('Please check the highlighted fields.', 'err');
      form.querySelector<HTMLElement>('.is-invalid input, .is-invalid textarea')?.focus();
      return;
    }
    if (sitekey && !token) {
      loadTurnstile();
      setNote('Please wait for the security check to finish, then try again.', 'err');
      return;
    }

    submit.disabled = true;
    setNote('Sending…');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, token }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setNote('Thank you. Your message has been sent and we will reply within one business day.', 'ok');
    } catch {
      note.className = 'form__note is-err';
      note.textContent = 'We could not send your message right now. ';
      const a = document.createElement('a');
      a.href = mailtoFallback(data);
      a.textContent = 'Email us directly instead.';
      a.style.textDecoration = 'underline';
      note.append(a);
    } finally {
      submit.disabled = false;
      token = '';
      if (widget) window.turnstile?.reset(widget);
    }
  });
}
