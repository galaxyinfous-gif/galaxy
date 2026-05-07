// Generate a preview of what the new email will look like, using mock data
const fs = require('fs');

const client = {
  name: 'Mass HVAC',
  site: 'https://masshvac.net/',
  monthName: 'abril de 2026',
  period: '27/3/2026 a 25/4/2026',
  new30d: 10,
  won30d: 0,
  impressions: 32976,
  clicks: 43,
  avgCtr: '0.1',
  avgPos: '21.0',
  // 30 days of mock GSC data
  dailySeries: Array.from({length: 30}, (_, i) => {
    const date = new Date(2026, 2, 27 + i);
    const dateStr = date.toISOString().slice(0, 10);
    return {
      date: dateStr,
      impressions: 800 + Math.round(Math.sin(i/3) * 400) + Math.round(Math.random()*500),
      clicks: 1 + Math.round(Math.random()*4)
    };
  }),
  report: 'Olá, equipe da Mass HVAC! Tudo bem?\n\nÉ com grande satisfação que celebramos as 10 novas oportunidades conquistadas neste período! Esses resultados são fruto do trabalho conjunto dedicado da nossa equipe.\n\nO desempenho do site no Google também foi otimo: alcançamos 33,0K impressões e 43 cliques, com um CTR de 0.1% e posição média de 21.0. Isso mostra que estamos conquistando uma visibilidade promissora.\n\nVamos manter o ritmo no próximo mês! Com essa base sólida, podemos esperar um crescimento ainda maior.\n\nConte com a gente! Abracos, Equipe Galaxy IT & Marketing'
};

// === Replicate Formatar Email logic ===
const report = client.report;
const monthName = client.monthName;
const rHtml = report.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
const subject = '[PREVIEW - ' + client.name + '] Relatorio Mensal - ' + monthName;
const impressions = Number(client.impressions || 0);
const clicks = Number(client.clicks || 0);
const ctrRaw = parseFloat(client.avgCtr || '0');
const ctr = ctrRaw.toFixed(1);
const new30d = Number(client.new30d || 0);
const won30d = Number(client.won30d || 0);
const period = client.period || '';

const fmtBig = (n) => {
  if (n < 1000) return n.toString();
  const k = n / 1000;
  if (n < 10000) return k.toFixed(1).replace('.', ',') + 'K';
  if (k >= 100 || k === Math.round(k)) return Math.round(k).toString() + 'K';
  return k.toFixed(1).replace('.', ',') + 'K';
};

// Daily impressions chart
const series = client.dailySeries || [];
const maxImpr = series.reduce((m, d) => Math.max(m, d.impressions||0), 1);
const fmtDay = (s) => { const p = s.split('-'); return p[2] + '/' + p[1]; };
const dayCells = series.map(d => {
  const h = Math.max(4, Math.round((d.impressions / maxImpr) * 100));
  return '<td style="vertical-align:bottom;padding:0 1px;width:' + Math.floor(100/Math.max(series.length,1)) + '%;">' +
    '<div title="' + fmtDay(d.date) + ': ' + d.impressions + ' impressoes, ' + d.clicks + ' cliques" style="background:linear-gradient(180deg,#ffd700,#1a237e);height:' + h + 'px;border-radius:3px 3px 0 0;min-height:4px;"></div>' +
  '</td>';
}).join('');
const chartHtml = series.length
  ? '<div style="background:#f8f9fa;padding:18px 12px 8px;border-radius:10px;">' +
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="height:120px;"><tr>' + dayCells + '</tr></table>' +
      '<div style="display:flex;justify-content:space-between;font-size:10px;color:#888;margin-top:6px;padding:0 4px;">' +
        '<span>' + (series[0]?fmtDay(series[0].date):'') + '</span>' +
        '<span>' + (series[series.length-1]?fmtDay(series[series.length-1].date):'') + '</span>' +
      '</div>' +
    '</div>'
  : '<p style="color:#888;font-style:italic;font-size:13px;">Sem dados diarios do GSC</p>';

const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;max-width:680px;margin:0 auto;padding:20px;color:#1f2937;background:#f5f5f5;">' +
'<div style="background:linear-gradient(135deg,#0d1b2a,#1a237e);padding:32px 24px;border-radius:14px 14px 0 0;text-align:center;">' +
'<h1 style="color:#ffd700;margin:0;font-size:24px;font-weight:800;letter-spacing:0.5px;">Galaxy IT &amp; Marketing</h1>' +
'<p style="color:rgba(255,255,255,0.85);margin:10px 0 0;font-size:14px;">Relatorio Mensal &mdash; ' + monthName + '</p>' +
'<p style="color:rgba(255,255,255,0.55);margin:4px 0 0;font-size:12px;">Cliente: ' + client.name + ' &middot; Periodo: ' + period + '</p>' +
'</div>' +
'<div style="background:linear-gradient(135deg,#1a237e,#3b4bb8);padding:24px;text-align:center;color:#fff;">' +
'<div style="font-size:13px;text-transform:uppercase;letter-spacing:1.5px;opacity:0.85;">Novas oportunidades no periodo</div>' +
'<div style="font-size:56px;font-weight:900;color:#ffd700;line-height:1;margin:8px 0;">' + new30d + '</div>' +
(won30d > 0 ? '<div style="font-size:13px;opacity:0.9;">' + won30d + ' ja ganhas &middot; otimo trabalho!</div>' : '<div style="font-size:13px;opacity:0.7;">Acompanhe o avanco no pipeline</div>') +
'</div>' +
'<div style="background:#fff;padding:24px;border-left:1px solid #e5e5e5;border-right:1px solid #e5e5e5;">' +
'<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>' +
'<td width="33%" style="padding:0 6px;text-align:center;"><div style="background:#f8f9fa;padding:18px 8px;border-radius:10px;border-top:3px solid #ffd700;">' +
'<div style="font-size:22px;font-weight:800;color:#1a237e;">' + fmtBig(impressions) + '</div>' +
'<div style="font-size:10px;color:#888;margin-top:4px;text-transform:uppercase;">Impressoes Google</div></div></td>' +
'<td width="33%" style="padding:0 6px;text-align:center;"><div style="background:#f8f9fa;padding:18px 8px;border-radius:10px;border-top:3px solid #1a237e;">' +
'<div style="font-size:22px;font-weight:800;color:#1a237e;">' + clicks.toLocaleString('pt-BR') + '</div>' +
'<div style="font-size:10px;color:#888;margin-top:4px;text-transform:uppercase;">Cliques Google</div></div></td>' +
'<td width="33%" style="padding:0 6px;text-align:center;"><div style="background:#f8f9fa;padding:18px 8px;border-radius:10px;border-top:3px solid #16a34a;">' +
'<div style="font-size:22px;font-weight:800;color:#1a237e;">' + ctr + '%</div>' +
'<div style="font-size:10px;color:#888;margin-top:4px;text-transform:uppercase;">CTR</div></div></td>' +
'</tr></table>' +
'</div>' +
'<div style="background:#fff;padding:24px;border-left:1px solid #e5e5e5;border-right:1px solid #e5e5e5;">' +
'<h2 style="color:#1a237e;font-size:16px;margin:0 0 4px;">Impressoes diarias no Google</h2>' +
'<p style="color:#6b7280;font-size:12px;margin:0 0 12px;">Visibilidade do site dia a dia no periodo</p>' +
chartHtml +
'</div>' +
'<div style="background:#fff;padding:24px;border-left:1px solid #e5e5e5;border-right:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;">' +
'<h2 style="color:#1a237e;font-size:16px;margin:0 0 12px;">Resumo do mes</h2>' +
'<div style="font-size:14px;line-height:1.75;color:#374151;">' + rHtml + '</div>' +
'</div>' +
'<div style="background:linear-gradient(135deg,#0d1b2a,#1a237e);padding:20px;border-radius:0 0 14px 14px;text-align:center;">' +
'<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.85);">Duvidas? <a href="https://galaxyinfo.us/support" style="color:#ffd700;font-weight:600;text-decoration:none;">Central de Ajuda</a></p>' +
'<p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.5);">&copy; 2026 Galaxy IT &amp; Marketing &middot; Worcester, MA</p></div>' +
'</body></html>';

fs.writeFileSync('./email-preview-new.html', html);
console.log('Preview saved: ./email-preview-new.html');
console.log('Subject:', subject);
console.log('');
console.log('Open file:// path or run:');
console.log('  start email-preview-new.html (Windows)');
