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

  // M05 fallback: when an incoming visit has NO UTM params, infer source from
  // document.referrer so attribution still works even if the user forgot to
  // add UTMs to their Instagram/Facebook bio link.
  var url = new URL(window.location.href);
  var hasUtm = url.searchParams.has('utm_source');
  var inferred = {};
  if (!hasUtm && document.referrer) {
    try {
      var ref = new URL(document.referrer);
      var host = ref.hostname.replace(/^www\./, '');
      var map = {
        'instagram.com': { utm_source: 'instagram', utm_medium: 'social' },
        'l.instagram.com': { utm_source: 'instagram', utm_medium: 'social' },
        'facebook.com': { utm_source: 'facebook', utm_medium: 'social' },
        'l.facebook.com': { utm_source: 'facebook', utm_medium: 'social' },
        'lm.facebook.com': { utm_source: 'facebook', utm_medium: 'social' },
        'youtube.com': { utm_source: 'youtube', utm_medium: 'social' },
        'm.youtube.com': { utm_source: 'youtube', utm_medium: 'social' },
        'tiktok.com': { utm_source: 'tiktok', utm_medium: 'social' },
        'wa.me': { utm_source: 'whatsapp', utm_medium: 'messaging' },
        'whatsapp.com': { utm_source: 'whatsapp', utm_medium: 'messaging' },
        'linkedin.com': { utm_source: 'linkedin', utm_medium: 'social' },
        't.co': { utm_source: 'twitter', utm_medium: 'social' },
        'google.com': { utm_source: 'google', utm_medium: 'organic' },
        'bing.com': { utm_source: 'bing', utm_medium: 'organic' },
        'duckduckgo.com': { utm_source: 'duckduckgo', utm_medium: 'organic' }
      };
      inferred = map[host] || { utm_source: host, utm_medium: 'referral' };
    } catch (e) { /* ignore malformed referrer */ }
  }

  gtag('config', GA_ID, Object.assign({
    send_page_view: true,
    anonymize_ip: true
  }, inferred));

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
