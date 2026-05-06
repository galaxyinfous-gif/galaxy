// Tighten all main page meta descriptions to ~150-160 chars including phone (O02 audit)
const fs = require('fs');
const path = require('path');

const PHONE = ' Call (774) 285-2299.';

const NEW_DESCS = {
  'index.html': 'Galaxy IT & Marketing — Worcester, MA agency helping home-service businesses grow with CRM, local SEO, and lead automation. Call (774) 285-2299.',
  'about.html': 'Meet the Galaxy IT & Marketing team — Worcester, MA agency since 2007 helping local home-service businesses grow with CRM and SEO. Call (774) 285-2299.',
  'services.html': 'Galaxy IT services: CRM setup, local SEO, Google Business Profile, marketing automation, and websites for MA home-service businesses. Call (774) 285-2299.',
  'contact.html': 'Contact Galaxy IT & Marketing — Worcester MA. Free 30-min strategy call for local businesses. Email info@galaxyinfo.us or call (774) 285-2299 today.',
  'blog.html': 'Galaxy IT & Marketing blog — practical CRM, local SEO, and growth tips for small home-service businesses across Massachusetts. Call (774) 285-2299.',
  'areas.html': 'Galaxy IT serves home-service businesses across MA, NH, RI, CT, VT, ME — local SEO and CRM in 1,200+ cities and towns. Call (774) 285-2299.',
  'support.html': 'Galaxy Help Center for Bee Pro Hub clients — AI assistant, video tutorials, and same-day team support. Free for all clients. Call (774) 285-2299.',
  'tutorials.html': 'Step-by-step Bee Pro Hub video tutorials: contacts, conversations, calendars, payments, automations, and more. Galaxy IT clients only. (774) 285-2299.',
  'consultation.html': 'Book a free 30-minute growth assessment with Galaxy IT & Marketing — discover gaps, opportunities, and a clear plan. Call (774) 285-2299.',
  'reviews.html': 'Real numbers from Galaxy IT clients — actual leads, Google impressions, and clicks per month from MA home-service businesses. Call (774) 285-2299.'
};

let updated = 0;
for (const [f, newDesc] of Object.entries(NEW_DESCS)) {
  const fp = path.join(__dirname, '..', f);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  const newTag = `<meta name="description" content="${newDesc}">`;
  const re = /<meta\s+name="description"\s+content="[^"]+"\s*\/?>/;
  if (re.test(html)) {
    html = html.replace(re, newTag);
    fs.writeFileSync(fp, html);
    updated++;
    console.log(`${f.padEnd(20)} ${newDesc.length} chars ${newDesc.length >= 140 && newDesc.length <= 160 ? '✓' : '⚠️'}`);
  } else {
    console.log(`${f.padEnd(20)} NO MATCH`);
  }
}
console.log(`\nUpdated: ${updated}`);
