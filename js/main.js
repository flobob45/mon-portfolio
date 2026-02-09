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
    const publicIcon = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';
    const privateIcon = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

    const githubIcon = '<svg class="project-card__github-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-label="Voir sur GitHub"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>';

    const tags = project.languages
      .map(lang => `<li class="badge">${lang}</li>`)
      .join('');

    const visibility = project.visibility === 'public'
      ? `<span class="project-card__visibility">${publicIcon} Public</span>`
      : `<span class="project-card__visibility">${privateIcon} Private</span>`;

    const article = document.createElement('article');
    article.className = 'card project-card';
    article.innerHTML = `
      <a href="${project.url}" target="_blank" rel="noopener" class="project-card__link">
        <div class="card__banner"></div>
        <div class="card__body">
          <h3>${project.name}</h3>
          ${visibility}
          <p>${project.description}</p>
          <ul class="project-card__tags">${tags}</ul>
          ${githubIcon}
        </div>
      </a>`;
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

/* --- Contact Form (AJAX) --- */
const contactForm = document.querySelector('.contact-form');
const contactSuccess = document.querySelector('.contact-success');

if (contactForm && contactSuccess) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    // Ajouter le sujet personnalisé
    formData.append('_subject', 'Nouveau message depuis le portfolio');

    // État loading
    submitButton.classList.add('is-loading');
    submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Succès : cacher le formulaire et afficher le message
        contactForm.classList.add('is-hidden');
        contactSuccess.classList.add('is-visible');

        // Scroll vers le message de succès
        contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Erreur serveur
        throw new Error('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      // Erreur réseau ou autre
      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
      submitButton.classList.remove('is-loading');
      submitButton.disabled = false;
    }
  });
}
