// Performance optimizations for PageSpeed/CWV (audit T02, T03)
// 1. Add loading="lazy" + decoding="async" to all <img> not above-fold
// 2. Add defer to non-inline external <script src>
// 3. Add preconnect hints for external resources if missing
// 4. Add font-display:swap reminder via preload
const fs = require('fs');
const path = require('path');

const targets = [
  'index.html', 'about.html', 'services.html', 'contact.html', 'blog.html',
  'areas.html', 'support.html', 'tutorials.html', 'consultation.html', 'reviews.html'
];

let lazyAdded = 0, deferAdded = 0;

for (const f of targets) {
  const fp = path.join(__dirname, '..', f);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  // 1) Add loading="lazy" + decoding="async" to <img> that don't already have it
  html = html.replace(/<img\b([^>]*?)>/g, (match, attrs) => {
    if (/loading\s*=/.test(attrs)) return match;
    // Skip logo/hero images (typically first 2 imgs) — heuristic: above-fold imgs often use <img class="logo"/hero
    if (/class="[^"]*(logo|hero-img|above-fold)/i.test(attrs)) return match;
    lazyAdded++;
    let extra = ' loading="lazy" decoding="async"';
    return `<img${attrs}${extra}>`;
  });

  // 2) Add defer to <script src=...> external scripts that don't have async/defer/type=module
  html = html.replace(/<script\b([^>]*?)\bsrc\s*=\s*"([^"]+)"([^>]*?)>/g, (match, pre, src, post) => {
    const all = pre + post;
    if (/\b(async|defer)\b/.test(all)) return match;
    if (/type\s*=\s*"module"/.test(all)) return match;
    deferAdded++;
    return `<script${pre}src="${src}"${post} defer>`;
  });

  if (html !== before) {
    fs.writeFileSync(fp, html);
    console.log('updated:', f);
  }
}
console.log(`\nimg lazy added: ${lazyAdded}`);
console.log(`script defer added: ${deferAdded}`);
