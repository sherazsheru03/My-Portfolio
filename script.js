/**
 * PORTFOLIO — SCRIPT.JS v2
 * ─────────────────────────────────────────────────────
 * Handles:
 *   1.  Custom cursor with magnetic hover effects
 *   2.  Navigation scroll state
 *   3.  Mobile menu toggle
 *   4.  Intersection Observer — scroll reveal
 *   5.  Intersection Observer — skill bar animation
 *   6.  Magnetic button effect
 *   7.  Smooth anchor scroll (with nav offset)
 *   8.  Hero heading — staggered entrance on load
 *   9.  Budget Mode bar animation
 *   10. Live store CTA cursor state
 *   11. Bento cards — hover cursor state
 *   12. Case study step — staggered reveal
 * ─────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════
     UTILITY: Respect prefers-reduced-motion
  ═══════════════════════════════════════════════════ */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ═══════════════════════════════════════════════════
     1. CUSTOM CURSOR
  ═══════════════════════════════════════════════════ */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');

  // Only show custom cursor on pointer devices (not touch)
  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches && cursor && cursorDot) {
    let mouseX = -100, mouseY = -100;
    let dotX   = -100, dotY   = -100;
    let cursorX = -100, cursorY = -100;

    // Reveal after first mouse movement
    let cursorReady = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorReady) {
        cursorReady = true;
        document.body.classList.add('cursor-ready');
      }
    });

    // Smooth cursor lag animation
    function animateCursor() {
      // Outer ring — eased follow
      cursorX += (mouseX - cursorX) * 0.14;
      cursorY += (mouseY - cursorY) * 0.14;
      cursor.style.left = cursorX + 'px';
      cursor.style.top  = cursorY + 'px';

      // Inner dot — tight follow
      dotX += (mouseX - dotX) * 0.7;
      dotY += (mouseY - dotY) * 0.7;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top  = dotY + 'px';

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Hover states — expanded set including bento cards
    const hoverTargets = document.querySelectorAll(
      'a, button, [data-magnetic], .skill-chip, .project-card__cta, .about__pillar, .contact__link, .bento-card, .cs-step'
    );
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Text cursor on paragraphs and headings
    const textTargets = document.querySelectorAll('p, h1, h2, h3');
    textTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (cursorReady) {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
      }
    });
  }


  /* ═══════════════════════════════════════════════════
     2. NAVIGATION SCROLL STATE
  ═══════════════════════════════════════════════════ */
  const nav = document.getElementById('nav');

  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on init
  }


  /* ═══════════════════════════════════════════════════
     3. MOBILE MENU
  ═══════════════════════════════════════════════════ */
  const menuBtn    = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      menuBtn.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', () => toggleMenu());

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }


  /* ═══════════════════════════════════════════════════
     4. SCROLL REVEAL — Intersection Observer
  ═══════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal-up');

  if (revealEls.length) {
    if (reducedMotion) {
      // Skip animation entirely for reduced motion
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target); // animate once
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }


  /* ═══════════════════════════════════════════════════
     5. SKILL BARS ANIMATION — Intersection Observer
  ═══════════════════════════════════════════════════ */
  const barFills = document.querySelectorAll('.skills__bar-fill');

  if (barFills.length) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const width = fill.getAttribute('data-width');
            fill.style.setProperty('--target-width', width + '%');
            // Small timeout to ensure CSS transition fires after paint
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                fill.style.width = width + '%';
              });
            });
            barObserver.unobserve(fill);
          }
        });
      },
      { threshold: 0.3 }
    );

    barFills.forEach((el) => barObserver.observe(el));
  }


  /* ═══════════════════════════════════════════════════
     6. MAGNETIC BUTTON EFFECT
  ═══════════════════════════════════════════════════ */
  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const magneticEls = document.querySelectorAll('[data-magnetic]');

    magneticEls.forEach((el) => {
      const strength = 0.35; // Magnetic pull strength

      el.addEventListener('mousemove', (e) => {
        const rect    = el.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const deltaX  = (e.clientX - centerX) * strength;
        const deltaY  = (e.clientY - centerY) * strength;

        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        el.style.transition = 'transform 0.1s ease';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }


  /* ═══════════════════════════════════════════════════
     7. SMOOTH ANCHOR SCROLL (with nav offset)
  ═══════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });


  /* ═══════════════════════════════════════════════════
     8. HERO HEADING — Staggered entrance on load
  ═══════════════════════════════════════════════════ */
  window.addEventListener('load', () => {
    const heroReveals = document.querySelectorAll('.hero .reveal-up');
    heroReveals.forEach((el) => {
      const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      if (reducedMotion) {
        el.classList.add('is-visible');
      } else {
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay * 80 + 100);
      }
    });
  });


  /* ═══════════════════════════════════════════════════
     9. BUDGET MODE BAR ANIMATION — re-trigger on visibility
  ═══════════════════════════════════════════════════ */
  document.querySelectorAll('.pv-budget-mode__fill').forEach((budgetFill) => {
    if (!budgetFill) return;
    const budgetObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              budgetFill.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s';
            }, 100);
            budgetObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    budgetObs.observe(budgetFill);
  });


  /* ═══════════════════════════════════════════════════
     10. LIVE STORE CTA — cursor hover state
  ═══════════════════════════════════════════════════ */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card__cta--live').forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }


  /* ═══════════════════════════════════════════════════
     11. BENTO CARDS — subtle scale on scroll-in
  ═══════════════════════════════════════════════════ */
  if (!reducedMotion) {
    const bentoCards = document.querySelectorAll('.bento-card');
    if (bentoCards.length) {
      const bentoObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // The reveal-up class handles the main animation;
              // just ensure bento cards get their is-visible class
              entry.target.classList.add('is-visible');
              bentoObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      bentoCards.forEach((card) => bentoObs.observe(card));
    }
  }


  /* ═══════════════════════════════════════════════════
     12. CASE STUDY STEPS — staggered number counter
         Animates the step number from 00 to the target
  ═══════════════════════════════════════════════════ */
  if (!reducedMotion) {
    const csSteps = document.querySelectorAll('.cs-step');
    if (csSteps.length) {
      const csObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const numEl = entry.target.querySelector('.cs-step__num');
              if (numEl) {
                const target = parseInt(numEl.textContent, 10);
                let current = 0;
                const interval = setInterval(() => {
                  current++;
                  numEl.textContent = String(current).padStart(2, '0');
                  if (current >= target) clearInterval(interval);
                }, 60);
              }
              csObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      csSteps.forEach((step) => csObs.observe(step));
    }
  }

})();
