// Swap bare wa.me/553522990041 links → include pre-filled "Olá, vim pelo site..." message.
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

const OLD = 'https://wa.me/553522990041';
const NEW = 'https://wa.me/553522990041?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.';

const files = walk(path.join(__dirname, '..'));
let stats = { files: 0, replacements: 0 };

for (const f of files) {
  let h = fs.readFileSync(f, 'utf8');
  if (!h.includes(OLD)) continue;
  const before = h;
  // Replace only bare URLs (not ones that already have query string)
  // Split by OLD then rejoin: only rewrite occurrences where next char is quote/space (end of URL)
  const parts = h.split(OLD);
  let rebuilt = parts[0];
  for (let i = 1; i < parts.length; i++) {
    const next = parts[i].charAt(0);
    if (next === '?' || next === '&') {
      // Already has params, keep as-is
      rebuilt += OLD + parts[i];
    } else {
      rebuilt += NEW + parts[i];
      stats.replacements++;
    }
  }
  if (rebuilt !== before) {
    fs.writeFileSync(f, rebuilt);
    stats.files++;
  }
}

console.log('WhatsApp links upgraded with pre-filled text:', stats.replacements);
console.log('Files modified:', stats.files);
