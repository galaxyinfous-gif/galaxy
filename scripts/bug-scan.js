// Scan all HTML files for visible-text bugs (leaked attributes, broken phrases, etc.)
const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git', '.vercel', 'images', 'memory', 'scripts', 'api'].includes(e.name)) walk(fp, out);
    else if (e.isFile() && e.name.endsWith('.html')) out.push(fp);
  }
  return out;
}
const files = walk(path.join(__dirname, '..'));

const patterns = [
  { name: 'leaked data-i18n attr as text', re: /\bdata-i18n="[^"]*"\s+style="display:none">/g },
  { name: 'orphan </span> after style attr', re: /style="display:none"><\/span>/g },
  { name: 'Emailor (missing space)', re: /Emailor/g },
  { name: 'Call now info@', re: /Call now info@galaxyinfo\.us/g },
  { name: 'info@galaxyinfo.us today', re: /info@galaxyinfo\.us\s+today/g },
  { name: 'double email back-to-back', re: /info@galaxyinfo\.us\s*,\s*info@galaxyinfo\.us/g },
  { name: '+1-7742852299 leftover', re: /\+1-7742852299/g },
  { name: '+17742852299 leftover (US)', re: /\+17742852299/g },
  { name: '(774) leftover', re: /\(774\)\s*285-?2299/g },
  { name: 'tel:tel:', re: /tel:tel:/g },
  { name: 'undefined as text', re: />undefined</g },
  { name: 'NaN as text', re: />NaN</g },
  { name: '$\\{ template literal leak', re: /\$\{[^}]+\}/g }
];

const issues = {};
for (const p of patterns) issues[p.name] = [];

for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  for (const p of patterns) {
    const m = h.match(p.re);
    if (m) issues[p.name].push({ file: f.replace(__dirname + '\\..\\', '').replace(/\\/g, '/'), count: m.length, sample: m[0].slice(0, 90) });
  }
}

let any = false;
for (const [name, list] of Object.entries(issues)) {
  if (list.length) {
    any = true;
    console.log('\n=== ' + name + ' — ' + list.length + ' files ===');
    list.slice(0, 5).forEach(i => console.log('  [' + i.count + ']', i.file, '·', JSON.stringify(i.sample)));
    if (list.length > 5) console.log('  ... and ' + (list.length - 5) + ' more');
  }
}
if (!any) console.log('\nNo bug patterns matched. Clean.');
