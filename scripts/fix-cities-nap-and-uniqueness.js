// Section C audit: fix old NAP (508→774) on all city pages + inject unique 150-word block per city (C04)
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'cities');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// === Service-specific copy templates (rotated per city) ===
const SERVICE = {
  'crm-automation': {
    label: 'CRM & Sales Automation',
    benefit: ['centralizes leads from forms, calls, WhatsApp, and Google Business Profile in one shared inbox', 'replaces sticky notes and missed callbacks with auto-reminders, pipelines, and tagged follow-ups', 'turns every quote request into a tracked opportunity tied to revenue, source, and rep'],
    industries: ['painting contractors', 'siding installers', 'HVAC and heating crews', 'cleaning services', 'electrical contractors', 'roofing companies', 'general contractors', 'landscaping crews', 'plumbing teams']
  },
  'it-support': {
    label: 'Same-Day IT Support',
    benefit: ['fixes Wi-Fi, email, printer, and PC issues without waiting for a Boston tech to drive out', 'monitors office workstations and surveillance cameras 24/7 from our Marlborough NOC', 'covers cybersecurity hardening, ransomware backup, and Microsoft 365 administration'],
    industries: ['contractor offices', 'medical and dental practices', 'small law firms', 'real-estate teams', 'retail storefronts', 'auto repair shops', 'fitness studios', 'accounting offices', 'home-service business HQs']
  },
  'seo-marketing': {
    label: 'Local SEO & Marketing',
    benefit: ['gets your Google Business Profile into the local 3-pack for service-area keywords', 'builds geo-targeted landing pages for every neighborhood you actually serve', 'ranks the long-tail terms your competitors ignore — like "siding installer near me, financing"'],
    industries: ['painters', 'siding companies', 'HVAC contractors', 'cleaning services', 'plumbers', 'roofers', 'electricians', 'landscapers', 'general contractors']
  }
};

// === Population/region tiers — used to vary the unique block by city size ===
const STATE_NAMES = { ma: 'Massachusetts', nh: 'New Hampshire', ri: 'Rhode Island', ct: 'Connecticut', vt: 'Vermont', me: 'Maine' };

// Deterministic pseudo-random — same city name → same selection (so re-runs are stable)
function seedFromString(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) | 0; return Math.abs(h); }
function pick(arr, seed, offset = 0) { return arr[(seed + offset) % arr.length]; }
function pickN(arr, seed, n) {
  const out = [], used = new Set();
  for (let i = 0; out.length < n && i < arr.length * 3; i++) {
    const idx = (seed + i * 7) % arr.length;
    if (!used.has(idx)) { used.add(idx); out.push(arr[idx]); }
  }
  return out;
}

// Generic ways to start the unique block — rotate ~12 openers per service to break duplicate templates
const OPENERS = [
  'Galaxy IT & Marketing has been working with home-service businesses in {city}, {state} since 2007.',
  '{city} sits at the heart of our service area, and {service} here looks different than in larger metro markets.',
  'Local owners in {city} tell us the same thing every quarter: leads come from too many places to track manually.',
  'For a {city}, {state} crew, the gap between a missed call at 4pm and a booked job is real money.',
  'When {city}, {state} businesses search for {service}, they want a partner who already understands the local market.',
  'Whether you run a 3-person crew or a 25-truck operation in {city}, the math of leads → quotes → revenue stays the same.',
  '{city} is part of our New England service grid — same-day setup, monthly reporting, and a human you can text.',
  'Most {city}, {state} owners we meet have already tried 1–2 marketing vendors before calling Galaxy IT.',
  'In {city}, the home-service market rewards the contractor who answers first and follows up most consistently.',
  'Year-over-year, the home-service businesses winning in {city}, {state} are the ones with a real CRM and a real local SEO play.',
  'Galaxy IT serves {city} from our Marlborough, MA office — close enough to drop in, far enough to scale across New England.',
  '{service} for a {city}, {state} business should solve one specific problem: turning every inbound lead into a booked job, every time.'
];

// Mid-paragraph hook templates — vary how we describe what we do
const MIDDLES = [
  'Our {service} package for {city} {benefit}.',
  'For {city} {industry}, our {service} setup {benefit}.',
  'Galaxy IT runs a {service} stack that {benefit} — built specifically for {state} home-service operators.',
  'In {city}, our team typically {benefit} within the first 30 days.',
  'The Galaxy IT {service} system {benefit}, with monthly reports tied to your Google Business Profile data.',
  'We tune our {service} setup for {city} {industry}, where {benefit} is what separates booked weeks from quiet ones.'
];

// Closing CTA-flavored sentences
const CLOSERS = [
  'Schedule a free 30-minute audit and we\'ll show you exactly what\'s leaking leads in {city}.',
  'Call (774) 285-2299 or book a free assessment online — no card, no contract, just a clear plan for {city}.',
  'Book the free 30-minute call and walk away with a written {service} plan for your {city} business.',
  'Free 30-minute strategy call. We\'ll review your Google Business Profile, your form leads, and your follow-up gap.',
  'No-pressure free assessment for {city} owners — phone (774) 285-2299 or schedule online. Done in 30 minutes.',
  'Reach Galaxy IT at (774) 285-2299 or book a free assessment online; we typically have a same-week opening.'
];

// === Helpers ===
function parseFilename(f) {
  // Examples: crm-automation-worcester-ma.html · it-support-new-bedford-ma.html · seo-marketing-east-providence-ri.html
  const slug = f.replace('.html', '');
  for (const svc of Object.keys(SERVICE)) {
    if (slug.startsWith(svc + '-')) {
      const rest = slug.slice(svc.length + 1);
      const stateMatch = rest.match(/-(ma|nh|ri|ct|vt|me)$/);
      if (stateMatch) {
        const state = stateMatch[1];
        const city = rest.slice(0, -stateMatch[0].length).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return { service: svc, city, state, stateLong: STATE_NAMES[state] };
      }
    }
  }
  return null;
}

// === Pool of 24 distinct city-specific FAQ pairs — each city picks 3 ===
const FAQ_POOL = [
  ['How fast can Galaxy IT get this set up for my {city} business?', 'Most {city} projects are live in 2–3 weeks. Week 1: discovery and access. Week 2: build and integrations. Week 3: training, hand-off, and the first monthly reporting cycle.'],
  ['Do I need to switch CRMs to work with Galaxy IT?', 'Not always. We support Bee Pro Hub, GoHighLevel, HubSpot, and ServiceTitan-style stacks. For most {city} contractors we recommend Bee Pro Hub because of the integrated WhatsApp and Google Business Profile sync.'],
  ['Can you handle Spanish or Portuguese intake for my {city} customers?', 'Yes. We build bilingual forms, SMS sequences, and email templates. Several Galaxy IT clients in {state} run dual-language pipelines for Hispanic and Brazilian-American customers.'],
  ['What does month one look like in {city}?', 'Audit your Google Business Profile, set up tracking, build the first 3 automations, and ship monthly reporting. By day 30 you can see exactly which {city} channels produce real revenue.'],
  ['Do you require a long contract?', 'No. Galaxy IT services are month-to-month after the initial setup. We earn the relationship every {state} business reviews their numbers.'],
  ['Will you replace my marketing agency or work alongside it?', 'Either way. Some {city} clients keep their ad agency and we handle CRM + local SEO. Others consolidate everything to Galaxy IT for one accountable point of contact.'],
  ['How do I know if my Google Business Profile in {city} needs work?', 'Search your service + neighborhood from outside Wi-Fi. If you\'re not in the local 3-pack and competitors are, your profile needs categories, photos, posts, and review velocity work.'],
  ['What if my {city} business is too small for a CRM?', 'If you take more than 5 estimates per week, a CRM pays for itself the first month it stops a single missed quote. Most Galaxy IT clients started with 1–3 reps.'],
  ['Can Galaxy IT manage my IT support and my marketing?', 'Yes — many {city} clients use both stacks. One monthly invoice, one team that knows both your office and your sales pipeline.'],
  ['Do you do website rebuilds or just CRM/SEO?', 'We rebuild sites when the existing one is hurting conversions. {city} businesses on Wix or old WordPress sites typically see better lead capture within 30 days of a rebuild.'],
  ['How do I track which ads or directories are sending me {city} leads?', 'We tag every form, call, and chat with the source channel. Monthly reports show exactly which {city} ad spend produces booked jobs versus tire-kickers.'],
  ['Will my office staff be able to use the system day one?', 'Yes. We do live training sessions and record them. {city} office staff are typically running independent within a week — and we stay reachable on WhatsApp for questions.'],
  ['Can you migrate years of contacts out of my Gmail?', 'Yes. We import contacts, label by source and tag history, and dedupe before everything lands in your new {city} pipeline.'],
  ['What\'s included in the free 30-minute assessment?', 'A live audit of your Google Business Profile, your top 3 keywords in {city}, your form-to-quote conversion rate, and a written 90-day plan. No card, no contract.'],
  ['Do you charge per user or per location?', 'Pricing scales with active users and Bee Pro Hub features used. A 5-rep {city} team typically lands at $97–$297/month after the one-time setup.'],
  ['How do you measure success after the first 90 days?', 'Three numbers: leads per month, source channel mix, and conversion rate. Every {city} client gets the same monthly report — no fluff metrics.'],
  ['What if I already have a CRM and just need automations?', 'We can add automation, reporting, and review-request flows on top of your existing stack. About 30% of {city} engagements are automation-only.'],
  ['Can Galaxy IT integrate with QuickBooks or my invoicing tool?', 'Yes. We map deals → invoices → payments so your {city} revenue dashboard reflects what actually got billed and collected.'],
  ['Do you support after-hours emergency IT issues?', 'Yes. {city} businesses on a managed plan get same-day response with after-hours coverage for critical issues like email outage or compromised accounts.'],
  ['What if my {city} business is seasonal — do you still recommend a CRM?', 'Especially. Seasonal businesses lose more leads to slow follow-up than steady ones. Galaxy IT automations keep nurturing leads through the off-season.'],
  ['How do you handle reviews and reputation for {city} clients?', 'Auto review-request when a job is marked complete, plus a review monitoring inbox so you reply to every Google review within 24 hours.'],
  ['Can you set up call tracking specifically for my {city} ads?', 'Yes. We provision unique tracking numbers per channel — Google Local Service Ads, Facebook, direct mail — so you know exactly which {city} channel called.'],
  ['Do I need new computers or hardware to run this?', 'Almost never. The Bee Pro Hub stack runs in any modern browser. {city} field crews use the mobile app on existing phones.'],
  ['What does Galaxy IT NOT do?', 'We don\'t do print design, paid YouTube production, or large-scale e-commerce. We focus on what moves leads for {city} home-service operators.']
];

// === Pool of 30 distinct value statements — each city picks 5 unique ones ===
const VALUE_POINTS = [
  'Set up Bee Pro Hub CRM with your existing forms, ad sources, and call-tracking numbers',
  'Build a 12-month local SEO calendar with weekly Google Business Profile posts',
  'Connect your QuickBooks or invoicing to the CRM so revenue lines up with the source channel',
  'Add WhatsApp, SMS, and email follow-up sequences that fire automatically when a quote sits idle',
  'Create geo-targeted landing pages for every neighborhood and service combination you sell',
  'Migrate years of contacts out of spreadsheets, sticky notes, and Gmail labels into one tagged database',
  'Build review-request automations that send the second a job is marked complete',
  'Set up a missed-call text-back so prospects never reach voicemail twice',
  'Wire up a recurring monthly KPI report — leads, source breakdown, conversion rate, revenue per channel',
  'Configure round-robin lead distribution so the next available rep gets the next inbound lead',
  'Build pipeline stages that match your real sales process — quote → site visit → contract → invoice',
  'Track ad spend ROI per campaign by tagging every lead with UTMs and source channel',
  'Set up an after-hours auto-reply on Google Business Profile that captures the lead and books a callback',
  'Wire your security cameras and alarm system into a remote monitoring stack we manage',
  'Audit and harden Microsoft 365 — MFA, conditional access, and ransomware-resilient backups',
  'Replace consumer-grade Wi-Fi with mesh access points sized for your office and yard',
  'Set up a dedicated managed phone line with call routing, recording, and after-hours menu',
  'Move email off Gmail/Yahoo to a real Microsoft 365 mailbox with your domain',
  'Build a public-facing booking calendar so prospects self-schedule estimates without phone tag',
  'Tag every lead by service type, ZIP, and ad source so reporting actually reflects reality',
  'Add Spanish or Portuguese intake to your forms and follow-up sequences when the local market demands it',
  'Set up Google Local Service Ads with proper job-type categorization and lead disputes handled',
  'Build a referral pipeline that turns happy customers into 2–3 new leads per month, automatically',
  'Set up an internal help desk so your office staff can submit IT tickets in writing, not chase you',
  'Audit your domain DNS, SSL certificates, and email deliverability so legit emails stop hitting spam',
  'Build a yearly content cluster around your best 3 services with one new page per month',
  'Configure a backup-and-restore plan tested quarterly — not just "set it and forget it"',
  'Wire your contact form, phone, and chat into a single inbox that any rep can monitor',
  'Set up automated win/loss tagging so you actually know why deals closed or didn\'t',
  'Build a 90-day onboarding plan for every new hire on your sales team — scripts, KPIs, recordings'
];

function buildUniqueBlock(parsed) {
  const { service, city, state, stateLong } = parsed;
  const seed = seedFromString(`${service}-${city}-${state}`);
  const cfg = SERVICE[service];
  const tplVars = {
    '{city}': city,
    '{state}': stateLong,
    '{service}': cfg.label,
    '{benefit}': pick(cfg.benefit, seed),
    '{industry}': pick(cfg.industries, seed, 1)
  };
  const fill = (s) => Object.entries(tplVars).reduce((acc, [k, v]) => acc.split(k).join(v), s);

  const opener = fill(pick(OPENERS, seed, 2));
  const middle = fill(pick(MIDDLES, seed, 3));
  const middle2 = fill(pick(MIDDLES, seed, 5));
  const closer = fill(pick(CLOSERS, seed, 7));

  // Pick 3 industries + 5 value points + 3 city-specific FAQs unique to this city (deterministic seed-varied)
  const industries = pickN(cfg.industries, seed, 3);
  const points = pickN(VALUE_POINTS, seed * 13 + city.length, 5);
  const pointsHtml = points.map(p => `        <li style="margin-bottom:8px;">${p}</li>`).join('\n');
  const faqs = pickN(FAQ_POOL, seed * 17 + city.length * 3, 3).map(([q, a]) => [fill(q), fill(a)]);
  const faqHtml = faqs.map(([q, a]) => `      <article class="city-faq-item" itemscope itemtype="https://schema.org/Question" style="background:#fff;padding:18px 22px;border-radius:10px;border-left:3px solid #ffd700;margin-bottom:12px;">
        <h4 itemprop="name" style="margin:0 0 8px;color:#1a237e;font-size:16px;">${q}</h4>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p itemprop="text" style="margin:0;color:#374151;line-height:1.7;font-size:14px;">${a}</p>
        </div>
      </article>`).join('\n');

  return `
  <!-- C04 unique-content block (audit Section C) -->
  <section class="section section-light city-unique" aria-labelledby="city-unique-h2-${seed % 10000}">
    <div class="container fade-up" style="max-width:880px;">
      <h2 id="city-unique-h2-${seed % 10000}" style="color:#1a237e;margin:0 0 12px;">Why ${city} Businesses Choose Galaxy IT</h2>
      <p style="color:#374151;line-height:1.7;margin:0 0 14px;">${opener} ${middle}</p>
      <p style="color:#374151;line-height:1.7;margin:0 0 14px;">${middle2}</p>
      <p style="color:#374151;line-height:1.7;margin:0 0 14px;">In ${city} we work with <strong>${industries.join('</strong>, <strong>')}</strong> — every account starts with a free 30-minute audit so the ${cfg.label.toLowerCase()} package matches the size of your ${city} crew, your typical job ticket, and your peak season in ${stateLong}.</p>
      <h3 style="color:#1a237e;font-size:18px;margin:24px 0 10px;">What a typical ${cfg.label} engagement looks like for a ${city} business</h3>
      <ul style="margin:0 0 18px 18px;padding:0;color:#374151;line-height:1.7;">
${pointsHtml}
      </ul>
      <h3 style="color:#1a237e;font-size:18px;margin:24px 0 10px;">${city} business owner questions we hear most</h3>
${faqHtml}
      <p style="color:#374151;line-height:1.7;margin:18px 0 0;"><strong>${closer}</strong></p>
    </div>
  </section>
`;
}

// === Run ===
let stats = { phone: 0, blocks: 0, parsed: 0 };
const PHONE_OLD_RE = /\b(?:\+1[-\s]?)?(?:\(508\)\s*|508[-\s])499[-\s]?9279\b/g;
const PHONE_DIGITS_RE = /\+?15084999279\b/g;

for (const f of files) {
  const fp = path.join(dir, f);
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  // === 1) NAP fix: 508-499-9279 → 774-285-2299 ===
  html = html.replace(PHONE_DIGITS_RE, (m) => m.startsWith('+') ? '+17742852299' : '17742852299');
  html = html.replace(/\(508\)\s*499[-\s]?9279/g, '(774) 285-2299');
  html = html.replace(/508[-\s]?499[-\s]?9279/g, '774-285-2299');
  if (html !== before) stats.phone++;

  // === 2) Inject unique block before <footer if not already present ===
  if (!html.includes('class="section section-light city-unique"')) {
    const parsed = parseFilename(f);
    if (parsed) {
      stats.parsed++;
      const block = buildUniqueBlock(parsed);
      const footerRe = /(\n\s*<footer\b[^>]*>)/;
      if (footerRe.test(html)) {
        html = html.replace(footerRe, block + '$1');
        stats.blocks++;
      }
    }
  }

  fs.writeFileSync(fp, html);
}

console.log(`Phone fixes: ${stats.phone}/${files.length}`);
console.log(`Filenames parsed: ${stats.parsed}/${files.length}`);
console.log(`Unique blocks injected: ${stats.blocks}/${files.length}`);
