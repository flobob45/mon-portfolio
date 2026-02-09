# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

**MonPortfolio** — Site portfolio statique (HTML, CSS, JavaScript vanilla). Aucun framework, aucun bundler.

## Commandes

- `python3 -m http.server 8000` — Serveur de développement local (ou tout autre serveur statique)
- Pas de build, pas de lint, pas de tests configurés

## Architecture

```
/
├── index.html          — Page principale (point d'entrée)
├── css/
│   └── style.css       — Styles globaux
├── js/
│   └── main.js         — Scripts globaux
└── assets/
    └── images/         — Images et médias
```

Site statique mono-page ou multi-page. Tout le routing est géré par des fichiers HTML.

## Design

- **Mobile-first** : écrire les styles pour mobile par défaut, utiliser des media queries `min-width` pour les écrans plus grands
- **Fond sombre** : palette sombre (ex. `#0a0a0a`, `#1a1a1a`) avec texte clair
- **Minimaliste et professionnel** : espacement généreux, typographie sobre, peu de couleurs d'accent

## Conventions

- **Code en anglais** : noms de variables, fonctions, classes CSS, attributs `id`/`class`
- **Contenu visible en français** : tout texte affiché à l'utilisateur (titres, paragraphes, boutons, alt d'images)
- **Messages de commit en français**
- **Répondre toujours en français**
- CSS : utiliser des custom properties (`--var`) pour les couleurs et les tailles réutilisables
- JavaScript : vanilla uniquement, pas de bibliothèques externes sauf nécessité explicite
- HTML sémantique : `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
