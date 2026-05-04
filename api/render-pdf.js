// Render HTML → PDF with multi-provider fallback
// 1. PDFEndpoint (100 PDFs/mo free) — primary
// 2. PDFShift (50 PDFs/mo free) — fallback
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

  var debugInfo = [];

  // Provider 1: PDFEndpoint (100/mo free)
  var pdfEndpointKey = process.env.PDFENDPOINT_API_KEY;
  if (pdfEndpointKey) {
    try {
      var peResp = await fetch('https://api.pdfendpoint.com/v1/convert', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + pdfEndpointKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          html: html,
          page_size: 'A4',
          margin_top: '12mm',
          margin_bottom: '12mm',
          margin_left: '10mm',
          margin_right: '10mm',
          delivery_mode: 'json',
          no_backgrounds: false
        })
      });
      if (peResp.ok) {
        var peData = await peResp.json();
        // pdfendpoint returns { data: { url } } or direct PDF depending on mode
        if (peData && peData.data && peData.data.url) {
          // Fetch the PDF from the URL
          var pdfFetch = await fetch(peData.data.url);
          if (pdfFetch.ok) {
            var arrBuf = await pdfFetch.arrayBuffer();
            var pdfBuffer = Buffer.from(arrBuf);
            return sendPdf(res, pdfBuffer, filename, asBase64);
          }
          debugInfo.push('pdfendpoint_fetch_url_failed');
        } else {
          debugInfo.push('pdfendpoint_unexpected_response');
        }
      } else {
        var peErr = await peResp.text();
        debugInfo.push('pdfendpoint_' + peResp.status + ': ' + peErr.substring(0, 200));
      }
    } catch (e) {
      debugInfo.push('pdfendpoint_exception: ' + e.message);
    }
  } else {
    debugInfo.push('pdfendpoint_no_key');
  }

  // Provider 2: PDFShift (50/mo free) — fallback
  var pdfShiftKey = process.env.PDFSHIFT_API_KEY;
  if (pdfShiftKey) {
    try {
      var psResp = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from('api:' + pdfShiftKey).toString('base64'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source: html,
          format: 'A4',
          margin: '12mm 10mm 12mm 10mm',
          use_print: true
        })
      });
      if (psResp.ok) {
        var psBuf = await psResp.arrayBuffer();
        return sendPdf(res, Buffer.from(psBuf), filename, asBase64);
      } else {
        var psErr = await psResp.text();
        debugInfo.push('pdfshift_' + psResp.status + ': ' + psErr.substring(0, 200));
      }
    } catch (e) {
      debugInfo.push('pdfshift_exception: ' + e.message);
    }
  } else {
    debugInfo.push('pdfshift_no_key');
  }

  return res.status(502).json({ error: 'PDF render failed (all providers exhausted)', debug: debugInfo });
};

function sendPdf(res, buffer, filename, asBase64) {
  if (asBase64) {
    return res.status(200).json({ pdf: buffer.toString('base64'), filename: filename });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
  return res.status(200).send(buffer);
}
