/* ============================================
   王悦 · AI Product Operations — 交互脚本
   ============================================ */

// ----- DOM References -----
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

// ----- Scroll to Section -----
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  // Close mobile menu if open
  if (navLinks.classList.contains('nav__links--open')) {
    closeMenu();
  }

  target.scrollIntoView({ behavior: 'smooth' });
}

// ----- Navigation Scroll Effect -----
function updateNav() {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
}

// ----- Mobile Menu -----
function toggleMenu() {
  const isOpen = navLinks.classList.contains('nav__links--open');
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  navLinks.classList.add('nav__links--open');
  menuBtn.classList.add('nav__menu-btn--open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('nav__links--open');
  menuBtn.classList.remove('nav__menu-btn--open');
  document.body.style.overflow = '';
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
  if (navLinks.classList.contains('nav__links--open') &&
      !navLinks.contains(e.target) &&
      !menuBtn.contains(e.target)) {
    closeMenu();
  }
});

// Close menu on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && navLinks.classList.contains('nav__links--open')) {
    closeMenu();
  }
});

// ----- Intersection Observer for Scroll Animations -----
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate--visible');
      // Don't unobserve cards/features so they re-trigger if they exit and re-enter
      // But unobserve one-shot elements like sections
      if (entry.target.classList.contains('animate--once')) {
        observer.unobserve(entry.target);
      }
    }
  });
}, observerOptions);

// Observe all .animate elements
document.querySelectorAll('.animate').forEach((el) => {
  observer.observe(el);
});

// Also observe sections for staggered children
document.querySelectorAll('.features-grid, .reflection-grid, .project-links, .projects-grid').forEach((container) => {
  container.querySelectorAll('.animate').forEach((el) => {
    observer.observe(el);
  });
});

// ----- Flow Diagram Animation -----
// Flow diagrams need the connector lines to animate when visible
document.querySelectorAll('.flow-diagram.animate').forEach((flow) => {
  observer.observe(flow);

  // Add staggered delays to flow connectors
  const connectors = flow.querySelectorAll('.flow-connector__line');
  connectors.forEach((connector, index) => {
    connector.style.transitionDelay = (index * 0.08) + 's';
  });
});

// ----- Scroll & Resize Handlers -----
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateNav();
      ticking = false;
    });
    ticking = true;
  }
});

// Initial nav state
updateNav();

// Close mobile menu on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks.classList.contains('nav__links--open')) {
    closeMenu();
  }
});

// ----- Keyboard Navigation -----
// Allow pressing Enter/Space on clickable cards
document.querySelectorAll('.project-card').forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// Make nav buttons keyboard accessible
document.querySelectorAll('.nav__link, .nav__dropdown-item, .project-hero__back, .hero__scroll-hint').forEach((btn) => {
  if (!btn.getAttribute('tabindex')) {
    btn.setAttribute('tabindex', '0');
  }

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// ----- Email: mailto + clipboard fallback -----
function copyEmail(event) {
  const email = 'wesimoo16@gmail.com';
  // Copy to clipboard as safety net (works whether or not mailto succeeds)
  navigator.clipboard.writeText(email).then(() => {
    const link = event.target;
    const originalText = link.textContent;
    link.textContent = '已复制 ✓';
    setTimeout(() => {
      link.textContent = originalText;
    }, 2000);
  }).catch(() => {});
  // Let mailto proceed normally — if HR has a mail client, it opens
}

// ----- QR Code -----
(function() {
  const qrImg = document.getElementById('qrCode');
  if (!qrImg) return;
  const url = encodeURIComponent(window.location.href);
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`;
  qrImg.onerror = function() {
    qrImg.parentElement.style.display = 'none';
  };
})();

console.log('🌱 王悦 · AI Product & Operations — 作品集已就绪');
