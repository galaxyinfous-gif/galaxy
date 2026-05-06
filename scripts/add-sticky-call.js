// Add sticky mobile call button before </body> on all main HTML pages
const fs = require('fs');
const path = require('path');

const STICKY_BUTTON = `
    <!-- Sticky Mobile Call CTA (audit X01) -->
    <a href="tel:+17742852299" class="sticky-call-mobile" aria-label="Ligar para Galaxy IT">
        <i class="fas fa-phone"></i>
    </a>
`;

const dir = path.join(__dirname, '..');
const targets = [
  'index.html', 'about.html', 'services.html', 'contact.html', 'blog.html',
  'areas.html', 'support.html', 'tutorials.html', 'consultation.html'
];

let updated = 0;
for (const f of targets) {
  const fp = path.join(dir, f);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('class="sticky-call-mobile"')) { console.log('skip:', f, '(already)'); continue; }
  if (!html.includes('</body>')) { console.log('skip:', f, '(no body)'); continue; }
  html = html.replace('</body>', STICKY_BUTTON + '\n</body>');
  fs.writeFileSync(fp, html);
  updated++;
  console.log('updated:', f);
}
console.log(`\nTotal: ${updated}/${targets.length}`);
