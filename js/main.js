/*
 * MonPortfolio — Main JavaScript
 * Florian BOURGOIN
 */

/* --- Theme Toggle --- */
const themeToggle = document.querySelector('.theme-toggle');

function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
  }
}

const initialTheme = getPreferredTheme();
applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

/* --- Hamburger Menu --- */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* --- Projects (dynamic from JSON) --- */
const projectsGrid = document.getElementById('projects-grid');

if (projectsGrid) {
  function createProjectCard(project) {
    const visibilityIcon = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';

    const tags = project.languages
      .map(lang => `<li class="badge">${lang}</li>`)
      .join('');

    const visibility = project.visibility === 'public'
      ? `<span class="project-card__visibility">${visibilityIcon} Public</span>`
      : '';

    const article = document.createElement('article');
    article.className = 'card project-card';
    article.innerHTML = `
      <div class="card__banner"></div>
      <div class="card__body">
        <h3><a href="${project.url}" target="_blank" rel="noopener">${project.name}</a></h3>
        ${visibility}
        <p>${project.description}</p>
        <ul class="project-card__tags">${tags}</ul>
        <a href="${project.url}" target="_blank" rel="noopener" class="project-link">Voir ${project.name} sur GitHub<span class="sr-only"> (ouvre dans un nouvel onglet)</span></a>
      </div>`;
    return article;
  }

  fetch('data/projects.json')
    .then(res => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(projects => {
      projects.forEach(p => projectsGrid.appendChild(createProjectCard(p)));
    })
    .catch(() => {
      projectsGrid.innerHTML = '<p class="projects-error">Impossible de charger les projets.</p>';
    });
}

/* --- Fade-in on scroll --- */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function observeSections() {
  document.querySelectorAll('main > section').forEach(s => {
    s.classList.add('fade-in');
    fadeObserver.observe(s);
  });
}

observeSections();
