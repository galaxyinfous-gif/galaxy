// Galaxy IT lead form — validates business email client-side, posts to /api/submit-lead
(function () {
  'use strict';
  var PERSONAL = new Set(['gmail.com','googlemail.com','yahoo.com','yahoo.com.br','ymail.com','rocketmail.com','hotmail.com','hotmail.co.uk','hotmail.com.br','outlook.com','outlook.com.br','live.com','live.com.br','msn.com','aol.com','icloud.com','me.com','mac.com','protonmail.com','pm.me','tutanota.com','tutanota.de','mail.com','gmx.com','gmx.de','gmx.net','fastmail.com','zoho.com','qq.com','163.com','126.com','sina.com','yandex.com','yandex.ru','mail.ru','comcast.net','verizon.net','att.net','sbcglobal.net','charter.net','cox.net','optonline.net','earthlink.net','rambler.ru','inbox.ru','list.ru','bk.ru','uol.com.br','bol.com.br','terra.com.br','ig.com.br','oi.com.br','globo.com']);
  var DISPOSABLE = new Set(['mailinator.com','10minutemail.com','guerrillamail.com','tempmail.com','temp-mail.org','throwaway.email','trashmail.com','yopmail.com','sharklasers.com','getnada.com','maildrop.cc','mintemail.com','fakeinbox.com','spamgourmet.com','mytemp.email']);

  function classify(email) {
    if (!email) return 'invalid';
    var t = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'malformed';
    var d = t.split('@')[1];
    if (DISPOSABLE.has(d)) return 'disposable';
    if (PERSONAL.has(d)) return 'personal';
    return 'ok';
  }

  function init() {
    var form = document.getElementById('galaxyLeadForm');
    if (!form) return;
    var fb = document.getElementById('lf-feedback');
    var emailInput = document.getElementById('lf-email');
    var submitBtn = document.getElementById('lf-submit');

    function showFb(msg, type) {
      if (!fb) return;
      fb.textContent = msg || '';
      fb.style.color = type === 'error' ? '#dc2626' : (type === 'ok' ? '#16a34a' : '#374151');
    }

    if (emailInput) {
      emailInput.addEventListener('blur', function () {
        var r = classify(emailInput.value);
        if (r === 'personal') showFb('That looks like a personal email. Please use your work/business email.', 'error');
        else if (r === 'disposable') showFb('Disposable email detected. Please use your real business email.', 'error');
        else if (r === 'malformed' && emailInput.value) showFb('Please enter a valid email.', 'error');
        else showFb('', '');
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showFb('', '');
      var fullName = form.fullName.value.trim();
      var email = form.email.value.trim();
      var company = form.company.value.trim();
      var service = form.service ? form.service.value : '';
      var message = form.message ? form.message.value.trim() : '';
      var hp = form.hp_field ? form.hp_field.value : '';

      if (!fullName || !email || !company) { showFb('Please fill name, business email, and company.', 'error'); return; }
      var cls = classify(email);
      if (cls === 'personal') { showFb('Please use your business/work email — Gmail, Yahoo, Hotmail, etc. are not accepted.', 'error'); emailInput.focus(); return; }
      if (cls === 'disposable') { showFb('Disposable emails are not accepted. Please use your real business email.', 'error'); emailInput.focus(); return; }
      if (cls !== 'ok') { showFb('Please enter a valid business email.', 'error'); emailInput.focus(); return; }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      showFb('Sending your message…', 'info');

      fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName, email: email, company: company, service: service, message: message, honeypot: hp })
      })
      .then(function (r) { return r.json().then(function (d) { return { status: r.status, data: d }; }); })
      .then(function (res) {
        if (res.status >= 200 && res.status < 300 && res.data && res.data.ok) {
          form.style.display = 'none';
          fb.innerHTML = '<div style="background:#dcfce7;color:#15803d;padding:18px 22px;border-radius:10px;border-left:3px solid #16a34a;font-weight:600;"><i class="fas fa-check-circle"></i> Got it! A Galaxy IT team member will email you back within 1 business day at <strong>' + email + '</strong>.</div>';
          if (window.gtag) window.gtag('event', 'form_submit', { event_category: 'conversion', event_label: 'business_email_lead', value: 1 });
        } else {
          showFb((res.data && res.data.message) || 'Something went wrong. Please email info@galaxyinfo.us directly.', 'error');
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send my message';
        }
      })
      .catch(function () {
        showFb('Network error. Please email info@galaxyinfo.us directly.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send my message';
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
