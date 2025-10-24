# Workshop Event Database Migration proposal

**Date**: 2025-09-29
**Purpose**: Research migrating Claude Code workshop event data from Vercel KV to Course Builder database

---

## Executive Summary

This document analyzes the current workshop event data loading mechanism (Vercel KV/Edge Config) and proposes migration strategies to use the Course Builder database as the primary data source.

**✨ UPDATED RECOMMENDATION (2025-10-07)**: Implement a **fully dynamic, database-driven architecture** using Next.js App Router with React Server Components. This eliminates hard-coded workshop routes (claude-code, cursor) in favor of a single dynamic route that loads all page content from Course Builder events, enabling new workshop launches without code deployments.

---

## Table of Contents

1. [Current Implementation](#1-current-implementation)
2. [Course Builder Database Structure](#2-course-builder-database-structure)
3. [Reference Pattern: Post Loading](#3-reference-pattern-post-loading)
4. [**NEW: Dynamic Workshop Architecture**](#4-dynamic-workshop-architecture-app-router) ⭐
5. [Migration Strategies](#5-migration-strategies)
6. [Migration Considerations](#6-migration-considerations)
7. [Recommended Migration Path](#7-recommended-migration-path)
8. [Technical Decisions Summary](#8-technical-decisions-summary)
9. [Implementation Checklist](#9-implementation-checklist)
10. [Rollback Plan](#10-rollback-plan)
11. [Success Metrics](#11-success-metrics)
12. [Conclusion](#12-conclusion)
13. [Appendices](#appendix-a-reference-links)

---

## 1. Current Implementation

### 1.1 Data Storage: Vercel Edge Config (KV)

**Storage Key**: `featureFlagClaudeCodeWorkshopSale_workshop`

**Data Structure** (validated by `LiveWorkshopSchema`):

```typescript
{
  date: string,              // "2025-02-20"
  startTime: string,         // "9:00 AM"
  endTime: string,           // "5:00 PM"
  timeZone: string,          // "Pacific Time (PST)"
  utcOffset: string,         // "UTC-8"
  isSaleLive: boolean,       // Controls if workshop is on sale
  isEuFriendly: boolean,     // Indicates EU-friendly timing
  isEarlyBird: boolean,      // Enables early bird pricing
  productId: string,         // Stripe product ID
  workshopPrice: string,     // "$499"
  stripePaymentLink: string, // Direct Stripe checkout URL
  stripeEarlyBirdMemberCouponCode: string,
  stripeMemberCouponCode: string,
  stripeEarlyBirdCouponCode: string,
  stripeEarlyBirdMemberDiscount: string,
  stripeMemberDiscount: string,
  stripeEarlyBirdNonMemberDiscount: string,
}
```

### 1.2 Implementation Files

**tRPC Router** (`src/server/routers/feature-flag.ts`):

```typescript
export const featureFlagRouter = router({
  getLiveWorkshop: baseProcedure
    .input(z.object({flag: z.string()}))
    .query(async ({input, ctx}) => {
      const workshop = await getFeatureFlag(input.flag, 'workshop')
      const parsedWorkshop = LiveWorkshopSchema.parse(workshop)
      return parsedWorkshop
    }),
})
```

**Feature Flag Library** (`src/lib/feature-flags.ts`):

```typescript
export async function getFeatureFlag(prefix: string, key: keyof FeatureFlags) {
  if (!process.env.FEATURE_FLAGS_EDGE_CONFIG) return false
  const prefixedKey = prefixKey(prefix, key)
  const edgeConfig = createClient(process.env.FEATURE_FLAGS_EDGE_CONFIG)
  const featureFlag = await edgeConfig.get<FeatureFlags>(prefixedKey)
  return featureFlag
}
```

### 1.3 Usage Pattern

**Workshop Page** (`src/pages/workshop/claude-code/index.tsx`):

```typescript
const {data: liveWorkshop, isLoading: isLiveWorkshopLoading} =
  trpc.featureFlag.getLiveWorkshop.useQuery({
    flag: 'featureFlagClaudeCodeWorkshopSale',
  })

// Data flows to:
<Hero formRef={formRef} saleisActive={saleisActive} workshop={liveWorkshop} />
<ActiveSale hasYearlyProDiscount={...} workshop={liveWorkshop} />
```

### 1.4 Dependencies

Files that reference this feature flag:

- `src/pages/workshop/claude-code/index.tsx` - Main workshop page
- `src/pages/workshop/claude-code/boss.tsx` - Private workshop variant
- `src/components/app/header/index.tsx` - Header banner
- `src/components/workshop/claude-code/workshop-cta.tsx` - CTA component
- `src/inngest/utils/stripe-webhook-utils.ts` - Payment processing
- `src/inngest/utils/specific-product-helpers.ts` - Product helpers

---

## 2. Course Builder Database Structure

### 2.1 Database Schema

**Table**: `egghead_ContentResource`

**Key Columns**:

- `id` (string): Primary key (e.g., "kcd8u8qow000008jo5e3y4a0z")
- `type` (string): Resource type - `'event'` for workshop events
- `fields` (JSON): Contains all event-specific data
- `createdById` (string): User who created the event
- `createdAt`, `updatedAt`, `deletedAt` (datetime): Timestamps
- `currentVersionId` (string): Version tracking
- `organizationId` (string): Organization reference

### 2.2 Event Fields JSON Structure

Stored in the `fields` column:

```typescript
{
  // Core Event Info
  title: string,                    // "Claude Code Power-User Workshop"
  description?: string,             // Short description
  details?: string,                 // Long-form details
  slug: string,                     // "claude-code-feb-2025"

  // State Management
  state: 'draft' | 'published' | 'archived' | 'deleted',
  visibility: 'public' | 'unlisted' | 'private',

  // Timing
  startsAt: string,                 // ISO datetime: "2025-02-20T17:00:00.000Z"
  endsAt: string,                   // ISO datetime
  timezone: string,                 // "America/Los_Angeles"

  // Content
  body?: string,                    // Markdown content
  attendeeInstructions?: string,    // Instructions for attendees

  // Media
  image?: string,                   // Event thumbnail
  socialImage?: {
    type: string,
    url: string
  },
  thumbnailTime?: number,

  // Configuration
  calendarId?: string,              // Calendar integration
  featured?: boolean,               // Feature on homepage

  // Custom fields (can be added as needed)
  // pricing, coupons, etc.
}
```

### 2.3 Active Event Detection

Based on course-builder patterns, an event is considered "active" when:

1. ✅ `type = 'event'`
2. ✅ `fields.state = 'published'`
3. ✅ `fields.visibility = 'public'`
4. ✅ Event is not in the past: `endsAt >= now()` (or `startsAt` if `endsAt` missing)
5. ✅ Product has availability: `quantityAvailable > 0` OR `totalQuantity = -1` (unlimited)

**Reference Query Pattern** (from course-builder):

```typescript
const events = await db.query.contentResource.findMany({
  where: and(
    eq(contentResource.type, 'event'),
    eq(sql`JSON_EXTRACT (${contentResource.fields}, "$.state")`, 'published'),
    eq(sql`JSON_EXTRACT (${contentResource.fields}, "$.visibility")`, 'public'),
    // Exclude past/sold-out events via helper function
  ),
  orderBy: asc(sql`JSON_EXTRACT (${contentResource.fields}, "$.startsAt")`),
})
```

### 2.4 Related Tables

**Products** (`egghead_Product`):

- Linked via `egghead_ContentResourceProduct` join table
- Contains pricing, quantity, Stripe product ID
- Fields: `id`, `name`, `status`, `quantityAvailable`, `totalQuantity`, etc.

**Purchases** (`egghead_Purchase`):

- Tracks who bought the event
- Linked via `egghead_PurchaseProduct` join table

---

## 3. Reference Pattern: Post Loading

The codebase has a well-established pattern for loading posts from the Course Builder database that we can follow.

### 3.1 File Structure

Following the code organization guidelines from `CLAUDE.md`:

```
src/
├── schemas/
│   └── post.ts                # Zod schemas and TypeScript types
├── lib/
│   ├── db.ts                  # Database connection pool (mysql2)
│   ├── posts-query.ts         # Main export file
│   └── posts/
│       ├── get-post.ts        # Main data fetching
│       ├── get-tags.ts        # Related data fetching
│       ├── get-course.ts      # Associated data
│       └── utils.ts           # Utility functions
└── pages/
    └── [post].tsx             # Page orchestration (262 lines after refactor)
```

### 3.2 Implementation Pattern

**Schema Definition** (`src/schemas/post.ts`):

```typescript
export const PostSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
  fields: FieldsSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  // ...
})

export type Post = z.infer<typeof PostSchema>
```

**Database Query** (`src/lib/posts/get-post.ts`):

```typescript
'use server'

import {RowDataPacket} from 'mysql2/promise'
import {PostSchema} from '@/schemas/post'
import {getPool} from '../db'

export async function getPost(slug: string) {
  const {hashFromSlug} = parseSlugForHash(slug)
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    // Query using JSON_EXTRACT for JSON fields
    const [postRows] = await conn.execute<RowDataPacket[]>(
      `SELECT cr_lesson.*, egh_user.name, egh_user.image
       FROM egghead_ContentResource cr_lesson
       LEFT JOIN egghead_User egh_user ON cr_lesson.createdById = egh_user.id
       WHERE (cr_lesson.id = ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ?
              OR cr_lesson.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) LIKE ?)
       LIMIT 1`,
      [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`],
    )

    const postRow = postRows[0]
    if (!postRow) return null

    // Validate with Zod
    const postData = PostSchema.safeParse(postRow)
    if (!postData.success) {
      throw new Error(`Invalid post data: ${postData.error.message}`)
    }

    return {post: postData.data /* ... */}
  } finally {
    conn.release() // Always release connection
  }
}
```

**Connection Pool** (`src/lib/db.ts`):

```typescript
import {createPool, Pool} from 'mysql2/promise'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = createPool({
      uri: process.env.COURSE_BUILDER_DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}
```

### 3.3 Key Pattern Elements

✅ Uses `mysql2/promise` with connection pooling (NOT Drizzle ORM)
✅ `'use server'` directive for server-side operations
✅ JSON extraction with `JSON_EXTRACT` and `JSON_UNQUOTE`
✅ Flexible slug matching (exact match OR hash match)
✅ Zod validation for type safety
✅ Connection release in `finally` block
✅ Separation of concerns (schemas, queries, utilities, pages)

---

## 4. Dynamic Workshop Architecture (App Router)

**Date Added**: 2025-10-07
**Status**: Recommended Approach ⭐

### 4.1 Problem with Current Hard-Coded Routes

The current implementation has significant limitations:

**Current Structure**:

```
src/pages/workshop/
├── claude-code/index.tsx  (hard-coded content)
├── cursor/index.tsx       (hard-coded content)
```

**Issues**:

1. ❌ Each new workshop topic requires code deployment
2. ❌ Content is hard-coded in TSX files (difficult for non-devs to edit)
3. ❌ Can't easily iterate on messaging without code changes
4. ❌ Duplicated logic across workshop-specific components
5. ❌ No single source of truth for workshop content

### 4.2 Proposed Dynamic Architecture

**New Structure** (App Router with RSC):

```
src/app/workshop/
├── page.tsx              # Redirects to featured workshop
├── [slug]/
│   └── page.tsx         # Dynamic workshop page (RSC)
└── _components/
    ├── hero.tsx
    ├── testimonial.tsx
    ├── features-section.tsx
    ├── cta-section.tsx
    └── mdx-components.tsx
```

**Key Benefits**:

- ✅ **Single Dynamic Route**: One template handles all workshops
- ✅ **Content in Course Builder**: Non-technical staff can edit workshop pages
- ✅ **No Code Deployments**: Launch new workshops by creating events in CMS
- ✅ **React Server Components**: Load data on server, better performance
- ✅ **MDX Support**: Rich content with custom components via `next-mdx-remote`
- ✅ **Featured Toggle**: Change primary workshop with `featured` flag

### 4.3 Component Analysis from Current Implementation

**Components Used Across Both Workshops**:

| Component            | Usage                 | Location             | Notes                           |
| -------------------- | --------------------- | -------------------- | ------------------------------- |
| `Hero`               | Hero section with CTA | Workshop-specific    | Pass workshop data as props     |
| `Markdown`           | Content rendering     | Shared               | Replace with MDX for more power |
| `Testimonial`        | Social proof          | Shared               | Reusable                        |
| `TestimonialBar`     | Multiple testimonials | Cursor-specific      | Make generic                    |
| `Features`           | Feature list section  | Cursor-specific      | Make generic                    |
| `Instructor`         | Instructor bio        | Shared               | Already shared                  |
| `InstructorTerminal` | Code demo             | Claude Code-specific | Make optional                   |
| `WorkshopHistory`    | Past workshop list    | Claude Code-specific | Make optional                   |
| `ActiveSale`         | Pricing/purchase UI   | Workshop-specific    | Unify into shared               |
| `CtaSection`         | CTA with forms        | Shared               | Already shared                  |
| `SignUpForm`         | Email capture         | Workshop-specific    | Make generic                    |

**Content Types Identified**:

1. **Hero Section**: Headline, subheadline, CTA, background image
2. **Body Sections**: Multiple markdown/MDX content blocks with headings
3. **Testimonials**: Scattered throughout page
4. **Features/Benefits**: Bullet lists, formatted sections
5. **Pricing**: Dynamic based on user subscription status
6. **Schedule**: Workshop timing and agenda (optional)
7. **Instructor Bio**: Info about workshop leader
8. **SEO Metadata**: Title, description, OG image

### 4.4 Enhanced Event Schema for Full Page Content

Extend `EventFieldsSchema` to support complete workshop pages:

```typescript
// In src/schemas/event.ts - Enhanced for full page content
export const EventFieldsSchema = z.object({
  // ... existing fields (title, slug, startsAt, etc.)

  // === HERO SECTION ===
  heroHeadline: z.string().optional(), // "Become a Claude Code Power-User"
  heroSubheadline: z.string().optional(), // "Master AI workflows in one day"
  heroImage: z.string().optional(), // Cloudinary URL
  heroBackgroundImage: z.string().optional(), // Background image
  heroCta: z.string().optional(), // CTA button text

  // === PAGE CONTENT (MDX) ===
  body: z.string().optional(), // Main MDX content for page body
  // Sections will be defined with heading markers in MDX:
  // ## Section 1 Heading
  // Content here...
  // ## Section 2 Heading
  // More content...

  // === FEATURES/BENEFITS ===
  features: z.array(z.string()).optional(), // Live workshop features list
  teamFeatures: z.array(z.string()).optional(), // Team workshop features
  benefits: z.array(z.string()).optional(), // Key workshop benefits

  // === TESTIMONIALS ===
  testimonials: z
    .array(
      z.object({
        quote: z.string(),
        name: z.string(),
        image: z.string().optional(),
        role: z.string().optional(),
        link: z.string().optional(),
      }),
    )
    .optional(),

  // === INSTRUCTOR ===
  instructorName: z.string().optional(), // "John Lindquist"
  instructorBio: z.string().optional(), // MDX content
  instructorImage: z.string().optional(), // Profile photo
  instructorRole: z.string().optional(), // "Creator of egghead.io"

  // === SCHEDULE (Optional) ===
  schedule: z
    .array(
      z.object({
        time: z.string(),
        title: z.string(),
        description: z.string().optional(),
      }),
    )
    .optional(),

  // === PAGE LAYOUT OPTIONS ===
  showInstructorSection: z.boolean().default(true),
  showHistorySection: z.boolean().default(false),
  showTestimonialBar: z.boolean().default(false),
  customComponents: z.array(z.string()).optional(), // ['InstructorTerminal', 'WorkshopHistory']

  // === SEO ===
  seo: z
    .object({
      title: z.string(),
      description: z.string(),
      ogImage: z.string(),
      ogImageWidth: z.number().optional(),
      ogImageHeight: z.number().optional(),
    })
    .optional(),

  // === EXISTING WORKSHOP FIELDS ===
  isSaleLive: z.boolean().optional(),
  isEarlyBird: z.boolean().optional(),
  workshopPrice: z.string().optional(),
  stripeProductId: z.string().optional(),
  stripePaymentLink: z.string().optional(),
  coupons: WorkshopCouponsSchema.optional(),
  discounts: WorkshopDiscountsSchema.optional(),
})
```

### 4.5 App Router File Structure

**Complete App Router Implementation**:

```
src/app/workshop/
├── page.tsx                          # Featured workshop redirect
├── [slug]/
│   ├── page.tsx                      # Main workshop page (RSC)
│   ├── loading.tsx                   # Loading skeleton
│   └── not-found.tsx                 # 404 page
│
├── _components/                      # Shared workshop components
│   ├── workshop-hero.tsx             # Hero section (generic)
│   ├── workshop-content.tsx          # MDX content renderer
│   ├── workshop-features.tsx         # Features list
│   ├── workshop-testimonials.tsx     # Testimonial display
│   ├── workshop-cta.tsx              # CTA section
│   ├── workshop-pricing.tsx          # Pricing display
│   ├── workshop-schedule.tsx         # Schedule (optional)
│   ├── workshop-instructor.tsx       # Instructor bio
│   └── mdx/                          # MDX custom components
│       ├── index.tsx                 # MDX components export
│       ├── testimonial.tsx           # <Testimonial /> in MDX
│       ├── feature-list.tsx          # <FeatureList /> in MDX
│       ├── cta-box.tsx               # <CtaBox /> in MDX
│       └── instructor-terminal.tsx   # <InstructorTerminal /> in MDX
│
└── _lib/
    └── get-workshop.ts               # Workshop data fetching
```

### 4.6 Implementation Details

#### 4.6.1 Featured Workshop Redirect

**File**: `src/app/workshop/page.tsx`

```typescript
import {redirect} from 'next/navigation'
import {getPrimaryWorkshop} from '@/lib/events/get-event'

export default async function WorkshopIndexPage() {
  // Get the featured workshop
  const primaryWorkshop = await getPrimaryWorkshop('*') // Match any workshop type

  if (!primaryWorkshop) {
    // No featured workshop, show a coming soon page or 404
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Workshops Available</h1>
          <p className="text-gray-600">
            Check back soon for upcoming workshops!
          </p>
        </div>
      </div>
    )
  }

  // Redirect to the featured workshop
  redirect(`/workshop/${primaryWorkshop.fields.slug}`)
}

// Opt out of caching for this page to always show latest featured workshop
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

#### 4.6.2 Dynamic Workshop Page (RSC)

**File**: `src/app/workshop/[slug]/page.tsx`

```typescript
import {notFound} from 'next/navigation'
import {getEventBySlug} from '@/lib/events/get-event'
import {transformEventToWorkshop} from '@/lib/events/transform-event-to-workshop'
import {MDXRemote} from 'next-mdx-remote/rsc'
import {mdxComponents} from '../_components/mdx'

import WorkshopHero from '../_components/workshop-hero'
import WorkshopTestimonials from '../_components/workshop-testimonials'
import WorkshopFeatures from '../_components/workshop-features'
import WorkshopCta from '../_components/workshop-cta'
import WorkshopInstructor from '../_components/workshop-instructor'

// Optional custom components
import InstructorTerminal from '@/components/workshop/claude-code/instructor-terminal'
import WorkshopHistory from '@/components/workshop/claude-code/workshop-history'

type Props = {
  params: {slug: string}
}

export default async function WorkshopPage({params}: Props) {
  // Fetch workshop event from Course Builder
  const event = await getEventBySlug(params.slug)

  if (!event || event.type !== 'event') {
    notFound()
  }

  const {fields} = event

  // Transform to LiveWorkshop format for pricing components
  const workshop = transformEventToWorkshop(event)

  // Custom component map
  const customComponentMap = {
    InstructorTerminal,
    WorkshopHistory,
  }

  return (
    <main className="min-h-screen relative bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <WorkshopHero
        headline={fields.heroHeadline || fields.title}
        subheadline={fields.heroSubheadline}
        image={fields.heroImage}
        backgroundImage={fields.heroBackgroundImage}
        workshop={workshop}
      />

      {/* Optional Testimonial Bar */}
      {fields.showTestimonialBar && fields.testimonials && (
        <WorkshopTestimonials
          testimonials={fields.testimonials.slice(0, 3)}
          variant="bar"
        />
      )}

      {/* Main Content (MDX) */}
      <section className="relative z-10 pb-8">
        {fields.body && (
          <article className="prose-base w-full sm:prose-lg md:prose-xl mx-auto">
            <MDXRemote
              source={fields.body}
              components={{
                ...mdxComponents,
                // Inject workshop data into MDX components
                Testimonial: (props) => <Testimonial {...props} />,
                Features: () => <WorkshopFeatures features={fields.features} />,
              }}
            />
          </article>
        )}

        {/* Inject custom components based on event config */}
        {fields.customComponents?.map((componentName) => {
          const Component = customComponentMap[componentName]
          return Component ? <Component key={componentName} /> : null
        })}
      </section>

      {/* Testimonials Section */}
      {fields.testimonials && fields.testimonials.length > 0 && (
        <WorkshopTestimonials testimonials={fields.testimonials} />
      )}

      {/* Features Section */}
      {fields.features && (
        <WorkshopFeatures
          features={fields.features}
          teamFeatures={fields.teamFeatures}
        />
      )}

      {/* Instructor Section */}
      {fields.showInstructorSection && fields.instructorName && (
        <WorkshopInstructor
          name={fields.instructorName}
          bio={fields.instructorBio}
          image={fields.instructorImage}
          role={fields.instructorRole}
        />
      )}

      {/* CTA Section with Pricing */}
      <WorkshopCta
        workshop={workshop}
        features={fields.features}
        teamFeatures={fields.teamFeatures}
      />
    </main>
  )
}

// Generate static params for all published workshops
export async function generateStaticParams() {
  const {getAllWorkshops} = await import('@/lib/events/get-event')
  const workshops = await getAllWorkshops()

  return workshops.map((workshop) => ({
    slug: workshop.fields.slug,
  }))
}

// Revalidate every hour
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata({params}: Props) {
  const event = await getEventBySlug(params.slug)

  if (!event) {
    return {
      title: 'Workshop Not Found',
    }
  }

  const seo = event.fields.seo || {}

  return {
    title: seo.title || event.fields.title,
    description: seo.description || event.fields.description,
    openGraph: {
      images: seo.ogImage
        ? [
            {
              url: seo.ogImage,
              width: seo.ogImageWidth || 1200,
              height: seo.ogImageHeight || 630,
            },
          ]
        : [],
    },
  }
}
```

#### 4.6.3 MDX Component Library

**File**: `src/app/workshop/_components/mdx/index.tsx`

```typescript
import {Testimonial} from './testimonial'
import {FeatureList} from './feature-list'
import {CtaBox} from './cta-box'
import {InstructorTerminal} from './instructor-terminal'
import {WorkshopHistory} from './workshop-history'
import Image from 'next/image'

// MDX components available in workshop body content
export const mdxComponents = {
  // Custom workshop components
  Testimonial,
  FeatureList,
  CtaBox,
  InstructorTerminal,
  WorkshopHistory,

  // Enhanced standard components
  img: ({src, alt, ...props}) => (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      className="rounded-lg my-8"
      {...props}
    />
  ),

  h2: ({children, ...props}) => (
    <h2
      className="mt-10 sm:mt-20 mb-10 lg:text-3xl sm:text-2xl text-xl font-bold dark:text-white text-center text-balance"
      {...props}
    >
      {children}
    </h2>
  ),

  // Add more custom styled components as needed
}
```

**Example MDX Component**: `src/app/workshop/_components/mdx/testimonial.tsx`

```typescript
import Image from 'next/image'

type TestimonialProps = {
  quote: string
  name: string
  image?: string
  role?: string
  link?: string
}

export function Testimonial({
  quote,
  name,
  image,
  role,
  link,
}: TestimonialProps) {
  const content = (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg my-8 max-w-2xl mx-auto">
      {image && (
        <Image
          src={image}
          alt={name}
          width={80}
          height={80}
          className="rounded-full"
        />
      )}
      <blockquote className="text-lg italic text-center">"{quote}"</blockquote>
      <div className="text-center">
        <div className="font-semibold">{name}</div>
        {role && (
          <div className="text-sm text-gray-600 dark:text-gray-400">{role}</div>
        )}
      </div>
    </div>
  )

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}
```

### 4.7 Example Workshop MDX Content in Course Builder

**Event Fields → Body** (MDX):

```mdx
## You're using Claude Code, but are you getting the most out of it?

You've seen the demos. You've experienced the magic. You've started using Claude Code in your daily workflow… but you know there's more potential to unlock.

<Testimonial
  quote="John's workshop revealed that I was barely scratching the surface with Claude Code."
  name="Vitor Correa"
  image="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1755729693/people/vitor.png"
/>

## Crucial Workflows You're Missing

**Beyond Basic Prompting: Script Your Way to get more done**

Most developers are typing prompts one at a time. Power users? They're orchestrating entire workflows:

- Set up cron jobs where Claude searches the web, analyzes findings
- Feed Claude programmatic results from other tools for consistency
- Coordinate sub-agents for complex tasks

<FeatureList
  features={['Context management', 'Scriptable workflows', 'MCP integration']}
/>

<InstructorTerminal />

## Building with AI Agents CAN Actually be Reliable

This isn't just about writing code faster. It's about fundamentally rethinking how you approach every task in your workflow.

<CtaBox
  title="Ready to Master Claude Code?"
  description="Join John for a hands-on workshop"
  cta="Register Now"
/>
```

### 4.8 Database Query Additions

Add helper function to `src/lib/events/get-event.ts`:

```typescript
/**
 * Get event by slug (not just ID)
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource
       WHERE type = 'event'
       AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) = ?
       LIMIT 1`,
      [slug],
    )

    if (!rows[0]) return null

    const result = EventSchema.safeParse(rows[0])
    if (!result.success) {
      console.error('Invalid event data:', result.error.message)
      return null
    }

    return result.data
  } finally {
    conn.release()
  }
}

/**
 * Get all published workshops for static generation
 */
export async function getAllWorkshops(): Promise<Event[]> {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource
       WHERE type = 'event'
       AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.state')) = 'published'
       AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.visibility')) = 'public'
       ORDER BY JSON_EXTRACT(fields, '$.startsAt') DESC`,
    )

    const events: Event[] = []
    for (const row of rows) {
      const result = EventSchema.safeParse(row)
      if (result.success) {
        events.push(result.data)
      }
    }

    return events
  } finally {
    conn.release()
  }
}
```

### 4.9 Benefits of This Architecture

**For Developers**:

- ✅ Single template to maintain
- ✅ Type-safe event data with Zod
- ✅ React Server Components for better performance
- ✅ Automatic static generation with ISR
- ✅ Easy to add new MDX components

**For Content Managers**:

- ✅ Edit workshop pages in Course Builder CMS
- ✅ No code deployment needed for new workshops
- ✅ Preview changes before publishing
- ✅ Rich MDX content with custom components
- ✅ Manage all workshop content in one place

**For Business**:

- ✅ Launch new workshop topics instantly
- ✅ A/B test messaging without engineering time
- ✅ Iterate on sales copy rapidly
- ✅ Scale to many workshop types easily
- ✅ Consistent UX across all workshops

### 4.10 Migration Path from Hard-Coded Routes

**Step 1**: Create app router structure with dynamic route
**Step 2**: Add enhanced fields to event schema
**Step 3**: Migrate Claude Code workshop content to Course Builder event
**Step 4**: Test dynamic route with Claude Code workshop
**Step 5**: Migrate Cursor workshop content to Course Builder
**Step 6**: Add redirects from old routes to new dynamic route
**Step 7**: Deprecate pages router workshop routes

**Backward Compatibility** (Temporary Redirects):

```typescript
// src/app/workshop/claude-code/page.tsx
import {redirect} from 'next/navigation'

export default function ClaudeCodeRedirect() {
  redirect('/workshop/claude-code-power-user')
}

// src/app/workshop/cursor/page.tsx
import {redirect} from 'next/navigation'

export default function CursorRedirect() {
  redirect('/workshop/cursor-power-user')
}
```

### 4.11 MDX Components Needed

Based on analysis of current workshop pages, these custom MDX components should be built:

| Component              | Purpose                         | Priority                   |
| ---------------------- | ------------------------------- | -------------------------- |
| `<Testimonial>`        | Individual testimonial display  | High                       |
| `<TestimonialBar>`     | Multiple testimonials in row    | Medium                     |
| `<FeatureList>`        | Bullet list with custom styling | High                       |
| `<CtaBox>`             | Inline CTA within content       | Medium                     |
| `<InstructorTerminal>` | Code demo terminal              | Low (Claude Code specific) |
| `<WorkshopHistory>`    | Past workshop showcase          | Low (Claude Code specific) |
| `<Image>`              | Enhanced Next.js Image          | High                       |
| `<VideoEmbed>`         | Embed videos in content         | Medium                     |
| `<Pricing>`            | Inline pricing display          | Low (use main CTA section) |

---

## 5. Migration Strategies

### Strategy A: Hybrid Model (Recommended)

Store **event ID reference** in Vercel KV, load full event data from database.

#### Advantages

✅ **Minimal KV Storage**: Only store ID and quick-toggle flags
✅ **Single Source of Truth**: Database owns event details
✅ **Easy Updates**: Change event details without touching KV
✅ **Leverages Existing Infrastructure**: Reuse post loading patterns
✅ **Performance Control**: Can cache DB queries as needed
✅ **Gradual Migration**: Update incrementally without breaking changes

#### Implementation

**Vercel KV Structure**:

```typescript
{
  eventId: "kcd8u8qow000008jo5e3y4a0z",  // Reference to ContentResource
  isSaleLive: true,                       // Quick toggle for sale status
  productId: "prod_xyz"                   // Stripe product ID (still needed for webhooks)
}
```

**Loading Pattern**:

```typescript
// 1. Load KV reference
const kv = await getFeatureFlag('featureFlagClaudeCodeWorkshopSale', 'workshop')

// 2. Load full event from database
const event = await getEventById(kv.eventId)

// 3. Combine for component use
return {
  ...event.fields,
  isSaleLive: kv.isSaleLive,
  productId: kv.productId,
}
```

#### Disadvantages

⚠️ Requires database query on every page load
⚠️ Need to build event loading infrastructure
⚠️ More complex than pure KV approach

---

### Strategy B: Database-Only with `isActive` Flag

Store all event data in database, use custom fields or time-based logic for active status.

#### Advantages

✅ **Complete Database Solution**: No KV dependency
✅ **Aligns with Course-Builder**: Uses standard event patterns
✅ **Queryable**: Can list all active/upcoming events
✅ **Centralized Management**: All data in one place

#### Implementation

**Extended Event Fields**:

```typescript
{
  // ... standard event fields (title, startsAt, etc.)

  // Workshop-specific fields
  isActive: true,              // Manual sale toggle
  isSaleLive: true,
  isEarlyBird: true,
  workshopPrice: "$499",
  stripeProductId: "prod_xyz",
  stripePaymentLink: "https://buy.stripe.com/...",

  // Coupon codes
  coupons: {
    earlyBirdMember: "EARLY2025",
    member: "MEMBER2025",
    earlyBird: "EARLYBIRD2025"
  },

  // Discounts
  discounts: {
    earlyBirdMember: "$100",
    member: "$50",
    earlyBird: "$75"
  }
}
```

**Query Active Workshop**:

```typescript
export async function getActiveWorkshop() {
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM egghead_ContentResource
       WHERE type = 'event'
       AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) LIKE 'claude-code%'
       AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.state')) = 'published'
       AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.isActive')) = 'true'
       LIMIT 1`,
    )

    return rows[0] ? EventSchema.parse(rows[0]) : null
  } finally {
    conn.release()
  }
}
```

#### Disadvantages

⚠️ Lose KV's edge caching benefits (~5-10ms → ~50-100ms)
⚠️ Need robust caching strategy
⚠️ More frequent database queries

---

## 5. Migration Considerations

### 5.1 Performance

**Current (KV)**:

- Edge-cached globally
- ~5-10ms response time
- No database load

**Database Queries**:

- ~50-100ms+ depending on connection and query
- Adds load to database
- Can impact other queries

**Mitigation**:

- Implement Next.js revalidation: `revalidate: 60` (60 seconds)
- Use React Query caching: `staleTime: 5 * 60 * 1000` (5 minutes)
- Consider Redis cache layer for high-traffic periods
- Use connection pooling (already implemented)

### 5.2 Schema Mapping

**Challenge**: Current `LiveWorkshopSchema` doesn't exactly match event fields.

**Differences**:

- KV: `date` (string), `startTime`, `endTime`, `timeZone`, `utcOffset`
- DB: `startsAt` (ISO datetime), `endsAt`, `timezone`

**Solution**: Create adapter/transformer functions:

```typescript
function transformEventToWorkshop(event: Event): LiveWorkshop {
  const startDate = new Date(event.fields.startsAt)
  return {
    date: format(startDate, 'yyyy-MM-dd'),
    startTime: format(startDate, 'h:mm a'),
    endTime: event.fields.endsAt
      ? format(new Date(event.fields.endsAt), 'h:mm a')
      : '',
    timeZone: event.fields.timezone,
    utcOffset: getUtcOffset(event.fields.timezone),
    // ... map other fields
  }
}
```

### 5.3 Backward Compatibility

**Challenge**: Many files reference the current feature flag structure.

**Files to Update**:

1. `src/pages/workshop/**/index.tsx` - Main consumer
2. `src/pages/workshop/**/boss.tsx` - Private variant
3. `src/components/app/header/index.tsx` - Banner display
4. `src/components/workshop/**/workshop-cta.tsx` - CTA
5. `src/inngest/utils/stripe-webhook-utils.ts` - Payment webhooks
6. `src/inngest/utils/specific-product-helpers.ts` - Product helpers

**Migration Strategy**:

1. Create new tRPC endpoint: `getWorkshopEvent()`
2. Keep old endpoint during transition
3. Update consumers one by one
4. Deprecate old endpoint
5. Remove KV dependency (optional)

### 5.4 Edge Runtime Compatibility

**Issue**:

- Vercel Edge Config works in edge runtime
- `mysql2` requires Node.js runtime
- Can't use `mysql2` in edge functions/middleware

**Solution**:

- Keep DB queries in Node.js runtime (API routes, server components)
- Use `'use server'` directive
- Already handled correctly in post loading pattern

### 5.5 Client-Side Bundling

**Issue**:

- `mysql2` cannot be bundled for client-side code
- Will cause build errors if imported in client components

**Solution**:

- Use `'use server'` directive on all DB query functions
- Keep DB imports server-side only
- Already handled correctly in codebase

### 5.6 Multiple Workshop Types

**Challenge**: Code handles both Claude Code and Cursor workshops.

**Solution**: Create generic event loading system:

```typescript
// Generic by slug
export async function getWorkshopEvent(slug: string): Promise<Event | null>

// Get active workshop of a type
export async function getActiveWorkshopBySlugPattern(
  pattern: string,
): Promise<Event | null>

// Example usage
const claudeCodeWorkshop = await getActiveWorkshopBySlugPattern('claude-code%')
const cursorWorkshop = await getActiveWorkshopBySlugPattern('cursor%')
```

### 5.7 Cache Invalidation

**Challenge**:

- KV updates are instant across edge network
- Database updates need cache invalidation strategy

**Solutions**:

1. **Time-based revalidation**: `revalidate: 60` in getServerSideProps
2. **On-demand revalidation**: Use `revalidatePath()` or `revalidateTag()` when event updates
3. **Webhook-triggered**: Invalidate cache when event is updated in admin
4. **Short TTL**: Accept 1-5 minute staleness for better performance

### 5.8 Testing & Preview

**Current**: Easy to toggle KV flags for testing different workshop states.

**Database Approach**: Need preview logic:

- Use `state: 'draft'` for testing
- Role-based access: show drafts to admins
- Preview mode query parameter: `?preview=true`
- Separate staging database for testing

---

## 6. Recommended Migration Path

### Phase 1: Infrastructure Setup

**Goal**: Create event loading infrastructure without changing existing code.

**Tasks**:

1. ✅ Create event schema: `src/schemas/event.ts`
2. ✅ Build event query functions: `src/lib/events/get-event.ts`
3. ✅ Create transformer: `src/lib/events/transform-event-to-workshop.ts`
4. ✅ Add unit tests for transformers
5. ✅ Test with Claude Code workshop data

**Deliverables**:

```
src/
├── schemas/
│   └── event.ts              # EventSchema, WorkshopEventSchema
└── lib/
    └── events/
        ├── get-event.ts      # getEventById, getActiveWorkshopEvent
        ├── transform.ts      # transformEventToWorkshop
        └── utils.ts          # Utility functions
```

**Success Criteria**:

- Can query events by ID from database
- Can transform event to LiveWorkshop format
- Tests pass

---

### Phase 2: Hybrid Implementation

**Goal**: Combine KV reference with database queries.

**Tasks**:

1. ✅ Create new tRPC endpoint: `getWorkshopEventFromDb`
2. ✅ Update KV structure to store event ID
3. ✅ Implement hybrid loading logic
4. ✅ Add caching strategy (60s revalidation)
5. ✅ Test end-to-end with workshop page

**Implementation**:

```typescript
// src/server/routers/workshop.ts
export const workshopRouter = router({
  getWorkshopEvent: baseProcedure
    .input(z.object({flag: z.string()}))
    .query(async ({input}) => {
      // Load KV reference
      const kv = await getFeatureFlag(input.flag, 'workshop')
      if (!kv?.eventId) return null

      // Load full event from database
      const event = await getEventById(kv.eventId)
      if (!event) return null

      // Transform and combine
      const workshop = transformEventToWorkshop(event)
      return {
        ...workshop,
        isSaleLive: kv.isSaleLive,
        productId: kv.productId,
      }
    }),
})
```

**Success Criteria**:

- Workshop page loads event from database
- No breaking changes to components
- Performance acceptable (<200ms)

---

### Phase 3: Update Consumers

**Goal**: Migrate all files to use new endpoint.

**Tasks**:

1. ✅ Update `src/pages/workshop/claude-code/index.tsx`
2. ✅ Update `src/pages/workshop/claude-code/boss.tsx`
3. ✅ Update header banner component
4. ✅ Update Stripe webhook handlers
5. ✅ Update product helpers
6. ✅ Test all flows (purchase, webhooks, display)

**Success Criteria**:

- All workshop pages working
- Stripe webhooks processing correctly
- No references to old endpoint

---

### Phase 4: Evaluate & Optimize

**Goal**: Monitor performance and consider full database migration.

**Tasks**:

1. ✅ Monitor query performance
2. ✅ Measure cache hit rates
3. ✅ Evaluate user experience (page load times)
4. ✅ Decide: keep hybrid OR go full database

**Decision Criteria**:

- If performance acceptable → Consider full database migration
- If performance issues → Improve caching, keep hybrid
- If simplicity desired → Full database with aggressive caching

---

### Phase 5: Full Migration (Optional)

**Goal**: Remove KV dependency completely.

**Tasks**:

1. ✅ Move all workshop data to database event fields
2. ✅ Implement robust caching (Redis or Next.js cache)
3. ✅ Add on-demand revalidation webhooks
4. ✅ Remove KV feature flag entirely
5. ✅ Update all references
6. ✅ Monitor for issues

**Success Criteria**:

- No KV dependency
- Performance equal or better than before
- Easier to manage workshop data

---

## 7. Technical Decisions Summary

### Question 1: Where to Store Event ID Reference?

**Answer**: Vercel KV (Phase 2+3) → Database Only (Phase 5, optional)

**Rationale**:

- Start with hybrid for safety and easy rollback
- Evaluate performance before committing to full database
- Allow gradual migration

### Question 2: How to Identify Active Event?

**Answer**: Hybrid approach:

- **Phase 2-4**: `isSaleLive` flag in KV + event data from DB
- **Phase 5**: `fields.isActive` in database + time-based logic

**Rationale**:

- KV provides instant toggle for sale start/stop
- Database provides rich event data
- Can transition to pure database if caching works well

### Question 3: Should We Use `isActive` Flag in Database?

**Answer**: Optional, recommended for Phase 5.

**Rationale**:

- Time-based logic (`startsAt`, `endsAt`) handles most cases
- Manual `isActive` flag useful for:
  - Pausing sales temporarily
  - Early access control
  - Sold-out override
- Aligns with course-builder patterns

### Question 4: Caching Strategy?

**Answer**: Multi-layer approach:

1. **Next.js Revalidation**: 60-second revalidate
2. **React Query**: 5-minute stale time on client
3. **Optional Redis**: For high-traffic events only
4. **On-demand**: Webhook to invalidate on updates

**Rationale**:

- 60s staleness acceptable for workshop data
- Reduces database load significantly
- Can add Redis if needed

---

## 8. Implementation Checklist

### Pre-Migration

- [ ] Review course-builder database schema for events
- [ ] Identify all workshop-specific fields needed
- [ ] Create test event in Course Builder database
- [ ] Document current KV structure

### Phase 1: Infrastructure

- [ ] Create `src/schemas/event.ts` with EventSchema
- [ ] Create `src/lib/events/get-event.ts` with query functions
- [ ] Create `src/lib/events/transform.ts` with transformers
- [ ] Add unit tests for schemas and transformers
- [ ] Test queries against real database

### Phase 2: Hybrid Setup

- [ ] Update KV to include `eventId` field
- [ ] Create new tRPC endpoint for hybrid loading
- [ ] Implement caching strategy
- [ ] Add error handling and fallbacks
- [ ] Test with Claude Code workshop

### Phase 3: Migration

- [ ] Update workshop page to use new endpoint
- [ ] Update header banner
- [ ] Update Stripe webhooks
- [ ] Update product helpers
- [ ] Test full purchase flow
- [ ] Deploy to staging for testing

### Phase 4: Monitoring

- [ ] Monitor query performance
- [ ] Track cache hit rates
- [ ] Measure page load times
- [ ] Collect user feedback

### Phase 5: Optimization (Optional)

- [ ] Implement Redis caching if needed
- [ ] Add on-demand revalidation
- [ ] Consider full database migration
- [ ] Remove KV dependency if feasible

---

## 9. Rollback Plan

If issues arise during migration:

### Rollback from Phase 2/3 (Hybrid)

1. Revert tRPC router changes
2. Switch components back to `getLiveWorkshop` endpoint
3. Restore original KV structure
4. No data loss (KV still has full data)

### Rollback from Phase 5 (Full Database)

1. Restore KV with full workshop data
2. Revert tRPC endpoint to use KV only
3. Update components to use KV endpoint
4. Keep database events for future use

---

## 10. Success Metrics

Track these metrics to evaluate migration success:

### Performance

- **Page Load Time**: Target <2s for workshop page
- **Database Query Time**: Target <100ms for event query
- **Cache Hit Rate**: Target >90% for workshop data

### Reliability

- **Error Rate**: <0.1% for workshop data loading
- **Cache Misses**: <10% for workshop queries
- **Database Connection Issues**: <0.01%

### Developer Experience

- **Code Maintainability**: Fewer lines, clearer separation
- **Deployment Friction**: Equal or less than before
- **Debugging Time**: Easier to trace data flow

### Business Metrics

- **Workshop Sales**: No negative impact
- **Page Abandonment**: No increase
- **Support Tickets**: No increase related to workshop loading

---

## 11. Conclusion

The migration from Vercel KV to Course Builder database for workshop event data is feasible and beneficial. The **recommended approach is a phased hybrid model**:

1. **Start with hybrid** (KV reference + DB queries)
2. **Monitor performance** and user experience
3. **Optionally migrate fully** to database if performance is acceptable

This approach minimizes risk, allows incremental progress, and provides clear rollback paths at each phase.

**Key Benefits**:

- ✅ Single source of truth in database
- ✅ Easier event management (no manual KV updates)
- ✅ Aligns with course-builder patterns
- ✅ Enables future features (event listings, archives, etc.)
- ✅ Reduces dependency on Vercel-specific infrastructure

**Key Risks (Mitigated)**:

- ⚠️ Performance (mitigated by caching)
- ⚠️ Complexity (mitigated by phased approach)
- ⚠️ Breaking changes (mitigated by gradual migration)

**Next Steps**:

1. Review this research document with team
2. Create event in Course Builder database for testing
3. Begin Phase 1: Infrastructure setup
4. Test hybrid approach with Claude Code workshop
5. Evaluate and proceed to Phase 3+

---

## Appendix A: Reference Links

- **Current Workshop Page**: `src/pages/workshop/claude-code/index.tsx`
- **Feature Flag Router**: `src/server/routers/feature-flag.ts`
- **Post Loading Pattern**: `src/lib/posts/get-post.ts`
- **Database Connection**: `src/lib/db.ts`
- **Course Builder Repo**: `badass-courses/course-builder/tree/main/apps/egghead`

## Appendix B: SQL Query Examples

**Get Event by ID**:

```sql
SELECT * FROM egghead_ContentResource
WHERE type = 'event'
AND id = 'kcd8u8qow000008jo5e3y4a0z';
```

**Get Active Workshop Events**:

```sql
SELECT * FROM egghead_ContentResource
WHERE type = 'event'
AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.state')) = 'published'
AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.visibility')) = 'public'
AND JSON_UNQUOTE(JSON_EXTRACT(fields, '$.slug')) LIKE 'claude-code%'
AND STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(fields, '$.endsAt')), '%Y-%m-%dT%H:%i:%s') >= NOW()
LIMIT 1;
```

**Get Event with Products**:

```sql
SELECT
  cr.*,
  p.id as product_id,
  p.name as product_name,
  p.status as product_status,
  p.quantityAvailable,
  JSON_UNQUOTE(JSON_EXTRACT(p.fields, '$.stripeProductId')) as stripe_product_id
FROM egghead_ContentResource cr
JOIN egghead_ContentResourceProduct crp ON cr.id = crp.resourceId
JOIN egghead_Product p ON crp.productId = p.id
WHERE cr.type = 'event'
AND cr.id = 'kcd8u8qow000008jo5e3y4a0z';
```

## Appendix C: TypeScript Type Examples

**Event Schema**:

```typescript
import {z} from 'zod'

export const EventFieldsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  details: z.string().optional(),
  slug: z.string(),
  state: z.enum(['draft', 'published', 'archived', 'deleted']),
  visibility: z.enum(['public', 'unlisted', 'private']),
  startsAt: z.string(), // ISO datetime
  endsAt: z.string(),
  timezone: z.string(),
  body: z.string().optional(),
  image: z.string().optional(),
  socialImage: z
    .object({
      type: z.string(),
      url: z.string(),
    })
    .optional(),
  attendeeInstructions: z.string().optional(),
  calendarId: z.string().optional(),
  featured: z.boolean().optional(),
  thumbnailTime: z.number().optional(),
  // Workshop-specific fields (for Phase 5)
  isActive: z.boolean().optional(),
  isSaleLive: z.boolean().optional(),
  isEarlyBird: z.boolean().optional(),
  workshopPrice: z.string().optional(),
  stripeProductId: z.string().optional(),
  stripePaymentLink: z.string().optional(),
  coupons: z
    .object({
      earlyBirdMember: z.string().optional(),
      member: z.string().optional(),
      earlyBird: z.string().optional(),
    })
    .optional(),
  discounts: z
    .object({
      earlyBirdMember: z.string().optional(),
      member: z.string().optional(),
      earlyBird: z.string().optional(),
    })
    .optional(),
})

export const EventSchema = z.object({
  id: z.string(),
  type: z.literal('event'),
  fields: EventFieldsSchema,
  createdById: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  currentVersionId: z.string().nullable(),
  organizationId: z.string().nullable(),
})

export type Event = z.infer<typeof EventSchema>
export type EventFields = z.infer<typeof EventFieldsSchema>
```

**Transformer Function**:

```typescript
import {format} from 'date-fns'
import {formatInTimeZone} from 'date-fns-tz'
import type {Event} from '@/schemas/event'
import type {LiveWorkshop} from '@/types'

export function transformEventToWorkshop(event: Event): LiveWorkshop {
  const startDate = new Date(event.fields.startsAt)
  const endDate = event.fields.endsAt ? new Date(event.fields.endsAt) : null

  return {
    date: format(startDate, 'yyyy-MM-dd'),
    startTime: formatInTimeZone(startDate, event.fields.timezone, 'h:mm a'),
    endTime: endDate
      ? formatInTimeZone(endDate, event.fields.timezone, 'h:mm a')
      : '',
    timeZone: getTimeZoneName(event.fields.timezone),
    utcOffset: getUtcOffset(event.fields.timezone, startDate),
    isSaleLive: event.fields.isSaleLive ?? event.fields.state === 'published',
    isEuFriendly: isEuFriendlyTime(startDate, event.fields.timezone),
    isEarlyBird: event.fields.isEarlyBird ?? false,
    productId: event.fields.stripeProductId ?? '',
    workshopPrice: event.fields.workshopPrice ?? '',
    stripePaymentLink: event.fields.stripePaymentLink ?? '',
    stripeEarlyBirdMemberCouponCode:
      event.fields.coupons?.earlyBirdMember ?? '',
    stripeMemberCouponCode: event.fields.coupons?.member ?? '',
    stripeEarlyBirdCouponCode: event.fields.coupons?.earlyBird ?? '',
    stripeEarlyBirdMemberDiscount:
      event.fields.discounts?.earlyBirdMember ?? '',
    stripeMemberDiscount: event.fields.discounts?.member ?? '',
    stripeEarlyBirdNonMemberDiscount: event.fields.discounts?.earlyBird ?? '',
  }
}

function getTimeZoneName(tz: string): string {
  const mapping: Record<string, string> = {
    'America/Los_Angeles': 'Pacific Time (PST)',
    'America/New_York': 'Eastern Time (EST)',
    'America/Chicago': 'Central Time (CST)',
    'Europe/London': 'British Time (GMT)',
    // ... add more as needed
  }
  return mapping[tz] || tz
}

function getUtcOffset(tz: string, date: Date): string {
  const offset = formatInTimeZone(date, tz, 'XXX')
  return `UTC${offset}`
}

function isEuFriendlyTime(startDate: Date, tz: string): boolean {
  const hour = parseInt(formatInTimeZone(startDate, tz, 'H'))
  // EU friendly if starting between 5 PM - 11 PM local time
  // which is roughly 9 AM - 3 PM CET
  return hour >= 9 && hour <= 15
}
```
