# Task: Build AI Dev Essentials Newsletter Landing Page

## Commit 1: feat: create database query function for AI Dev Essentials posts [docs/tasks/2025-06-02-11-40-ai-dev-essentials-landing-page.md]

**Description:**
Create a new database query function in `src/lib/ai-dev-essentials.ts` that fetches posts with titles containing "AI Dev Essentials" from the egghead_ContentResource table. This function will be similar to the `getPost` function in `src/pages/[post].tsx` but will return multiple posts filtered by title. The function will include proper TypeScript types using the existing `PostSchema` and handle database connection management with mysql2. Add comprehensive logging for query execution, results count, and error handling using the project's logging configuration.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test src/lib/__tests__/ai-dev-essentials.test.ts`
    - **Expected Outcome:** `Asserts that getAIDevEssentialsPosts returns array of posts with titles containing "AI Dev Essentials", validates PostSchema compliance, and handles empty results gracefully`
2.  **Logging Check:**
    - **Action:** `Call getAIDevEssentialsPosts function and check console output`
    - **Expected Log:** `INFO: Fetching AI Dev Essentials posts, found X posts matching criteria`
    - **Toggle Mechanism:** `LOG_LEVEL=info`

---

## Commit 2: feat: create AI Dev Essentials landing page component [docs/tasks/2025-06-02-11-40-ai-dev-essentials-landing-page.md]

**Description:**
Build the main landing page component at `src/pages/newsletters/ai-dev-essentials.tsx` that displays a hero section, list of past AI Dev Essentials posts, and newsletter signup form. The component will use Next.js `getStaticProps` to fetch posts using the database function from commit 1. Include proper SEO meta tags using `next-seo`, responsive design with Tailwind CSS classes, and reuse existing components like `InstructorProfile` and `TagList` from `src/pages/[post].tsx`. Add structured logging for page renders, post loading, and user interactions.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test src/pages/newsletters/__tests__/ai-dev-essentials.test.tsx`
    - **Expected Outcome:** `Renders hero section, displays list of posts, shows newsletter signup form, and handles loading states correctly`
2.  **Logging Check:**
    - **Action:** `Navigate to /newsletters/ai-dev-essentials and check browser console`
    - **Expected Log:** `INFO: AI Dev Essentials page rendered with X posts loaded`
    - **Toggle Mechanism:** `LOG_LEVEL=info`

---

## Commit 3: feat: implement newsletter signup form with validation [docs/tasks/2025-06-02-11-40-ai-dev-essentials-landing-page.md]

**Description:**
Create a newsletter signup form component at `src/components/forms/newsletter-signup.tsx` using `react-hook-form` with `@hookform/resolvers` for validation and `zod` for schema validation. The form will include email input, optional name field, and submit button with loading states. Integrate with the existing Customer.io setup (referenced in package.json dependencies) or create a new API endpoint at `src/pages/api/newsletter/subscribe.ts` for handling subscriptions. Add comprehensive form validation, error handling, success states, and detailed logging for subscription attempts, validation errors, and API responses.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test src/components/forms/__tests__/newsletter-signup.test.tsx`
    - **Expected Outcome:** `Validates email format, handles form submission, displays success/error messages, and prevents duplicate submissions`
2.  **Logging Check:**
    - **Action:** `Submit newsletter signup form with valid/invalid data`
    - **Expected Log:** `INFO: Newsletter subscription attempt for email: user@example.com, status: success/failed`
    - **Toggle Mechanism:** `LOG_LEVEL=info`

---

## Commit 4: feat: add post list component with pagination and filtering [docs/tasks/2025-06-02-11-40-ai-dev-essentials-landing-page.md]

**Description:**
Create a reusable post list component at `src/components/posts/ai-dev-essentials-list.tsx` that displays AI Dev Essentials posts with pagination, search filtering, and sorting options. The component will render post cards showing title, description, publication date, tags, and read time estimates. Include responsive grid layout using Tailwind CSS, loading skeletons, empty states, and accessibility features. Implement client-side filtering and sorting with proper URL state management using Next.js router. Add performance logging for list rendering, filter operations, and pagination interactions.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test src/components/posts/__tests__/ai-dev-essentials-list.test.tsx`
    - **Expected Outcome:** `Renders post cards correctly, handles pagination navigation, filters posts by search term, and maintains URL state`
2.  **Logging Check:**
    - **Action:** `Use search filter and pagination controls on the post list`
    - **Expected Log:** `INFO: Post list filtered with term: "react", showing X of Y results, page: 2`
    - **Toggle Mechanism:** `LOG_LEVEL=info`

---

## Commit 5: feat: integrate analytics and performance monitoring [docs/tasks/2025-06-02-11-40-ai-dev-essentials-landing-page.md]

**Description:**
Add analytics tracking and performance monitoring to the AI Dev Essentials landing page using the existing analytics setup (referenced in `src/utils/analytics`). Track page views, newsletter signups, post clicks, search interactions, and user engagement metrics. Implement performance monitoring for database queries, page load times, and component render performance using the existing logging infrastructure. Add error boundary components for graceful error handling and user feedback. Include A/B testing setup for newsletter signup form variations and conversion optimization.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test src/utils/__tests__/ai-dev-essentials-analytics.test.ts`
    - **Expected Outcome:** `Tracks page view events, newsletter signup conversions, post click events, and performance metrics correctly`
2.  **Logging Check:**
    - **Action:** `Navigate page, sign up for newsletter, and click on posts`
    - **Expected Log:** `INFO: Analytics event tracked - type: newsletter_signup, user_id: anonymous, conversion_time: 1234ms`
    - **Toggle Mechanism:** `LOG_LEVEL=info`
