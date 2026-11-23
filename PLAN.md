# Cornerstone Tech Advisory LLP: Website

Animated, installable (PWA) marketing site for software consulting firm Cornerstone Tech Advisory LLP. Hosted on Cloudflare Pages at cornerstonetech.co.in.

- Sales and queries: letsconnect@cornerstonetech.co.in
- Support and care: wecare@cornerstonetech.co.in

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 5 (static output) + TypeScript |
| Animation | GSAP (ScrollTrigger, SplitText), Lenis smooth scroll, a dependency-free raw WebGL hero globe (lazy-loaded, about 4 KB gzipped), CSS cross-document view transitions |
| Styling | Hand-written CSS with design tokens (`src/styles`), self-hosted Inter and Space Grotesk |
| PWA | `public/manifest.webmanifest`, `public/sw.js` (stamped with a build version and precache list by `scripts/stamp-sw.mjs`), `public/offline.html` |
| Contact form | Cloudflare Pages Function `functions/api/contact.ts` with Turnstile, honeypot, rate limit and Resend email |
| Security | `public/_headers`: strict CSP (no inline scripts), HSTS, X-Frame-Options, Permissions-Policy |

## Commands

```
npm install
npm run dev          # Astro dev server
npm run build        # builds dist/ and stamps the service worker
node scripts/serve.mjs   # serves dist/ with the production headers on :4321
npm test             # Playwright smoke tests (uses installed Microsoft Edge)
npm run check        # astro check + type check of functions/
npm run icons        # regenerate PNG icons and the social card from public/icons/icon.svg
npm run pages:dev    # build and run with Wrangler (Pages Functions locally; copy .dev.vars.example to .dev.vars first)
```

Copy `.env.example` to `.env` to set the Turnstile site key locally.

## Pages

Home, Services (+12 detail pages), Industries (+12 detail pages), About, Contact, Privacy, Terms, 404. Content lives in `src/data` (`services.ts`, `industries.ts`, `site.ts`).

Business details shown only when filled: `site.details` in `src/data/site.ts` (LLPIN, address, phone, LinkedIn).

## Experience

- Preloader (home, once per session), 3D particle globe with arcs, split-text headline reveal, rotating capability word, dual technology marquee, scroll-scrubbed manifesto, pinned horizontal services showcase (desktop), counters, industries explorer, self-drawing process timeline, FAQ, custom cursor, magnetic buttons, 3D card tilt, scroll progress bar.
- Reduced motion: all animation is removed and content shows immediately. Save-Data, software-rendered WebGL and no-WebGL browsers get a static gradient instead of the globe (add `?globe=force` to the URL to override the software check when testing).
- Devices: 320 px phones to 4K. The root font size scales at 1920, 2560 and 3200 px for Smart TVs. Everything is keyboard and D-pad reachable with strong focus rings.

## Deploy to Cloudflare Pages

1. Push this folder to `github.com/andrewvijaykumars/CornerstoneTechWebsite` (`main`).
2. Cloudflare dashboard: Workers & Pages, Create, Pages, Connect to Git, pick the repo.
   - Framework preset: Astro. Build command: `npm run build`. Output directory: `dist`.
   - Environment variable: `NODE_VERSION=22`.
3. Turnstile: Cloudflare dashboard, Turnstile, add a widget for `cornerstonetech.co.in` (and the `*.pages.dev` preview host if wanted).
4. Resend: create an account, verify the `cornerstonetech.co.in` domain (adds SPF/DKIM DNS records; leave existing MX records alone), create an API key.
5. Pages project, Settings, Variables and Secrets (Production and Preview):
   - `PUBLIC_TURNSTILE_SITEKEY` (plain text, needed at build time)
   - `TURNSTILE_SECRET` (secret)
   - `RESEND_API_KEY` (secret)
   - Optional: `MAIL_FROM`, `SALES_TO`, `SUPPORT_TO` (defaults are in the function).
6. Custom domains: add `cornerstonetech.co.in` and `www.cornerstonetech.co.in`.
7. Redirect www to the apex: Rules, Redirect Rules, `https://www.cornerstonetech.co.in/*` to `https://cornerstonetech.co.in/${1}`, 301.
8. SSL/TLS: Full (strict), Always Use HTTPS, HTTP/3 and Brotli on. Optionally enable cookie-free Web Analytics.
9. Optional hard rate limit: WAF, Rate limiting rules, `/api/contact` POST, 5 requests per 10 minutes per IP.

Mailboxes: if letsconnect@ and wecare@ do not exist yet, use Cloudflare Email Routing to forward them. If a mail provider already hosts them, do not enable Email Routing.

CLI alternative: `npm run deploy` (needs `wrangler login`).

## Verification checklist

- `npm run build`, `npm run check`, `npm test` pass.
- securityheaders.com and Mozilla Observatory after the first deploy.
- Lighthouse on the live URL (mobile): Performance 95+, Accessibility, Best Practices and SEO 100.
- Install as an app on Android Chrome, iOS Safari (Add to Home Screen) and desktop Edge/Chrome.
- Send a real test enquiry for each mailbox.
- Smoke test on a Smart TV browser (Samsung or LG).

## Phase 2 ideas

Case studies and insights blog, careers page, multi-language (Hindi and Tamil), real client logos and testimonials once available.
