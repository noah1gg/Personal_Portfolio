/* ═══════════════════════════════════════════════
   NOUH ELHICHEM — DIGITAL PORTFOLIO
   script.js
   ═══════════════════════════════════════════════ */

'use strict';

// ── Nav: scroll behaviour ──
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Nav: mobile burger ──
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile nav when a link is tapped
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Reveal on scroll (IntersectionObserver) ──
const revealEls = document.querySelectorAll('.reveal');

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

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav__link[href^="#"]');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            if (!link.classList.contains('nav__link--cta')) {
              link.style.color = 'var(--gold)';
            }
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => activeObserver.observe(s));

// ── Smooth parallax on hero background ──
const heroBg = document.querySelector('.hero__bg');
if (heroBg && window.innerWidth > 768) {
  const parallaxScroll = () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  };
  window.addEventListener('scroll', parallaxScroll, { passive: true });
}

// ── Cursor glow effect (desktop only) ──
if (window.innerWidth > 1024) {
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
if (window.innerWidth > 1024) {
  const tiltCards = document.querySelectorAll('.skill-card, .service-card');
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
