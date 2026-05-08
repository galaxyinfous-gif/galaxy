// Add Brazil phone +55 (32) 2299-0041 in all places where the US phone was previously removed.
// Coexists with the email channel — email stays as primary, BR phone added alongside.
const fs = require('fs');
const path = require('path');

const BR_DISPLAY = '(32) 2299-0041';
const BR_TEL = 'tel:+553222990041';
const BR_WA = 'https://wa.me/553222990041';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git', '.vercel', 'images', 'n8n', 'memory', 'scripts', 'api'].includes(e.name)) walk(fp, out);
    else if (e.isFile() && e.name.endsWith('.html')) out.push(fp);
  }
  return out;
}

const files = walk(path.join(__dirname, '..'));
let stats = { schema: 0, metaDesc: 0, footerContact: 0, files: 0 };

for (const fp of files) {
  let h = fs.readFileSync(fp, 'utf8');
  const before = h;

  // 1) Re-add schema.org "telephone" field next to "email" line
  h = h.replace(/(\s*"email"\s*:\s*"info@galaxyinfo\.us"\s*,\s*\n\s*)("address")/g, (m, pre, addr) => {
    if (h.includes('"telephone"')) return m;
    stats.schema++;
    return pre + '"telephone": "+55-32-2299-0041",\n    ' + addr;
  });

  // 2) Append BR phone to meta descriptions that ended in "Email info@galaxyinfo.us." (and have room)
  h = h.replace(/(<meta\s+name="description"\s+content=")([^"]+?)(Email info@galaxyinfo\.us\.)(")/gi, (m, p1, mid, end, p4) => {
    const totalLen = (p1 + mid + end + ' or ' + BR_DISPLAY + '.' + p4).length - p1.length - p4.length;
    if (totalLen > 160) return m;
    if (mid.includes('+55')) return m;
    stats.metaDesc++;
    return p1 + mid + end.replace(/\.$/, '') + ' or ' + BR_DISPLAY + '.' + p4;
  });

  // 3) Restore the contact-info-item "Phone" block on contact.html (was stripped earlier)
  if (fp.endsWith('contact.html') && !h.includes('contact_phone_h4')) {
    h = h.replace(/(<div class="contact-info-item">\s*<div class="contact-info-icon">\s*<i class="fas fa-envelope"><\/i>)/,
      `<div class="contact-info-item">
                        <div class="contact-info-icon"><i class="fas fa-phone"></i></div>
                        <div>
                            <h4>Phone (Brazil)</h4>
                            <a href="${BR_TEL}">${BR_DISPLAY}</a>
                            <p>International / Brazil office</p>
                        </div>
                    </div>

                    $1`);
    stats.footerContact++;
  }

  if (h !== before) {
    fs.writeFileSync(fp, h);
    stats.files++;
  }
}

console.log('schema "telephone" added:', stats.schema);
console.log('meta descriptions with BR phone:', stats.metaDesc);
console.log('contact.html phone block restored:', stats.footerContact);
console.log('files modified:', stats.files);
