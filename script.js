/* ==========================================================================
   NorthPeak Digital — script.js
   Handles: mobile nav, navbar shadow on scroll, scroll-reveal animations,
   animated stat counters, and contact form validation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Dark Mode Toggle ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when a nav link is clicked (mobile)
    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------------- Navbar shadow on scroll ---------------- */
  const navbar = document.getElementById('navbar');
  const toggleNavbarShadow = () => {
    if (window.scrollY > 8) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };
  toggleNavbarShadow();
  window.addEventListener('scroll', toggleNavbarShadow, { passive: true });

  /* ---------------- Scroll-reveal (fade-in on scroll) ---------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal everything immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------- Animated stat counters ---------------- */
  const statNumbers = document.querySelectorAll('.stats__num');

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach((el) => statsObserver.observe(el));
  } else {
    statNumbers.forEach((el) => {
      el.textContent = (el.getAttribute('data-count') || '0') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------------- Contact form validation ---------------- */
  const form = document.getElementById('contactForm');

  if (form) {
    const fields = {
      name: {
        input: document.getElementById('name'),
        error: document.getElementById('nameError'),
        validate: (value) => value.trim().length >= 2,
        message: 'Please enter your full name (min. 2 characters).'
      },
      email: {
        input: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
        message: 'Please enter a valid email address.'
      },
      phone: {
        input: document.getElementById('phone'),
        error: document.getElementById('phoneError'),
        validate: (value) => /^[\d\s()+-]{7,}$/.test(value.trim()),
        message: 'Please enter a valid phone number.'
      },
      message: {
        input: document.getElementById('message'),
        error: document.getElementById('messageError'),
        validate: (value) => value.trim().length >= 10,
        message: 'Message should be at least 10 characters.'
      }
    };

    const successEl = document.getElementById('formSuccess');

    const validateField = (key) => {
      const field = fields[key];
      const value = field.input.value;
      const isValid = field.validate(value);

      if (!isValid) {
        field.input.classList.add('is-invalid');
        field.input.setAttribute('aria-invalid', 'true');
        field.error.textContent = field.message;
      } else {
        field.input.classList.remove('is-invalid');
        field.input.removeAttribute('aria-invalid');
        field.error.textContent = '';
      }
      return isValid;
    };

    // Validate on blur for immediate feedback
    Object.keys(fields).forEach((key) => {
      fields[key].input.addEventListener('blur', () => validateField(key));
      fields[key].input.addEventListener('input', () => {
        if (fields[key].input.classList.contains('is-invalid')) validateField(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successEl.classList.remove('is-visible');
      successEl.textContent = '';

      let allValid = true;
      Object.keys(fields).forEach((key) => {
        const valid = validateField(key);
        if (!valid) allValid = false;
      });

      if (!allValid) {
        // Focus the first invalid field for accessibility
        const firstInvalid = Object.values(fields).find((f) => f.input.classList.contains('is-invalid'));
        if (firstInvalid) firstInvalid.input.focus();
        return;
      }

      // Simulate successful submission (no backend attached)
      successEl.textContent = "Thanks! Your message has been sent — we'll be in touch within one business day.";
      successEl.classList.add('is-visible');
      form.reset();
    });
  }

});
