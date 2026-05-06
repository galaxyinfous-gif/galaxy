// Add ai-summary meta tag to all main HTML pages that don't already have it
const fs = require('fs');
const path = require('path');

const SUMMARY = "Galaxy IT & Marketing is a digital marketing agency in Worcester, Massachusetts (founded 2007, 19+ years experience) that helps small and medium-sized home service businesses (painting, siding, HVAC, cleaning, construction) across New England get more leads with technology and marketing. Core services: custom websites, Google Business Profile optimization, local SEO, marketing automation, CRM (Bee Pro Hub / GoHighLevel), monthly performance reports, and AI-powered support. Average client gains 10-30 new leads per month from organic Google traffic. Owner: Luiz Alberto. Contact: (774) 285-2299, info@galaxyinfo.us, 186 Main St Ste 20, Marlborough MA 01752.";

const PURPOSE = "Help small business owners in Massachusetts and New England decide if Galaxy IT & Marketing fits their digital marketing needs.";
const KEYWORDS = "digital marketing agency Massachusetts, local SEO, Google Business Profile, CRM small business, marketing automation, Bee Pro Hub, GoHighLevel partner, Worcester MA, Marlborough MA, home services marketing, painting contractor marketing, HVAC marketing, siding contractor marketing";

const META_BLOCK = `\n  <!-- AI Summary (for ChatGPT, Perplexity, AI Overviews) -->\n  <meta name="ai-summary" content="${SUMMARY}">\n  <meta name="ai-purpose" content="${PURPOSE}">\n  <meta name="ai-keywords" content="${KEYWORDS}">\n`;

const targets = [
  'about.html', 'services.html', 'contact.html', 'blog.html', 'areas.html',
  'support.html', 'tutorials.html', 'consultation.html'
];

let updated = 0;
for (const f of targets) {
  const fp = path.join(__dirname, '..', f);
  if (!fs.existsSync(fp)) { console.log('skip:', f, '(missing)'); continue; }
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('name="ai-summary"')) { console.log('skip:', f, '(already has)'); continue; }
  // Insert before </head>
  if (html.includes('</head>')) {
    html = html.replace('</head>', META_BLOCK + '</head>');
    fs.writeFileSync(fp, html);
    updated++;
    console.log('updated:', f);
  } else {
    console.log('skip:', f, '(no </head>)');
  }
}
console.log(`\nTotal updated: ${updated}/${targets.length}`);
