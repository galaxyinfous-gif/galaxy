const fs = require('fs');
const path = require('path');
const file = process.argv[2] || 'areas.html';
const h = fs.readFileSync(file, 'utf8');
const tags = ['div', 'section', 'header', 'footer', 'script', 'a', 'span', 'h1', 'h2'];
for (const t of tags) {
  const open = (h.match(new RegExp('<' + t + '(?=[\\s>/])', 'g')) || []).length;
  const close = (h.match(new RegExp('</' + t + '>', 'g')) || []).length;
  console.log(t.padEnd(8), 'open=', open, 'close=', close, open === close ? 'OK' : '**MISMATCH**');
}
