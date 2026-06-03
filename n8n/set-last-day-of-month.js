// Reschedule the monthly report workflow to fire on the LAST DAY of each month at 9 UTC.
// Strategy: cron fires on days 28-31 @ 9 UTC, then a guard Code node aborts if today isn't actually the last day.
// (n8n's node-cron implementation doesn't support `L` for last-day, so we fan a 4-day window + guard.)
const fs = require('fs');
const path = require('path');

const N8N_URL = 'https://n8n.galaxyinfo.us';
const WF_ID = 'mof20kEAZqNLwreY';
const API_KEY = process.env.N8N_API_KEY;

if (!API_KEY) { console.error('Set N8N_API_KEY env var'); process.exit(1); }

async function main() {
  const r = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}`, {
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  if (!r.ok) { console.error('GET failed', r.status); process.exit(1); }
  const wf = await r.json();

  // 1. Replace existing schedule trigger (Dia 3 as 9AM) with cron 0 9 28-31 * *
  let trig = wf.nodes.find(n => n.type === 'n8n-nodes-base.scheduleTrigger');
  if (trig) {
    trig.name = 'Ultimo dia do mes 9AM';
    trig.parameters = {
      rule: {
        interval: [
          { field: 'cronExpression', expression: '0 9 28-31 * *' }
        ]
      }
    };
  }

  // Rewire connection key (old name → new name)
  if (wf.connections['Dia 3 as 9AM']) {
    wf.connections['Ultimo dia do mes 9AM'] = wf.connections['Dia 3 as 9AM'];
    delete wf.connections['Dia 3 as 9AM'];
  }

  // 2. Insert a guard Code node between trigger and Lista de Clientes
  // that exits early if today is NOT the last day of the month.
  let guard = wf.nodes.find(n => n.name === 'Guard: Last Day of Month');
  if (!guard) {
    guard = {
      id: 'guard-last-day',
      name: 'Guard: Last Day of Month',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [380, 300],
      parameters: {}
    };
    wf.nodes.push(guard);
  }
  guard.parameters = {
    jsCode: `// Only continue if TODAY is the last day of the month (UTC).
const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const isLastDay = tomorrow.getUTCMonth() !== now.getUTCMonth();
if (!isLastDay) {
  // Stop the workflow silently — wrong day, this is one of the 28/29/30 false-fires.
  return [];
}
// Pass through with a single dummy item so the downstream Lista de Clientes Code node fires.
return [{ json: { triggeredAt: now.toISOString(), reason: 'last-day-of-month' } }];`
  };

  // Rewire: trigger → guard → Lista de Clientes
  wf.connections['Ultimo dia do mes 9AM'] = { main: [[{ node: 'Guard: Last Day of Month', type: 'main', index: 0 }]] };
  wf.connections['Guard: Last Day of Month'] = { main: [[{ node: 'Lista de Clientes', type: 'main', index: 0 }]] };

  // 3. Sanitize before PUT: n8n's PUT rejects read-only fields like createdAt/updatedAt/id
  const body = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings || {},
    staticData: wf.staticData || null
  };

  const u = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}`, {
    method: 'PUT',
    headers: { 'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const txt = await u.text();
  console.log('PUT status:', u.status);
  console.log(txt.slice(0, 300));

  // 4. Reactivate
  const a = await fetch(`${N8N_URL}/api/v1/workflows/${WF_ID}/activate`, {
    method: 'POST',
    headers: { 'X-N8N-API-KEY': API_KEY }
  });
  console.log('activate status:', a.status);

  console.log('\n✓ Schedule = cron 0 9 28-31 * * → fires day 28/29/30/31 at 9 UTC');
  console.log('✓ Guard runs first → only proceeds if tomorrow is in a different month');
  console.log('✓ Effective: 1 execution per month, on the actual last day, at 9 UTC');
}

main().catch(e => { console.error(e); process.exit(1); });
