# Copy as Prompt Feature Implementation Plan

## Overview

Add a "Copy as Prompt" button to three main pages (posts, courses, lessons) that formats content with XML-style tags for LLM consumption. The course page feature should be restricted to paying members, while posts and lessons should be free for everyone.

## Target Pages Analysis

### 1. Posts Page (`/[post]`)

- **File**: `src/pages/[post].tsx`
- **Content Available**: Title, description, transcript (from videoResource)
- **Access Level**: Free for all users
- **Implementation**: Add button near existing share buttons (line 569-592)

### 2. Course Page (`/courses/[course]`)

- **File**: `src/pages/courses/[course]/index.tsx`
- **Content Available**: Course title, description, all lesson titles/descriptions/transcripts
- **Access Level**: Restricted to paying members (`viewer.is_pro`)
- **Implementation**: Add to course layout components

### 3. Lessons Page (`/courses/[course]/[lesson]`)

- **File**: `src/app/(content)/courses/[course]/[lesson]/page.tsx`
- **Content Available**: Lesson title, description, transcript
- **Access Level**: Free for all users
- **Implementation**: Add to lesson header or player sidebar

## Authentication & Access Control

### Current Auth System

- Uses `useViewer()` hook from `src/context/viewer-context.tsx`
- Pro membership check: `viewer?.is_pro` boolean
- Authentication state: `viewer` object exists when logged in

### Access Rules

- **Posts**: No authentication required
- **Courses**: Require `viewer?.is_pro === true`
- **Lessons**: No authentication required

## Implementation Tasks

### Phase 1: Core Component Development

#### 1.1 Create CopyAsPromptButton Component

```typescript
// src/components/copy-as-prompt-button.tsx
interface CopyAsPromptButtonProps {
  title: string
  description?: string
  transcript?: string
  lessons?: Array<{title: string; description?: string; transcript?: string}>
  contentType: 'post' | 'course' | 'lesson'
  requiresPro?: boolean
}
```

#### 1.2 XML Formatting Function

```typescript
// src/lib/format-content-as-prompt.ts
export function formatContentAsPrompt(content: {
  title: string
  description?: string
  transcript?: string
  lessons?: Array<{title: string; description?: string; transcript?: string}>
  contentType: 'post' | 'course' | 'lesson'
}): string
```

### Phase 2: Page Integration

#### 2.1 Posts Page Integration

- **Location**: Near share buttons section (lines 569-592)
- **Props**: `title`, `description`, `transcript` from videoResource
- **Access**: No restrictions

#### 2.2 Course Page Integration

- **Location**: Main course layout (`CollectionPageLayout`)
- **Props**: Course data + all lesson data with transcripts
- **Access**: Require `viewer?.is_pro`
- **Fallback**: Show upgrade prompt for non-pro users

#### 2.3 Lessons Page Integration

- **Location**: `LessonHeader` component or player sidebar
- **Props**: Individual lesson data
- **Access**: No restrictions

### Phase 3: UI/UX Design

#### 3.1 Button Design

- Icon: Copy or clipboard icon
- Text: "Copy as Prompt"
- Styling: Match existing button patterns (Tailwind classes)
- States: Default, loading, success, error

#### 3.2 Pro Gate for Courses

- Show locked button with tooltip for non-pro users
- Link to membership page
- Clear messaging about pro requirement

#### 3.3 Success Feedback

- Toast notification or temporary text change
- Analytics tracking for usage

### Phase 4: Data Fetching Enhancements

#### 4.1 Course Page Transcript Loading

- Current course page may not load all lesson transcripts
- Need to ensure transcript data is available for all lessons
- Consider performance implications

#### 4.2 API Optimization

- Evaluate if additional API calls are needed
- Consider caching strategy for large course data

## Technical Specifications

### XML Format Structure

```xml
<content type="post|course|lesson">
  <title>Content Title</title>
  <description>Content Description</description>
  <transcript>Video Transcript</transcript>
  <!-- For courses only -->
  <lessons>
    <lesson>
      <title>Lesson Title</title>
      <description>Lesson Description</description>
      <transcript>Lesson Transcript</transcript>
    </lesson>
  </lessons>
</content>
```

### Component API

```typescript
interface CopyAsPromptButtonProps {
  title: string
  description?: string
  transcript?: string
  lessons?: LessonData[]
  contentType: 'post' | 'course' | 'lesson'
  requiresPro?: boolean
  className?: string
  onCopy?: () => void
}
```

## File Structure

```
src/
├── components/
│   ├── copy-as-prompt-button.tsx          # Main button component
│   └── pro-gate-copy-button.tsx           # Pro-gated version for courses
├── lib/
│   └── format-content-as-prompt.ts        # XML formatting logic
└── hooks/
    └── use-copy-as-prompt.ts              # Copy logic & state management
```

## Testing Strategy

### Unit Tests

- XML formatting function
- Copy functionality
- Pro access logic

### Integration Tests

- Button rendering on all three pages
- Pro gate functionality
- Analytics tracking

### Manual Testing

- Test on all three page types
- Verify pro/free access controls
- Test copy functionality across browsers
- Verify XML output format

## Analytics & Tracking

### Events to Track

- `copy_as_prompt_clicked` - Button clicked
- `copy_as_prompt_success` - Content copied successfully
- `copy_as_prompt_pro_gate_shown` - Pro gate displayed
- `copy_as_prompt_upgrade_clicked` - Upgrade link clicked

### Event Properties

- `content_type`: 'post' | 'course' | 'lesson'
- `content_id`: Unique identifier
- `user_pro_status`: boolean
- `content_length`: Character count of copied content

## Performance Considerations

### Course Page Optimization

- Lazy load lesson transcripts if not already available
- Consider pagination for courses with many lessons
- Implement loading states for large content

### Memory Management

- Clear clipboard data appropriately
- Avoid memory leaks in copy functionality

## Rollout Plan

### Phase 1: Development & Testing

1. Create core components
2. Implement formatting logic
3. Add to posts page (lowest risk)
4. Unit and integration testing

### Phase 2: Gradual Rollout

1. Deploy to posts page
2. Add to lessons page
3. Implement pro-gated course page feature
4. Monitor usage and performance

### Phase 3: Optimization

1. Analyze usage patterns
2. Optimize performance based on real data
3. Enhance UX based on user feedback

## Success Metrics

### Usage Metrics

- Click-through rates on copy button
- Successful copy operations
- Pro conversion rate from course copy feature

### Technical Metrics

- Page load time impact
- Error rates
- Performance of large content copying

## Dependencies

### External Libraries

- Existing clipboard API usage
- Current authentication system
- Analytics tracking infrastructure

### Internal Dependencies

- Viewer context for pro status
- Existing lesson/course data structures
- Current UI component patterns

## Risks & Mitigation

### Technical Risks

- **Large content performance**: Implement size limits and loading states
- **Browser compatibility**: Test clipboard API across browsers
- **Memory usage**: Optimize for large course content

### Business Risks

- **Pro feature adoption**: Monitor conversion metrics
- **Content formatting**: Ensure XML is properly escaped and formatted
- **User experience**: Provide clear feedback and error handling

## Future Enhancements

### Potential Features

- Custom XML format options
- Bulk export for multiple pieces of content
- Integration with external tools
- Advanced filtering options for course content

### Technical Improvements

- Server-side XML generation for large content
- Caching strategy for formatted content
- Progressive loading for large courses
