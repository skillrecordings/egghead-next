# User Navigation and Routing Flow

## Description

Complete navigation experience including route protection, redirects, middleware processing, and dynamic routing.

## Key Files

- `src/middleware.ts`
- `src/app/layout.tsx`
- `src/pages/_app.tsx`
- `src/context/viewer-context.tsx`
- Various page components

## Trigger Points

- User navigates to any URL
- Authentication state changes
- Route protection checks
- Dynamic route resolution

## Mermaid Diagram

```mermaid
flowchart TD
    A[User Navigates to URL] --> B[Next.js Router]
    B --> C[Middleware Processing]
    C --> D{Protected Route?}

    D -->|No| E[Continue to Page]
    D -->|Yes| F[Check Authentication]

    F --> G{User Authenticated?}
    G -->|No| H[Redirect to Login]
    G -->|Yes| I[Check Permissions]

    I --> J{Has Required Access?}
    J -->|No| K[Redirect to Access Denied]
    J -->|Yes| L[Allow Access]

    H --> M[Store Intended URL]
    M --> N[Navigate to Login Page]
    N --> O[User Completes Login]
    O --> P[Redirect to Intended URL]

    E --> Q[Route Resolution]
    L --> Q

    Q --> R{Route Type}
    R -->|Static| S[Serve Static Page]
    R -->|Dynamic| T[Extract Route Params]
    R -->|API| U[Execute API Handler]

    T --> V{Valid Params?}
    V -->|No| W[404 Not Found]
    V -->|Yes| X[Fetch Page Data]

    X --> Y{Data Fetch Success?}
    Y -->|No| Z[500 Server Error]
    Y -->|Yes| AA[Render Page]

    S --> BB[Page Rendering]
    AA --> BB
    U --> CC[API Response]

    BB --> DD[Layout Wrapper]
    DD --> EE[Authentication Context]
    EE --> FF{User State Available?}

    FF -->|No| GG[Show Loading State]
    FF -->|Yes| HH[Render Navigation]

    GG --> II[Load User Data]
    II --> JJ{Load Success?}
    JJ -->|No| KK[Anonymous State]
    JJ -->|Yes| LL[Authenticated State]

    KK --> MM[Public Navigation]
    LL --> NN[Personalized Navigation]

    HH --> OO[Render Page Content]
    MM --> OO
    NN --> OO

    PP[Client-Side Navigation] --> QQ[Next.js Link Click]
    QQ --> RR[Prefetch Route Data]
    RR --> SS[Update Browser History]
    SS --> TT[Route Change Event]
    TT --> UU[Component Update]

    VV[Dynamic Routes] --> WW{Route Pattern}
    WW -->|/[post]| XX[Blog Post Route]
    WW -->|/courses/[course]| YY[Course Route]
    WW -->|/lessons/[slug]| ZZ[Lesson Route]

    XX --> AAA[Fetch Post Data]
    YY --> BBB[Fetch Course Data]
    ZZ --> CCC[Fetch Lesson Data]

    AAA --> DDD{Post Found?}
    BBB --> EEE{Course Found?}
    CCC --> FFF{Lesson Found?}

    DDD -->|No| GGG[Post 404]
    DDD -->|Yes| HHH[Render Post]

    EEE -->|No| III[Course 404]
    EEE -->|Yes| JJJ[Render Course]

    FFF -->|No| KKK[Lesson 404]
    FFF -->|Yes| LLL[Render Lesson]

    MMM[Search Engine Routes] --> NNN[Check Bot User Agent]
    NNN --> OOO{Is Search Bot?}
    OOO -->|Yes| PPP[Server-Side Render]
    OOO -->|No| QQQ[Client-Side Render]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef redirect fill:#fff3cd

    class L,P,AA,BB,HHH,JJJ,LLL success
    class W,Z,K,GGG,III,KKK error
    class C,F,I,Q,T,X,RR,AAA,BBB,CCC process
    class H,M,N redirect
```

## Navigation Patterns

### 1. Public Routes

- Home page (`/`)
- Course catalog (`/courses`)
- Individual course pages (`/courses/[slug]`)
- Blog posts (`/blog/[slug]`)
- Public lessons (limited access)

### 2. Protected Routes

- User dashboard (`/user`)
- Account settings (`/user/profile`)
- Premium content access
- Admin-only pages

### 3. Conditional Routes

- Different content based on authentication
- Subscription-gated features
- Geographic restrictions
- Feature flag controls

## Route Protection Strategies

### Middleware Layer

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('auth-token')

  if (protectedPaths.includes(pathname) && !token) {
    return NextResponse.redirect('/login')
  }
}
```

### Component-Level Guards

```typescript
// Route protection hook
const useRequireAuth = () => {
  const {user, loading} = useViewer()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading])
}
```

### Server-Side Checks

```typescript
// Page-level authentication
export const getServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {destination: '/login', permanent: false},
    }
  }

  return {props: {user: session.user}}
}
```

## Dynamic Route Handling

### Blog Post Routes (`/[post]`)

- Fetch post data by slug
- Handle both course and blog content
- SEO optimization with metadata
- Social sharing integration

### Course Routes (`/courses/[course]`)

- Course accessibility checks
- Enrollment status verification
- Progress tracking integration
- Related content suggestions

### Lesson Routes (`/lessons/[slug]`)

- Video player initialization
- Progress tracking setup
- Completion status management
- Next lesson recommendations

## SEO and Performance

### Static Generation

- Pre-generate popular pages
- Incremental static regeneration
- Automatic sitemap generation
- Open Graph metadata

### Client-Side Optimization

- Route prefetching on hover
- Lazy loading of components
- Code splitting by route
- Image optimization

### Search Engine Optimization

- Server-side rendering for bots
- Structured data markup
- Canonical URL management
- Meta tag optimization

## Error Handling

### 404 Not Found

- Custom 404 page with suggestions
- Search functionality integration
- Popular content recommendations
- Report broken link option

### 500 Server Error

- Graceful error boundaries
- Error reporting integration
- Fallback content display
- Retry mechanisms

### Network Errors

- Offline page functionality
- Service worker integration
- Cached content serving
- Connection retry logic

## Analytics Integration

### Page View Tracking

- Google Analytics integration
- Custom event tracking
- User journey mapping
- Conversion funnel analysis

### Performance Monitoring

- Core Web Vitals tracking
- Route change timing
- Error rate monitoring
- User experience metrics

## Accessibility Considerations

### Keyboard Navigation

- Tab order management
- Skip links for efficiency
- Focus management on route change
- ARIA live regions for updates

### Screen Reader Support

- Route announcements
- Loading state communication
- Error state descriptions
- Navigation landmark identification
