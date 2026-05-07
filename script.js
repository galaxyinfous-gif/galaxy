/* ============================================
   GALAXY IT & MARKETING — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Header Scroll Effect ----
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  // ---- Mobile Menu Toggle ----
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll-Triggered Animations (Intersection Observer) ----
  const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .stagger');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 100px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Safety net: if anything is still hidden after 2 seconds (e.g. observer stalled
    // on long pages like /areas with 1200+ city links), force-show everything.
    setTimeout(() => {
      animatedElements.forEach(el => el.classList.add('visible'));
    }, 2000);
  } else {
    // Fallback: just show everything
    animatedElements.forEach(el => el.classList.add('visible'));
  }

  // ---- Animated Counter (for stats) ----
  const statNumbers = document.querySelectorAll('[data-count]');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => countObserver.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);

      // Detect suffix (+ or %)
      const label = el.closest('.stat-item')?.querySelector('.stat-label')?.textContent || '';
      if (label.includes('%')) {
        el.textContent = current + '%';
      } else if (label.includes('+')) {
        el.textContent = current + '+';
      } else {
        el.textContent = current + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ---- N8N Webhook URLs ----
  const N8N_WEBHOOKS = {
    contact: 'https://n8n.galaxyinfo.us/webhook/galaxy-contact',
    consultation: 'https://n8n.galaxyinfo.us/webhook/galaxy-consultation'
  };
  const N8N_AUTOREPLY = {
    contact: 'https://n8n.galaxyinfo.us/webhook/galaxy-autoreply-contact',
    consultation: 'https://n8n.galaxyinfo.us/webhook/galaxy-autoreply-assessment'
  };

  // ---- Contact Form Validation & Submission ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'consultation'));
  }

  const consultForm = document.getElementById('consultForm');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => handleFormSubmit(e, 'consultation'));
  }

  const heroForm = document.getElementById('heroForm');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => handleFormSubmit(e, 'consultation'));
  }

  async function handleFormSubmit(e, formType) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    // Validate required fields
    form.querySelectorAll('[required]').forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        group.classList.add('error');
        isValid = false;
      }
      // Email validation
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const freeEmailDomains = [
          'gmail.com', 'yahoo.com', 'yahoo.com.br', 'hotmail.com', 'hotmail.com.br',
          'outlook.com', 'outlook.com.br', 'aol.com', 'icloud.com', 'me.com',
          'mac.com', 'live.com', 'live.com.br', 'msn.com', 'protonmail.com',
          'proton.me', 'mail.com', 'zoho.com', 'yandex.com', 'gmx.com',
          'gmx.net', 'inbox.com', 'fastmail.com', 'tutanota.com', 'tuta.com',
          'bol.com.br', 'uol.com.br', 'terra.com.br', 'ig.com.br', 'globo.com',
          'r7.com', 'zipmail.com.br'
        ];
        const emailValue = input.value.trim().toLowerCase();
        const emailDomain = emailValue.split('@')[1];

        if (!emailRegex.test(emailValue)) {
          group.classList.add('error');
          isValid = false;
        } else if (freeEmailDomains.includes(emailDomain)) {
          group.classList.add('error');
          const errorMsg = group.querySelector('.error-message');
          if (errorMsg) errorMsg.textContent = 'Please use a professional/business email address';
          isValid = false;
        }
      }
    });

    if (!isValid) return;

    // Collect form data
    const formData = {};
    new FormData(form).forEach((value, key) => { formData[key] = value; });

    // Disable button & show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      const response = await fetch(N8N_WEBHOOKS[formType], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Send auto-reply email to lead (fire and forget)
        if (N8N_AUTOREPLY[formType]) {
          fetch(N8N_AUTOREPLY[formType], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          }).catch(() => {});
        }
        // Show success message
        const successEl = form.parentElement.querySelector('.form-success');
        if (successEl) {
          form.style.display = 'none';
          successEl.style.display = 'block';
        }
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      // Show error & re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      alert('Something went wrong. Please try again or contact us via WhatsApp.');
    }
  }

  // ---- WhatsApp Chat Widget ----
  const whatsappWidget = document.getElementById('whatsappWidget');
  const whatsappToggle = document.getElementById('whatsappToggle');
  const whatsappSend = document.getElementById('whatsappSend');
  const whatsappMsg = document.getElementById('whatsappMsg');

  if (whatsappToggle && whatsappWidget) {
    whatsappToggle.addEventListener('click', () => {
      whatsappWidget.classList.toggle('open');
    });

    function sendWhatsApp() {
      const msg = whatsappMsg ? whatsappMsg.value.trim() : '';
      const url = msg
        ? 'https://wa.me/17742852299?text=' + encodeURIComponent(msg)
        : 'https://wa.me/17742852299';
      window.open(url, '_blank');
      if (whatsappMsg) whatsappMsg.value = '';
      whatsappWidget.classList.remove('open');
    }

    if (whatsappSend) {
      whatsappSend.addEventListener('click', sendWhatsApp);
    }

    if (whatsappMsg) {
      whatsappMsg.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendWhatsApp();
        }
      });
    }
  }

  // ---- Real-time field validation ----
  const freeEmailDomains = [
    'gmail.com', 'yahoo.com', 'yahoo.com.br', 'hotmail.com', 'hotmail.com.br',
    'outlook.com', 'outlook.com.br', 'aol.com', 'icloud.com', 'me.com',
    'mac.com', 'live.com', 'live.com.br', 'msn.com', 'protonmail.com',
    'proton.me', 'mail.com', 'zoho.com', 'yandex.com', 'gmx.com',
    'gmx.net', 'inbox.com', 'fastmail.com', 'tutanota.com', 'tuta.com',
    'bol.com.br', 'uol.com.br', 'terra.com.br', 'ig.com.br', 'globo.com',
    'r7.com', 'zipmail.com.br'
  ];
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('blur', () => {
      const group = input.closest('.form-group');
      if (input.hasAttribute('required') && !input.value.trim()) {
        group.classList.add('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg && input.type === 'email') errorMsg.textContent = 'Please enter a valid email address';
      } else if (input.type === 'email' && input.value.trim()) {
        const domain = input.value.trim().toLowerCase().split('@')[1];
        if (domain && freeEmailDomains.includes(domain)) {
          group.classList.add('error');
          const errorMsg = group.querySelector('.error-message');
          if (errorMsg) errorMsg.textContent = 'Please use a professional/business email address';
        } else {
          group.classList.remove('error');
        }
      } else {
        group.classList.remove('error');
      }
    });
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('error');
    });
  });

  // ---- Result Image Lightbox ----
  const lightbox = document.getElementById('resultLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox) {
    document.querySelectorAll('.result-zoom').forEach(btn => {
      btn.closest('.result-card').addEventListener('click', (e) => {
        e.preventDefault();
        const img = btn.closest('.result-card').querySelector('.result-img img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

});
