// Fix audit gaps: NAP consistency, title length, meta description with phone
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const targets = [
  'index.html', 'about.html', 'services.html', 'contact.html', 'blog.html',
  'areas.html', 'support.html', 'tutorials.html', 'consultation.html', 'reviews.html'
];

let stats = { phones: 0, titles: 0, descs: 0 };

for (const f of targets) {
  const fp = path.join(dir, f);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  // 1) NAP: replace 508-499-9279 with 774-285-2299 everywhere
  const phoneVariants = [
    /\+15084999279/g,
    /5084999279/g,
    /\(508\)\s*499[-\s]?9279/g,
    /508[-\s]499[-\s]9279/g,
    /\+1[-\s]?508[-\s]?499[-\s]?9279/g
  ];
  phoneVariants.forEach(re => {
    if (re.test(html)) {
      stats.phones += (html.match(re) || []).length;
      html = html.replace(re, (match) => {
        if (match.startsWith('+1')) return '+17742852299';
        if (match.startsWith('(')) return '(774) 285-2299';
        if (/^\d/.test(match)) return '7742852299';
        return '774-285-2299';
      });
    }
  });

  // 2) Shorten title if >60 chars on index
  if (f === 'index.html') {
    const oldTitle = /<title>[^<]+<\/title>/;
    if (oldTitle.test(html)) {
      const newTitle = '<title>Galaxy IT & Marketing | Local Marketing & CRM in MA</title>'; // 53 chars
      html = html.replace(oldTitle, newTitle);
      stats.titles++;
    }
  }

  // 3) Tighten meta description to 150-160 chars + include phone
  if (f === 'index.html') {
    const oldDesc = /<meta\s+name="description"\s+content="[^"]+">/;
    if (oldDesc.test(html)) {
      const newDesc = '<meta name="description" content="Galaxy IT & Marketing — Worcester, MA agency helping home-service businesses grow with CRM, local SEO, and lead automation. Call (774) 285-2299.">'; // ~158 chars
      html = html.replace(oldDesc, newDesc);
      stats.descs++;
    }
  }

  if (html !== before) {
    fs.writeFileSync(fp, html);
    console.log('updated:', f);
  }
}

console.log(`\nPhone refs fixed: ${stats.phones}`);
console.log(`Titles tightened: ${stats.titles}`);
console.log(`Descriptions tightened: ${stats.descs}`);
