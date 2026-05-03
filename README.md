# FB Admin — Enterprise Operations Platform

A production-grade, frontend-only enterprise admin dashboard built with React 18, TypeScript, Material UI, Redux Toolkit, and Apache ECharts.

## Features

- **Authentication** — Mock login system with role-based access (Super Admin, Admin, Manager, Viewer)
- **Dashboard** — Executive KPI cards, revenue charts, order analytics, conversion tracking
- **Analytics** — Regional revenue breakdown, monthly trends, top products, new user growth
- **User Management** — Full CRUD with search, pagination, role assignment
- **Product Management** — Create/edit/delete products, low stock alerts, SKU management
- **Order Management** — Status workflow, order details with timeline, status updates
- **Categories** — Hierarchical category tree with subcategories
- **Notifications** — Real-time notification feed with read/unread states
- **Audit Logs** — Complete activity logging with search and filters
- **Settings** — General config, appearance (light/dark), branding, security
- **i18n** — English and French language support
- **Responsive** — Fully responsive with collapsible sidebar, mobile drawer

## Tech Stack

- React 18 + TypeScript (strict)
- Material UI v6
- Redux Toolkit
- Apache ECharts (echarts-for-react)
- React Hook Form + Zod validation
- React Router v6
- notistack notifications

## Quick Start

```bash
npm install
npm run dev
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@fb.com | admin123 |
| Admin | claire@fb.com | admin123 |
| Manager | marc@fb.com | admin123 |
| Viewer | viewer@fb.com | admin123 |

## Deployment

Configured for GitHub Pages via GitHub Actions. Push to `main` to auto-deploy.

For custom domain, update `public/CNAME` with your domain.

## Architecture

```
src/
├── core/          # Auth, i18n, theme providers
├── modules/       # Feature modules (dashboard, users, products, etc.)
├── components/    # Shared layout components
├── mock/          # Mock data layer (DB engine, API, generators)
├── store/         # Redux store configuration
└── assets/        # Static assets
```

## License

Proprietary — All rights reserved.
