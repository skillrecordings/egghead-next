# Direct PG course shell for `/courses/[course]`

## Status

accepted

## Date

2026-03-10

## Context

This ADR is a concrete implementation slice of `migrate-egghead:17` (the direct-Postgres strangler-fig strategy for egghead-next).

`/courses/[course]` is one of the highest-traffic and slowest routes in egghead-next.

Historically the page builds its lesson list by:

1. loading playlist/course metadata from Rails GraphQL
2. resolving lesson membership from Rails GraphQL
3. loading each lesson individually through the legacy merge stack
   - Rails GraphQL
   - Sanity
   - Course Builder

That creates an N+1 waterfall for the shared course shell.

At the same time, the risky business logic is mostly **not** in the course shell:

- pro-media gating (`hls_url`, `dash_url`, downloads) lives on lesson/media fields
- draft/instructor/staff access is already handled separately in page logic
- course page lesson lists mostly need shared metadata: title, slug, path, duration

egghead-next also already uses **CASL** (`src/server/ability.ts`) for some RBAC checks, but today that surface is narrow and does **not** replace Rails CanCan query filtering.

## Decision

Take a first swing by replacing `loadResourcesForCourse()` membership + per-lesson waterfall with a direct Postgres query against Rails tables:

- `playlists`
- `tracklists`
- `lessons`

This first swing is intentionally scoped to the **public/shared course shell**.

### Implemented in the first swing

- public/shared course lesson shell only
- preserve ordering for top-level lessons and one-level nested playlists
- preserve existing fallback path when PG returns nothing or errors
- do **not** move media permission logic yet

### Expanded in the second swing

- split public course loading from authenticated course bits
- keep the public course shell PG-first and token-free
- keep favorite / RSS / other user-specific course bits behind a separate authenticated seam
- mark responses with authenticated course bits as `private, no-store`
- add a narrower CASL permission surface for lesson-media style actions instead of recreating Rails CanCan query behavior

### Auth hardening refinement

Public course-shell fallbacks must remain token-free even when the browser has a
stale local session. Auth failures in `/courses/[course]` recovery paths must
degrade to anonymous behavior instead of triggering another brittle auth lookup
that can turn a recoverable `401/403` into an SSR `500`.

### Permission boundary going forward

We will **not** port Rails CanCan 1:1 into egghead-next.

Instead, the system is split into two layers:

#### 1. Public content shell

This should be:

- PG-driven
- cacheable
- mostly auth-agnostic

Examples:

- course metadata
- ordered lesson list
- instructor/tag shell data
- public lesson metadata that does not reveal gated media

#### 2. Authorized media and privileged actions

This should be handled explicitly behind a narrower permission boundary using egghead-next's existing **CASL** model.

Examples:

- `hls_url`
- `dash_url`
- `download_url`
- staff notes
- `lesson_view_url`
- instructor/staff/editor actions

The goal is to use CASL for **policy decisions** in egghead-next while keeping public content queries simple and cache-friendly.

### What CASL is for here

CASL should answer questions like:

- can this viewer access lesson media?
- can this viewer download this lesson?
- can this viewer perform instructor/editor actions?

CASL should **not** become a recreation of every Rails `accessible_by(...)` query path.

## Consequences

### Positive

- removes the biggest course-page N+1 offender
- keeps the initial change away from pro-media permission logic
- creates a safe seam for later full content-service work
- gives us a cache-friendly shared lesson list payload
- simplifies the mental model: **public shell vs gated media**
- lets egghead-next use CASL where it actually helps, instead of dragging Rails CanCan query logic into every fetch

### Negative

- does not yet solve personalized course data
- still leaves Rails GraphQL in place for some course metadata
- one-level nested playlist flattening matches current behavior, but deeper recursion is still not handled
- lesson/media access still needs a follow-up abstraction before more direct-PG migration there is safe

## Follow-up

1. split public course shell loading from authenticated/personalized data
2. move playlist/course metadata onto direct PG as well
3. add explicit cache-policy instrumentation so we know why Vercel is still missing
4. expand CASL in egghead-next for media/download/view-style checks
5. add a focused helper such as `canViewLessonMedia()` rather than spreading permission logic across loaders
6. tackle lesson-page media gating separately with permission-aware logic
