/* ══════════════════════════════════════════════════════════════
   PORTFOLIO — Premium Script
   Author: Jasti Lokesh Sai Krishna
══════════════════════════════════════════════════════════════ */

/* ── 1. PRELOADER ─────────────────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('done'), 500);
  }
});

/* ── 2. PARTICLE CANVAS ──────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const GOLD_DIM = 'rgba(201,168,76,';
  const COUNT = 110;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function rnd(min, max) { return min + Math.random() * (max - min); }

  function createParticle() {
    return {
      x: rnd(0, W), y: rnd(0, H),
      r: rnd(0.8, 2.4),
      vx: rnd(-0.2, 0.2), vy: rnd(-0.35, -0.08),
      alpha: rnd(0.25, 0.7), life: rnd(0.004, 0.008),
    };
  }

  particles = Array.from({ length: COUNT }, createParticle);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = GOLD_DIM + (0.07 * (1 - d / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = GOLD_DIM + p.alpha + ')';
      ctx.fill();
      p.x += p.vx; p.y += p.vy; p.alpha -= p.life;
      if (p.alpha <= 0 || p.y < 0 || p.x < 0 || p.x > W) Object.assign(p, createParticle());
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 3. NAVBAR ───────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActive();
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  function updateActive() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('#navLinks a');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
})();

/* ── 4. SMOOTH SCROLL ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── 5. KPI / STAT COUNTER ───────────────────────────────── */
(function initCounters() {
  const items = [
    ...document.querySelectorAll('.kpi-val[data-count]'),
    ...document.querySelectorAll('.stat-number[data-target]'),
  ];
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseFloat(el.dataset.count || el.dataset.target);
      const isF = String(end).includes('.');
      const dur = 1800;
      const t0  = performance.now();
      (function tick(now) {
        const p   = Math.min((now - t0) / dur, 1);
        const e   = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
        el.textContent = isF ? (e*end).toFixed(2) : Math.floor(e*end);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = isF ? end.toFixed(2) : end;
      })(t0);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  items.forEach(el => obs.observe(el));
})();

/* ── 6. SKILL BARS ───────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.width + '%';
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
})();

/* ── 7. SCROLL REVEAL ────────────────────────────────────── */
(function initReveal() {
  const autoTargets = [
    '.skill-card', '.project-card', '.timeline-card',
    '.edu-card', '.cert-card', '.contact-item',
    '.kpi', '.stat', '.about-lead', '.sec-label',
  ];
  autoTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
    });
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── 8. BACK TO TOP ──────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── 9. CONTACT FORM ─────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  // ── Change this URL when you deploy the backend ──────────
  const API_URL = 'http://localhost:8080/api/contact';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showNote('⚠️ Please fill in all fields.', '#e2b96f');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        showNote('✅ ' + data.message, '#6fcf97');
        form.reset();
      } else {
        // Validation error returned by Spring Boot
        const errMsg = data.errors
          ? Object.values(data.errors).join(' ')
          : (data.message || 'Something went wrong. Please try again.');
        showNote('❌ ' + errMsg, '#eb5757');
      }
    } catch (err) {
      // Network error — backend not running
      showNote('❌ Could not reach the server. Please email me directly.', '#eb5757');
      console.error('Contact form error:', err);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message ✉️';
    }
  });

  function showNote(text, color) {
    if (!note) return;
    note.style.color = color;
    note.textContent = text;
    setTimeout(() => { note.textContent = ''; }, 6000);
  }
})();

/* ── 10. CURSOR GLOW ─────────────────────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed', top: '0', left: '0',
    width: '300px', height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: '0',
    transform: 'translate(-50%, -50%)', willChange: 'left, top',
    transition: 'left 0.08s linear, top 0.08s linear',
  });
  document.body.appendChild(glow);
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

/* ── Console signature ───────────────────────────────────── */
console.log('%c✦ Jasti Lokesh Sai Krishna', 'font-family:Georgia,serif;font-size:16px;color:#c9a84c;font-weight:bold;');
console.log('%c  Portfolio — Built with HTML, CSS & Vanilla JS', 'font-size:11px;color:#888;');

