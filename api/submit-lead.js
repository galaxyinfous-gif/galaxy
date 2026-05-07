// /api/submit-lead — accepts form posts, rejects personal email providers, forwards to GHL
// Per Galaxy IT policy: business email only (rejects gmail.com, yahoo.com, hotmail.com, etc.)

const PERSONAL_EMAIL_PROVIDERS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.com.br', 'ymail.com', 'rocketmail.com',
  'hotmail.com', 'hotmail.co.uk', 'hotmail.com.br', 'outlook.com', 'outlook.com.br', 'live.com', 'live.com.br',
  'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'pm.me', 'tutanota.com', 'tutanota.de',
  'mail.com', 'gmx.com', 'gmx.de', 'gmx.net', 'fastmail.com', 'zoho.com',
  'qq.com', '163.com', '126.com', 'sina.com', 'yandex.com', 'yandex.ru', 'mail.ru',
  'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net', 'charter.net', 'cox.net', 'optonline.net', 'earthlink.net',
  'rambler.ru', 'inbox.ru', 'list.ru', 'bk.ru', 'web.de', 't-online.de', 'orange.fr', 'wanadoo.fr', 'free.fr',
  'uol.com.br', 'bol.com.br', 'terra.com.br', 'ig.com.br', 'oi.com.br', 'globo.com'
]);

const DISPOSABLE_PROVIDERS = new Set([
  'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'tempmail.com', 'temp-mail.org',
  'throwaway.email', 'trashmail.com', 'yopmail.com', 'sharklasers.com', 'getnada.com', 'maildrop.cc',
  'mintemail.com', 'fakeinbox.com', 'spamgourmet.com', 'mytemp.email'
]);

function classifyEmail(email) {
  if (!email || typeof email !== 'string') return { ok: false, reason: 'invalid' };
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { ok: false, reason: 'malformed' };
  const domain = trimmed.split('@')[1];
  if (DISPOSABLE_PROVIDERS.has(domain)) return { ok: false, reason: 'disposable' };
  if (PERSONAL_EMAIL_PROVIDERS.has(domain)) return { ok: false, reason: 'personal' };
  return { ok: true, domain };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  const body = (typeof req.body === 'string') ? JSON.parse(req.body || '{}') : (req.body || {});
  const { fullName, email, company, service, message, honeypot } = body;

  if (honeypot) { res.status(200).json({ ok: true }); return; }

  if (!fullName || !email || !company) {
    res.status(400).json({ ok: false, error: 'missing_fields', message: 'Name, business email, and company are required.' });
    return;
  }

  const cls = classifyEmail(email);
  if (!cls.ok) {
    const map = {
      personal: 'Please use your business/work email — Galaxy IT only works with companies. Personal addresses (Gmail, Yahoo, Hotmail, Outlook, AOL, iCloud, etc.) are not accepted.',
      disposable: 'Disposable email addresses are not accepted. Please use your real business email.',
      malformed: 'Please enter a valid email address.',
      invalid: 'Email is required.'
    };
    res.status(400).json({ ok: false, error: cls.reason, message: map[cls.reason] || 'Invalid email.' });
    return;
  }

  const ghlPayload = {
    firstName: fullName.split(' ')[0],
    lastName: fullName.split(' ').slice(1).join(' ') || '',
    email: email.trim().toLowerCase(),
    companyName: company,
    customField: { service: service || '', message: message || '' },
    source: 'galaxyinfo.us /contact form (business-email-only)',
    tags: ['website-lead', 'business-email-verified']
  };

  const ghlKey = process.env.GHL_AGENCY_API_KEY || process.env.GHL_LOCATION_API_KEY;
  let ghlOk = false;
  let ghlError = null;

  if (ghlKey) {
    try {
      const r = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${ghlKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(ghlPayload)
      });
      ghlOk = r.ok;
      if (!r.ok) ghlError = `GHL ${r.status}`;
    } catch (e) {
      ghlError = e.message;
    }
  }

  // Always send a notification email to the team via SMTP fallback (configured in Vercel env)
  // (Email sending omitted here — relies on n8n speed-to-lead workflow webhook below)
  try {
    if (process.env.N8N_LEAD_WEBHOOK) {
      await fetch(process.env.N8N_LEAD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ghlPayload, businessDomain: cls.domain })
      }).catch(() => {});
    }
  } catch (e) { /* swallow */ }

  res.status(200).json({
    ok: true,
    ghl: ghlOk ? 'forwarded' : (ghlError ? `error:${ghlError}` : 'no_key'),
    domain: cls.domain
  });
};

module.exports.classifyEmail = classifyEmail;
