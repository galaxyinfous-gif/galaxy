// Render HTML → PDF via puppeteer-core + sparticuz/chromium
// POST { html: "..." } → returns PDF binary (Content-Type: application/pdf)
// Or POST { html: "...", base64: true } → returns { pdf: "<base64>" } so n8n can attach as binary

const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  var body = req.body || {};
  var html = body.html;
  var asBase64 = body.base64 === true;
  var filename = body.filename || 'report.pdf';

  if (!html) return res.status(400).json({ error: 'html required' });

  var browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    var page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 25000 });
    var pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' },
      preferCSSPageSize: true
    });
    await browser.close();
    browser = null;

    if (asBase64) {
      return res.status(200).json({ pdf: pdfBuffer.toString('base64'), filename: filename });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    return res.status(200).send(pdfBuffer);
  } catch (e) {
    if (browser) try { await browser.close(); } catch (_) {}
    console.error('render-pdf error:', e.message);
    return res.status(500).json({ error: 'PDF render failed', detail: e.message });
  }
};
