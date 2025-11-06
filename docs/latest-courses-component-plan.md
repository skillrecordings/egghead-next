# Latest Courses Component Implementation Plan

## Overview

Create a component that displays the latest 4 courses from Course Builder with intelligent sorting and "new lessons" badges.

## Requirements

### Core Features

1. Query the latest 4 courses from Course Builder database
2. Sort by most recently active (course creation or lesson addition)
3. Display "New Lessons" badge for courses with recent lesson additions
4. Direct database queries (no API intermediary needed)

### Badge Logic

- **Show "New Lessons" badge when:**
  - Course was published > 7 days ago AND
  - Has lessons published within the last 7 days
- **Don't show badge when:**
  - Course itself was published within the last 7 days (entire course is new)
  - No new lessons in the last 7 days

## Database Schema Analysis (Updated from Course Builder)

### Tables

1. **`egghead_ContentResource`**

   - Primary content table for all content types
   - Key columns:
     - `id`: varchar(255) - Primary key
     - `type`: varchar(255) - Content type (e.g., 'post', 'lesson', 'exercise', 'workshop', 'tutorial')
     - `fields`: JSON - Flexible data storage for content metadata
     - `createdAt`: timestamp(3) - Creation timestamp
     - `updatedAt`: timestamp(3) - Last update timestamp
     - `deletedAt`: timestamp(3) - Soft deletion timestamp
     - `createdById`: varchar(255) - User who created the resource
     - `currentVersionId`: varchar(255) - Current version reference
     - `organizationId`: varchar(191) - Organization association

2. **`egghead_ContentResourceResource`**
   - Join table for hierarchical content relationships
   - Key columns:
     - `resourceOfId`: varchar(255) - Parent content resource ID
     - `resourceId`: varchar(255) - Child content resource ID
     - `position`: double - Order within parent
     - `metadata`: JSON - Additional relationship data
     - `createdAt`, `updatedAt`, `deletedAt`: Timestamps
   - Composite primary key: (resourceOfId, resourceId)

### Content Type Distinctions

- **Courses**: Usually `type = 'post'` with `fields.postType = 'course'`
- **Lessons**: `type = 'post'` with `fields.postType = 'lesson'` or `type = 'lesson'`
- **Sections**: May be used for course organization
- State tracking: `fields.state` can be 'draft', 'published', 'archived'

### Field Structure (JSON in `fields` column)

```json
{
  "title": "Course/Lesson Title",
  "slug": "url-slug",
  "postType": "course|lesson", // distinguishes post subtypes
  "state": "draft|published|archived",
  "visibility": "public|private|unlisted",
  "description": "Content description",
  "body": "Main content/markdown",
  "image": "image-url",
  "github": "github-repo-url",
  "gitpod": "gitpod-url",
  "thumbnailTime": 0
}
```

## Implementation Architecture

### 1. Database Query Functions (`src/lib/courses/`)

#### `get-latest-courses.ts`

```typescript
export async function getLatestCourses(limit: number = 4) {
  // Query logic:
  // 1. Get all published courses with their latest lesson dates
  // 2. Calculate "last activity" (max of course creation or latest lesson)
  // 3. Sort by last activity DESC
  // 4. Include lesson count and latest lesson date for badge logic
}
```

#### `get-course-lessons-summary.ts`

```typescript
export async function getCourselessonsSummary(courseId: string) {
  // Get summary of lessons for badge calculation:
  // - Total lesson count
  // - Lessons published in last 7 days count
  // - Most recent lesson publish date
}
```

### 2. Component Structure (`src/components/courses/`)

#### `latest-courses-feed.tsx`

Main container component that:

- Fetches course data server-side
- Passes data to display components
- Handles loading states

#### `course-card.tsx`

Individual course display component:

- Shows course image, title, description
- Displays instructor info
- Renders "New Lessons" badge conditionally
- Shows lesson count

#### `new-lessons-badge.tsx`

Badge component that shows when conditions are met:

- Accepts course publish date and recent lesson count
- Calculates and displays badge visibility

### 3. SQL Query Strategy

```sql
-- Main query for latest courses with activity tracking
SELECT
  cr_course.*,
  JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.title')) AS title,
  JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.slug')) AS slug,
  JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.image')) AS image,
  JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.description')) AS description,
  COUNT(DISTINCT cr_lesson.id) AS total_lessons,
  MAX(cr_lesson.createdAt) AS latest_lesson_date,
  SUM(
    CASE
      WHEN cr_lesson.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      THEN 1
      ELSE 0
    END
  ) AS recent_lessons_count,
  GREATEST(
    cr_course.createdAt,
    COALESCE(MAX(cr_lesson.createdAt), cr_course.createdAt)
  ) AS last_activity_date
FROM egghead_ContentResource cr_course
LEFT JOIN egghead_ContentResourceResource crr
  ON cr_course.id = crr.resourceOfId
LEFT JOIN egghead_ContentResource cr_lesson
  ON crr.resourceId = cr_lesson.id
  AND cr_lesson.type = 'post'
  AND JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.state')) = 'published'
WHERE
  cr_course.type = 'post'
  AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.postType')) = 'course'
  AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.state')) = 'published'
GROUP BY cr_course.id
ORDER BY last_activity_date DESC
LIMIT 4;
```

## File Structure

```
src/
├── lib/
│   ├── courses/
│   │   ├── get-latest-courses.ts      # Main query function
│   │   ├── types.ts                   # Type definitions
│   │   └── utils.ts                   # Helper functions
│   └── courses-query.ts                # Export aggregator
├── components/
│   └── courses/
│       ├── latest-courses-feed.tsx    # Main component
│       ├── course-card.tsx            # Individual course display
│       └── new-lessons-badge.tsx      # Badge component
└── app/
    └── typesense-test/
        └── page.tsx                    # Integration point
```

## Type Definitions

```typescript
interface LatestCourse {
  id: string
  title: string
  slug: string
  description?: string
  image?: string
  createdAt: Date
  totalLessons: number
  recentLessonsCount: number
  latestLessonDate?: Date
  lastActivityDate: Date
  instructor?: {
    name: string
    image?: string
  }
}

interface NewLessonsBadgeProps {
  courseCreatedAt: Date
  recentLessonsCount: number
  latestLessonDate?: Date
}
```

## Component Integration

### In `src/app/typesense-test/page.tsx`:

```tsx
import CompactFeed from './_components/compact-feed'
import LatestCoursesFeed from '@/components/courses/latest-courses-feed'

export default async function TypesenseTestPage() {
  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50">
      <div className="max-w-screen-xl mx-auto w-full p-5 mb-4">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">
          Typesense Test Page (App Router)
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Testing InstantSearch with Typesense adapter - Compact Feed Component
        </p>
      </div>

      {/* Latest Courses Section */}
      <div className="max-w-screen-xl mx-auto w-full p-5 mb-8">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Latest Courses
        </h2>
        <LatestCoursesFeed />
      </div>

      {/* Existing Compact Feed */}
      <CompactFeed />
    </div>
  )
}
```

## Implementation Steps

1. **Create type definitions** (`src/lib/courses/types.ts`)
2. **Implement database query functions** (`src/lib/courses/get-latest-courses.ts`)
3. **Create utility functions** for date calculations (`src/lib/courses/utils.ts`)
4. **Build badge component** (`src/components/courses/new-lessons-badge.tsx`)
5. **Create course card component** (`src/components/courses/course-card.tsx`)
6. **Implement main feed component** (`src/components/courses/latest-courses-feed.tsx`)
7. **Integrate into test page** (`src/app/typesense-test/page.tsx`)
8. **Add error handling and loading states**
9. **Test with various data scenarios**

## Edge Cases to Handle

1. **No courses available**: Display appropriate empty state
2. **Courses with no lessons**: Handle null lesson dates gracefully
3. **Database connection errors**: Fallback to error state
4. **Missing course metadata**: Provide defaults for optional fields
5. **Timezone considerations**: Ensure consistent date comparisons

## Performance Considerations

1. **Use connection pooling** (already implemented in codebase)
2. **Minimize JSON parsing** in SQL where possible
3. **Consider caching** for production (using Next.js cache or Redis)
4. **Optimize query with proper indexes** on frequently queried fields

## Testing Strategy

1. **Unit tests** for date calculation utilities
2. **Integration tests** for database queries
3. **Component tests** for badge visibility logic
4. **E2E tests** for full user flow

## Future Enhancements

1. **Pagination** for viewing more courses
2. **Filter by category/tags**
3. **User-specific recommendations**
4. **Real-time updates** using WebSockets
5. **Analytics tracking** for course impressions

## Notes

- The current implementation will query Course Builder database directly
- Follow existing patterns from `src/lib/posts/` for consistency
- Use the existing `getPool()` function from `src/lib/db.ts`
- Ensure proper TypeScript types throughout
- Consider adding `publishedAt` field to course fields if not present
