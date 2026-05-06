// Add <script src="/analytics.js" defer> to all main HTML pages
const fs = require('fs');
const path = require('path');

const TAG = '<script src="/analytics.js" defer></script>';

const targets = [
  'index.html', 'about.html', 'services.html', 'contact.html', 'blog.html',
  'areas.html', 'support.html', 'tutorials.html', 'consultation.html', 'reviews.html'
];

let updated = 0;
for (const f of targets) {
  const fp = path.join(__dirname, '..', f);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('analytics.js')) continue;
  if (!html.includes('</head>')) continue;
  html = html.replace('</head>', '  ' + TAG + '\n</head>');
  fs.writeFileSync(fp, html);
  updated++;
  console.log('updated:', f);
}
console.log(`Total: ${updated}`);
