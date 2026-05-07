// Section B audit: rewrite blog titles to <60 chars + geo-modifier (B03), add Related Articles cluster section (B02)
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'blog');

// New titles: ≤60 chars, all contain geo-modifier (MA / Massachusetts / Worcester / New England)
const TITLES = {
  'get-more-leads-home-service-business.html': {
    title: 'Get More Leads for MA Home-Service Businesses',                      // 47 (PILLAR)
    h1: 'How to Get More Leads for Your Home-Service Business in Massachusetts'
  },
  'local-seo-rank-google-maps.html': {
    title: 'How to Rank #1 on Google Maps in MA (2026 Guide)',                  // 50
    h1: 'Local SEO: How to Rank #1 on Google Maps in Massachusetts (2026)'
  },
  'google-business-profile-optimization-guide.html': {
    title: 'Google Business Profile Guide for MA Businesses 2026',              // 53
    h1: 'Google Business Profile Optimization for Massachusetts Businesses'
  },
  'marketing-automation-strategies-small-business.html': {
    title: '5 Marketing Automation Strategies for MA Businesses',               // 53
    h1: '5 Marketing Automation Strategies for Massachusetts Small Businesses'
  },
  'email-marketing-vs-sms-marketing.html': {
    title: 'Email vs SMS Marketing for MA Businesses (2026)',                   // 47
    h1: 'Email Marketing vs SMS Marketing for Massachusetts Businesses (2026)'
  },
  'whatsapp-business-customer-communication.html': {
    title: 'WhatsApp Business for MA Local Businesses (2026)',                  // 49
    h1: 'WhatsApp Business: Customer Communication for Massachusetts Businesses'
  },
  'sales-funnel-strategies-convert-leads.html': {
    title: 'Sales Funnel Strategies for MA Home-Service Businesses',            // 56
    h1: 'Sales Funnel Strategies for Massachusetts Home-Service Businesses'
  },
  'social-media-marketing-local-business.html': {
    title: 'Social Media Marketing for MA Local Businesses',                    // 48
    h1: 'Social Media Marketing for Local Businesses in Massachusetts'
  },
  'what-is-crm-why-small-business-needs-one.html': {
    title: 'What Is a CRM? Small Business Guide for MA',                        // 48
    h1: 'What Is a CRM and Why Your Massachusetts Small Business Needs One'
  },
  'crm-automation-saves-time-increases-revenue.html': {
    title: 'How CRM Automation Saves 15+ Hrs/Week (MA Guide)',                  // 51
    h1: 'How CRM Automation Saves 15+ Hours/Week for Massachusetts Businesses'
  },
  'digital-marketing-roi-measure-results.html': {
    title: 'Digital Marketing ROI: Measure What Matters (MA)',                  // 49
    h1: 'Digital Marketing ROI: Measure What Actually Matters for MA Businesses'
  },
  'why-business-needs-professional-website.html': {
    title: 'Why MA Businesses Need a Pro Website in 2026',                      // 46
    h1: 'Why Your Massachusetts Business Needs a Professional Website in 2026'
  },
  'security-camera-systems-business-guide.html': {
    title: 'Security Camera Systems Guide for MA Business Owners',              // 56
    h1: 'Security Camera Systems: A Complete Guide for Massachusetts Business Owners'
  },
  'it-support-outsource-vs-inhouse.html': {
    title: 'IT Support: Outsource vs In-House for MA Businesses',               // 56
    h1: 'IT Support for Massachusetts Businesses: When to Outsource vs Hire In-House'
  },
  'brand-identity-local-business.html': {
    title: 'Brand Identity Guide for MA Local Businesses',                      // 48
    h1: 'Building a Strong Brand Identity for Your Local Massachusetts Business'
  }
};

const PILLAR = 'get-more-leads-home-service-business.html';
const PILLAR_TITLE = 'Get More Leads for MA Home-Service Businesses';

// Cluster groups for related-articles section (each post links to 4 siblings + pillar + 1 service page)
const RELATED = {
  // === PILLAR — list of all 7 children clusters ===
  'get-more-leads-home-service-business.html': [
    ['local-seo-rank-google-maps.html', 'How to Rank #1 on Google Maps in MA'],
    ['google-business-profile-optimization-guide.html', 'Google Business Profile Guide for MA'],
    ['marketing-automation-strategies-small-business.html', '5 Marketing Automation Strategies for MA'],
    ['email-marketing-vs-sms-marketing.html', 'Email vs SMS Marketing for MA Businesses'],
    ['whatsapp-business-customer-communication.html', 'WhatsApp Business for MA Local Businesses'],
    ['sales-funnel-strategies-convert-leads.html', 'Sales Funnel Strategies for MA Businesses'],
    ['social-media-marketing-local-business.html', 'Social Media Marketing for MA Local Businesses']
  ],
  // === ACQUISITION cluster — link to pillar + 3 sibs ===
  'local-seo-rank-google-maps.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['google-business-profile-optimization-guide.html', 'Google Business Profile Guide for MA'],
    ['social-media-marketing-local-business.html', 'Social Media Marketing for MA Local Businesses'],
    ['why-business-needs-professional-website.html', 'Why MA Businesses Need a Pro Website']
  ],
  'google-business-profile-optimization-guide.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['local-seo-rank-google-maps.html', 'How to Rank #1 on Google Maps in MA'],
    ['social-media-marketing-local-business.html', 'Social Media Marketing for MA Local Businesses'],
    ['why-business-needs-professional-website.html', 'Why MA Businesses Need a Pro Website']
  ],
  'social-media-marketing-local-business.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['google-business-profile-optimization-guide.html', 'Google Business Profile Guide for MA'],
    ['brand-identity-local-business.html', 'Brand Identity Guide for MA Local Businesses'],
    ['whatsapp-business-customer-communication.html', 'WhatsApp Business for MA Local Businesses']
  ],
  // === NURTURE cluster ===
  'email-marketing-vs-sms-marketing.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['whatsapp-business-customer-communication.html', 'WhatsApp Business for MA Local Businesses'],
    ['marketing-automation-strategies-small-business.html', '5 Marketing Automation Strategies for MA'],
    ['sales-funnel-strategies-convert-leads.html', 'Sales Funnel Strategies for MA Businesses']
  ],
  'whatsapp-business-customer-communication.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['email-marketing-vs-sms-marketing.html', 'Email vs SMS Marketing for MA Businesses'],
    ['marketing-automation-strategies-small-business.html', '5 Marketing Automation Strategies for MA'],
    ['social-media-marketing-local-business.html', 'Social Media Marketing for MA Local Businesses']
  ],
  'marketing-automation-strategies-small-business.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['crm-automation-saves-time-increases-revenue.html', 'How CRM Automation Saves 15+ Hrs/Week'],
    ['email-marketing-vs-sms-marketing.html', 'Email vs SMS Marketing for MA Businesses'],
    ['sales-funnel-strategies-convert-leads.html', 'Sales Funnel Strategies for MA Businesses']
  ],
  'sales-funnel-strategies-convert-leads.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['marketing-automation-strategies-small-business.html', '5 Marketing Automation Strategies for MA'],
    ['email-marketing-vs-sms-marketing.html', 'Email vs SMS Marketing for MA Businesses'],
    ['digital-marketing-roi-measure-results.html', 'Digital Marketing ROI: Measure What Matters']
  ],
  // === FOUNDATIONS cluster ===
  'what-is-crm-why-small-business-needs-one.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['crm-automation-saves-time-increases-revenue.html', 'How CRM Automation Saves 15+ Hrs/Week'],
    ['marketing-automation-strategies-small-business.html', '5 Marketing Automation Strategies for MA'],
    ['sales-funnel-strategies-convert-leads.html', 'Sales Funnel Strategies for MA Businesses']
  ],
  'crm-automation-saves-time-increases-revenue.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['what-is-crm-why-small-business-needs-one.html', 'What Is a CRM? Small Business Guide for MA'],
    ['marketing-automation-strategies-small-business.html', '5 Marketing Automation Strategies for MA'],
    ['digital-marketing-roi-measure-results.html', 'Digital Marketing ROI: Measure What Matters']
  ],
  'digital-marketing-roi-measure-results.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['marketing-automation-strategies-small-business.html', '5 Marketing Automation Strategies for MA'],
    ['sales-funnel-strategies-convert-leads.html', 'Sales Funnel Strategies for MA Businesses'],
    ['local-seo-rank-google-maps.html', 'How to Rank #1 on Google Maps in MA']
  ],
  'why-business-needs-professional-website.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['local-seo-rank-google-maps.html', 'How to Rank #1 on Google Maps in MA'],
    ['google-business-profile-optimization-guide.html', 'Google Business Profile Guide for MA'],
    ['brand-identity-local-business.html', 'Brand Identity Guide for MA Local Businesses']
  ],
  'brand-identity-local-business.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['why-business-needs-professional-website.html', 'Why MA Businesses Need a Pro Website'],
    ['social-media-marketing-local-business.html', 'Social Media Marketing for MA Local Businesses'],
    ['google-business-profile-optimization-guide.html', 'Google Business Profile Guide for MA']
  ],
  // === IT/OPS cluster ===
  'it-support-outsource-vs-inhouse.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['security-camera-systems-business-guide.html', 'Security Camera Systems Guide for MA'],
    ['why-business-needs-professional-website.html', 'Why MA Businesses Need a Pro Website'],
    ['what-is-crm-why-small-business-needs-one.html', 'What Is a CRM? Small Business Guide for MA']
  ],
  'security-camera-systems-business-guide.html': [
    [PILLAR, PILLAR_TITLE + ' (pillar)'],
    ['it-support-outsource-vs-inhouse.html', 'IT Support: Outsource vs In-House for MA'],
    ['why-business-needs-professional-website.html', 'Why MA Businesses Need a Pro Website'],
    ['what-is-crm-why-small-business-needs-one.html', 'What Is a CRM? Small Business Guide for MA']
  ]
};

let stats = { titles: 0, h1s: 0, og: 0, related: 0 };

for (const [f, conf] of Object.entries(TITLES)) {
  const fp = path.join(dir, f);
  if (!fs.existsSync(fp)) { console.log('MISSING', f); continue; }
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  // 1) <title> — drop " | Galaxy IT" brand suffix on blog posts to stay <60 chars
  html = html.replace(/<title>[^<]+<\/title>/, `<title>${conf.title}</title>`);
  stats.titles++;

  // 2) og:title (without brand suffix for cleaner social share)
  html = html.replace(/(<meta[^>]+property="og:title"[^>]+content=")[^"]+("[^>]*>)/, `$1${conf.title}$2`);
  // 2b) twitter:title (if exists)
  html = html.replace(/(<meta[^>]+name="twitter:title"[^>]+content=")[^"]+("[^>]*>)/, `$1${conf.title}$2`);
  if (html !== before) stats.og++;

  // 3) <h1> — keep the longer descriptive H1 with full geo
  html = html.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/, `<h1$1>${conf.h1}</h1>`);
  stats.h1s++;

  // 4) Insert "Related Articles" cluster section before <footer>, only if not already present
  if (!html.includes('class="section section-light related-articles"')) {
    const rel = RELATED[f];
    if (rel && rel.length) {
      const isPillar = f === PILLAR;
      const headerLabel = isPillar ? 'In This Cluster — All Lead-Gen Topics for MA Home-Service Businesses' : 'Related Articles';
      const linksHtml = rel.map(([slug, title]) => `        <a href="/blog/${slug.replace('.html', '')}" class="related-card">
          <i class="fas fa-arrow-right"></i>
          <span>${title}</span>
        </a>`).join('\n');

      const block = `
  <!-- Related Articles cluster section (Section B audit: B02 pillar/cluster + internal linking) -->
  <section class="section section-light related-articles" aria-labelledby="related-h2">
    <div class="container">
      <h2 id="related-h2" style="color:#1a237e;margin:0 0 8px;">${headerLabel}</h2>
      <p style="color:#6b7280;margin:0 0 24px;">Practical, MA-specific guides written for owners of home-service businesses across Massachusetts and New England.</p>
      <div class="related-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;">
${linksHtml}
        <a href="/services" class="related-card" style="border-left-color:#ffd700;">
          <i class="fas fa-rocket"></i>
          <span>Galaxy IT Services for MA Businesses</span>
        </a>
        <a href="/areas" class="related-card" style="border-left-color:#16a34a;">
          <i class="fas fa-map-marker-alt"></i>
          <span>Service Areas — MA, NH, RI, CT, VT, ME</span>
        </a>
      </div>
    </div>
  </section>
`;
      // Insert right before the (first) <footer tag — match either id="footer" or just class="footer"
      const footerRe = /(\n\s*<footer\b[^>]*>)/;
      if (footerRe.test(html)) {
        html = html.replace(footerRe, block + '$1');
        stats.related++;
      } else {
        console.log('NO footer match in', f);
      }
    }
  }

  fs.writeFileSync(fp, html);
}

console.log(`titles: ${stats.titles} · h1s: ${stats.h1s} · og: ${stats.og} · related-sections: ${stats.related}`);

// Verify all titles are <60 and have geo
let geoOk = 0, lenOk = 0;
for (const [f, conf] of Object.entries(TITLES)) {
  const t = conf.title;
  const hasGeo = /\b(MA|Massachusetts|Worcester|New England|MetroWest|NE\b|Boston)\b/i.test(t);
  const ok = t.length < 60;
  if (hasGeo) geoOk++;
  if (ok) lenOk++;
  console.log(t.length.toString().padStart(2), hasGeo ? 'GEO' : '   ', ok ? '<60' : 'OVR', '·', t);
}
console.log(`\ngeo: ${geoOk}/${Object.keys(TITLES).length} · <60: ${lenOk}/${Object.keys(TITLES).length}`);
