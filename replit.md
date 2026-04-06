# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Coast 2 Coast Mobile Mechanics Website (`coast2coast`)
- **Type**: react-vite (presentation-first, no backend)
- **Preview path**: `/`
- **Description**: Premium single-page marketing website for Coast 2 Coast Mobile Mechanics (Sunshine Coast, QLD). Features hero, services, about, testimonials, contact form.
- **Branding**: Black (#111), Red (#D42B2B), Bebas Neue + Inter fonts
- **Key files**:
  - `artifacts/coast2coast/src/App.tsx` — app entry point and router
  - `artifacts/coast2coast/src/pages/Home.tsx` — main single-page site
  - `artifacts/coast2coast/src/index.css` — theme and design tokens
  - Logo imported from `attached_assets/image_1775463095020.png` via `@assets` alias
