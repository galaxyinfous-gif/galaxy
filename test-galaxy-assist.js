// Battery of tests for the live Galaxy Assist API
// Uses the real system prompt extracted from support-chat.js

const fs = require('fs');
const path = require('path');

// Extract systemPrompt from support-chat.js (between backticks after "systemPrompt: `")
const code = fs.readFileSync(path.join(__dirname, 'support-chat.js'), 'utf8');
const m = code.match(/systemPrompt:\s*`([\s\S]+?)`\s*\n\s*}/);
if (!m) { console.error('could not find systemPrompt'); process.exit(1); }
const systemPrompt = m[1];

const ENDPOINT = 'https://galaxyinfo.us/api/galaxy-assist';

const TESTS = [
  { name: 'Typo PT (wokflow)', msg: 'como configurar wokflow no bee pro hub' },
  { name: 'Slang PT (oq, vc)', msg: 'oq é trigger link, vc sabe?' },
  { name: 'Single keyword', msg: 'whatsapp' },
  { name: 'Vague PT', msg: 'ta dando erro' },
  { name: 'Multi-question', msg: 'como vejo cliques de email e tambem como configuro resposta automatica?' },
  { name: 'Frustrated', msg: 'nao consigo configurar isso!!! ta muito ruim' },
  { name: 'Voice-to-text', msg: 'oi cara queria saber como faço pra mandar uma mensagem pro meu cliente que pediu orçamento ontem mas eu n sei se ele recebeu o email q eu mandei sabe' },
  { name: 'Off-topic adjacent', msg: 'qual o melhor horario pra postar no instagram?' },
  { name: 'Specific feature (likely needs search)', msg: 'qual o limite de SMS no plano starter do GHL?' },
  { name: 'English question', msg: 'how do I set up a chatbot in conversation AI?' },
  { name: 'Spanish question', msg: 'como envío un email masivo a todos mis contactos?' },
  { name: 'Off-topic completely', msg: 'qual a melhor pizza do mundo?' },
  { name: 'GHL setup (needs docs)', msg: 'como conectar minha conta de stripe no GHL?' },
];

async function ask(msg) {
  const start = Date.now();
  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, language: 'pt', systemPrompt })
    });
    const data = await r.json();
    return { ok: r.ok, ms: Date.now() - start, text: data.text || data.error || '(no text)' };
  } catch (e) {
    return { ok: false, ms: Date.now() - start, text: 'ERROR: ' + e.message };
  }
}

(async () => {
  for (const t of TESTS) {
    process.stdout.write('\n=== ' + t.name + ' ===\nQ: ' + t.msg + '\n');
    const r = await ask(t.msg);
    const preview = (r.text || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 400);
    console.log('A (' + r.ms + 'ms): ' + preview + (r.text.length > 400 ? '...' : ''));
    await new Promise(r => setTimeout(r, 12000));
  }
})();
