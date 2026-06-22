/* EliteHomes — Creative Animations (Bootstrap Edition) */

document.addEventListener('DOMContentLoaded', function () {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  /* ── Scroll progress bar ──────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight * 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ── Cursor glow (desktop only) ─────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);
    document.body.classList.add('cursor-active');

    let glowX = 0, glowY = 0, targetX = 0, targetY = 0;
    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top  = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ── Hero ambient orbs + particles ────────────────────────── */
  const hero = document.getElementById('hero-section');
  if (hero) {
    const ambient = document.createElement('div');
    ambient.className = 'hero-ambient';
    ambient.innerHTML =
      '<div class="hero-orb hero-orb--1"></div>' +
      '<div class="hero-orb hero-orb--2"></div>' +
      '<div class="hero-orb hero-orb--3"></div>';
    hero.prepend(ambient);

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--dur', (6 + Math.random() * 8) + 's');
      p.style.setProperty('--delay', (-Math.random() * 12) + 's');
      ambient.appendChild(p);
    }

    /* Hero title — "Dream Home" in gold like the design */
    const h1 = hero.querySelector('h1');
    if (h1) {
      h1.innerHTML =
        '<span class="hero-word" style="--i:0">Find</span> ' +
        '<span class="hero-word" style="--i:1">Your</span> ' +
        '<span class="hero-word hero-word--accent" style="--i:2">Dream Home</span>';
    }

    const subtitle = hero.querySelector('.hero-subtitle');
    if (subtitle) subtitle.classList.add('hero-subtitle-anim');

    const searchCard = hero.querySelector('.hero-search-card');
    if (searchCard) searchCard.classList.add('hero-search-anim');

    const searchBtn = hero.querySelector('button');
    if (searchBtn) searchBtn.classList.add('btn-shimmer');

    /* Stats count-up */
    const statEls = hero.querySelectorAll('.hero-stat-anim .stat-value');
    statEls.forEach(function (el, i) {
      const parent = el.closest('.hero-stat-anim');
      parent.classList.add('hero-stat-anim');
      parent.style.setProperty('--i', i);

      const raw = el.textContent.trim();
      const hasPlus = raw.includes('+');
      const hasPct  = raw.includes('%');
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) {
        el.classList.add('stat-value');
        el.setAttribute('data-target', num);
        el.setAttribute('data-suffix', (hasPlus ? '+' : '') + (hasPct ? '%' : ''));
        el.textContent = '0' + (hasPct ? '%' : hasPlus ? '+' : '');
      }
    });

    function countUp(el) {
      const target = parseFloat(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const isFloat = target % 1 !== 0;
      const duration = 2000;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = target * eased;
        el.textContent = (isFloat ? current.toFixed(0) : Math.floor(current).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-value').forEach(countUp);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statObserver.observe(hero);
  }

  /* ── Header scroll glass effect ───────────────────────────── */
  const header = document.getElementById('header');
  const brand  = header?.querySelector('.navbar-brand');
  if (brand) brand.classList.add('brand-anim');

  /* ── Scroll reveal observer ─────────────────────────────────── */
  function setupReveals() {
    /* Section headers */
    document.querySelectorAll('.section-header').forEach(function (el) {
      el.classList.add('reveal');
      el.querySelectorAll('.label-line-anim').forEach(function (line) {
        line.classList.add('label-line-anim');
      });
      el.querySelectorAll('.gradient-shimmer').forEach(function (title) {
        title.classList.add('gradient-shimmer');
      });
    });

    /* Property cards */
    const propGrid = document.querySelector('.property-grid');
    if (propGrid) {
      observeEl(propGrid);
    }

    /* Service tab icons */
    document.querySelectorAll('.service-icon').forEach(function (icon, i) {
      icon.classList.add('service-icon-float');
      icon.style.setProperty('--float-delay', (i * 0.4) + 's');
    });

    /* FAQ items */
    document.querySelectorAll('.faq-item-anim').forEach(function (item, i) {
      item.classList.add('faq-item-anim', 'reveal');
      if (i % 2 === 0) item.classList.add('reveal-left');
      else item.classList.add('reveal-right');
      observeEl(item);
    });

    /* Contact cards */
    document.querySelectorAll('.contact-card').forEach(function (card) {
      card.classList.add('contact-card-glow', 'reveal');
      observeEl(card);
    });

    /* Contact form fields */
    document.querySelectorAll('.form-field-anim').forEach(function (field) {
      field.classList.add('form-field-anim');
    });
    const submitBtn = document.querySelector('#contact-section form button[type="submit"]');
    if (submitBtn) submitBtn.classList.add('btn-magnetic');

    /* Testimonial cards */
    document.querySelectorAll('.testimonial-card').forEach(function (card) {
      card.classList.add('testimonial-card-anim');
    });

    /* View all / CTA buttons */
    document.querySelectorAll('#featured-properties button').forEach(function (btn) {
      btn.classList.add('btn-magnetic');
    });
  }

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  function observeEl(el) {
    revealObserver.observe(el);
  }

  setupReveals();
  document.querySelectorAll('.reveal').forEach(observeEl);
  document.querySelectorAll('.stagger-children').forEach(observeEl);

  /* ── 3D tilt on property cards ──────────────────────────────── */
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── Magnetic buttons ───────────────────────────────────────── */
  document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });

  /* ── FAQ open state class ───────────────────────────────────── */
  document.querySelectorAll('.faq-item-anim .accordion-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item-anim');
      if (item) {
        setTimeout(function () {
          const isExpanded = btn.getAttribute('aria-expanded') === 'true';
          item.classList.toggle('faq-open', isExpanded);
        }, 50);
      }
    });
  });

  /* ── Parallax hero on scroll ────────────────────────────────── */
  if (hero) {
    let bgScale = 1;
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const heroH  = hero.offsetHeight;
      if (scrolled < heroH) {
        const content = hero.querySelector('.container.position-relative.z-2');
        if (content) {
          content.style.transform = 'translateY(' + (scrolled * 0.35) + 'px)';
          content.style.opacity   = 1 - (scrolled / heroH) * 0.6;
        }
        bgScale = 1 + scrolled * 0.00015;
        hero.style.backgroundSize = (bgScale * 100) + '%';
      }
    }, { passive: true });

    /* Slow ambient bg drift */
    let drift = 0;
    function driftBg() {
      drift += 0.02;
      const x = 50 + Math.sin(drift * 0.01) * 2;
      const y = 50 + Math.cos(drift * 0.008) * 2;
      hero.style.backgroundPosition = x + '% ' + y + '%';
      requestAnimationFrame(driftBg);
    }
    driftBg();
  }

});
