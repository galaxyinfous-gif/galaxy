# Galaxy Assist — n8n Setup Guide

## Pre-requisites
- n8n self-hosted on DigitalOcean VPS (~$6/month)
- Anthropic API key (Claude)
- Domain: n8n.galaxyinfo.us (pointed to VPS)
- Optional: Twilio account (for SMS), Google Sheets API, SMTP email

---

## Environment Variables (set in n8n Settings > Environment)

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
TEAM_EMAIL=info@galaxyinfo.us
LUIZ_EMAIL=luiz@galaxyinfo.us
LUIZ_PHONE=+17742852299
TWILIO_ACCOUNT_SID=ACxxxxx        (optional — for SMS)
TWILIO_AUTH_TOKEN=xxxxx            (optional — for SMS)
TWILIO_PHONE=+1xxxxxxxxxx         (optional — for SMS)
```

---

## Workflows to Import

### 1. `01-galaxy-assist-chat.json` — Main AI Chat
**Webhook URL:** `https://n8n.galaxyinfo.us/webhook/galaxy-assist`

**Flow:** Webhook → Extract Data → Claude API → Format → Respond

**What it does:**
- Receives chat messages from the support page
- Sends to Claude with system prompt + conversation history
- Returns AI response to the client
- Optional: logs to Google Sheets

**Setup steps:**
1. Import the workflow in n8n
2. The webhook path `galaxy-assist` matches what's in `support-chat.js`
3. Make sure `ANTHROPIC_API_KEY` env variable is set
4. Enable the "Log to Google Sheets" node if you want logging (create a spreadsheet with columns: timestamp, language, question, answer, tokens, ip)
5. Activate the workflow

**Model:** Claude Sonnet 4 (`claude-sonnet-4-20250514`) — fast + cheap. Change to `claude-haiku-4-5-20251001` for even cheaper, or `claude-opus-4-6` for highest quality.

---

### 2. `02-escalation-ticket.json` — Escalation & Tickets
**Webhook URL:** `https://n8n.galaxyinfo.us/webhook/galaxy-escalation`

**Flow:** Webhook → Extract → Check Priority → SMS (urgent) + Email + Google Sheets → Respond

**What it does:**
- Creates ticket with auto-generated ID (GX-XXXXXX)
- Checks if urgent → SMS to Luiz
- Emails team with full issue summary + chat history
- Logs ticket to Google Sheets

**Setup steps:**
1. Import the workflow
2. Enable the disabled nodes one by one:
   - "SMS Urgent → Luiz" — needs Twilio credentials
   - "Email Team" — needs SMTP credentials (Settings > Credentials > SMTP)
   - "Log Ticket → Google Sheets" — needs Google Sheets credentials + spreadsheet with columns: ticketId, timestamp, clientName, clientEmail, category, priority, issueSummary, status, resolvedBy, resolvedAt
3. Activate the workflow

**Note:** This workflow is called manually or by a future enhancement to the chat. Currently the chat falls back to "schedule a call" — this webhook is for when you want explicit ticket creation.

---

### 3. `03-appointment-notification.json` — Appointment Notifications
**Webhook URL:** `https://n8n.galaxyinfo.us/webhook/galaxy-appointment`

**Flow:** Webhook → Extract → AI Summarize → Email + SMS → Respond

**What it does:**
- Triggered when a client books a support call (from GHL/LeadConnector)
- Uses Claude Haiku to generate a 2-3 sentence briefing for the team
- Emails the team with client info + AI briefing
- SMS to Luiz with the summary

**Setup steps:**
1. Import the workflow
2. In GoHighLevel (Bee Pro Hub), create a webhook trigger:
   - Go to Automation → Workflows → Create
   - Trigger: "Appointment Status Changed" (to "confirmed")
   - Action: Webhook → POST to `https://n8n.galaxyinfo.us/webhook/galaxy-appointment`
   - Map fields: contact_name, contact_email, contact_phone, appointment_date, appointment_time, duration, notes
3. Enable the disabled nodes (Email + SMS)
4. Activate the workflow

**Model:** Claude Haiku 4.5 — cheapest, fast enough for summaries.

---

### 4. `04-monthly-report.json` — Monthly Support Report
**Schedule:** Runs automatically on the 1st of every month at 8:00 AM

**Flow:** Schedule → Read Sheets (chat logs + tickets) → Merge → AI Report → Email to Luiz

**What it does:**
- Pulls all chat logs and tickets from Google Sheets
- Sends to Claude to generate a full monthly report
- Includes: total conversations, top topics, resolution rate, peak hours, recommendations
- Emails report to Luiz

**Setup steps:**
1. Import the workflow
2. Link the Google Sheets nodes to the same spreadsheets used in workflows 1 and 2
3. Enable the disabled nodes
4. Activate the workflow

---

## n8n Installation (for Rhaideline)

### DigitalOcean VPS Setup
```bash
# Create a $6/mo droplet (Ubuntu 22.04, 1GB RAM)
# SSH into the server

# Install Docker
curl -fsSL https://get.docker.com | sh

# Create n8n directory
mkdir -p /opt/n8n
cd /opt/n8n

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.galaxyinfo.us
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.galaxyinfo.us/
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=CHANGE_THIS_PASSWORD
      - GENERIC_TIMEZONE=America/New_York
      - N8N_ENCRYPTION_KEY=CHANGE_THIS_TO_RANDOM_STRING
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
EOF

# Start n8n
docker compose up -d

# Verify it's running
docker compose logs -f
```

### DNS Setup
Point `n8n.galaxyinfo.us` to the DigitalOcean droplet IP:
- Type: A record
- Name: n8n
- Value: [droplet IP]

### SSL (Caddy reverse proxy)
```bash
# Install Caddy for automatic HTTPS
apt install -y caddy

# Configure Caddy
cat > /etc/caddy/Caddyfile << 'EOF'
n8n.galaxyinfo.us {
    reverse_proxy localhost:5678
}
EOF

# Restart Caddy
systemctl restart caddy
```

---

## Cost Estimate

| Item | Monthly Cost |
|------|-------------|
| DigitalOcean VPS (1GB) | ~$6 |
| Claude API (Sonnet, ~500 chats/mo) | ~$2-5 |
| Claude API (Haiku, summaries) | ~$0.50 |
| Twilio SMS (optional, ~50 msgs) | ~$2 |
| **Total** | **~$10-14/month** |

vs. Make.com at scale: $59-299/month for equivalent operations.

---

## Testing

1. After importing workflow 01, activate it
2. Go to `https://galaxyinfo.us/support`
3. Type a question in Galaxy Assist
4. Check n8n execution log — should show the webhook received, Claude called, response sent
5. If it works, the chat will show the AI response instead of the local knowledge base fallback

---

### 18. `18-speed-to-lead.json` — Speed-to-Lead (X05 audit)
**Webhook URL:** `https://n8n.galaxyinfo.us/webhook/speed-to-lead`

**Flow:** Webhook → Extract Lead → fan-out (SMS to lead · Auto-reply email · Team alert) → 200 OK

**What it does:**
- Receives a form-submission webhook from Bee Pro Hub (configured under Settings → Workflows → outbound webhook)
- Sends instant SMS to the lead via Twilio ("Hi {Name}! It's Galaxy IT… we'll call within 1 business hour")
- Sends auto-reply email to the lead with our phone, address, and reassurance
- Sends a parallel alert email to `info@galaxyinfo.us` so the team sees the lead in real time
- Total execution typically completes in 2–8 seconds — well under the 60-second X05 audit threshold (391% conversion lift per Invoca 2026 study)

**Setup steps:**
1. In Bee Pro Hub: open the website-form workflow → add an outbound webhook action → URL = `https://n8n.galaxyinfo.us/webhook/speed-to-lead` → method POST → payload includes `full_name`, `email`, `phone`, `source`, `message`
2. In n8n: import `18-speed-to-lead.json`, set credentials for Twilio and SMTP, set env vars `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE`, `TEAM_EMAIL`
3. Activate the workflow
4. **Test:** submit a test lead at https://galaxyinfo.us/consultation with your own phone + email. Time the auto-SMS arrival — should be < 30 seconds.

**Cost:** ~$0.0079 per SMS (Twilio US local). Email is included in your existing SMTP plan.

> If Bee Pro Hub's built-in "Send SMS on form submission" automation is already configured inside the GHL UI, this n8n workflow is redundant — keep it as a backup or delete it. The audit only requires the speed-to-lead path to exist somewhere.
