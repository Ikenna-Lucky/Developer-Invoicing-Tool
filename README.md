# Billd

Frontend for Billd, an invoicing tool for freelancers and small dev shops — create clients, send invoices, track payments, and get paid faster.

Built with [Next.js](https://nextjs.org) (App Router) and [Tailwind CSS](https://tailwindcss.com). Talks to the [Billd API](../developer-invoicing-api) for data.

## Features

- Sign in with email/password or Google
- Dashboard with revenue, outstanding, and overdue stats, plus a collection-rate summary
- Client management — add, edit, view billing history per client
- Invoice creation with line items, auto-calculated totals, and PDF download
- Send invoices by email with a Paystack payment link attached
- Trash view for deleted invoices, with restore
- Command palette (⌘K) for quick navigation and search across clients/invoices
- Profile and business settings, including logo/avatar upload

## Tech stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide icons

## Getting started

**Prerequisites:** Node.js, and the [Billd API](../developer-invoicing-api) running (locally or deployed).

```bash
git clone <repo-url>
cd developer-invoicing-web
npm install
cp .env.local.example .env.local   # then set NEXT_PUBLIC_API_URL
npm run dev
```

The app starts on `http://localhost:3000` by default.

## Environment variables

| Variable              | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Billd API, e.g. `http://localhost:3001` |

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm run start` | Start the production build |
| `npm run lint`  | Run ESLint                 |

## Project structure

```
src/
  app/
    (auth)/          sign-in, sign-up, forgot/reset password
    (dashboard)/     dashboard, clients, invoices, settings
  components/
    landing/         marketing/landing page sections
    layout/          dashboard header, sidebar
    ui/              shared UI primitives (Button, Modal, Toast, CommandPalette, ...)
  context/           auth and sidebar state (React Context)
  lib/               API client and small utilities
  middleware.ts      route protection for the dashboard
```

## Auth notes

Access and refresh tokens are httpOnly cookies set by the API. Since the API and this app live on different domains in production, a separate non-httpOnly `billd_session` cookie is set on this app's own domain purely so `middleware.ts` can tell whether someone is signed in before letting them reach a dashboard route.
