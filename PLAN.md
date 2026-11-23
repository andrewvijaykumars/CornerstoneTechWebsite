# Cornerstone Tech Advisory LLP: Website

Animated, installable (PWA) marketing site for Cornerstone Tech Advisory LLP, hosted on Cloudflare Pages at https://cornerstonetech.co.in.

Customers contact the firm by email only (no form, no server code, no secrets):

- Sales and queries: letsconnect@cornerstonetech.co.in
- Support and care: wecare@cornerstonetech.co.in (hosted on Zoho Mail)

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro (static output) + TypeScript |
| Animation | GSAP (ScrollTrigger, SplitText), Lenis smooth scroll, a dependency-free raw WebGL hero globe (about 4 KB gzipped), CSS cross-document view transitions |
| Styling | Hand-written CSS with design tokens (`src/styles`), self-hosted Inter and Space Grotesk |
| PWA | `public/manifest.webmanifest`, `public/sw.js` (stamped with a build version and precache list by `scripts/stamp-sw.mjs`), `public/offline.html` |
| Security | `public/_headers`: strict CSP (no inline scripts or styles), HSTS, frame, referrer and permissions policies; `public/.well-known/security.txt` |

## Commands

```
npm install
npm run dev              # Astro dev server
npm run build            # builds dist/ and stamps the service worker
node scripts/serve.mjs   # serves dist/ with the production headers on :4321
npm test                 # Playwright smoke tests (uses installed Microsoft Edge)
node tests/audit.mjs     # link, heading, overflow and tap-target audit (server must be running)
npm run check            # astro check
npm run icons            # regenerate PNG icons and the social card from public/icons/icon.svg
npm run deploy           # build and upload to Cloudflare Pages (run `npx wrangler@4 login` first)
```

## Pages

Home, Services (+12 detail pages), Industries (+12 detail pages), About, Contact, Privacy, Terms, 404. Content lives in `src/data` (`services.ts`, `industries.ts`, `site.ts`). Business details are shown only when filled in `site.details` in `src/data/site.ts` (LLPIN, address, phone, LinkedIn).

## Experience

- Preloader (home, once per session), 3D particle globe, split-text headline reveal, rotating capability word, technology marquee, scroll-scrubbed manifesto, pinned horizontal services showcase (desktop) and swipeable carousel (phones), counters, industries explorer, self-drawing process timeline, FAQ, custom cursor, magnetic buttons, 3D card tilt, scroll progress bar.
- Reduced motion removes all animation. Save-Data, software-rendered WebGL and no-WebGL browsers get a static gradient instead of the globe (append `?globe=force` to test the globe on a software renderer).
- Devices: 320 px phones to 4K. The root font size scales at 1920, 2560 and 3200 px for Smart TVs. Everything is keyboard and D-pad reachable with strong focus rings.

## Hosting and security

- Cloudflare Pages project `cornerstonetech`, direct upload (`npm run deploy`). Custom domains: `cornerstonetech.co.in` and `www` (301 to the apex).
- Cloudflare zone: SSL Full (strict), Always Use HTTPS, TLS 1.2 minimum, HTTPS rewrites, DNSSEC enabled (add the DS record at the registrar to activate it), email obfuscation off (mailto links are plain).
- DNS: only the website CNAMEs plus Zoho Mail (MX, SPF, DKIM) and one DMARC record. Do not enable Cloudflare Email Routing: it would replace the Zoho MX records.
- GitHub: public repo with secret scanning and push protection, Dependabot alerts and updates, CodeQL, CI (`npm audit`, type check, build), branch protection on `main` (no force pushes or deletion). Actions are pinned to commit SHAs.
- `*.pages.dev` addresses are marked noindex; the canonical site is cornerstonetech.co.in.

## Verification checklist

- `npm run build`, `npm run check`, `npm test` and `node tests/audit.mjs` pass.
- securityheaders.com and Mozilla Observatory on the live URL.
- Lighthouse on the live URL (mobile).
- Install as an app on Android Chrome, iOS Safari (Add to Home Screen) and desktop Edge/Chrome.
- Smoke test on a Smart TV browser (Samsung or LG).

## Phase 2 ideas

Case studies and insights blog, careers page, multi-language (Hindi and Tamil), real client logos and testimonials once available, and a contact form if one is wanted later.
