const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const navOverlay = document.getElementById('navOverlay');
const closeNavBtn = document.getElementById('closeNav');
const navLinks = document.querySelectorAll('.nav-links a');

// navbar glass + active link highlight
const sections = document.querySelectorAll('section[id], header[id]');
const toggleGlass = () => navbar.classList.toggle('glass', window.scrollY > 40);
window.addEventListener('scroll', toggleGlass, { passive: true });
toggleGlass();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.remove('active-link'));
    const match = document.querySelector(`.nav-links a[href='#${entry.target.id}']`);
    if (match) match.classList.add('active-link');
  });
}, { threshold: 0.45 });
sections.forEach(section => sectionObserver.observe(section));

// mobile nav
menuBtn?.addEventListener('click', () => navOverlay.classList.add('open'));
closeNavBtn?.addEventListener('click', () => navOverlay.classList.remove('open'));
window.closeMenu = function closeMenu() { navOverlay.classList.remove('open'); };

// service filtering
const filterButtons = document.querySelectorAll('#serviceFilters .pill');
const serviceCards = document.querySelectorAll('#servicesGrid .service-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    serviceCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      const show = filter === 'all' || categories.includes(filter);
      card.style.display = show ? 'block' : 'none';
    });
  });
});

// testimonials carousel
const testimonials = [
  { quote: '“Every visit feels like a calm ritual. The team remembers every detail and I walk out glowing.”', author: '— Ananya S.' },
  { quote: '“They crafted my bridal look with such finesse. Elegant, subtle, and timeless.”', author: '— Priyanka V.' },
  { quote: '“From manicure to hair rituals, everything feels premium and calm.”', author: '— Meera L.' }
];

let testimonialIndex = 0;
const quoteEl = document.getElementById('testimonialQuote');
const authorEl = document.getElementById('testimonialAuthor');
const testimonialNavs = document.querySelectorAll('.t-nav');

const renderTestimonial = (index) => {
  const { quote, author } = testimonials[index];
  quoteEl.textContent = quote;
  authorEl.textContent = author;
};

testimonialNavs.forEach(btn => {
  btn.addEventListener('click', () => {
    testimonialIndex = btn.dataset.dir === 'next'
      ? (testimonialIndex + 1) % testimonials.length
      : (testimonialIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(testimonialIndex);
  });
});

setInterval(() => {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  renderTestimonial(testimonialIndex);
}, 6000);

// counters
const counters = document.querySelectorAll('.count');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const duration = 1800;

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = (target * progress).toFixed(decimals).replace(/\.0+$/, '');
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
}, { threshold: 0.6 });
counters.forEach(counter => counterObserver.observe(counter));

// motion reveals — [data-motion] elements
const motionElements = document.querySelectorAll('[data-motion]');
const motionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    motionObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });
motionElements.forEach(el => motionObserver.observe(el));

// stagger reveals — service cards
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    staggerObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.services-grid .service-card, .why-card').forEach(el => staggerObserver.observe(el));
