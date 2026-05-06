// Bulk add Google Maps embed to all city pages, inserted before the CTA section
const fs = require('fs');
const path = require('path');

const CITIES_DIR = path.join(__dirname, '..', 'cities');
const files = fs.readdirSync(CITIES_DIR).filter(f => f.endsWith('.html'));

let updated = 0, skipped = 0, failed = 0;

for (const f of files) {
  const fp = path.join(CITIES_DIR, f);
  let html = fs.readFileSync(fp, 'utf8');

  if (html.includes('google.com/maps') && html.includes('iframe')) {
    skipped++;
    continue;
  }

  // Extract city + state from the gold-styled span in h1
  const cityMatch = html.match(/<span class="gold"[^>]*>([^<]+?)<\/span>/);
  if (!cityMatch) { failed++; continue; }
  const cityFull = cityMatch[1].trim();
  const queryStr = encodeURIComponent(cityFull + ' USA');

  const mapSection = `
    <!-- Map embed (audit C05) -->
    <section class="section section-light" id="location-map" style="padding:60px 0;">
        <div class="container">
            <div class="section-header fade-up" style="text-align:center;margin-bottom:24px;">
                <span class="section-label"><i class="fas fa-map-marker-alt"></i> Service Area</span>
                <h2 style="font-size:1.8rem;">Serving ${cityFull}</h2>
                <p style="max-width:560px;margin:10px auto 0;color:var(--text-muted);font-size:0.95rem;">Galaxy IT &amp; Marketing proudly serves businesses across ${cityFull} and surrounding areas.</p>
            </div>
            <div class="fade-up" style="max-width:900px;margin:0 auto;border-radius:14px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12);">
                <iframe
                    src="https://www.google.com/maps?q=${queryStr}&output=embed"
                    width="100%" height="360" style="border:0;display:block;"
                    loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                    title="Map of ${cityFull}"
                    allowfullscreen></iframe>
            </div>
        </div>
    </section>
`;

  // Insert before the cta-section
  if (html.includes('<section class="cta-section">')) {
    html = html.replace('<section class="cta-section">', mapSection + '\n    <section class="cta-section">');
    fs.writeFileSync(fp, html);
    updated++;
  } else {
    failed++;
  }
}

console.log(`Total files: ${files.length}`);
console.log(`Updated: ${updated}`);
console.log(`Skipped (already had map): ${skipped}`);
console.log(`Failed: ${failed}`);
