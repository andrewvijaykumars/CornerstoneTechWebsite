interface Env {
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  SALES_TO?: string;
  SUPPORT_TO?: string;
}

const DEFAULT_SALES = 'letsconnect@cornerstonetech.co.in';
const DEFAULT_SUPPORT = 'wecare@cornerstonetech.co.in';
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const MAX_BODY = 10_000;
const RATE_LIMIT = 5;
const RATE_WINDOW_S = 600;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

// Collapse whitespace and drop control characters so values are safe in headers and subjects.
const oneLine = (v: unknown, max: number) =>
  String(v ?? '')
    .replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

const multiLine = (v: unknown, max: number) =>
  String(v ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function rateLimited(ip: string): Promise<boolean> {
  // Best effort per data centre via the Cache API; Cloudflare WAF rate limiting is the hard limit.
  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request(`https://rate-limit.internal/contact/${encodeURIComponent(ip)}`);
  const hit = await cache.match(key);
  const count = hit ? Number(await hit.text()) || 0 : 0;
  if (count >= RATE_LIMIT) return true;
  await cache.put(key, new Response(String(count + 1), { headers: { 'Cache-Control': `max-age=${RATE_WINDOW_S}` } }));
  return false;
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  // Same-origin only: blocks cross-site form posts.
  const origin = request.headers.get('Origin');
  let originHost = '';
  try {
    originHost = origin ? new URL(origin).host : '';
  } catch {
    /* malformed Origin is treated as missing */
  }
  if (!originHost || originHost !== url.host) return json({ error: 'Forbidden' }, 403);
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) return json({ error: 'Unsupported media type' }, 415);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: 'Payload too large' }, 413);
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  // Honeypot: pretend success so bots learn nothing.
  if (oneLine(data.website, 200)) return json({ ok: true });

  const name = oneLine(data.name, 80);
  const email = oneLine(data.email, 120);
  const company = oneLine(data.company, 120);
  const message = multiLine(data.message, 2000);
  const dept = data.dept === 'support' ? 'support' : data.dept === 'sales' ? 'sales' : '';

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10 || !dept) {
    return json({ error: 'Please check your details and try again.' }, 422);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? '';

  if (env.TURNSTILE_SECRET) {
    const token = oneLine(data.token, 2048);
    if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET, token, ip))) return json({ error: 'Security check failed' }, 403);
  } else if (!isLocal) {
    return json({ error: 'Service not configured' }, 503);
  }

  if (ip && (await rateLimited(ip))) return json({ error: 'Too many requests. Please try again later.' }, 429);

  if (!env.RESEND_API_KEY) {
    if (isLocal) return json({ ok: true, dev: true });
    return json({ error: 'Service not configured' }, 503);
  }

  const to = dept === 'support' ? env.SUPPORT_TO || DEFAULT_SUPPORT : env.SALES_TO || DEFAULT_SALES;
  const label = dept === 'support' ? 'Support & Care' : 'Sales';
  const subject = `[Website ${label}] ${name}${company ? ` (${company})` : ''}`.slice(0, 200);
  const html = `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.6;color:#111">
<h2 style="margin:0 0 12px">New website enquiry: ${escapeHtml(label)}</h2>
<table cellpadding="6" style="border-collapse:collapse">
<tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
<tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>
<tr><td><b>Company</b></td><td>${escapeHtml(company) || '-'}</td></tr>
</table>
<p style="white-space:pre-wrap;border-left:3px solid #22d3ee;padding-left:12px;margin-top:16px">${escapeHtml(message)}</p>
</div>`;
  const text = `New website enquiry (${label})\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || '-'}\n\n${message}\n`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM || 'Cornerstone Website <noreply@cornerstonetech.co.in>',
      to: [to],
      reply_to: email,
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return json({ error: 'Could not send message' }, 502);
  }
  return json({ ok: true });
};

export const onRequest: PagesFunction<Env> = async () => json({ error: 'Method not allowed' }, 405);
