const fs = require('fs');
const path = require('path');

const wf = JSON.parse(fs.readFileSync(path.join(__dirname, 'wf-live.json'), 'utf8'));

// Fix Preparar GSC — get client from Lista de Clientes, contacts from item.json
const preparar = wf.nodes.find(n => n.name === 'Preparar GSC');
if (preparar) {
  preparar.parameters.jsCode = `return $input.all().map((item, idx) => {
  const client = $('Lista de Clientes').all()[idx]?.json || {};
  const contactsData = item.json;
  const now = new Date();
  // Always: last 30 days ending yesterday (GSC has stable data up to yesterday)
  const gscEnd = new Date(now.getTime() - 1*24*60*60*1000);
  const gscStart = new Date(gscEnd.getTime() - 29*24*60*60*1000);
  return { json: {
    ...client,
    _contactsData: contactsData,
    startDate: gscStart.toISOString().split('T')[0],
    endDate: gscEnd.toISOString().split('T')[0]
  }};
});`;
}

// Fix Encontrar Site no GSC — client comes from Preparar GSC (has email), item.json is HTTP response
const encontrar = wf.nodes.find(n => n.name === 'Encontrar Site no GSC');
if (encontrar) {
  encontrar.parameters.jsCode = `return $input.all().map((item, idx) => {
  const client = $('Preparar GSC').all()[idx]?.json || {};
  const sitesResp = item.json || {};
  const sites = sitesResp.siteEntry || [];
  const clientUrl = (client.site || '').replace(/https?:\\/\\//, '').replace(/\\/$/, '');
  const clientDomain = clientUrl.replace(/^www\\./, '');
  let matchedSite = null;
  for (const s of sites) {
    const url = s.siteUrl || '';
    if (url === 'sc-domain:' + clientDomain) { matchedSite = url; break; }
  }
  if (!matchedSite) {
    for (const s of sites) {
      const url = s.siteUrl || '';
      const urlClean = url.replace(/https?:\\/\\//, '').replace(/\\/$/, '').replace(/^www\\./, '');
      if (urlClean === clientDomain) { matchedSite = url; break; }
    }
  }
  return { json: {
    ...client,
    gscSiteUrl: matchedSite || '',
    gscAvailable: !!matchedSite
  }};
});`;
}

// Fix Processar Dados — client from Encontrar Site no GSC, gsc from item.json (HTTP response)
const processar = wf.nodes.find(n => n.name === 'Processar Dados');
if (processar) {
  processar.parameters.jsCode = `return $input.all().map((item, idx) => {
  const client = $('Encontrar Site no GSC').all()[idx]?.json || {};
  const contactsData = client._contactsData || {};
  const gscData = item.json || {};
  const allContacts = contactsData.contacts || [];
  const now = new Date();
  // Same range as GSC: last 30 days ending yesterday (00:00 UTC boundary)
  const yesterdayEnd = new Date(now.getTime() - 1*24*60*60*1000);
  yesterdayEnd.setHours(23, 59, 59, 999);
  const thirtyAgoMs = yesterdayEnd.getTime() - 30*24*60*60*1000;
  const yesterdayEndMs = yesterdayEnd.getTime();
  // Filter contacts: last 30 days ending yesterday AND from a form source only (matches GHL "new leads" view)
  const allLast30 = allContacts.filter(c => {
    if (!c.dateAdded) return false;
    const t = new Date(c.dateAdded).getTime();
    return t >= thirtyAgoMs && t <= yesterdayEndMs;
  });
  // ALL new contacts in the last 30 days — no filter (user sees everything)
  const last30 = allLast30;
  const sources30d = {};
  last30.forEach(c => { const s = c.source || 'Sem fonte definida'; sources30d[s] = (sources30d[s]||0)+1; });
  const sourcesList = Object.entries(sources30d).sort((a,b)=>b[1]-a[1]);
  const topSources = sourcesList.slice(0,5).map(([k,v])=>k+' ('+v+')').join(', ') || 'Nenhum lead novo';
  const sourcesDetailed = sourcesList.map(([k,v])=>'- ' + k + ': ' + v + ' leads').join('\\n') || '- Nenhum lead novo no periodo';
  let impressions = 0, clicks = 0, avgCtr = '0', avgPos = '0';
  const gscRows = gscData.rows || [];
  if (gscRows.length > 0) {
    gscRows.forEach(r => { impressions += r.impressions; clicks += r.clicks; });
    avgCtr = impressions > 0 ? ((clicks/impressions)*100).toFixed(2) : '0';
    avgPos = (gscRows.reduce((s,r)=>s+r.position,0) / gscRows.length).toFixed(1);
  }
  const hasGsc = impressions > 0;
  const gscInfo = hasGsc ? 'Impressoes no Google: ' + impressions + ' | Cliques: ' + clicks + ' | CTR: ' + avgCtr + '% | Posicao media: ' + avgPos : 'Dados do Google Search Console ainda nao disponiveis (site precisa estar verificado no GSC)';
  const mesesPT = ['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const monthName = mesesPT[now.getMonth()] + ' de ' + now.getFullYear();
  const thirtyAgo = new Date(thirtyAgoMs);
  const startFmt = thirtyAgo.getDate() + '/' + (thirtyAgo.getMonth()+1) + '/' + thirtyAgo.getFullYear();
  const endFmt = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear();
  const period = startFmt + ' a ' + endFmt;
  const prompt = 'IMPORTANTE: Escreva APENAS em portugues brasileiro. NUNCA use ingles.\\n\\nVoce e redator da Galaxy IT & Marketing.\\n\\nCliente: ' + client.name + '\\nSite: ' + client.site + '\\nPeriodo: ' + period + '\\n\\n=== LEADS (ultimos 30 dias) ===\\nTotal de novos leads: ' + last30.length + '\\n\\nDe onde vieram:\\n' + sourcesDetailed + '\\n\\n=== SITE (Google Search Console) ===\\n' + gscInfo + '\\n\\nESTRUTURA:\\n1. Ola, equipe da ' + client.name + '!\\n2. Destaques: ' + last30.length + ' novos leads + dados do site\\n3. De onde vieram os leads\\n4. Desempenho no Google (se tiver dados)\\n5. Uma recomendacao\\n6. Abracos, Equipe Galaxy IT & Marketing\\n\\nMaximo 220 palavras. Em portugues brasileiro. Use os numeros reais.';
  const body = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'Voce e um redator brasileiro. Escreve APENAS em portugues do Brasil.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 800,
    temperature: 0.5
  };
  return { json: {
    ...client,
    newContacts: last30.length,
    topSources,
    impressions, clicks, avgCtr, avgPos,
    monthName, period,
    aiBody: JSON.stringify(body)
  }};
});`;
}

// Fix Formatar Email — client from Processar Dados (has all data), item.json is AI response
const formatar = wf.nodes.find(n => n.name === 'Formatar Email');
if (formatar) {
  formatar.parameters.jsCode = `return $input.all().map((item, idx) => {
  const client = $('Processar Dados').all()[idx]?.json || {};
  const aiResp = item.json;
  const report = aiResp.choices?.[0]?.message?.content || 'Erro ao gerar relatorio';
  const monthName = client.monthName;
  const rHtml = report.replace(/\\n/g, '<br>').replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>');
  const subject = '[TESTE - ' + client.name + '] Relatorio Mensal - ' + monthName;
  const impressions = client.impressions || 0;
  const clicks = client.clicks || 0;
  const ctr = client.avgCtr || '0';
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:20px;color:#333;background:#f5f5f5;">' +
'<div style="background:linear-gradient(135deg,#0d1b2a,#1a237e);padding:30px;border-radius:12px 12px 0 0;text-align:center;">' +
'<h1 style="color:#ffd700;margin:0;font-size:22px;">Galaxy IT &amp; Marketing</h1>' +
'<p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px;">Relatorio Mensal de Desempenho &mdash; ' + monthName + '</p>' +
'<p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:12px;">Cliente: ' + client.name + '</p>' +
'</div><div style="background:#fff;padding:30px;border:1px solid #e5e5e5;border-top:none;">' +
'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;"><tr>' +
'<td width="25%" style="padding:0 4px;text-align:center;"><div style="background:#f8f9fa;padding:16px 8px;border-radius:8px;border-top:3px solid #ffd700;">' +
'<div style="font-size:24px;font-weight:800;color:#1a237e;">' + client.newContacts + '</div>' +
'<div style="font-size:9px;color:#888;margin-top:4px;text-transform:uppercase;">Novos Leads</div></div></td>' +
'<td width="25%" style="padding:0 4px;text-align:center;"><div style="background:#f8f9fa;padding:16px 8px;border-radius:8px;border-top:3px solid #2e7d32;">' +
'<div style="font-size:24px;font-weight:800;color:#1a237e;">' + impressions.toLocaleString('pt-BR') + '</div>' +
'<div style="font-size:9px;color:#888;margin-top:4px;text-transform:uppercase;">Impressoes</div></div></td>' +
'<td width="25%" style="padding:0 4px;text-align:center;"><div style="background:#f8f9fa;padding:16px 8px;border-radius:8px;border-top:3px solid #1a237e;">' +
'<div style="font-size:24px;font-weight:800;color:#1a237e;">' + clicks + '</div>' +
'<div style="font-size:9px;color:#888;margin-top:4px;text-transform:uppercase;">Cliques</div></div></td>' +
'<td width="25%" style="padding:0 4px;text-align:center;"><div style="background:#f8f9fa;padding:16px 8px;border-radius:8px;border-top:3px solid #ffd700;">' +
'<div style="font-size:24px;font-weight:800;color:#1a237e;">' + ctr + '%</div>' +
'<div style="font-size:9px;color:#888;margin-top:4px;text-transform:uppercase;">CTR</div></div></td></tr></table>' +
'<p style="font-size:14px;line-height:1.8;">' + rHtml + '</p></div>' +
'<div style="background:#f8f9fa;padding:20px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e5e5e5;border-top:none;">' +
'<p style="margin:0;font-size:12px;color:#888;">Duvidas? <a href="https://galaxyinfo.us/support" style="color:#1a237e;font-weight:600;">Central de Ajuda</a></p>' +
'<p style="margin:8px 0 0;font-size:11px;color:#aaa;">&copy; 2026 Galaxy IT &amp; Marketing &middot; Worcester, MA</p></div></body></html>';
  return { json: { ...client, report, html, subject } };
});`;
}

const updated = {
  name: wf.name,
  nodes: wf.nodes,
  connections: wf.connections,
  settings: wf.settings || { executionOrder: 'v1' }
};

fs.writeFileSync(path.join(__dirname, 'wf-iterate.json'), JSON.stringify(updated));
console.log('Done. Nodes: ' + updated.nodes.length);
