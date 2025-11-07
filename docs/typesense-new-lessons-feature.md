# TypeSense "New Lessons" Feature Plan

## Current State Analysis

### TypeSense Integration Overview

**Current Data Structure:**

- Search powered by TypeSense InstantSearch adapter
- Index: `content_production` (configurable via env)
- Primary fields: `title`, `description`, `_tags`, `instructor_name`, `contributors`
- Available timestamps: `published_at_timestamp`, `updated_at_timestamp`

**Existing Presets:**

1. `popular` - Most Popular
2. `rating` - Highest Rated
3. `created_at` - Recently Added (default, sorts by `published_at_timestamp`)
4. `most_watched` - Most Watched
5. `the_feed` - Custom preset (used on home page)

**Current UI Components:**

- `the-feed.tsx` - Main feed container with InstantSearch
- `hits.tsx` - Renders grid of course cards (first card larger)
- `SearchHitResourceCard` - Individual card component
- Already displays completion badges (green checkmark for completed courses)

### Key Issues Identified

1. **No lesson count tracking** - TypeSense doesn't store lesson counts or track when lessons are added
2. **No "recently updated" indicator** - Courses use `published_at_timestamp` for sorting, not `updated_at_timestamp`
3. **No differentiation** - Updated courses appear same as never-updated courses
4. **Missing metadata** - Need to track: number of lessons, date last lesson added, number of new lessons

---

## Proposed Solution

### Phase 1: Data Layer Enhancement

#### Required TypeSense Fields (Add to indexing)

```typescript
{
  // Existing fields...
  "published_at_timestamp": 1761167342589,
  "updated_at_timestamp": 1761167263669,

  // NEW FIELDS NEEDED:
  "lesson_count": 12,                    // Total number of lessons
  "last_lesson_added_at": 1761167342589, // Timestamp when last lesson was added
  "lessons_added_count": 3,              // Number of lessons added in last N days
  "lessons_added_since": "2025-10-15",   // Human-readable date
  "has_new_lessons": true,               // Boolean flag for quick filtering
  "new_lesson_threshold_days": 14        // Configurable threshold (e.g., 14 days)
}
```

#### Backend Changes Required

**Update TypeSense indexing to include:**

1. Query to get lesson count per course
2. Track `last_lesson_added_at` timestamp
3. Calculate `lessons_added_count` (lessons added in last 14 days)
4. Set `has_new_lessons` flag based on threshold
5. Re-index courses when lessons are added

**Implementation location:** Check Rails backend for TypeSense indexing code

---

### Phase 2: Sorting & Filtering

#### New Preset Option: "Recently Updated"

Add to `preset-options.tsx`:

```tsx
<option value="recently_updated">Recently Updated</option>
```

**Sorting logic:**

- Primary: Courses with `has_new_lessons = true` first
- Secondary: Sort by `last_lesson_added_at` desc
- Tertiary: Sort by `updated_at_timestamp` desc
- Fallback: `published_at_timestamp` desc

#### Enhanced "Recently Added" Preset

Modify default `created_at` preset to prioritize:

1. Newly published courses (last 7 days)
2. Courses with new lessons (last 14 days)
3. All other courses by `published_at_timestamp`

**Formula (TypeSense):**

```
sort_by: _eval(
  [
    (published_at_timestamp > NOW - 7days): 100,
    (has_new_lessons = true): 50
  ]
):desc,
  last_lesson_added_at:desc,
  published_at_timestamp:desc
```

---

### Phase 3: UI Components

#### Badge Component (Netflix-style)

Create `NewLessonsBadge` component:

**Location:** `src/components/badge/new-lessons-badge.tsx`

```tsx
interface NewLessonsBadgeProps {
  lessonsCount: number
  addedSince?: string
}

const NewLessonsBadge: React.FC<NewLessonsBadgeProps> = ({
  lessonsCount,
  addedSince,
}) => {
  return (
    <span
      className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-10"
      title={`${lessonsCount} new lesson${lessonsCount > 1 ? 's' : ''} added${
        addedSince ? ` since ${addedSince}` : ''
      }`}
    >
      <PlusIcon className="w-3 h-3" />
      <span>{lessonsCount} New</span>
    </span>
  )
}
```

**Design Notes:**

- Position: Absolute top-right of card
- Color: Blue gradient (Netflix uses red, but blue fits egghead brand)
- Animation: Optional fade-in on mount
- Tooltip: Show exact date lessons were added

#### Update SearchHitResourceCard Component

**File:** `src/components/card/search-hit-resource-card.tsx:55`

Add badge rendering near line 55 (inside Card component):

```tsx
<Card {...props} resource={resource} className={defaultClassName}>
  {/* Add badge for courses with new lessons */}
  {resource.has_new_lessons && resource.lessons_added_count > 0 && (
    <NewLessonsBadge
      lessonsCount={resource.lessons_added_count}
      addedSince={resource.lessons_added_since}
    />
  )}

  <CardContent className="flex justify-center items-center...">
    {/* existing content */}
  </CardContent>
</Card>
```

#### Visual Hierarchy Enhancement

**Optional:** Add subtle styling changes to cards with new lessons:

```tsx
const defaultClassName = cn(
  'rounded-md w-full h-full transition-all ease-in-out duration-200...',
  resource.has_new_lessons && 'ring-2 ring-blue-500 ring-opacity-50',
)
```

---

### Phase 4: User Experience Enhancements

#### Filtering Toggle

Add filter option above the feed:

```tsx
<div className="flex items-center gap-2 px-5 py-3">
  <input
    type="checkbox"
    id="show-updated-only"
    onChange={(e) => {
      // Filter to only show courses with has_new_lessons = true
    }}
  />
  <label htmlFor="show-updated-only">Show only courses with new lessons</label>
</div>
```

#### "What's New" Section (Optional)

Add dedicated section on home page above the feed:

```tsx
<section className="max-w-screen-xl mx-auto w-full px-5 py-8">
  <h2 className="text-2xl font-semibold mb-4">Recently Updated Courses</h2>
  <HorizontalScroll>
    {/* Render top 5 courses with new lessons */}
  </HorizontalScroll>
</section>
```

---

## Implementation Checklist

### Backend (Rails + TypeSense)

- [ ] Add `lesson_count` field to TypeSense index
- [ ] Add `last_lesson_added_at` timestamp tracking
- [ ] Add `lessons_added_count` calculation (14-day window)
- [ ] Add `has_new_lessons` boolean flag
- [ ] Add `lessons_added_since` human-readable date
- [ ] Create migration/script to backfill existing courses
- [ ] Update indexing job to recalculate on lesson additions
- [ ] Add TypeSense preset for "recently_updated" sorting

### Frontend

- [ ] Create `NewLessonsBadge` component
- [ ] Update `CardResource` type to include new fields
- [ ] Modify `SearchHitResourceCard` to show badge
- [ ] Add "Recently Updated" preset option
- [ ] Update `the-feed.tsx` preset to prioritize updated courses
- [ ] Add optional filter toggle
- [ ] Add analytics tracking for badge interactions

### Testing

- [ ] Test badge rendering with various lesson counts
- [ ] Test sorting with mixed new/old courses
- [ ] Test filter toggle functionality
- [ ] Test mobile responsiveness of badge
- [ ] Verify analytics events fire correctly
- [ ] Test with courses that have no lessons added

---

## Questions & Recommendations

### Data Tracking Questions

1. **Threshold Configuration:** What time window defines "new lessons"?

   - Recommendation: 14 days (configurable)
   - After 14 days, badge disappears automatically

2. **Lesson Count vs. Date:** Should badge show number of lessons or days since update?

   - Recommendation: Show lesson count ("3 New Lessons")
   - Tooltip shows date ("Added on Oct 15, 2025")

3. **Re-indexing Trigger:** How to trigger TypeSense re-index when lessons added?

   - Recommendation: Event-driven (Inngest job when lesson published)

4. **Backfill Strategy:** How to handle existing courses?
   - Recommendation: One-time script to calculate based on lesson published dates

### UI/UX Questions

1. **Badge Placement:** Top-right corner or bottom-left?

   - Recommendation: Top-right (Netflix pattern, less likely to overlap content)

2. **Badge Color:** Blue (brand) or Red (attention)?

   - Recommendation: Blue gradient to match egghead brand

3. **Card Visual Treatment:** Ring, shadow, or no change?

   - Recommendation: Subtle blue ring for updated courses

4. **Default Sort:** Should feed default to showing updated courses first?
   - Recommendation: Yes, blend new + updated in "Recently Added" preset

### Performance Considerations

1. **Re-indexing Frequency:** How often to recalculate `lessons_added_count`?

   - Recommendation: Daily cron job (low priority) + immediate on lesson publish

2. **Badge Removal:** When to remove "new lessons" flag?

   - Recommendation: Automatic after 14 days, or when user views the course

3. **Caching:** Should badge state be cached per user?
   - Recommendation: Global state (all users see same badge), optional: hide for completed courses

---

## Alternative Approaches

### Option A: Simpler Implementation (MVP)

- Only track `updated_at_timestamp`
- Show "Updated" badge (no lesson count)
- Sort by most recently updated
- **Pros:** Quick to implement, no complex calculations
- **Cons:** Less informative, doesn't differentiate minor updates

### Option B: User-Specific Tracking

- Track which lessons user has seen
- Show "X New Lessons" only for lessons they haven't viewed
- **Pros:** More personalized, more accurate
- **Cons:** Complex state management, requires auth, higher storage needs

### Option C: Notification System

- Send email/notification when subscribed courses get new lessons
- Badge is secondary indicator
- **Pros:** Proactive engagement, higher retention
- **Cons:** Requires subscription system, notification infrastructure

---

## Next Steps

1. **Validate Data Availability:**

   - Check Rails backend to confirm lesson timestamps are tracked
   - Verify TypeSense can store additional fields without re-indexing all data

2. **Design Review:**

   - Get stakeholder approval on badge design
   - Confirm 14-day threshold makes sense for egghead content cadence

3. **Prioritize Phases:**

   - Phase 1 (Backend): 2-3 days
   - Phase 2 (Sorting): 1 day
   - Phase 3 (UI): 2-3 days
   - Phase 4 (Enhancements): 1-2 days
   - **Total estimate:** 6-9 days

4. **Create Tickets:**
   - Backend task: Add TypeSense fields + indexing logic
   - Frontend task: Create badge component + update cards
   - QA task: Test badge behavior across presets

Would you like me to proceed with any specific phase or need clarification on any approach?
