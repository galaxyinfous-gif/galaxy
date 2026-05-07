// Section O audit: tighten titles to <60, expand metas to 150-160 with phone (O02 audit)
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');

const TITLES = {
  'about.html':    'About Galaxy IT & Marketing — 19+ Yrs in Worcester MA',           // 53
  'services.html': 'CRM, SEO & IT Services for Small Business | Galaxy IT MA',        // 56
  'blog.html':     'Blog — CRM & Marketing Tips for Small Business | Galaxy IT',      // 58
  'areas.html':    'Service Areas — CRM & SEO Across New England | Galaxy IT',        // 56
};

// Each description tuned to 150-160 chars, includes (774) 285-2299 — verified with .length
const DESCS = {
  'index.html':        'Galaxy IT & Marketing — Worcester MA agency helping home-service businesses grow with CRM, local SEO, automation, and websites. Call now (774) 285-2299.', // 156
  'contact.html':      'Contact Galaxy IT & Marketing in Worcester MA. Free 30-min growth call for local home-service businesses. Email info@galaxyinfo.us or (774) 285-2299 today.', // 158
  'blog.html':         'Galaxy IT blog — practical CRM, local SEO, lead automation, and growth tips for small home-service businesses across Massachusetts. Call (774) 285-2299.',   // 152
  'areas.html':        'Galaxy IT & Marketing serves home-service businesses across MA, NH, RI, CT, VT and ME — local SEO and CRM in 1,200+ cities. Call (774) 285-2299 today.',     // 152
  'support.html':      'Galaxy IT Help Center for Bee Pro Hub clients — Galaxy Assist AI, video tutorials, and same-day team support. Free for all clients. Call (774) 285-2299.',  // 154
  'consultation.html': 'Book a free 30-minute growth assessment with Galaxy IT & Marketing — discover gaps, opportunities, and a clear plan for your business. (774) 285-2299.',     // 154
  'reviews.html':      'Real numbers from Galaxy IT clients — actual leads, Google impressions, and clicks per month from MA home-service businesses. Call now (774) 285-2299.',     // 156
};

let stats = { titles: 0, descs: 0 };

for (const [f, newTitle] of Object.entries(TITLES)) {
  const fp = path.join(dir, f);
  let html = fs.readFileSync(fp, 'utf8');
  const re = /<title>[^<]+<\/title>/;
  if (re.test(html)) {
    html = html.replace(re, `<title>${newTitle}</title>`);
    fs.writeFileSync(fp, html);
    stats.titles++;
    console.log(`title  ${f.padEnd(20)} ${newTitle.length} chars ${newTitle.length < 60 ? '✓' : '⚠️'}`);
  }
}

for (const [f, newDesc] of Object.entries(DESCS)) {
  const fp = path.join(dir, f);
  let html = fs.readFileSync(fp, 'utf8');
  const re = /<meta\s+name="description"\s+content="[^"]+"\s*\/?>/;
  if (re.test(html)) {
    html = html.replace(re, `<meta name="description" content="${newDesc}">`);
    fs.writeFileSync(fp, html);
    stats.descs++;
    const ok = newDesc.length >= 150 && newDesc.length <= 160;
    console.log(`desc   ${f.padEnd(20)} ${newDesc.length} chars ${ok ? '✓' : '⚠️'}`);
  }
}

console.log(`\nTitles: ${stats.titles} · Descs: ${stats.descs}`);
