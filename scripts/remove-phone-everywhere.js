// Remove (774) 285-2299 from entire site. Replace with email/contact form CTAs.
// Per user instruction: communication channels = form + email only.
const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git', '.vercel', '.vscode', 'dist', 'images', 'n8n', 'memory', 'scripts'].includes(e.name)) walk(fp, out);
    else if (e.isFile() && (e.name.endsWith('.html') || e.name === 'analytics.js')) out.push(fp);
  }
  return out;
}

const root = path.join(__dirname, '..');
const files = walk(root);

let stats = { tel: 0, display: 0, schema: 0, meta: 0, sticky: 0, files: 0 };

for (const fp of files) {
  let h = fs.readFileSync(fp, 'utf8');
  const before = h;

  // 1) tel: links → mailto: or /contact
  h = h.replace(/<a([^>]*?)href=["']tel:\+?17?7?42852299["']([^>]*?)>([\s\S]*?)<\/a>/gi, (m, pre, post, inner) => {
    stats.tel++;
    const cleanInner = inner.replace(/\(774\)\s*285-?2299|774[-.\s]?285[-.\s]?2299|\+?1?-?774-?285-?2299/gi, 'info@galaxyinfo.us');
    return `<a${pre}href="mailto:info@galaxyinfo.us"${post}>${cleanInner}</a>`;
  });
  // Catch any remaining tel: pattern (links with weird formatting)
  h = h.replace(/href=["']tel:[^"']*7742852299[^"']*["']/gi, () => { stats.tel++; return 'href="mailto:info@galaxyinfo.us"'; });

  // 2) Schema.org "telephone" field — remove the line entirely
  h = h.replace(/\s*"telephone"\s*:\s*"[^"]*",?\n?/g, () => { stats.schema++; return '\n    '; });

  // 3) Visible display strings inside meta descriptions: "Call (774) 285-2299." patterns
  h = h.replace(/(content="[^"]*?)\s*Call\s*\(?774\)?[-.\s]?285[-.\s]?2299\.?\s*("?)/gi, (m, pre, suf) => { stats.meta++; return pre + ' Email info@galaxyinfo.us.' + suf; });
  h = h.replace(/(content="[^"]*?)\s*\(?774\)?[-.\s]?285[-.\s]?2299\s*today\.?\s*("?)/gi, (m, pre, suf) => { stats.meta++; return pre + ' info@galaxyinfo.us.' + suf; });
  h = h.replace(/(content="[^"]*?)\s*\(?774\)?[-.\s]?285[-.\s]?2299\.?\s*("?)/gi, (m, pre, suf) => { stats.meta++; return pre + ' info@galaxyinfo.us.' + suf; });

  // 4) Remaining inline visible phone text "(774) 285-2299" or "774-285-2299" in body content → email
  h = h.replace(/\(774\)\s*285-?2299/g, () => { stats.display++; return 'info@galaxyinfo.us'; });
  h = h.replace(/\b774[-.\s]285[-.\s]2299\b/g, () => { stats.display++; return 'info@galaxyinfo.us'; });
  h = h.replace(/\+1[-\s]?774[-\s]?285[-\s]?2299/g, () => { stats.display++; return 'info@galaxyinfo.us'; });
  h = h.replace(/\+17742852299/g, () => { stats.display++; return 'info@galaxyinfo.us'; });

  // 5) Sticky-call-mobile → swap fa-phone for fa-envelope, point to /contact
  if (h.includes('class="sticky-call-mobile"')) {
    h = h.replace(/<a([^>]*?)class="sticky-call-mobile"([^>]*?)href="[^"]*"([^>]*?)>[\s\S]*?<\/a>/i, (m, a, b, c) => {
      stats.sticky++;
      return `<a${a}class="sticky-call-mobile"${b}href="/contact"${c} aria-label="Send a message"><i class="fas fa-envelope"></i></a>`;
    });
    // Alternative if href comes after class
    if (!stats.sticky) {
      h = h.replace(/<a([^>]*)class="sticky-call-mobile"([\s\S]*?)<\/a>/i, (m, pre, rest) => {
        stats.sticky++;
        const newRest = rest.replace(/href="[^"]+"/, 'href="/contact"').replace(/<i\s+class="[^"]*fa-phone[^"]*"[^>]*><\/i>/i, '<i class="fas fa-envelope"></i>');
        return `<a${pre}class="sticky-call-mobile"${newRest}</a>`;
      });
    }
  }

  // 6) Generic "Call now" / "Call us" → "Send us a message" (preserves CTAs that lost their phone)
  h = h.replace(/>Call now</g, '>Send a message<');
  h = h.replace(/>Call us</g, '>Email us<');
  h = h.replace(/>Call Us</g, '>Email Us<');

  if (h !== before) {
    fs.writeFileSync(fp, h);
    stats.files++;
  }
}

console.log('Files modified:    ', stats.files, '/', files.length);
console.log('  tel: links:      ', stats.tel);
console.log('  schema fields:   ', stats.schema);
console.log('  meta descriptions:', stats.meta);
console.log('  display refs:    ', stats.display);
console.log('  sticky FAB:      ', stats.sticky);
