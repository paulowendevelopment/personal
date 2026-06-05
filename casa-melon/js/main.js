/* Casa Melon — main.js */

const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

// Navbar scroll state
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile nav toggle
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const [top, mid, bot] = navToggle.querySelectorAll('span');

  if (open) {
    top.style.transform = 'rotate(45deg) translate(5px, 5px)';
    mid.style.opacity   = '0';
    bot.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    top.style.transform = '';
    mid.style.opacity   = '';
    bot.style.transform = '';
  }
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

// Staggered fade-in on scroll
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Find sibling .fade-in elements in the same parent grid/container
    const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)')];
    const delay    = siblings.indexOf(entry.target) * 90;

    setTimeout(() => entry.target.classList.add('visible'), delay);
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

// Active nav highlight while scrolling
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// Simple lightbox for gallery — clicking a non-placeholder item shows it larger
document.querySelectorAll('.gallery-item:not(.photo-placeholder)').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.88);
      display:flex; align-items:center; justify-content:center;
      z-index:9999; cursor:zoom-out; padding:24px;
    `;

    const clone = img.cloneNode();
    clone.style.cssText = 'max-height:90vh; max-width:90vw; object-fit:contain; border-radius:12px;';
    overlay.appendChild(clone);

    overlay.addEventListener('click', () => document.body.removeChild(overlay));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, { once: true });

    document.body.appendChild(overlay);
  });
});
