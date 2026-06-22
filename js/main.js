/* EliteHomes — main page scripts */

document.addEventListener('DOMContentLoaded', function () {

  // close mobile menu when a nav link is clicked
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.getElementById('mainNav');
  let bsCollapse = null;

  if (navbarCollapse) {
    bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
    if (!bsCollapse) {
      bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
    }
  }

  const mobileNavQuery = window.matchMedia('(max-width: 991.98px)');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // keep menu open when tapping a dropdown toggle (e.g. Properties)
      if (link.classList.contains('dropdown-toggle')) return;
      if (link.getAttribute('data-bs-toggle') === 'dropdown') return;

      if (mobileNavQuery.matches && navbarCollapse && navbarCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });

  // close mobile menu when a link inside the properties dropdown is tapped
  document.querySelectorAll('#mainNav .dropdown-menu a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      if (mobileNavQuery.matches && navbarCollapse && navbarCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });

  // smooth scroll for anchor links (account for fixed header)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // highlight active nav link while scrolling
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.navbar-nav .nav-link');

  function highlightNav() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.clientHeight;
      if (scrollPos >= top && !(scrollPos >= top + height)) {
        current = section.getAttribute('id');
      }
    });

    desktopNavLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // shared Bootstrap form validation helper
  function handleFormSubmit(form, onSuccess) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      onSuccess();
      form.reset();
      form.classList.remove('was-validated');
    });
  }

  // hero search form validation
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    handleFormSubmit(heroSearchForm, function () {
      const location = document.getElementById('heroLocation')?.value || '';
      alert('Searching properties near: ' + location);
    });
  }

  // contact form — Bootstrap validation + toast
  const contactForm = document.getElementById('contactForm');
  const formToastEl = document.getElementById('formSuccessToast');
  let formToast = null;

  if (formToastEl) {
    formToast = new bootstrap.Toast(formToastEl, { delay: 5000 });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }

      const submitBtn = document.getElementById('submitBtn');
      const btnText = document.getElementById('btnText');
      const btnSpinner = document.getElementById('btnSpinner');
      const btnIcon = document.getElementById('btnIcon');

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending...';
      if (btnSpinner) btnSpinner.classList.remove('d-none');
      if (btnIcon) btnIcon.classList.add('d-none');

      setTimeout(function () {
        if (btnText) btnText.textContent = 'Send Message';
        if (btnSpinner) btnSpinner.classList.add('d-none');
        if (btnIcon) btnIcon.classList.remove('d-none');
        if (submitBtn) submitBtn.disabled = false;

        contactForm.reset();
        contactForm.classList.remove('was-validated');

        if (formToast) {
          formToast.show();
        }
      }, 1500);
    });
  }

  // header background changes on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
    header.classList.toggle('header-scrolled', window.scrollY > 40);
  }, { passive: true });

});
