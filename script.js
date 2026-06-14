/* ═══════════════════════════════════════════════
   NOUH ELHICHEM — DIGITAL PORTFOLIO
   script.js
   ═══════════════════════════════════════════════ */

'use strict';

// ── Nav: scroll behaviour ──
const nav = document.getElementById('nav');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

const closeMenu = () => {
  if (burger) burger.classList.remove('open');
  if (navLinks) navLinks.classList.remove('open');
  document.body.style.overflow = '';
};

// UX helpers: keep scroll progress, nav background, and back-to-top state in sync.
const onScroll = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

  nav.classList.toggle('scrolled', window.scrollY > 20);
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 520);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Nav: mobile burger ──
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Smooth anchor navigation: offsets the fixed navbar for every in-page link.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = nav ? nav.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Back to top: smooth return to the page start.
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Reveal on scroll (IntersectionObserver) ──
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));
}

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav__link[href^="#"]');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35, rootMargin: '-22% 0px -58% 0px' }
);

sections.forEach(s => activeObserver.observe(s));

// ── Cursor glow effect (desktop only) ──
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.innerWidth > 1024 && !prefersReducedMotion) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  const animateGlow = () => {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

  // Hide glow when mouse leaves window
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

// ── Skill/service card tilt on hover (desktop only) ──
if (window.innerWidth > 1024 && !prefersReducedMotion) {
  // Tilt enhancement: extends the existing desktop interaction to new cards.
  const tiltCards = document.querySelectorAll('.skill-card, .service-card, .process-card, .tech-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 3}deg) rotateX(${-dy * 3}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── Typed headline effect in hero (on load) ──
const heroName = document.querySelector('.hero__name');
if (heroName) {
  heroName.classList.add('visible');
}

// Force reveal of first elements without waiting for scroll
setTimeout(() => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
}, 100);
