/* =========================================================
   PRINT AVENUE — Interactions
   - Mobile menu, sticky header state & scroll progress
   - Scroll-spy for navbar (driven by the nav links themselves)
   - Scroll-reveal animations ([data-reveal])
   - Subtle hero parallax
   Everything is generic: add a section + a matching #anchor
   link in the navbar and it works automatically.
   ========================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.getElementById('site-header');
  const nav = document.getElementById('primary-nav');
  const toggle = document.getElementById('nav-toggle');
  const progress = document.getElementById('scroll-progress');
  const navLinks = [...document.querySelectorAll('.nav__link[href^="#"]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => {
    if (nav?.classList.contains('is-open') && !e.target.closest('.site-header')) setMenu(false);
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', () => setMenu(false));

  /* ---------- Scroll-spy sections (built from the nav links) ---------- */
  const spyTargets = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter((t) => t.section);

  const setActive = () => {
    const probe = window.scrollY + header.offsetHeight + window.innerHeight * 0.3;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let current = spyTargets[0];

    for (const t of spyTargets) {
      if (t.section.getBoundingClientRect().top + window.scrollY <= probe) current = t;
    }
    if (atBottom) current = spyTargets[spyTargets.length - 1];

    navLinks.forEach((l) => {
      const on = l === current?.link;
      l.classList.toggle('is-active', on);
      on ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current');
    });
  };

  /* ---------- Hero parallax ---------- */
  const heroImg = document.getElementById('hero-img');
  const heroSection = document.getElementById('home');

  const parallax = () => {
    if (!heroImg || !heroSection || reduceMotion) return;
    const h = heroSection.offsetHeight;
    const y = Math.min(window.scrollY, h);
    heroImg.style.transform = `translate3d(0, ${y * 0.12}px, 0) scale(1.12)`;
  };

  /* ---------- Scroll handler (rAF throttled) ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (progress) progress.style.transform = `scaleX(${ratio})`;
      header.classList.toggle('is-scrolled', window.scrollY > 10);
      setActive();
      parallax();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach((el) => io.observe(el));
  }
})();
