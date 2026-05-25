# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DTS Viewer — a Next.js web application for browsing and viewing [Distributed Text Services (DTS)](https://distributed-text-services.github.io/specifications/) API collections. Users enter a DTS API endpoint URL, and the app fetches and displays collections, resources, and navigation structures.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (static export)
npm run start    # Serve production build
npm run lint     # ESLint
```

## Architecture

- **Next.js 15** App Router with static export (`output: 'export'` in next.config.ts)
- **React 19**, **TypeScript 5** (strict), **Tailwind CSS v4** (via PostCSS)
- **Internationalization**: next-intl with locale-based routing (`/[locale]/`). Default locale is `ja`. Translations in `src/messages/{en,ja}.json`.
- **Theming**: next-themes for dark/light mode

### Key directories

- `src/app/[locale]/` — Route pages (SSG via `generateStaticParams`)
- `src/components/page/` — Main page components that render DTS data types (Collection, Resource, Navigation). `index.tsx` routes to the correct component based on the API response `@type` field.
- `src/components/layout/` — Header, Footer, theme/language toggles
- `src/lib/` — DTS data types and converters (`collection.ts`, `navigation.ts`, `entryPoint.ts`). Each has a TypeScript type and a `convert()` function for transforming API responses.
- `src/i18n/` — i18n routing and request config

### Data flow

1. User enters a DTS API endpoint URL in `url-form.tsx`
2. Client-side fetch retrieves the JSON response
3. Response `@type` determines which component renders (Collection, Resource, or Navigation)
4. `src/lib/*.ts` converters transform raw API data into typed objects
5. URL params (`base` and `url`) track the current endpoint state

### Path alias

`@/*` maps to `src/*` (configured in tsconfig.json).

### Environment variables

- `NEXT_PUBLIC_BASE_PATH` — Optional base path for deployment (used in next.config.ts)

## Code Style

- Prettier: semi, singleQuote, tabWidth 2, printWidth 100
- ESLint: `next/core-web-vitals` + `next/typescript`, `@next/next/no-img-element` off
- Client components marked with `'use client'`
