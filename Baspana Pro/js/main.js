/* ============================================================
   BASPANA PRO — Main JavaScript
   ============================================================ */

'use strict';

// ────────────────────────────────────────────────────────────
// 1. STICKY HEADER
// ────────────────────────────────────────────────────────────
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ────────────────────────────────────────────────────────────
// 2. MOBILE MENU
// ────────────────────────────────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu) return;

  const openMenu = () => {
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
})();

// ────────────────────────────────────────────────────────────
// 3. SCROLL REVEAL (Intersection Observer)
// ────────────────────────────────────────────────────────────
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();

// ────────────────────────────────────────────────────────────
// 4. ANIMATED COUNTERS
// ────────────────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = Math.min(now - start, duration);
      const progress = easeOut(elapsed / duration);
      const current = Math.floor(progress * target);
      el.textContent = prefix + current + suffix;
      if (elapsed < duration) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ────────────────────────────────────────────────────────────
// 5. PORTFOLIO FILTER
// ────────────────────────────────────────────────────────────
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const category = item.dataset.category || 'all';
        const show = filter === 'all' || category === filter;

        if (show) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (item.style.opacity === '0') {
              item.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
})();

// ────────────────────────────────────────────────────────────
// 6. LIGHTBOX
// ────────────────────────────────────────────────────────────
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!lightbox) return;

  const openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 400);
  };

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
})();

// ────────────────────────────────────────────────────────────
// 7. TESTIMONIALS SLIDER
// ────────────────────────────────────────────────────────────
(function initSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (!track) return;

  // On mobile, slider is disabled (CSS handles it)
  if (window.innerWidth <= 1024) return;

  let current = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const total = Math.max(0, cards.length - 2); // Show 3 at once => max offset

  const getSlideWidth = () => {
    if (!cards[0]) return 0;
    return cards[0].offsetWidth + 24; // gap = 24px
  };

  const goTo = (index) => {
    current = Math.max(0, Math.min(index, total));
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-play
  let autoPlay = setInterval(() => {
    goTo(current >= total ? 0 : current + 1);
  }, 5000);

  track.parentElement?.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.parentElement?.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      goTo(current >= total ? 0 : current + 1);
    }, 5000);
  });
})();

// ────────────────────────────────────────────────────────────
// 8. FAQ ACCORDION
// ────────────────────────────────────────────────────────────
(function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => i.classList.remove('open'));

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
})();

// ────────────────────────────────────────────────────────────
// 9. CONTACT FORM
// ────────────────────────────────────────────────────────────
(function initForm() {
  const form = document.getElementById('contactForm');
  const formContent = document.getElementById('formContent');
  const formSuccess = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const inputs = form.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#e74c3c';
        valid = false;
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
      }
    });

    if (!valid) return;

    // Show loading state
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправляем...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      formContent.style.display = 'none';
      formSuccess.classList.add('visible');
    }, 1500);
  });
})();

// ────────────────────────────────────────────────────────────
// 10. BACK TO TOP & FAB
// ────────────────────────────────────────────────────────────
(function initFab() {
  const fabTop = document.getElementById('fabTop');
  if (!fabTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      fabTop.classList.add('visible');
    } else {
      fabTop.classList.remove('visible');
    }
  }, { passive: true });

  fabTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ────────────────────────────────────────────────────────────
// 11. HERO IMAGE PARALLAX
// ────────────────────────────────────────────────────────────
(function initParallax() {
  const heroBgImg = document.querySelector('.hero-bg img');
  if (!heroBgImg) return;

  // Mark loaded
  heroBgImg.addEventListener('load', () => {
    heroBgImg.classList.add('loaded');
  });
  if (heroBgImg.complete) heroBgImg.classList.add('loaded');

  // Subtle parallax on scroll
  const onScroll = () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    heroBgImg.style.transform = `scale(1) translateY(${rate}px)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ────────────────────────────────────────────────────────────
// 12. SMOOTH SCROLL for anchor links
// ────────────────────────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ────────────────────────────────────────────────────────────
// 13. MARQUEE DUPLICATION
// ────────────────────────────────────────────────────────────
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  // Clone items for seamless loop
  const items = Array.from(track.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });
})();

// ────────────────────────────────────────────────────────────
// 14. SCROLL PROGRESS (optional thin top bar)
// ────────────────────────────────────────────────────────────
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
})();
