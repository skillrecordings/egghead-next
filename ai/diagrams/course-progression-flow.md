# Course Progression and Learning Flow

## Description

Complete learning experience including course enrollment, lesson progression, completion tracking, and certification.

## Key Files

- `src/components/pages/courses/[course]/index.tsx`
- `src/server/routers/progress.ts`
- `src/components/pages/lessons/lesson/index.tsx`
- `src/components/pages/user/components/continue-learning.tsx`

## Trigger Points

- Course enrollment or access
- Lesson completion
- Progress tracking updates
- Course completion

## Mermaid Diagram

```mermaid
flowchart TD
    A[User Discovers Course] --> B{User Authenticated?}
    B -->|No| C[Show Preview Content]
    B -->|Yes| D{Has Course Access?}

    C --> E[Limited Lesson Access]
    E --> F[Membership CTA Overlay]
    F --> G[Subscribe or Login]
    G --> D

    D -->|No| H[Show Subscription Required]
    H --> I[Purchase/Subscribe Flow]
    I --> J[Grant Course Access]

    D -->|Yes| K[Load Course Progress]
    K --> L[Display Course Overview]
    L --> M[Show Lesson List]
    M --> N[Highlight Next Lesson]

    N --> O[User Selects Lesson]
    O --> P[Navigate to Lesson]
    P --> Q[Load Lesson Content]
    Q --> R[Initialize Video Player]

    R --> S[User Watches Lesson]
    S --> T[Track Progress Every 5s]
    T --> U{Progress > 80%?}

    U -->|No| V[Continue Tracking]
    V --> T
    U -->|Yes| W[Mark Lesson Complete]

    W --> X[Update Database]
    X --> Y[Update Course Progress]
    Y --> Z{Course Complete?}

    Z -->|No| AA[Show Next Lesson]
    AA --> BB{Auto-advance Enabled?}
    BB -->|Yes| CC[Auto-navigate to Next]
    BB -->|No| DD[Show Manual Options]

    CC --> O
    DD --> EE[Back to Course or Next Lesson]
    EE --> O

    Z -->|Yes| FF[Course Completion Flow]
    FF --> GG[Show Completion Overlay]
    GG --> HH[Request Course Rating]
    HH --> II{User Rates Course?}

    II -->|Yes| JJ[Save Rating to DB]
    II -->|No| KK[Skip Rating]

    JJ --> LL[Show Thank You]
    KK --> LL
    LL --> MM[Generate Certificate]
    MM --> NN[Add to User Achievements]
    NN --> OO[Update Learning Statistics]

    OO --> PP[Suggest Related Courses]
    PP --> QQ[Update Recommendation Engine]
    QQ --> RR[Show Continue Learning]

    SS[Progress Synchronization] --> TT[Load User Progress]
    TT --> UU{Multiple Devices?}
    UU -->|Yes| VV[Sync Across Devices]
    UU -->|No| WW[Single Device Progress]

    VV --> XX[Resolve Conflicts]
    XX --> YY[Use Latest Progress]
    WW --> YY
    YY --> ZZ[Update UI State]

    AAA[Learning Analytics] --> BBB[Track Viewing Time]
    BBB --> CCC[Monitor Completion Rates]
    CCC --> DDD[Identify Drop-off Points]
    DDD --> EEE[Improve Content]

    FFF[Gamification] --> GGG[Award Points]
    GGG --> HHH[Update Streaks]
    HHH --> III[Unlock Badges]
    III --> JJJ[Leaderboard Updates]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef analytics fill:#f3e5f5

    class J,W,MM,NN,OO success
    class H,F error
    class K,Q,R,T,X,Y process
    class BBB,CCC,DDD,GGG,HHH analytics
```

## Learning Path Stages

### 1. Discovery & Access

- Course catalog browsing
- Search and filtering
- Preview content access
- Subscription requirement checks

### 2. Enrollment & Setup

- Access verification
- Progress initialization
- User preference setup
- Learning path creation

### 3. Active Learning

- Lesson-by-lesson progression
- Video playback and controls
- Progress tracking and persistence
- Note-taking and bookmarking

### 4. Completion & Recognition

- Automatic completion detection
- Certificate generation
- Achievement unlocking
- Progress celebration

### 5. Continued Learning

- Related course recommendations
- Learning path suggestions
- Skill development tracking
- Community engagement

## Progress Tracking Features

### Granular Progress

- Video watch time and percentage
- Lesson completion status
- Module completion tracking
- Overall course progress

### Cross-Device Sync

- Cloud-based progress storage
- Real-time synchronization
- Conflict resolution
- Offline progress caching

### Analytics Integration

- Learning velocity tracking
- Engagement pattern analysis
- Drop-off point identification
- Success metric calculation

## User Experience Optimizations

### Adaptive Learning

- Personalized lesson recommendations
- Difficulty-based content filtering
- Learning style adaptations
- Pacing recommendations

### Engagement Features

- Progress visualizations
- Achievement notifications
- Social sharing options
- Learning streaks

### Accessibility

- Closed caption support
- Variable playback speeds
- Keyboard navigation
- Screen reader compatibility

## Data Persistence

### Progress Storage

```sql
-- User lesson progress
user_lesson_progress (
  user_id,
  lesson_id,
  completed_at,
  watch_time,
  percentage_complete
)

-- Course completion
user_course_completion (
  user_id,
  course_id,
  completed_at,
  certificate_id,
  rating
)
```

### Caching Strategy

- Browser local storage for immediate updates
- Database persistence for reliability
- CDN caching for course metadata
- Real-time sync for multi-device support

## Integration Points

### External Services

- **Video Platform**: Mux for video delivery
- **Analytics**: PostHog for learning analytics
- **CRM**: Customer.io for learning milestones
- **Certificates**: Automated certificate generation

### Internal Systems

- **User Management**: Authentication and permissions
- **Content Management**: Course and lesson metadata
- **Recommendation Engine**: Personalized suggestions
- **Notification System**: Achievement and progress alerts
