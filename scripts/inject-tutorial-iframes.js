const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'tutorials.html');
let html = fs.readFileSync(file, 'utf8');

const PLAYLIST = 'PL1hE_JByQxEpTseI_5oPTST2OnmnUDlh3'; // Official "GoHighLevel Tutorials and Training" playlist

const sections = [
  { id: 'contacts', label: 'Contacts & Smart Lists' },
  { id: 'conversations', label: 'Conversations Inbox' },
  { id: 'calendars', label: 'Calendars & Booking' },
  { id: 'reports', label: 'Reports & Dashboards' },
  { id: 'gbp', label: 'Google Business Profile' },
  { id: 'reputation', label: 'Reviews & Reputation' },
  { id: 'payments', label: 'Payments & Invoices' },
  { id: 'social', label: 'Social Planner' },
  { id: 'forms', label: 'Forms & Surveys' },
  { id: 'site', label: 'Website & Funnels' },
  { id: 'automations', label: 'Workflows & Automations' },
  { id: 'membership', label: 'Memberships & Courses' },
];

let injected = 0;
sections.forEach(s => {
  const re = new RegExp(
    `(<section[^>]*id="${s.id}"[\\s\\S]*?<div class="section-header[^"]*">[\\s\\S]*?</div>)(\\s*)(<div class="grid-3 fade-up">)`,
    'm'
  );
  const iframe = `
            <div class="fade-up" style="max-width:900px;margin:0 auto 32px;">
                <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,0.18);background:#000;">
                    <iframe loading="lazy" src="https://www.youtube.com/embed/videoseries?list=${PLAYLIST}" title="HighLevel Official Tutorials — ${s.label}" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
                </div>
                <p style="text-align:center;font-size:12px;color:#888;margin:10px 0 0;">Official tutorials from <a href="https://www.youtube.com/@HighLevel" target="_blank" rel="noopener" style="color:#1a237e;font-weight:600;">HighLevel YouTube channel</a> — pick the tutorial in the playlist matching the topic below.</p>
            </div>
            `;
  if (re.test(html)) {
    html = html.replace(re, `$1$2${iframe}$3`);
    injected++;
  } else {
    console.log('NOT MATCHED:', s.id);
  }
});

// Replace each "Coming soon" placeholder with a small "↑ See playlist above" tag
html = html.replace(
  /<div class="tutorial-video-placeholder"><i class="fas fa-play-circle"><\/i><span>Coming soon<\/span><\/div>/g,
  '<div class="tutorial-video-placeholder" style="cursor:default;background:linear-gradient(135deg,#f8f9fa,#e9ecef);"><i class="fas fa-play-circle" style="opacity:0.3;"></i><span style="font-size:11px;">See playlist above ↑</span></div>'
);

fs.writeFileSync(file, html);
console.log(`Injected ${injected}/${sections.length} iframe blocks`);
