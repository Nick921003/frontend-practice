# Chun-Wei Peng | Personal Portfolio

This is a responsive personal portfolio built with Vue 3 + Vite.
It includes a public showcase frontend and an optional admin CMS backed by Supabase.

## Live Site
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-2ea44f?style=for-the-badge&logo=github)](https://nick921003.github.io/frontend-practice/#/)

## Core Features
- Responsive portfolio homepage (About / Portfolio / Experience)
- Multi-language toggle (Chinese / English)
- Image gallery with lightbox preview
- Admin panel for content CRUD
- Supabase Auth login and Supabase Storage image upload
- AOS scroll animations

## Tech Stack
- Framework: Vue 3 (Composition API)
- Build Tool: Vite
- Router: Vue Router (hash mode for GitHub Pages)
- Backend Service: Supabase (Auth, Database, Storage)
- Styling: Custom CSS design tokens + component styles
- Deployment: GitHub Pages via GitHub Actions

## Project Structure
```text
src/
	components/
		ProjectCard.vue
		Footer.vue
	views/
		HomeView.vue
		AdminView.vue
	router/
		index.js
	supabase.js
	style.css
```

## Local Development

1. Install dependencies
```bash
npm install
```

2. (Optional) Create environment file for Supabase-enabled features
```bash
# .env.local
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

3. Start development server
```bash
npm run dev
```

## Build and Preview
```bash
npm run build
npm run preview
```

## Environment Variables

The app reads:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If these are missing or invalid:
- Public frontend still loads
- Supabase-related features are disabled gracefully

## Admin Panel Notes

The admin route is:
- `/#/admin`

For full admin functionality, make sure Supabase is configured and the required table/storage bucket exists.

## Deployment

GitHub Actions workflow file:
- `.github/workflows/deploy.yml`

Set these repository secrets before deployment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
