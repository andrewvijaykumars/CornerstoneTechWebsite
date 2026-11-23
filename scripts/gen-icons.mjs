// Generates PNG app icons and the social card from public/icons/icon.svg. Run: npm run icons
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (f) => path.join(root, 'public', 'icons', f);
const svg = await readFile(out('icon.svg'));

const png = (size, file, input = svg) => sharp(input, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toFile(out(file));

await png(192, 'icon-192.png');
await png(512, 'icon-512.png');
await png(180, 'apple-touch-icon.png');
await png(48, 'favicon-48.png');

// Maskable: full-bleed background, logo inside the 80% safe zone.
const maskable = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#101a3f"/><stop offset="1" stop-color="#05070f"/></linearGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#818cf8"/><stop offset=".55" stop-color="#22d3ee"/><stop offset="1" stop-color="#34d399"/></linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g transform="translate(138 138) scale(3.7)" stroke-linejoin="round">
    <path d="M32 4 58 18v28L32 60 6 46V18Z" fill="none" stroke="url(#g)" stroke-width="4"/>
    <path d="M32 4v28l26-14M32 32 6 18" fill="none" stroke="url(#g)" stroke-width="4"/>
    <path d="M32 32v28L6 46V18Z" fill="url(#g)" opacity=".9"/>
  </g></svg>`);
await png(192, 'maskable-192.png', maskable);
await png(512, 'maskable-512.png', maskable);

// favicon.ico: modern browsers accept PNG data in an .ico file.
await writeFile(path.join(root, 'public', 'favicon.ico'), await sharp(svg, { density: 384 }).resize(48, 48).png().toBuffer());

const og = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="a" cx=".85" cy=".1" r=".9"><stop offset="0" stop-color="#312e81" stop-opacity=".9"/><stop offset="1" stop-color="#05070f" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx=".1" cy="1" r=".8"><stop offset="0" stop-color="#0e7490" stop-opacity=".6"/><stop offset="1" stop-color="#05070f" stop-opacity="0"/></radialGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#818cf8"/><stop offset=".55" stop-color="#22d3ee"/><stop offset="1" stop-color="#34d399"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#05070f"/><rect width="1200" height="630" fill="url(#a)"/><rect width="1200" height="630" fill="url(#b)"/>
  <g transform="translate(90 90) scale(2)" stroke-linejoin="round">
    <path d="M32 4 58 18v28L32 60 6 46V18Z" fill="none" stroke="url(#g)" stroke-width="4"/>
    <path d="M32 4v28l26-14M32 32 6 18" fill="none" stroke="url(#g)" stroke-width="4"/>
    <path d="M32 32v28L6 46V18Z" fill="url(#g)" opacity=".9"/>
  </g>
  <text x="240" y="150" font-family="Segoe UI, Arial, sans-serif" font-size="44" font-weight="700" fill="#eef1fb">Cornerstone</text>
  <text x="240" y="190" font-family="Segoe UI, Arial, sans-serif" font-size="20" letter-spacing="6" fill="#a3acc6">TECH ADVISORY LLP</text>
  <text x="90" y="360" font-family="Segoe UI, Arial, sans-serif" font-size="76" font-weight="700" fill="#eef1fb">We lay the cornerstone</text>
  <text x="90" y="450" font-family="Segoe UI, Arial, sans-serif" font-size="76" font-weight="700" fill="url(#g)">of your digital future.</text>
  <text x="90" y="550" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="#a3acc6">Software consulting · Engineering · Advisory</text>
  <text x="1110" y="550" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="#22d3ee">cornerstonetech.co.in</text>
</svg>`);
await sharp(og).png({ compressionLevel: 9 }).toFile(out('og-image.png'));
console.log('Icons generated.');
