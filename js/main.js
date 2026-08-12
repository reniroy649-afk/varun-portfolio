/* =============================================
   MAIN.JS — Varun M D Portfolio
   ============================================= */

/* ---- Custom Cursor ---- */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .skill-card, .project-card, .timeline-content').forEach(el => {
  el.addEventListener('mouseenter', () => cursorFollower.style.transform += ' scale(1.6)');
  el.addEventListener('mouseleave', () => {});
});

/* ---- Navbar Scroll ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

/* ---- Mobile Nav Toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

/* ---- Hero Canvas Particle Network ---- */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 80;

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.15;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124,92,252,${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,92,252,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ---- Stats Counter ---- */
const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      let current = 0;
      const inc = target / 50;
      const timer = setInterval(() => {
        current = Math.min(current + inc, target);
        entry.target.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, 30);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

/* ---- Scroll Reveal ---- */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---- About 3D Card Tilt ---- */
const card3d = document.getElementById('about3dCard');
if (card3d) {
  const cardInner = card3d.querySelector('.card-inner');
  card3d.addEventListener('mousemove', e => {
    const rect = card3d.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 18;
    const rotateY = (x / rect.width) * 18;
    cardInner.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });
  card3d.addEventListener('mouseleave', () => {
    cardInner.style.transform = '';
  });
}

/* ---- Active Nav Link on Scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinkEls.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
});

/* ---- Contact Form ---- */
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = '';
    submitBtn.disabled = true;

    setTimeout(() => {
      btnText.style.display = '';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
      feedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
      feedback.className = 'form-feedback success';
      form.reset();
      setTimeout(() => { feedback.textContent = ''; feedback.className = 'form-feedback'; }, 5000);
    }, 1800);
  });
}
