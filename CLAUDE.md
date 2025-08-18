# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Next.js frontend for egghead.io, an online learning platform. It requires the `egghead-rails` backend to be running for full functionality.

## Essential Commands

```bash
# Install dependencies (MUST use pnpm)
pnpm install

# Development
pnpm dev              # Start Next.js dev server on port 3000
pnpm dev:concurrent   # Run dev server + Inngest dev server

# Testing
pnpm test            # Run tests in watch mode
pnpm test:ci         # Run tests once (for CI)

# Code Quality
pnpm lint            # Run ESLint with auto-fix
pnpm format          # Run Prettier on all files
pnpm build           # Production build (also runs type checking)

# Sanity CMS
pnpm sanity          # Start Sanity Studio
```

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 14.2.4 with React 18.3.1
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: XState (state machines), React hooks, tRPC (server state)
- **Database**: Postgres
- **CMS**: Sanity
- **Video**: Mux
- **Payments**: Stripe
- **Authentication**: Custom auth via app.egghead.io
- **Search**: Typesense

### Directory Structure

```
src/
├── app/           # Next.js 13+ app directory (new routing)
├── pages/         # Legacy pages directory (being migrated)
├── components/    # React components (feature-based organization)
├── lib/           # Core utilities and API clients
├── server/        # tRPC routers and server-side logic
├── hooks/         # Custom React hooks
├── inngest/       # Event-driven background jobs
├── machines/      # XState state machines
└── utils/         # Pure utility functions
```

### Key Patterns

1. **Component Organization**: Feature-based folders (e.g., `components/workshop/claude-code/`)
2. **Path Aliases**: Use `@/` for imports from `src/` directory
3. **Data Fetching**: Use tRPC for type-safe API calls
4. **Styling**: Prefer Tailwind utilities, use CSS modules for complex styles
5. **State Machines**: Use XState for complex UI states
6. **Testing**: Co-locate tests in `__tests__` folders or `*.test.ts` files

## Development Setup

1. Ensure Node.js 18.17.1 is installed (check `.nvmrc`)
2. Install dependencies: `pnpm install`
3. Pull environment variables: `vercel env pull .env.local`
4. Start the Rails backend: `cd ../egghead-rails && foreman start`
5. Configure Stripe webhooks if working with payments
6. Start development: `pnpm dev`

## Testing Approach

- Jest with React Testing Library
- Tests live alongside source files
- Run single test: `pnpm test -- path/to/test`
- Mock external dependencies (Stripe, Mux, etc.)
- Use XState testing utilities for state machines

## Pre-commit Checks

Husky automatically runs:

1. Prettier formatting on all files
2. ESLint with auto-fix on TypeScript files

## Common Tasks

### Adding a New Page

- Use app directory: `src/app/your-page/page.tsx`
- Follow existing patterns for data fetching and layouts

### Creating Components

- Check existing components first for patterns
- Use TypeScript interfaces for props
- Follow accessibility best practices

### Working with tRPC

- Routers in `src/server/routers/`
- Use `trpc.useQuery()` for data fetching
- Type safety is automatic

### Sanity CMS

- Studio runs at `/studio`
- Schema files in `studio/schemas/`
- Use GROQ queries for data fetching

## Important Notes

- Always use `pnpm` (not npm or yarn)
- The project uses both app/ and pages/ directories (migration in progress)
- Environment variables come from Vercel
- Backend must be running for most features
- Check `src/lib/` for existing utilities before creating new ones

## Working with Course Builder Database

The project integrates with a separate Course Builder database for new course content. Key patterns:

### Database Connection

- Uses `mysql2/promise` with connection pooling
- Connection string from `COURSE_BUILDER_DATABASE_URL` env var
- Always use the existing `getConnectionPool()` function in `src/lib/get-course-builder-metadata.ts`

### Important Patterns

1. **Server-Side Only**: MySQL connections must run server-side only

   - Create wrapper functions that check `typeof window === 'undefined'`
   - Use dynamic imports inside the wrapper: `await import('./get-course-builder-metadata')`
   - Never import mysql2 directly in files that could be bundled for client
   - See `load-course-builder-metadata-wrapper.ts` for the pattern

2. **Query Patterns**:

   - Content is stored in `egghead_ContentResource` table
   - Use flexible slug matching: `id = ? OR JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) = ?`
   - Fields are JSON, parse with: `typeof row.fields === 'string' ? JSON.parse(row.fields) : row.fields`

3. **Content Types**:

   - Posts with `type = 'post'` and `fields.postType = 'course'` are courses
   - Video resources have `type = 'videoResource'`
   - Relationships via `egghead_ContentResourceResource` join table

4. **Error Handling**:
   - Always release connections in finally block: `conn.release()`
   - Return `null` for missing data, not errors
   - Log helpful debug messages for troubleshooting
