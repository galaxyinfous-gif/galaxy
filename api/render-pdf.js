// Render HTML → PDF via PDFShift (free tier: 50 PDFs/mo, no card required)
// Sign up at pdfshift.io and set PDFSHIFT_API_KEY env var
// POST { html, base64?, filename? } → returns PDF binary or { pdf, filename } JSON

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

  var apiKey = process.env.PDFSHIFT_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'PDFSHIFT_API_KEY not configured' });

  try {
    var pdfResp = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('api:' + apiKey).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: html,
        format: 'A4',
        margin: '12mm 10mm 12mm 10mm',
        use_print: true
      })
    });

    if (!pdfResp.ok) {
      var errText = await pdfResp.text();
      return res.status(502).json({ error: 'PDFShift error', status: pdfResp.status, detail: errText.substring(0, 300) });
    }

    var arrayBuf = await pdfResp.arrayBuffer();
    var pdfBuffer = Buffer.from(arrayBuf);

    if (asBase64) {
      return res.status(200).json({ pdf: pdfBuffer.toString('base64'), filename: filename });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    return res.status(200).send(pdfBuffer);
  } catch (e) {
    return res.status(500).json({ error: 'PDF render failed', detail: e.message });
  }
};
