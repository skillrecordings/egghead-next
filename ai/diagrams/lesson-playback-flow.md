# Lesson Video Playback Flow

## Description

Complete user experience for watching lesson videos including progress tracking, overlays, and completion.

## Key Files

- `src/components/pages/lessons/lesson/index.tsx`
- `src/hooks/mux/use-mux-player.tsx`
- `src/components/pages/lessons/overlays.tsx`
- `src/machines/lesson-machine.ts`
- `src/server/routers/progress.ts`

## Trigger Points

- User navigates to lesson page
- Video play/pause actions
- Video completion
- Progress tracking updates

## Mermaid Diagram

```mermaid
flowchart TD
    A[User Navigates to Lesson] --> B[Load Lesson Data]
    B --> C{User Authenticated?}

    C -->|No| D[Show Anonymous User Overlay]
    D --> E{Free Lesson?}
    E -->|Yes| F[Allow Limited Playback]
    E -->|No| G[Show Membership CTA]

    C -->|Yes| H{User Has Access?}
    H -->|No| I[Show Subscription Required]
    H -->|Yes| J[Initialize Mux Player]

    J --> K[Load User Progress]
    K --> L[Apply Player Preferences]
    L --> M[Start Video Playback]

    M --> N[User Watches Video]
    N --> O[Track Viewing Progress Every 5s]
    O --> P{Progress > 80%?}

    P -->|No| Q[Continue Tracking]
    P -->|Yes| R[Mark as Completed]
    R --> S{First Time Completing?}

    S -->|Yes| T[Show Rating Overlay]
    S -->|No| U[Show Next Lesson CTA]

    T --> V{User Rates Lesson?}
    V -->|Yes| W[Save Rating to DB]
    V -->|No| X[Skip Rating]

    W --> Y[Show Thank You Message]
    X --> Y
    Y --> U

    U --> Z{Auto-play Enabled?}
    Z -->|Yes| AA[Navigate to Next Lesson]
    Z -->|No| BB[Show Manual Next Options]

    CC[Video Player Events] --> DD{Event Type}
    DD -->|Play| EE[Update Player State]
    DD -->|Pause| FF[Save Current Position]
    DD -->|Seek| GG[Update Progress]
    DD -->|Error| HH[Show Error Overlay]

    II[Preferences Changes] --> JJ[Save to Cookies]
    JJ --> KK[Apply to Current Player]

    LL[Completion Toggle Click] --> MM{Currently Complete?}
    MM -->|Yes| NN[Mark Incomplete]
    MM -->|No| OO[Mark Complete]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef decision fill:#ffeaa7

    class R,W,Y,AA success
    class G,I,HH error
    class J,O,EE,FF,GG process
    class C,E,H,P,S,V,Z decision
```

## Decision Points

1. **Authentication Check**: Determines access level and available features
2. **Access Rights**: Checks subscription/membership status
3. **Free Content**: Some lessons available without subscription
4. **Progress Threshold**: 80% completion triggers completion state
5. **First Completion**: Shows rating overlay only once
6. **Auto-play Setting**: Controls automatic progression

## Error Paths

- Authentication failure → Anonymous overlay → Limited access
- No subscription → Membership CTA → Upgrade prompt
- Video load error → Error overlay → Retry options
- Progress save failure → Silent retry → Eventually consistent

## State Management

- **Lesson Machine**: Complex state transitions for playback lifecycle
- **Player Preferences**: Persisted in cookies across sessions
- **Progress Tracking**: Real-time updates to database
- **Overlay Management**: Context-aware overlay display

## External Dependencies

- Mux for video hosting and playback
- tRPC for progress tracking API
- Cookie storage for user preferences
- Database for completion status
