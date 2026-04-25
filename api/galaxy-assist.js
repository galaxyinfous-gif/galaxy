// Galaxy Assist — Vercel Serverless Function
// Free-tier provider chain: Cerebras → Groq → Anthropic (if credit available)
// Each provider falls through to the next on rate limit, error, or missing key

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  var body = req.body || {};
  var message = body.message;
  var systemPrompt = body.systemPrompt || '';
  var history = body.history;

  if (!message) return res.status(400).json({ error: 'Message required' });

  // Build conversation messages
  var messages = [];
  try {
    var parsed = typeof history === 'string' ? JSON.parse(history) : (history || []);
    if (Array.isArray(parsed)) {
      for (var i = 0; i < parsed.length; i++) {
        messages.push({
          role: parsed[i].role === 'assistant' ? 'assistant' : 'user',
          content: String(parsed[i].content)
        });
      }
    }
  } catch (e) {}
  messages.push({ role: 'user', content: message });

  var debugInfo = [];

  // Helper: call an OpenAI-compatible chat completions endpoint
  async function callOpenAICompatible(name, url, key, model) {
    if (!key) { debugInfo.push(name + '_no_key'); return null; }
    try {
      var resp = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'system', content: systemPrompt }].concat(messages),
          max_tokens: 1024,
          temperature: 0.7
        })
      });
      if (resp.ok) {
        var data = await resp.json();
        var text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (text) return text;
        debugInfo.push(name + '_ok_no_text');
      } else {
        var err = await resp.text();
        debugInfo.push(name + '_' + resp.status + ': ' + err.substring(0, 250));
      }
    } catch (e) {
      debugInfo.push(name + '_exception: ' + e.message);
    }
    return null;
  }

  // 1) PRIMARY: Cerebras Qwen 3 235B — top free-tier quality, multilingual, fast
  var cerebrasText = await callOpenAICompatible(
    'cerebras-qwen',
    'https://api.cerebras.ai/v1/chat/completions',
    process.env.CEREBRAS_API_KEY,
    'qwen-3-235b-a22b-instruct-2507'
  );
  if (cerebrasText) return res.status(200).json({ text: cerebrasText, source: 'cerebras-qwen' });

  // 1b) Cerebras GPT-OSS 120B (different model, separate quota)
  var cerebrasOssText = await callOpenAICompatible(
    'cerebras-oss',
    'https://api.cerebras.ai/v1/chat/completions',
    process.env.CEREBRAS_API_KEY,
    'gpt-oss-120b'
  );
  if (cerebrasOssText) return res.status(200).json({ text: cerebrasOssText, source: 'cerebras-oss' });

  // 2) FALLBACK: Groq — 100K tokens/day free
  var groqText = await callOpenAICompatible(
    'groq',
    'https://api.groq.com/openai/v1/chat/completions',
    process.env.GROQ_API_KEY,
    'llama-3.3-70b-versatile'
  );
  if (groqText) return res.status(200).json({ text: groqText, source: 'groq' });

  // 3) Try Groq with the smaller, less-rate-limited 8B model
  var groqSmallText = await callOpenAICompatible(
    'groq8b',
    'https://api.groq.com/openai/v1/chat/completions',
    process.env.GROQ_API_KEY,
    'llama-3.1-8b-instant'
  );
  if (groqSmallText) return res.status(200).json({ text: groqSmallText, source: 'groq-8b' });

  // 4) LAST RESORT: Anthropic (only succeeds if user has credit)
  var anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      var antResp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages
        })
      });
      if (antResp.ok) {
        var antData = await antResp.json();
        var antText = '';
        if (antData.content && Array.isArray(antData.content)) {
          for (var j = 0; j < antData.content.length; j++) {
            if (antData.content[j].type === 'text' && antData.content[j].text) {
              antText += antData.content[j].text;
            }
          }
        }
        if (antText) return res.status(200).json({ text: antText, source: 'anthropic-haiku' });
        debugInfo.push('anthropic_ok_no_text');
      } else {
        var errBody = await antResp.text();
        debugInfo.push('anthropic_' + antResp.status + ': ' + errBody.substring(0, 250));
      }
    } catch (e) {
      debugInfo.push('anthropic_exception: ' + e.message);
    }
  } else {
    debugInfo.push('anthropic_no_key');
  }

  return res.status(200).json({ error: 'AI unavailable', debug: debugInfo });
};
