# Free User Pro Content Overlay System Flow

## Description

Detailed flow documenting the overlay system that manages what free users see when attempting to access pro/premium content, including all overlay types, triggers, and decision logic.

## Key Files

- `src/components/pages/lessons/overlays.tsx` - Main overlay orchestration
- `src/components/pages/lessons/overlay/anon-user-overlay.tsx` - Anonymous user overlay
- `src/components/pages/lessons/overlay/go-pro-cta-overlay.tsx` - Pro membership CTA
- `src/components/pages/lessons/overlay/email-capture-cta-overlay.tsx` - Email capture overlay
- `src/components/pages/lessons/lesson/index.tsx` - Overlay trigger logic
- `src/machines/lesson-machine.ts` - State machine controlling overlay states
- `src/components/pages/lessons/overlay/wrapper.tsx` - Overlay container component
  src/components/pages/lessons/overlays.tsx,src/components/pages/lessons/overlay/anon-user-overlay.tsx,src/components/pages/lessons/overlay/go-pro-cta-overlay.tsx,src/components/pages/lessons/overlay/email-capture-cta-overlay.tsx,src/components/pages/lessons/lesson/index.tsx,src/machines/lesson-machine.ts,src/components/pages/lessons/overlay/wrapper.tsx

## Trigger Points

- Free user accesses pro lesson
- Anonymous user completes free lesson
- View count limit exceeded
- Video completion events
- Authentication state changes

## Mermaid Diagram

```mermaid
flowchart TD
    A[Free User Clicks Pro Lesson] --> B[Load Lesson Component]
    B --> C{Check Authentication Status}

    C -->|Authenticated User| D[Authenticated Free User Flow]
    C -->|Anonymous User| E[Anonymous User Flow]

    D --> F{Check User Subscription}
    F -->|Has Pro Access| G[No Overlay - Full Access]
    F -->|No Pro Access| H[Trigger Subscription Flow]

    H --> I[Lesson Machine: SUBSCRIBE State]
    I --> J[Show Go Pro CTA Overlay]

    E --> K{Check Lesson Type}
    K -->|Free Forever Lesson| L[Check View Count]
    K -->|Pro Content| M[Immediate Paywall]

    L --> N{Views < MAX_FREE_VIEWS (4)?}
    N -->|Yes| O[Allow Limited Viewing]
    N -->|No| P[Show Membership Required]

    O --> Q[Play Video with Limitations]
    Q --> R[Track View Count in Cookie]
    R --> S[Video Completion Check]

    S --> T{Video Completed?}
    T -->|No| U[Continue Playing]
    T -->|Yes| V[Trigger Post-Completion Flow]

    V --> W[Lesson Machine: OFFER_SEARCH State]
    W --> X[Show Anonymous User Overlay]

    M --> Y[Lesson Machine: SUBSCRIBING State]
    Y --> J
    P --> Y

    X --> Z[AnonUserOverlay Component]
    Z --> AA[Display Course Information]
    AA --> BB[Show Continue Course Options]
    BB --> CC[Provide Search Functionality]
    CC --> DD[Related Content Recommendations]

    J --> EE[GoProCtaOverlay Component]
    EE --> FF[Display Membership Benefits]
    FF --> GG[Show Pricing Information]
    GG --> HH[Email Input Field]
    HH --> II[CTA: Access this Course Button]

    II --> JJ{User Action}
    JJ -->|Click Subscribe| KK[Email Validation]
    JJ -->|Click Close/Back| LL[Return to Lesson]

    KK --> MM{Valid Email?}
    MM -->|No| NN[Show Validation Error]
    MM -->|Yes| OO[Check Email for Existing Pro]

    NN --> HH
    OO --> PP{Email Already Has Pro?}
    PP -->|Yes| QQ[Show Error: Please Sign In]
    PP -->|No| RR[Proceed to Stripe Checkout]

    QQ --> SS[Track: Existing Pro Account Found]
    RR --> TT[Commerce Machine: Price Selection]
    TT --> UU[Redirect to Stripe Payment]

    UU --> VV[Payment Processing]
    VV --> WW{Payment Successful?}
    WW -->|No| XX[Return to Pricing Page]
    WW -->|Yes| YY[Stripe Webhook Triggers]

    YY --> ZZ[Return with session_id]
    ZZ --> AAA[Show Confirm Membership Overlay]
    AAA --> BBB[Verify New Subscription]
    BBB --> CCC{Verification Success?}
    CCC -->|Yes| DDD[Grant Full Access]
    CCC -->|No| EEE[Show Error - Contact Support]

    LL --> FFF[Lesson Machine State Transition]
    FFF --> GGG{Return to Which State?}
    GGG -->|Had Session ID| HHH[Return to subscribing]
    GGG -->|Anonymous User| III[Return to offeringSearch]
    GGG -->|Free User| JJJ[Return to loaded state]

    KKK[Overlay Display Logic] --> LLL{Current Machine State}
    LLL -->|'joining'| MMM[EmailCaptureCtaOverlay]
    LLL -->|'subscribing'| NNN[GoProCtaOverlay]
    LLL -->|'offeringSearch'| OOO[AnonUserOverlay]
    LLL -->|'showingNext'| PPP[WatchNextLessonCtaOverlay]
    LLL -->|'rating'| QQQ[RateCourseOverlay]
    LLL -->|'recommending'| RRR[RecommendNextStepOverlay]

    MMM --> SSS[Email Capture Form]
    SSS --> TTT[Newsletter Signup Process]
    TTT --> UUU[Transition to GoProCtaOverlay]

    NNN --> VVV[Membership Sales Pitch]
    VVV --> WWW[Pricing Display with PPP]
    WWW --> XXX[Email + Payment Flow]

    OOO --> YYY[Course Navigation Options]
    YYY --> ZZZ[Search Bar for More Content]
    ZZZ --> AAAA[Related Course Suggestions]

    PPP --> BBBB[Next Lesson Recommendations]
    QQQ --> CCCC[Course Rating Interface]
    RRR --> DDDD[Learning Path Suggestions]

    EEEE[Error Scenarios] --> FFFF{Error Type}
    FFFF -->|Network Error| GGGG[Show Retry Option]
    FFFF -->|Payment Failed| HHHH[Return to Payment Form]
    FFFF -->|Subscription Sync Failed| IIII[Show Manual Refresh]
    FFFF -->|Email Validation Failed| JJJJ[Highlight Field Errors]

    KKKK[Analytics Tracking] --> LLLL[Track Overlay Shows]
    LLLL --> MMMM[Track User Interactions]
    MMMM --> NNNN[Track Conversion Events]
    NNNN --> OOOO[Track Drop-off Points]

    PPPP[Overlay State Management] --> QQQQ[XState Lesson Machine]
    QQQQ --> RRRR[State Transitions Based on User Actions]
    RRRR --> SSSS[Context Updates with User Data]
    SSSS --> TTTT[Side Effects: Analytics, API Calls]

    classDef success fill:#d4edda,color:#000
    classDef error fill:#f8d7da,color:#000
    classDef process fill:#e3f2fd,color:#000
    classDef decision fill:#ffeaa7,color:#000
    classDef overlay fill:#e1f5fe,color:#000
    classDef critical fill:#ff6b6b,color:#fff

    class G,DDD,TTT,UUU success
    class QQ,EEE,XX,GGGG,HHHH,IIII,JJJJ error
    class B,I,R,KK,OO,VV,YY,BBB process
    class C,F,N,T,MM,PP,WW,CCC,LLL decision
    class Z,EE,MMM,NNN,OOO,PPP,QQQ,RRR overlay
    class EEEE,FFFF critical
```

## Overlay Types and Triggers

### 1. **GoProCtaOverlay** (`go-pro-cta-overlay.tsx`)

**Trigger**: Lesson machine state `'subscribing'`
**When Shown**:

- Free user clicks on pro lesson
- User has exceeded free view limit
- URL contains `session_id` (returning from failed payment)

**Components**:

- Membership benefits list (`ProMemberFeatures`)
- Pricing display with PPP (Purchasing Power Parity) discounts
- Email input field (pre-filled if authenticated)
- "Access this Course" CTA button
- Link to full pricing page

**Key Logic**:

```typescript
// File: src/components/pages/lessons/overlay/go-pro-cta-overlay.tsx:126-154
const emailRequiresAProCheck =
  !isEmpty(formik.values.email) && formik.values.email !== viewer?.email

if (emailRequiresAProCheck) {
  const {hasProAccess} = await axios.post(`/api/users/check-pro-status`, {
    email: formik.values.email,
  })

  if (hasProAccess) {
    toast.error(
      `You've already got a pro account at ${formik.values.email}. Please sign in.`,
    )
    return // Prevents duplicate subscription
  }
}
```

### 2. **AnonUserOverlay** (`anon-user-overlay.tsx`)

**Trigger**: Lesson machine state `'offeringSearch'`
**When Shown**:

- Anonymous user completes a free lesson
- No session history detected (`isEmpty(prevPath)`)
- User is not authenticated and not a subscriber

**Components**:

- Course continuation card with course image and details
- "View Course" button linking to full course
- "Play Next" and "Watch Again" buttons
- Search bar pre-populated with lesson topic
- Related course recommendations (2 courses shown)

**Key Logic**:

```typescript
// File: src/components/pages/lessons/lesson/index.tsx:232-241
} else if (lesson.collection && isIncomingAnonViewer) {
  console.debug(`Showing Offer Search Overlay`)
  send(`OFFER_SEARCH`)
} else if (nextLesson) {
  console.debug(`Showing Next Lesson Overlay`)
  send(`NEXT`)
}
```

### 3. **EmailCaptureCtaOverlay** (`email-capture-cta-overlay.tsx`)

**Trigger**: Lesson machine state `'joining'`
**When Shown**:

- User needs to provide email before seeing pro content
- Transitional state before showing subscription overlay

**Components**:

- Email capture form
- Newsletter signup integration
- Transition to `GoProCtaOverlay` after email submission

### 4. **ConfirmMembershipOverlay** (`confirm-membership.tsx`)

**Trigger**: URL contains `session_id` parameter
**When Shown**:

- User returns from successful Stripe payment
- Subscription verification in progress

**Components**:

- Success message
- Subscription confirmation details
- "Start Learning" CTA to begin using pro features

## Critical Decision Points

### 1. **View Count Enforcement**

**Location**: `src/components/pages/lessons/lesson/index.tsx:268-290`
**Logic**:

```typescript
const MAX_FREE_VIEWS = 4
const viewLimitNotReached = watchCount < MAX_FREE_VIEWS

if (isEmpty(viewer) && isEmpty(cookies.get('customer')) && free_forever) {
  if (viewLimitNotReached && mediaPresent) {
    send('VIEW') // Allow viewing
  } else {
    send('SUBSCRIBE') // Show paywall
  }
}
```

### 2. **Overlay State Selection**

**Location**: `src/components/pages/lessons/overlays.tsx:44-129`
**Logic**:

```typescript
if (lessonState.matches('joining')) {
  overlayToRender = <EmailCaptureCtaOverlay />
} else if (lessonState.matches('subscribing')) {
  overlayToRender = <GoProCtaOverlay />
} else if (lessonState.matches('offeringSearch')) {
  overlayToRender = <AnonUserOverlay />
}
```

### 3. **Email Duplicate Prevention**

**Location**: `src/components/pages/lessons/overlay/go-pro-cta-overlay.tsx:129-153`
**Purpose**: Prevent users from creating duplicate subscriptions
**API Endpoint**: `/api/users/check-pro-status`

## Potential Issues in Overlay System

### Issue 1: **State Machine Synchronization**

**Problem**: Lesson machine state may not accurately reflect user's actual access level
**Symptoms**: Wrong overlay shown or overlay not dismissed after payment
**Debug**: Check lesson machine context vs actual user authentication state

### Issue 2: **Session ID Handling**

**Problem**: `session_id` parameter handling in URL may cause overlay confusion
**Location**: `src/components/pages/lessons/overlay/go-pro-cta-overlay.tsx:308-319`
**Symptoms**: User sees subscription overlay even after successful payment

### Issue 3: **View Count Cookie Issues**

**Problem**: `egghead-watch-count` cookie may be cleared or manipulated
**Impact**: Free users get more than intended free views or hit limit prematurely
**Location**: Cookie management in lesson page component

### Issue 4: **Anonymous User Detection**

**Problem**: `isIncomingAnonViewer` detection may be unreliable
**Location**: `src/components/pages/lessons/lesson/index.tsx:190-200`
**Symptoms**: Wrong overlay type shown for anonymous users

## Overlay UX Flow Issues

### 1. **Overlay Stacking**

Multiple overlays can potentially be triggered simultaneously, causing UI conflicts

### 2. **Mobile Responsiveness**

Overlays may not display correctly on mobile devices, affecting conversion

### 3. **Back Button Behavior**

Browser back button may not properly dismiss overlays or restore previous state

### 4. **Keyboard Navigation**

Overlay focus management may not be accessible for keyboard users

## Debugging Checklist

### For Overlay Display Issues:

1. **Check lesson machine current state** in browser dev tools
2. **Verify user authentication status** (`viewer` object)
3. **Check view count cookie** value and expiration
4. **Validate lesson `free_forever` flag**
5. **Test with different user types** (anon, free, pro)
6. **Check for JavaScript errors** preventing state transitions

### For Conversion Issues:

1. **Monitor email duplicate check** API response times
2. **Verify Stripe checkout redirect** is working
3. **Check session ID handling** after payment return
4. **Test PPP coupon application** logic
5. **Validate analytics tracking** for conversion funnel

This overlay system is critical for converting free users to paid subscribers and needs careful monitoring to ensure all decision points work correctly.
