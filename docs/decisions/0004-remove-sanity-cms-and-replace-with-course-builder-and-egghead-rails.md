---
status: proposed
date: 2026-03-17
decision-makers: 'egghead engineering team'
consulted: 'Course Builder team (write API availability, videoResource schema, tip content model)'
informed: 'instructors using the upload workflow, content team managing editorial pages'
---

# Remove Sanity CMS and Replace with Course Builder and egghead-rails

## Context and Problem Statement

Sanity CMS is currently serving six distinct roles in `egghead-next`:

1. **Lesson metadata overlay** — every `loadLesson()` call fires a GROQ query to Sanity to enrich GraphQL data (transcript, description, tags, instructor). A Redis allowlist was introduced to skip this for lessons not in Sanity, but the call still happens for ~4% of lessons.
2. **Course metadata** — courses are hydrated with a Sanity GROQ query that provides lesson ordering, sections, dependencies, and instructor info. This is the primary source for the `/courses/[slug]` page overlay.
3. **Video resource storage** — `videoResource` documents in Sanity store `muxPlaybackId`, `muxAssetId`, `transcript`, `srt`, and `duration`. All video upload Inngest functions write to Sanity and read back from it.
4. **Tips feature** — Tips are native Sanity documents (`_type: "tip"`). The entire lifecycle (create, upload video, publish) runs through Sanity write operations.
5. **Editorial/static content** — 15 pages (blog, talks, case studies, guides, portfolios, curated learn pages) pull content exclusively from Sanity.
6. **Instructor creation workflow** — The upload form writes to Sanity, triggering webhooks → Inngest functions that create lessons/courses in egghead-rails and write Rails IDs back to Sanity.

The Course Builder system (MySQL, accessible via `COURSE_BUILDER_DATABASE_URL`) already stores `videoResource` and lesson data in `egghead_ContentResource`. `getCourseBuilderLesson()` in `src/lib/get-course-builder-metadata.ts` is already wired into `loadLesson()` as the third merge source. The egghead-rails system (Postgres, accessed via GraphQL at `NEXT_PUBLIC_AUTH_DOMAIN` and direct Postgres via `DATABASE_URL`) already contains the authoritative course and lesson catalogue.

Sanity adds operational overhead (separate service, API keys, webhook infrastructure, Redis allowlist), architectural complexity (three-way merges in `loadLesson()`), and a content editing surface (Sanity Studio) that is no longer the right tool given the Course Builder investment. The goal is to eliminate Sanity entirely.

## Decision Drivers

- Course Builder is the designated content platform going forward — new content is authored there, not in Sanity
- The Redis allowlist (`sanity-allowlist.ts`) was a band-aid over Sanity's latency; removing Sanity eliminates the need for it
- egghead-rails Postgres already has course and lesson metadata with high fidelity — Sanity was supplementing gaps that no longer exist
- `getCourseBuilderLesson()` already handles the transcript, muxPlaybackId, and repo_url overlay that Sanity was providing for newer content
- Sanity's write API is the last remaining strong coupling — the Inngest video upload pipeline and instructor workflow all write to Sanity
- 15 editorial pages powered by Sanity have low traffic and are candidates for archival or static content migration
- Maintaining two content pipelines (Sanity Studio + Course Builder) is a sustained cognitive and operational cost

## Considered Options

- **Option A: Remove Sanity, replace with Course Builder + egghead-rails** — the full removal described in this ADR
- **Option B: Keep Sanity read-only, remove write paths** — stop writing to Sanity from application code; keep it as a read source for editorial pages until they can be migrated individually
- **Option C: Keep Sanity for editorial content only, remove from data pipeline** — remove Sanity from lesson/course/video resource paths but retain Studio for blog, guides, case studies, and portfolios

## Decision Outcome

Chosen option: **Option A — Remove Sanity entirely**, because:

- Option B defers the hard work. A read-only Sanity still requires maintaining API keys, webhook configs, and the `@sanity/*` dependency tree. The allowlist and Redis caching complexity remains.
- Option C splits the goal. The editorial pages (blog, talks, case studies, portfolios) have low traffic and are either archivable or can be rebuilt as Course Builder `post` content. Keeping Sanity alive for them means keeping the entire dependency tree for a small surface area.
- Course Builder already has a `post` content type that maps to Sanity's `post`/`guide`/`caseStudy` documents. Editorial content migration is tractable.
- The operational cost of maintaining Sanity — keys, webhooks, the Studio deploy, the allowlist warm-up cron — is ongoing, not a one-time cost.

### Consequences

- Good, because `loadLesson()` becomes a two-source merge (GraphQL + Course Builder) instead of a three-way merge — simpler, faster, easier to reason about
- Good, because the Redis allowlist system (`src/lib/sanity-allowlist.ts`, `sanity:allowlist:lesson:*` and `sanity:allowlist:course:*` Upstash keys) is deleted entirely
- Good, because the cron job at `src/app/api/cron/route.ts` no longer needs to warm up the allowlist — reduced background load
- Good, because the instructor upload workflow becomes a direct Course Builder creation flow without a webhook hop through Sanity
- Good, because `@sanity/client`, `@sanity/image-url`, `@sanity/vision`, `@sanity/webhook`, `next-sanity`, `sanity`, `sanity-plugin-markdown`, and `groq` are all removed from `package.json`
- Good, because the `studio/` directory is deleted — one less service to deploy and maintain
- Bad, because 15 editorial pages currently return real content — they will return 404s or redirects until their content is migrated or archived; this is a content freeze risk if not communicated
- Bad, because Tips are entirely Sanity-native — there is no Course Builder `tip` schema today; this feature is blocked until Course Builder defines the `tip` content type
- Bad, because the video upload Inngest pipeline needs a Course Builder write API that does not currently exist in the form used here — the migration of those functions is gated on Course Builder exposing a write path
- Neutral, because instructor-specific curated search overlays (17 GROQ query files in `src/components/search/instructors/`) disappear — the base GraphQL instructor data remains, but the handcrafted Sanity overlays are lost

## Implementation Plan

### Phase ordering

Work in this order to minimize broken states. Each phase should be a separate PR.

**Phase 1 — Remove the Sanity lesson overlay (zero user-facing risk)**

- **Affected paths**:

  - `src/lib/lessons.ts`
  - `src/lib/sanity-allowlist.ts` — delete
  - `src/app/api/cron/route.ts`
  - `src/utils/lesson-metadata.ts`
  - `src/utils/__tests__/lesson-metadata.test.ts`
  - `src/lib/__tests__/load-lesson.integration.test.ts`

- **Changes**:

  - In `src/lib/lessons.ts`: delete `loadLessonMetadataFromSanity()`, `lessonQuery`, `SANITY_LESSON_CACHE_*` constants, `SanityLessonCacheValue` type, and `sanityLessonCacheKey()`. Remove the Sanity fetch call from `loadLesson()`. Remove the Sanity parameter from `mergeLessonMetadata()`. Remove imports: `sanityClient`, `groq`, `@/lib/sanity-allowlist`, Redis cache logic for Sanity keys.
  - In `src/utils/lesson-metadata.ts`: remove the second `sanityData` parameter from `mergeLessonMetadata()`. Course Builder data becomes the second source (was third).
  - In `src/app/api/cron/route.ts`: remove the two `refreshAllowlistIfStale()` calls and their import.
  - Delete `src/lib/sanity-allowlist.ts`.
  - After deployment: purge Upstash Redis keys `sanity:allowlist:lesson:slugs`, `sanity:allowlist:lesson:meta`, `sanity:allowlist:course:keys`, `sanity:allowlist:course:meta`.

- **Patterns to follow**: `getCourseBuilderLesson()` in `src/lib/get-course-builder-metadata.ts` is the model for how Course Builder data is merged into lesson metadata — follow the same pattern.
- **Patterns to avoid**: do not add any new `sanityClient.fetch()` calls; do not add any new GROQ queries.

---

**Phase 2 — Remove Sanity from course metadata (low risk)**

- **Affected paths**:

  - `src/lib/courses.ts`
  - `src/lib/course-resources.ts`
  - `src/lib/playlists.ts`

- **Changes**:

  - In `src/lib/courses.ts`: delete `loadCourseMetadata()`, `loadDraftSanityCourse()`, `loadDraftSanityCourseById()`, `loadSanityInstructorbyCourseId()`, the `courseQuery` GROQ constant, and the `SanityDraftCourse` / `SanityLesson` / `SanityInstructorSchema` Zod schemas. Remove `sanityClient` and `groq` imports.
  - In `src/lib/course-resources.ts`: delete `loadSanityCourseLessonSlugsByIdOrSlug()`. In `loadLegacyMergedLessons()`, remove the Sanity fallback branch — if Rails returns no lesson slugs, return empty rather than falling through to Sanity. Remove the import of `loadCourseMetadata`.
  - In `src/lib/playlists.ts`: remove the import and call to `sanityAllowlistAllowsCourse`. Remove the Sanity course metadata branch from `loadPlaylist()`.

- **Patterns to follow**: `loadPgCourseLessons()` in `src/lib/course-resources.ts` (Postgres direct query) and the GraphQL `loadRailsPlaylistLessonSlugs()` are the two remaining sources — preserve both.
- **Patterns to avoid**: do not call `loadCourseMetadata()` anywhere after this phase; do not import from `src/utils/sanity-client.ts` or `src/utils/sanity-server.ts`.

---

**Phase 3 — Replace Sanity video resource read/write paths (medium risk, gated on Course Builder write API)**

- **Affected paths**:

  - `src/lib/video-resources.ts`
  - `src/app/api/videos/[videoResourceId]/srt/route.ts`
  - `src/inngest/functions/video-uploaded.ts`
  - `src/inngest/functions/transcript-ready.ts`
  - `src/inngest/functions/mux/mux-webhooks-handlers.ts`
  - `src/inngest/functions/mux/add-srt-to-mux-asset.ts`

- **Changes**:

  - `src/lib/video-resources.ts`: rewrite `getVideoResource()` to query `egghead_ContentResource` in Course Builder by `id` (field: `id = ?`, `type = 'videoResource'`). Parse `fields` JSON. Return `{ _id, transcript: fields.transcript, muxPlaybackId: fields.muxPlaybackId }` to match the existing `VideoResourceSchema`.
  - `src/app/api/videos/[videoResourceId]/srt/route.ts`: replace `sanityQuery(...)` with a Course Builder DB query for `fields.srt` from `egghead_ContentResource`.
  - `src/inngest/functions/video-uploaded.ts`: replace Sanity `createOrReplace` mutation with a Course Builder write (INSERT INTO `egghead_ContentResource`). Replace Sanity module reference patch with Course Builder `egghead_ContentResourceResource` insert.
  - `src/inngest/functions/transcript-ready.ts`: replace Sanity `patch` with a Course Builder write to `fields.transcript` and `fields.srt`. Keep the Rails lesson update and Mux SRT event dispatch unchanged.
  - `src/inngest/functions/mux/mux-webhooks-handlers.ts`: replace `sanityMutation` duration update with Course Builder `fields.duration` update. Remove imports from `src/utils/sanity.fetch.only.server`.
  - `src/inngest/functions/mux/add-srt-to-mux-asset.ts`: replace Sanity fetch for `videoResource` with a Course Builder DB query. After adding SRT to Mux, update `fields.srt` in Course Builder instead of Sanity.

- **Patterns to follow**: `getCourseBuilderLesson()` and `getConnectionPool()` in `src/lib/get-course-builder-metadata.ts` — use the same pool pattern for reads. For writes, follow whatever Course Builder write API is available (HTTP API preferred over raw SQL writes to avoid schema drift).
- **Patterns to avoid**: do not import from `src/utils/sanity-server.ts` or `src/utils/sanity.fetch.only.server.ts`.

---

**Phase 4 — Remove Sanity from instructor creation workflow (high risk)**

- **Affected paths**:

  - `src/app/api/webhooks/sanity/route.ts` — delete
  - `src/pages/api/webhooks/sanity/videoResource/created.ts` — delete
  - `src/pages/api/webhooks/sanity/videoResource/updated.ts` — delete
  - `src/pages/api/sanity/lessons/create.ts` — delete
  - `src/inngest/events/sanity-course-document-created.ts` — delete
  - `src/inngest/events/sanity/webhooks/lesson/created.ts` — delete
  - `src/inngest/functions/create-lesson.ts` — delete and replace
  - `src/inngest/functions/create-course/index.ts` — rewrite trigger
  - `src/inngest/functions/create-course/utils/saveCourseDataToSanity.ts` — delete
  - `src/server/routers/instructor.ts` — rewrite Sanity operations against Course Builder
  - `src/pages/upload/index.tsx` — rewrite instructor fetch away from Sanity

- **Changes**:

  - Deregister Sanity webhooks in the Sanity dashboard (project `sb1i5dlc`) before or immediately after removing the route handlers.
  - Replace `createLesson` Inngest function trigger: instead of `SANITY_WEBHOOK_LESSON_CREATED`, trigger from a Course Builder event (e.g., `contentResource.created` with `type = 'lesson'`). Preserve the Rails lesson creation, Deepgram transcript order, and S3 upload logic.
  - In `create-course/index.ts`: replace `SANITY_COURSE_DOCUMENT_CREATED` trigger with a Course Builder course creation event. Remove the `add-rails-id-to-sanity` step entirely.
  - In `src/server/routers/instructor.ts`: replace all `sanityWriteClient` calls with Course Builder mutations. Replace `sanityClient.fetch()` calls for draft courses with Course Builder DB queries. The existing `loadDraftSanityCourseById()` and `loadSanityInstructorbyCourseId()` are deleted in Phase 2 — use Course Builder equivalents.
  - In `src/pages/upload/index.tsx`: fetch instructors from egghead-rails (`GET /api/v1/instructors`) instead of Sanity. Remove the `CourseData` type import from `src/pages/api/sanity/lessons/create.ts`.

- **Patterns to follow**: `loadCurrentUser()` in `src/lib/users.ts` for auth-gated instructor context. `getConnectionPool()` pattern for Course Builder DB access.
- **Patterns to avoid**: do not create new Sanity document types or new GROQ queries; do not call `@sanity/client` `createClient()` anywhere.

---

**Phase 5 — Migrate or retire Tips (blocked on Course Builder `tip` schema)**

- **Prerequisite**: Course Builder team confirms the `tip` content type in `egghead_ContentResource` (fields: `title`, `slug`, `state`, `description`, `body`, `summary`, `transcript`, `srt`, `muxPlaybackId`, `videoResourceId`, `tags`, `instructor`, `tweetId`, `sandpack`).

- **Affected paths**:

  - `src/lib/tips.ts`
  - `src/server/routers/tips.ts`
  - `src/inngest/functions/tip-video-uploaded.ts`

- **Changes** (once schema is confirmed):

  - `src/lib/tips.ts`: rewrite `getAllTips()` and `getTip()` to query `egghead_ContentResource WHERE type = 'tip'` in Course Builder. Parse `fields` JSON. Return objects matching `TipSchema`.
  - `src/server/routers/tips.ts`: replace `sanityWriteClient.create()` and `sanityWriteClient.fetch()` with Course Builder writes via the Course Builder API. Replace the `sanityInstructor` lookup with a Course Builder collaborator lookup.
  - `src/inngest/functions/tip-video-uploaded.ts`: replace Sanity reads and patches with Course Builder equivalents. Keep the Mux asset creation logic.

- **Data migration**: before decommissioning Sanity, export all `_type == "tip"` documents from Sanity project `sb1i5dlc` and import into Course Builder `egghead_ContentResource`.

---

**Phase 6 — Archive editorial content pages**

- **Affected paths** (all 15 pages listed below):

  - `src/pages/blog/[slug].tsx`, `src/pages/blog/index.tsx`
  - `src/pages/talks/index.tsx`
  - `src/pages/case-studies/[slug].tsx`, `src/pages/case-studies/index.tsx`
  - `src/pages/cloudflare.tsx`
  - `src/pages/portfolios/[slug].tsx`, `src/pages/portfolios/index.tsx`
  - `src/pages/developer-portfolio-foundations/[slug].tsx`
  - `src/pages/learn/developer-portfolio/index.tsx`
  - `src/pages/learn/digital-gardening/index.tsx`
  - `src/pages/learn/state-management/index.tsx`
  - `src/pages/own-your-online-presence/[slug].tsx`
  - `src/pages/projects/build-modern-layouts-with-css-grid/index.tsx`
  - `src/pages/projects/the-beginner-s-guide-to-vue-3/index.tsx`

- **Action**: Before removing pages, export all content from Sanity (GROQ: `*[_type in ["post","guide","caseStudy","portfolio","resource"]]`) as JSON. Store the export in `docs/sanity-content-export/`. Then replace `getStaticProps`/`getServerSideProps` in each page to return `{ notFound: true }` (or a redirect to `/`). Add a `next.config` redirect for any URLs that had meaningful SEO value.

- **Also delete**:
  - `src/lib/guides.ts`
  - `src/lib/articles.ts`
  - `src/components/search/curated/css/sanity-loading-data.tsx`
  - All 17 per-instructor GROQ query files under `src/components/search/instructors/` (keep the `index.tsx` shell)

---

**Phase 7 — Remove curated tag/instructor overlays**

- **Affected paths**:

  - `src/lib/tags.ts`
  - `src/lib/instructors.ts`
  - `src/hooks/use-load-topic-data.ts`
  - `src/components/search/curated/react/index.tsx`
  - `src/components/search/curated/remix/index.tsx`

- **Changes**:
  - `src/lib/tags.ts`: delete `loadSanityTag()`, `canLoadSanityTag()`, `sanityTagPageHash`, and the three curated query imports (`reactPageQuery`, `nextPageQuery`, `remixPageQuery`). Keep `getTags()`, `getTag()`, and `loadTag()`.
  - `src/lib/instructors.ts`: delete `loadSanityInstructor()`, `canLoadSanityInstructor()`, `loadSanityInstructorByEggheadId()`, `loadInstructorWipContent()`, and the `sanityInstructorHash` with all 17 imports. Remove `sanityClient` and `groq` imports. Keep `loadInstructor()` and `loadInstructors()`.
  - `src/hooks/use-load-topic-data.ts`: remove the Sanity client-side fetch branch; simplify to GraphQL data only.

---

**Phase 8 — Delete utility files and packages**

Run only after `rg -r "sanity" src/ --type ts --type tsx` returns no results.

- **Files to delete**:

  ```
  src/utils/sanity-client.ts
  src/utils/sanity-server.ts
  src/utils/sanity.fetch.only.server.ts
  src/lib/sanity-allowlist.ts          (deleted in Phase 1)
  studio/                              (entire directory)
  ```

- **Packages to remove**:

  ```bash
  pnpm remove @sanity/client @sanity/image-url @sanity/vision @sanity/webhook \
              next-sanity sanity sanity-plugin-markdown groq
  ```

- **Scripts to remove from `package.json`**:

  - `"sanity": "cd studio && sanity dev"`
  - `"sanity:deploy": "cd studio && sanity deploy"`

- **Environment variables to remove** from all `.env.*` files and Vercel project settings:
  ```
  NEXT_PUBLIC_SANITY_PROJECT_ID
  NEXT_PUBLIC_SANITY_DATASET
  NEXT_PUBLIC_SANITY_API_VERSION
  NEXT_PUBLIC_SANITY_PUBLIC_KEY
  SANITY_EDITOR_TOKEN
  SANITY_WEBHOOK_SIGNATURE_SECRET
  SANITY_WEBHOOK_CREATED_SECRET
  SANITY_WEBHOOK_SECRET
  SANITY_API_TOKEN
  SANITY_STUDIO_PROJECT_ID
  SANITY_STUDIO_API_VERSION
  SANITY_STUDIO_DATASET
  SANITY_ALLOWLIST_MAX_AGE_SECONDS
  ```

### Verification

- [ ] `rg -r "sanity" src/ --type-add 'tsx:*.tsx' -t ts -t tsx --iglob '!*.test.*'` returns zero results
- [ ] `rg -r "groq" src/ --type-add 'tsx:*.tsx' -t ts -t tsx` returns zero results
- [ ] `pnpm build` completes without errors after package removal
- [ ] `pnpm test:ci` passes — no test references `sanityClient`, `sanityWriteClient`, `sanityQuery`, or `sanityMutation`
- [ ] `curl https://<deploy-url>/api/videos/<any-video-resource-id>/srt` returns a response (not 500)
- [ ] Lesson pages (`/lessons/<slug>`) load correctly — transcript and mux playback ID are populated from Course Builder
- [ ] Course pages (`/courses/<slug>`) load correctly — lesson list is populated from Postgres/GraphQL
- [ ] The upload page (`/upload`) loads without errors and the instructor dropdown is populated from egghead-rails
- [ ] `package.json` contains no `@sanity/*`, `next-sanity`, `sanity`, `sanity-plugin-markdown`, or `groq` entries
- [ ] The `studio/` directory does not exist in the repository
- [ ] Sanity webhooks are deregistered in the Sanity dashboard (project `sb1i5dlc`) — no webhook deliveries succeed to the removed endpoints
- [ ] Upstash Redis keys `sanity:allowlist:*` are deleted
- [ ] No Sanity environment variables exist in Vercel project settings

## Pros and Cons of the Options

### Option A: Remove Sanity entirely (chosen)

- Good, because eliminates an entire external service dependency (API keys, webhooks, Studio deployment)
- Good, because removes the three-way merge complexity in `loadLesson()` — Course Builder becomes the single overlay source
- Good, because deletes the Redis allowlist system — ~150 lines of complexity and ongoing Redis traffic gone
- Good, because reduces `package.json` by 7 Sanity-related packages
- Good, because Course Builder is the strategic content platform — removing Sanity creates alignment
- Bad, because the Tips feature has no Course Builder schema yet — this work is blocked until Course Builder defines it
- Bad, because 15 editorial pages go dark or are archived — content freeze risk if not coordinated with content team
- Bad, because the video upload Inngest pipeline needs a Course Builder write API that may not be fully ready

### Option B: Keep Sanity read-only, remove write paths

- Good, because editorial pages keep working without content migration
- Good, because Tips keep working without a Course Builder schema
- Bad, because Sanity API keys, webhooks, and packages stay in the codebase indefinitely
- Bad, because the allowlist system, Redis caching, and three-way merge complexity all remain
- Bad, because "read-only for now" tends to persist — the migration never gets completed

### Option C: Keep Sanity for editorial content only, remove from data pipeline

- Good, because editorial pages (blog, talks, case studies) keep working
- Good, because Tips keep working
- Good, because the highest-traffic paths (lessons, courses) are cleaned up
- Bad, because Sanity packages, API keys, and Studio remain in the project
- Bad, because the Sanity client utilities (`sanity-client.ts`, `sanity-server.ts`) must remain — a future agent might use them for new code
- Bad, because the split creates ambiguity about which system owns what — Course Builder for structured content, Sanity for editorial, with no clear migration path

## More Information

**Sanity project details**: project ID `sb1i5dlc`, dataset `production`. API version `2021-10-21` (legacy) and `2023-01-03` (newer calls). Export content before decommissioning.

**Course Builder database**: accessed via `COURSE_BUILDER_DATABASE_URL` (MySQL). Connection pooling pattern is in `src/lib/get-course-builder-metadata.ts`. Content lives in `egghead_ContentResource` (primary table), `egghead_ContentResourceResource` (relationships), and `egghead_User` (authors).

**Course Builder write API**: as of the time this ADR was written, the Course Builder integration in `egghead-next` is read-only. Phase 3 and Phase 4 are gated on a write path being available. This should be the first dependency to resolve before starting Phase 3.

**Tips content type**: the Sanity `tip` schema has fields that need mapping: `title`, `slug.current`, `state` (`new|processing|reviewing|published|retired`), `description`, `body`, `summary`, `transcript`, `srt`, `muxPlaybackId`, `videoResourceId` (Sanity `_id`), `softwareLibraries` (tag refs), `collaborators` (instructor ref), `tweetId`, `sandpack` (array of `{file, code, active}`). Confirm with Course Builder team which of these map to `fields` JSON vs. relational tables.

**Redis cleanup**: after Phase 1 ships, delete Upstash Redis keys matching `sanity:allowlist:*`. These are populated by the cron job that will be removed.

**`groq` package**: used only as a tagged template literal for syntax highlighting on GROQ query strings. No GROQ query execution happens outside of Sanity API calls. The package is safe to remove once all GROQ strings are gone.

**Revisit conditions**: if Course Builder is deprecated or replaced before Phase 5 (Tips) is complete, reconsider the tip content migration target. If egghead-rails introduces a content API that covers transcript and video resource data, Phase 3 could simplify further.
