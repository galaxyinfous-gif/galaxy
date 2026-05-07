// Add missing pages to sitemap.xml + refresh lastmod dates (Section T audit)
const fs = require('fs');
const path = require('path');

const TODAY = '2026-05-06';
const fp = path.join(__dirname, '..', 'sitemap.xml');
let sm = fs.readFileSync(fp, 'utf8');

// 1) Add 3 missing pages right after /consultation block, before any other entries
const newEntries = ['reviews', 'support', 'tutorials'].map(p => `  <url>
    <loc>https://galaxyinfo.us/${p}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://galaxyinfo.us/${p}"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://galaxyinfo.us/${p}"/>
    <xhtml:link rel="alternate" hreflang="pt" href="https://galaxyinfo.us/${p}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://galaxyinfo.us/${p}"/>
  </url>`).join('\n');

const consultMarker = '<loc>https://galaxyinfo.us/consultation</loc>';
const idx = sm.indexOf(consultMarker);
const blockEnd = sm.indexOf('</url>', idx) + '</url>'.length;
sm = sm.slice(0, blockEnd) + '\n' + newEntries + sm.slice(blockEnd);

// 2) Refresh all lastmod dates to today
sm = sm.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${TODAY}</lastmod>`);

fs.writeFileSync(fp, sm);
const count = (sm.match(/<loc>/g) || []).length;
console.log(`sitemap.xml updated: ${count} URLs, lastmod=${TODAY}`);

// 3) Refresh sitemap-index.xml lastmod
const ip = path.join(__dirname, '..', 'sitemap-index.xml');
let si = fs.readFileSync(ip, 'utf8');
si = si.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${TODAY}</lastmod>`);
fs.writeFileSync(ip, si);
console.log('sitemap-index.xml lastmod refreshed');

// 4) Update robots.txt to also reference sitemap-index.xml
const rp = path.join(__dirname, '..', 'robots.txt');
let r = fs.readFileSync(rp, 'utf8');
if (!r.includes('sitemap-index.xml')) {
  r = r.trimEnd() + '\nSitemap: https://galaxyinfo.us/sitemap-index.xml\n';
  fs.writeFileSync(rp, r);
  console.log('robots.txt: added sitemap-index.xml');
}
