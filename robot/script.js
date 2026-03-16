/**
 * odyssey-main.js
 * ============================================================
 * Single entry-point for all Odyssey 2026 interactivity.
 * Loaded with `defer` — guaranteed to run after DOMContentLoaded.
 *
 * Modules (IIFE-scoped to avoid global pollution):
 *   1. Navigation — scroll effect + mobile burger
 *   2. Particles  — lightweight canvas starfield
 *   3. Spline     — lazy-load 3-D viewer after first paint
 *   4. Buttons    — data-action routing
 * ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     1. NAVIGATION
     ────────────────────────────────────────────────────────── */
  (function initNav() {
    const nav     = document.getElementById('nav');
    const burger  = document.getElementById('navBurger');
    const overlay = document.getElementById('navOverlay');
    if (!nav || !burger || !overlay) return;

    const SCROLL_THRESHOLD = 60;

    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function setMenuOpen(isOpen) {
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      overlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    burger.addEventListener('click', function () {
      setMenuOpen(!overlay.classList.contains('open'));
    });

    overlay.querySelectorAll('.overlay-link').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        setMenuOpen(false);
        burger.focus();
      }
    });
  })();


  /* ──────────────────────────────────────────────────────────
     2. PARTICLE CANVAS
     Lightweight starfield — floats on the hero background.
     Uses requestAnimationFrame; all heavy math is pre-computed.
     ────────────────────────────────────────────────────────── */
  (function initParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const PARTICLE_COUNT = 60;
    const COLOR_VIOLET   = 'rgba(124, 58, 237,';
    const COLOR_CYAN     = 'rgba(6, 182, 212,';

    let W, H, particles;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function createParticle(_) {
      const isCyan = Math.random() > 0.5;
      return {
        x:     Math.random() * (W || window.innerWidth),
        y:     Math.random() * (H || window.innerHeight),
        r:     Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        vx:    (Math.random() - 0.5) * 0.25,
        vy:    (Math.random() - 0.5) * 0.25,
        color: isCyan ? COLOR_CYAN : COLOR_VIOLET,
        pulse: Math.random() * Math.PI * 2,
      };
    }

    function tick(timestamp) {
      ctx.clearRect(0, 0, W, H);

      particles.forEach(function (p) {
        const alpha = p.alpha * (0.7 + 0.3 * Math.sin(timestamp * 0.001 + p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -2)    p.x = W + 2;
        if (p.x > W + 2) p.x = -2;
        if (p.y < -2)    p.y = H + 2;
        if (p.y > H + 2) p.y = -2;
      });

      requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || document.body);
    resize();
    requestAnimationFrame(tick);
  })();


  /* ──────────────────────────────────────────────────────────
     3. SPLINE LAZY LOAD + CURSOR FORWARDING
     ────────────────────────────────────────────────────────── */
  (function initSpline() {
    const wrapper = document.getElementById('splineWrapper');
    const hero    = document.getElementById('hero');
    if (!wrapper || !hero) return;

    let viewer     = null;
    let loaded     = false;
    let rafPending = false;
    let pendingEvent = null;

    function injectSpline() {
      if (loaded) return;
      loaded = true;

      const script  = document.createElement('script');
      script.type   = 'module';
      script.src    = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
      document.head.appendChild(script);

      viewer = document.createElement('spline-viewer');
      viewer.setAttribute('url', 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');
      viewer.setAttribute('loading-anim-type', 'spinner-small-dark');
      wrapper.appendChild(viewer);

      viewer.addEventListener('load', suppressWatermark);
    }

    function suppressWatermark() {
      const root = viewer?.shadowRoot;
      if (!root) return;
      ['#logo', 'a[href*="spline"]', '[class*="logo"]'].forEach(function (sel) {
        const el = root.querySelector(sel);
        if (el) el.style.setProperty('display', 'none', 'important');
      });
    }

    function getSplineCanvas() {
      return viewer?.shadowRoot?.querySelector('canvas') ?? viewer;
    }

    /* rAF-throttled cursor forwarding — coalesces events to one dispatch per frame */
    function dispatchToSpline() {
      rafPending = false;
      if (!pendingEvent || !viewer) return;
      const e = pendingEvent;
      pendingEvent = null;

      const target = getSplineCanvas();
      if (!target) return;

      target.dispatchEvent(new MouseEvent('mousemove', {
        bubbles:    false,
        cancelable: true,
        clientX:    e.clientX,
        clientY:    e.clientY,
        screenX:    e.screenX,
        screenY:    e.screenY,
        movementX:  e.movementX ?? 0,
        movementY:  e.movementY ?? 0,
        view:       window,
      }));
    }

    hero.addEventListener('mousemove', function (e) {
      pendingEvent = e;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(dispatchToSpline);
      }
    }, { passive: true });

    hero.addEventListener('touchmove', function (e) {
      if (!viewer) return;
      const t = e.touches[0];
      pendingEvent = { clientX: t.clientX, clientY: t.clientY, screenX: t.screenX, screenY: t.screenY };
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(dispatchToSpline);
      }
    }, { passive: true });

    if ('requestIdleCallback' in window) {
      requestIdleCallback(injectSpline, { timeout: 2000 });
    } else {
      setTimeout(injectSpline, 200);
    }
  })();


  /* ──────────────────────────────────────────────────────────
     4. BUTTON ROUTING
     ────────────────────────────────────────────────────────── */
  (function initButtons() {
    document.querySelectorAll('.button[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const action = btn.dataset.action;

        if (action === 'register') {
          const target = document.getElementById('register');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }

        if (action === 'events') {
          window.location.href = 'events.html';
        }
      });
    });
  })();

})();
