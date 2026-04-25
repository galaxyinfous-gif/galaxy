const fs = require('fs');
const path = require('path');

// Curated mapping: card title → YouTube video ID
// Cards not in this map will be DELETED from the page
const VIDEO_MAP = {
  // Contacts
  'Adding a New Contact': 'HJArLo800Ag',
  'Importing Contacts via CSV': 'a4HazCX245U',
  'Creating Smart Lists': 'SHsONrKv5Jo',
  'Managing Tags': 'HJArLo800Ag',
  'Using the Pipeline': 'KzeYpYxjC8M',
  'Contact Profile & Activity': '1Wu6AlPjIu0',
  // Conversations
  'Sending SMS Messages': 'X499mf5cghc',
  'Sending Emails': 'mdUU22vuSrc',
  'WhatsApp & Social DMs': 'nTdES7vktGU',
  // Calendars
  'Creating a Booking Calendar': 'YnaDsrPP8VI',
  // Reputation
  'Sending Review Requests': 'kNd-UiLPKcA',
  'Responding to Reviews': 'jrbfC5GDnlo',
  // Payments
  'Creating an Invoice': 'dBdyAgACKnI',
  'Payment Links': 'dBdyAgACKnI',
  'Recurring Subscriptions': '3HS_uwexg9Y',
  // Social
  'Scheduling a Post': 'ciS-b6k2HQg',
  'Connecting Accounts': 'nTdES7vktGU',
  // Forms
  'Creating a Form': 'FdTgqvJhlw4',
  'Embedding & Sharing': 'FdTgqvJhlw4',
  // Automations
  'Common Automations': 'CAEOl_m8PZI',
  // Membership
  'Creating a Course': 'kQYqDn72z9Q',
};

const file = path.join(__dirname, '..', 'tutorials.html');
let html = fs.readFileSync(file, 'utf8');

// Match each card (anchor element from previous step) and either rewrite href or remove
// Pattern: <a href="...search_query=..." ...class="card tutorial-video-card"...>(everything until matching </a>)
const cardRe = /<a href="https:\/\/www\.youtube\.com\/results\?search_query=[^"]+"[^>]*class="card tutorial-video-card"[\s\S]*?<\/a>/g;

let kept = 0, removed = 0;
html = html.replace(cardRe, (block) => {
  // Extract title from <h3>...</h3>
  const titleMatch = block.match(/<h3>([^<]+)<\/h3>/);
  if (!titleMatch) { removed++; return ''; }
  const title = titleMatch[1].trim();
  const videoId = VIDEO_MAP[title];
  if (!videoId) { removed++; return ''; }
  kept++;
  // Replace href with direct watch URL
  return block
    .replace(/href="[^"]+"/, `href="https://www.youtube.com/watch?v=${videoId}"`)
    .replace(/>Watch on YouTube</, '>Play video<');
});

// Clean up: if a section ends up with no cards inside grid-3, the whole grid-3 may become empty.
// Remove empty grid-3 wrappers
html = html.replace(/<div class="grid-3 fade-up">\s*<\/div>/g, '');

fs.writeFileSync(file, html);
console.log(`Kept ${kept}, removed ${removed}`);
