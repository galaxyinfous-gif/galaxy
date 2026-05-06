/* ============================================
   Galaxy IT — Analytics & Conversion Tracking
   ============================================
   GA4 Measurement ID: REPLACE BELOW with your real ID from
   https://analytics.google.com → Admin → Data Streams → Web → Measurement ID
   Format: G-XXXXXXXXXX
   ============================================ */

(function () {
  'use strict';
  var GA_ID = 'G-YFDSSWQLEJ';

  if (!GA_ID || GA_ID === 'G-PLACEHOLDER') {
    if (window.console) console.info('[Galaxy Analytics] GA4 not configured. Edit analytics.js → set GA_ID.');
    return;
  }

  // Load GA4 script
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: true, anonymize_ip: true });

  // Auto-track conversion events (M03)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) {
      gtag('event', 'click_to_call', {
        event_category: 'conversion',
        event_label: href.replace('tel:', ''),
        value: 1
      });
    } else if (href.indexOf('mailto:') === 0) {
      gtag('event', 'click_to_email', { event_category: 'engagement', event_label: href.replace('mailto:', '') });
    } else if (/wa\.me|whatsapp\.com|api\.whatsapp/.test(href)) {
      gtag('event', 'click_to_whatsapp', {
        event_category: 'conversion',
        event_label: href,
        value: 1
      });
    } else if (a.classList.contains('nav-cta') || a.classList.contains('btn-primary') || /consultation|free-assessment/i.test(href)) {
      gtag('event', 'cta_click', { event_category: 'engagement', event_label: a.textContent.trim().substring(0, 50) });
    }
  });

  document.addEventListener('submit', function (e) {
    if (e.target && e.target.tagName === 'FORM') {
      gtag('event', 'form_submit', {
        event_category: 'conversion',
        event_label: e.target.id || e.target.name || 'unknown_form',
        value: 1
      });
    }
  });
})();
