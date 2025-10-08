# Workshop Course Builder Stripe Integration Plan

**Date**: 2025-09-29
**Purpose**: Plan for integrating Course Builder's Stripe checkout sessions with egghead-next workshop pages
**Related**: See [workshop-event-database-migration-research.md](workshop-event-database-migration-proposal.md) for the database migration plan

---

## Executive Summary

This document outlines the strategy for replacing Stripe payment links with Course Builder's native checkout session creation for workshop purchases. The goal is to record all workshop purchases in the Course Builder database while maintaining a seamless user experience that auto-fills email for logged-in users.

**Key Challenge**: Users are authenticated against the egghead-rails database, but purchases need to be recorded in the Course Builder database (separate MySQL instance).

---

## 1. Current State Analysis

### 1.1 Egghead Next - Current Stripe Flow

**Payment Method**: Direct Stripe Payment Links

**Location**: `src/components/workshop/claude-code/active-sale.tsx:164`

```typescript
const paymentLink = `${workshop?.stripePaymentLink}${couponToApply.queryParam}`

// Link structure example:
// https://buy.stripe.com/XXX?prefilled_promo_code=COUPON_CODE
```

**User Flow**:

1. User clicks "Register Now" button
2. Redirects to Stripe-hosted checkout page (payment link)
3. User manually enters email and payment info
4. Stripe processes payment
5. Webhook fires → Inngest processes → Email sent
6. **No database record in Course Builder** (only in Stripe)

**Webhook Processing**: `src/inngest/utils/stripe-webhook-utils.ts:34-89`

- Detects workshop purchase by matching product ID
- Currently only sends emails
- Does **NOT** create records in Course Builder database

### 1.2 Authentication State

**Current User Session**: Managed by egghead-rails (via cookies)

- Users log in through app.egghead.io
- Session validated against egghead-rails PostgreSQL database
- User data available via tRPC queries to Rails API

**Available User Data** (when logged in):

```typescript
interface EggheadUser {
  email: string
  name: string
  id: string // egghead-rails user ID
  // ... other fields
}
```

### 1.3 Course Builder - Purchase Flow Reference

**Architecture** (from course-builder codebase):

- Also supports Stripe via `stripe` SDK primarily
- Handles checkout session creation server-side
- Records purchases in MySQL database tables:
  - `egghead_Purchase`
  - `egghead_PurchaseProduct` (join table)
  - `egghead_User` (creates if not exists)
  - `egghead_Organization` (creates if not exists)

**Example Flow** (from course-builder):

```typescript
// Create checkout session
const checkoutUrl = await createStripeCheckoutSession({
  userId: user.id,
  email: user.email,
  productId: product.id,
  couponCode: 'EARLY_BIRD',
})

// After successful payment:
// 1. Webhook received
// 2. Purchase record created
// 3. User gets access to content
```

---

## 2. Architecture Options

### Option A: Proxy Through Course Builder API (Recommended)

**Flow**:

1. Egghead-next calls Course Builder API endpoint
2. Course Builder creates Stripe checkout session
3. Returns session URL to egghead-next
4. Redirect user to Stripe checkout
5. Webhook goes to Course Builder
6. Course Builder records purchase in its database

**Advantages**:
✅ Course Builder owns entire purchase lifecycle
✅ Single source of truth for purchases
✅ Leverages existing Course Builder infrastructure
✅ Clean separation of concerns
✅ Easy to extend to other products

**Disadvantages**:
⚠️ Requires Course Builder API endpoint creation
⚠️ Cross-origin requests (needs CORS setup)
⚠️ Dependency on Course Builder availability

---

### Option B: Direct Stripe Session Creation in Egghead-next

**Flow**:

1. Egghead-next creates Stripe checkout session directly
2. Redirect user to Stripe checkout
3. Webhook fires to egghead-next
4. Egghead-next writes purchase to Course Builder database
5. Egghead-next also syncs to Course Builder via API

**Advantages**:
✅ No dependency on Course Builder API
✅ Faster initial implementation
✅ Direct control over checkout flow

**Disadvantages**:
⚠️ Duplicates purchase logic in two codebases
⚠️ Egghead-next needs direct Course Builder DB write access
⚠️ Harder to maintain consistency
⚠️ Risk of data sync issues

---

### Option C: Hybrid - Egghead Creates, Course Builder Records

**Flow**:

1. Egghead-next creates Stripe checkout session
2. Stores pending purchase metadata in egghead-rails
3. Webhook fires to both systems
4. Course Builder records purchase
5. Egghead-next updates status

**Advantages**:
✅ No Course Builder API required initially
✅ Egghead maintains control of checkout UX
✅ Course Builder gets webhook for database recording

**Disadvantages**:
⚠️ Complex webhook coordination
⚠️ Potential race conditions
⚠️ Requires webhook routing logic
⚠️ Two systems processing same event

---

## 3. Recommended Approach: Option A (Course Builder API)

### 3.1 Why Option A?

1. **Single Source of Truth**: Course Builder owns all purchase data
2. **Maintainability**: Purchase logic in one place
3. **Scalability**: Easy to add more products/workshops
4. **Existing Patterns**: Course Builder already has this infrastructure
5. **Clean Architecture**: Proper service boundaries

### 3.2 User Experience Flow

```
┌─────────────┐
│ Egghead User│
└──────┬──────┘
       │
       │ 1. Clicks "Register Now"
       ▼
┌─────────────────────────────────┐
│  Egghead-next Frontend          │
│  - Detects user session         │
│  - Prepares checkout request    │
└──────┬──────────────────────────┘
       │
       │ 2. POST /api/workshop/checkout
       │    { email, productId, couponCode }
       ▼
┌─────────────────────────────────┐
│  Egghead-next API Route         │
│  - Validates user (optional)    │
│  - Calls Course Builder API     │
└──────┬──────────────────────────┘
       │
       │ 3. POST /api/stripe/checkout-session
       │    { email, productId, metadata }
       ▼
┌─────────────────────────────────┐
│  Course Builder API             │
│  - Creates/finds user           │
│  - Creates checkout session     │
│  - Returns Stripe URL           │
└──────┬──────────────────────────┘
       │
       │ 4. Returns { checkoutUrl }
       ▼
┌─────────────────────────────────┐
│  Egghead-next Frontend          │
│  - Redirects to checkoutUrl     │
└──────┬──────────────────────────┘
       │
       │ 5. User completes payment
       ▼
┌─────────────────────────────────┐
│  Stripe                         │
│  - Processes payment            │
│  - Fires webhook                │
└──────┬──────────────────────────┘
       │
       │ 6. checkout.session.completed
       ▼
┌─────────────────────────────────┐
│  Course Builder Webhook         │
│  - Verifies webhook signature   │
│  - Creates Purchase record      │
│  - Creates/updates User         │
│  - Grants access                │
│  - Sends confirmation email     │
└─────────────────────────────────┘
```

---

## 4. Implementation Details

### 4.1 Course Builder Side (New Work)

#### API Endpoint: Create Checkout Session

**File**: `apps/egghead/src/pages/api/stripe/checkout-session.ts` (new)

```typescript
import {NextApiRequest, NextApiResponse} from 'next'
import {stripe} from '@/lib/stripe'
import {db} from '@/db'
import {users, contentResource, product} from '@/db/schema'
import {eq, and} from 'drizzle-orm'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'})
  }

  try {
    const {email, productId, couponCode, metadata} = req.body

    // 1. Validate inputs
    if (!email || !productId) {
      return res.status(400).json({error: 'Missing required fields'})
    }

    // 2. Find or create user in Course Builder
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      // Create new user (Course Builder pattern)
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          name: metadata?.name || email.split('@')[0],
        })
        .returning()
      user = newUser
    }

    // 3. Find product and pricing
    const productRecord = await db.query.product.findFirst({
      where: eq(product.id, productId),
    })

    if (!productRecord) {
      return res.status(404).json({error: 'Product not found'})
    }

    const priceId = productRecord.stripeProductId // Maps to Stripe Price ID

    // 4. Apply coupon if provided
    const sessionParams: any = {
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/workshop/claude-code/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/workshop/claude-code`,
      metadata: {
        userId: user.id,
        productId,
        source: 'egghead-next',
        ...metadata,
      },
    }

    if (couponCode) {
      // Look up Stripe coupon
      const coupon = await stripe.coupons.retrieve(couponCode)
      if (coupon) {
        sessionParams.discounts = [{coupon: couponCode}]
      }
    }

    // 5. Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    // 6. Return checkout URL
    return res.status(200).json({
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Checkout session creation failed:', error)
    return res.status(500).json({error: 'Failed to create checkout session'})
  }
}
```

#### Webhook Handler Enhancement

**File**: `apps/egghead/src/pages/api/stripe/webhook.ts` (modify)

Ensure webhook handles `checkout.session.completed` and creates:

1. User record (if not exists)
2. Organization (if not exists)
3. Purchase record
4. PurchaseProduct join record
5. Send confirmation email

**Reference**: Course Builder likely already has this - verify and extend.

---

### 4.2 Egghead-next Side (New Work)

#### API Route: Proxy to Course Builder

**File**: `src/pages/api/workshop/checkout.ts` (new)

```typescript
import {NextApiRequest, NextApiResponse} from 'next'
import {z} from 'zod'

const CheckoutRequestSchema = z.object({
  email: z.string().email(),
  productId: z.string(),
  couponCode: z.string().optional(),
  metadata: z
    .object({
      name: z.string().optional(),
      workshopSlug: z.string().optional(),
    })
    .optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'})
  }

  try {
    // Validate request
    const body = CheckoutRequestSchema.parse(req.body)

    // Call Course Builder API
    const courseBuilderUrl = process.env.COURSE_BUILDER_API_URL
    const response = await fetch(
      `${courseBuilderUrl}/api/stripe/checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.COURSE_BUILDER_API_KEY}`,
        },
        body: JSON.stringify(body),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Checkout session creation failed')
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Workshop checkout failed:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Checkout failed',
    })
  }
}
```

#### Frontend Component Update

**File**: `src/components/workshop/claude-code/active-sale.tsx` (modify)

```typescript
// Replace payment link logic with API call

const handleCheckout = async () => {
  setIsLoading(true)
  try {
    const response = await fetch('/api/workshop/checkout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: viewer?.email || '', // Auto-fill if logged in
        productId: workshop.productId,
        couponCode: getCouponCode(couponToApply), // Extract actual coupon code
        metadata: {
          name: viewer?.name,
          workshopSlug: 'claude-code',
        },
      }),
    })

    const {checkoutUrl} = await response.json()

    // Redirect to Stripe checkout
    window.location.href = checkoutUrl
  } catch (error) {
    console.error('Checkout failed:', error)
    // Show error message to user
  } finally {
    setIsLoading(false)
  }
}

// Update button to use handleCheckout instead of payment link
;<button onClick={handleCheckout}>Register Now</button>
```

#### Helper Function: Extract Coupon Code

```typescript
function getCouponCode(couponToApply: {
  queryParam: string
  type: string
}): string | undefined {
  // Extract coupon code from query param
  // ?prefilled_promo_code=COUPON_CODE → COUPON_CODE
  const match = couponToApply.queryParam.match(/prefilled_promo_code=([^&]+)/)
  return match ? match[1] : undefined
}
```

---

### 4.3 Database Schema (Course Builder)

Ensure these tables exist and are properly configured:

**`egghead_User`**:

```sql
CREATE TABLE egghead_User (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- ... other fields
)
```

**`egghead_Purchase`**:

```sql
CREATE TABLE egghead_Purchase (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  stripeChargeId VARCHAR(255),
  stripeCouponId VARCHAR(255),
  totalAmount DECIMAL(10,2),
  status VARCHAR(50),
  metadata JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES egghead_User(id)
)
```

**`egghead_Product`**:

```sql
CREATE TABLE egghead_Product (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50), -- 'event'
  status VARCHAR(50),
  stripeProductId VARCHAR(255), -- Stripe Price ID
  fields JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**`egghead_PurchaseProduct`**:

```sql
CREATE TABLE egghead_PurchaseProduct (
  id VARCHAR(255) PRIMARY KEY,
  purchaseId VARCHAR(255) NOT NULL,
  productId VARCHAR(255) NOT NULL,
  FOREIGN KEY (purchaseId) REFERENCES egghead_Purchase(id),
  FOREIGN KEY (productId) REFERENCES egghead_Product(id)
)
```

---

## 5. Cross-System Considerations

### 5.1 User Identity Mapping

**Challenge**: Users have different IDs in egghead-rails vs Course Builder

**Solution**: Use **email as the primary identifier**

- Email is unique in both systems
- Create Course Builder user on first purchase
- No need to sync user IDs

**Implications**:

- If user changes email in egghead → manual sync needed
- Consider future: unified user identity service

### 5.2 Authentication & Authorization

**Current State**:

- Egghead-next validates session via egghead-rails
- Course Builder has no knowledge of egghead sessions

**Options**:

**Option 1: No Authentication Required (Recommended)**

- Checkout flow doesn't require login
- Email field auto-filled if logged in, otherwise manual entry
- Simpler implementation
- Better conversion rate

**Option 2: Pass Session Token**

- Egghead-next passes session token to Course Builder
- Course Builder validates via egghead-rails API
- More secure, but complex
- Requires egghead-rails API endpoint

**Recommendation**: Go with Option 1 for MVP

### 5.3 CORS Configuration

**Course Builder** needs to allow requests from egghead-next:

```typescript
// apps/egghead/src/pages/api/stripe/checkout-session.ts
export const config = {
  api: {
    externalResolver: true,
  },
}

// In handler:
res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*')
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
```

### 5.4 API Authentication

**Protect Course Builder API** from unauthorized access:

**Option 1: Shared Secret (Simple)**

```typescript
// In Course Builder API
const apiKey = req.headers.authorization?.replace('Bearer ', '')
if (apiKey !== process.env.COURSE_BUILDER_API_KEY) {
  return res.status(401).json({error: 'Unauthorized'})
}
```

**Option 2: JWT (More Secure)**

- Issue JWT from egghead-next
- Verify in Course Builder
- Short expiration (5 minutes)

**Recommendation**: Shared secret for MVP, JWT for production

---

## 6. Email Auto-Fill Implementation

### 6.1 Logged-In Users

**Flow**:

1. User clicks "Register Now"
2. Frontend checks `viewer` context (from tRPC)
3. If logged in → auto-fill email in API request
4. Stripe checkout pre-fills email (via `customer_email`)

**Code**:

```typescript
// In active-sale.tsx
import {trpc} from '@/utils/trpc'

const {data: viewer} = trpc.user.current.useQuery()

const handleCheckout = async () => {
  const email = viewer?.email || '' // Auto-fill or empty
  // ... rest of checkout flow
}
```

### 6.2 Not Logged-In Users

**Flow**:

1. User clicks "Register Now"
2. Email field empty in API request
3. Stripe checkout shows email input
4. User manually enters email
5. Purchase recorded with entered email
6. New user created in Course Builder

**UX Enhancement** (Optional):

- Show login prompt before checkout
- "Sign in for faster checkout"
- Not required, just encouragement

---

## 7. Testing Strategy

### 7.1 Development Environment

**Setup**:

1. Run Course Builder locally: `pnpm dev` (port 3001)
2. Run egghead-next locally: `pnpm dev` (port 3000)
3. Use Stripe test mode
4. Use ngrok/localtunnel for webhook testing

**Test Cases**:

- [ ] Logged-in user with yearly subscription (member discount)
- [ ] Logged-in user without subscription (standard price)
- [ ] Not logged-in user (manual email entry)
- [ ] Early bird discount applied
- [ ] PPP discount applied
- [ ] Invalid coupon code handling
- [ ] Payment failure handling
- [ ] Webhook delivery and processing
- [ ] Duplicate purchase prevention

### 7.2 Staging Environment

**Requirements**:

- Staging Course Builder instance
- Staging egghead-next instance
- Stripe test mode
- Webhook routing to staging

### 7.3 Production Rollout

**Plan**:

1. Deploy Course Builder API endpoint
2. Deploy egghead-next changes (feature flag off)
3. Test end-to-end in production with test accounts
4. Enable feature flag for internal users
5. Monitor for 24 hours
6. Full rollout

---

## 8. Migration from Payment Links

### 8.1 Backward Compatibility

**During Transition**:

- Keep payment links functional
- Use feature flag to toggle between flows
- A/B test both approaches

**Feature Flag**:

```typescript
const useCourseBuilderCheckout = await getFeatureFlag(
  'featureFlagCourseBuilderCheckout',
  'enabled',
)

if (useCourseBuilderCheckout) {
  // New flow: API checkout
  handleCheckout()
} else {
  // Old flow: payment link
  window.location.href = paymentLink
}
```

### 8.2 Webhook Handling

**Challenge**: Some purchases via old payment links, some via new flow

**Solution**:

1. Course Builder webhook checks purchase metadata
2. If `source: 'egghead-next'` → new flow (already in DB)
3. If no metadata → legacy flow (create records)

### 8.3 Data Migration

**Question**: Do we need to backfill old purchases into Course Builder?

**Answer**: Depends on requirements

- If yes → write script to import from Stripe
- If no → start fresh, old data remains in Stripe only

---

## 9. Product Configuration

### 9.1 Linking Events to Products

**Course Builder Database**:

```sql
-- Event (ContentResource)
INSERT INTO egghead_ContentResource (id, type, fields) VALUES (
  'claude-code-feb-2025',
  'event',
  '{"title": "Claude Code Workshop", "slug": "claude-code-feb-2025", ...}'
)

-- Product
INSERT INTO egghead_Product (id, name, type, stripeProductId) VALUES (
  'prod_claude_code_feb',
  'Claude Code Workshop - February 2025',
  'event',
  'price_1234567890' -- Stripe Price ID
)

-- Link them
INSERT INTO egghead_ContentResourceProduct (resourceId, productId) VALUES (
  'claude-code-feb-2025',
  'prod_claude_code_feb'
)
```

### 9.2 Stripe Product Setup

**In Stripe Dashboard**:

1. Create Product: "Claude Code Workshop"
2. Create Prices:
   - Base price: $499 (recurring: no)
3. Create Coupons:
   - `EARLY_BIRD_MEMBER`: $150 off
   - `MEMBER`: $100 off
   - `EARLY_BIRD`: $75 off
   - PPP coupons: vary by country

### 9.3 Environment Variables

**Course Builder** (`.env`):

```bash
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
COURSE_BUILDER_API_KEY=cb_secret_key_...
NEXT_PUBLIC_APP_URL=https://egghead.io
ALLOWED_ORIGIN=https://egghead.io
```

**Egghead-next** (`.env.local`):

```bash
COURSE_BUILDER_API_URL=https://course-builder.egghead.io
COURSE_BUILDER_API_KEY=cb_secret_key_...
```

---

## 10. Error Handling & Edge Cases

### 10.1 API Failures

**Scenario**: Course Builder API is down

**Handling**:

```typescript
try {
  const response = await fetch(courseBuilderUrl)
  // ...
} catch (error) {
  // Fallback to payment link
  console.error('Course Builder API failed, using fallback', error)
  window.location.href = workshop.stripePaymentLink
}
```

### 10.2 Invalid Coupon Codes

**Scenario**: Coupon code doesn't exist in Stripe

**Handling**:

- Course Builder validates coupon before creating session
- Returns 400 error with message
- Frontend shows error, allows user to proceed without coupon

### 10.3 Email Mismatch

**Scenario**: User logged in with email A, manually enters email B at Stripe checkout

**Handling**:

- Stripe uses manually entered email B
- Purchase recorded under email B
- No issue, this is expected behavior
- User B gets confirmation email

### 10.4 Duplicate Purchases

**Scenario**: User tries to buy same workshop twice

**Handling**:

- Course Builder checks existing purchases
- If already purchased → show error message
- Alternative: allow multiple purchases (for gifting)

### 10.5 Webhook Failures

**Scenario**: Webhook delivery fails or times out

**Handling**:

- Stripe retries webhooks automatically
- Course Builder idempotency keys prevent duplicates
- Manual reconciliation script for edge cases

---

## 11. Monitoring & Observability

### 11.1 Logging

**Key Events to Log**:

- Checkout session creation requests
- Checkout session creation success/failure
- Webhook received
- Purchase record created
- Email sent

**Tools**:

- Course Builder: Use existing logger (Winston/Pino?)
- Egghead-next: Console logs + Vercel logs
- Consider: Sentry for error tracking

### 11.2 Metrics

**Track**:

- Checkout session creation rate
- Successful vs failed checkouts
- Payment completion rate
- Average checkout time
- API response times

**Dashboard** (Optional):

- Grafana/Datadog
- Track conversion funnel

### 11.3 Alerts

**Set up alerts for**:

- API errors > 5% in 5 minutes
- Webhook processing failures
- Stripe API errors
- Database connection issues

---

## 12. Implementation Phases

### Phase 1: Course Builder Foundation (Week 1)

**Tasks**:

- [ ] Create API endpoint: `/api/stripe/checkout-session`
- [ ] Implement user creation/lookup logic
- [ ] Implement checkout session creation
- [ ] Test with Stripe test mode
- [ ] Verify webhook handling creates purchases
- [ ] Add CORS configuration
- [ ] Add API key authentication
- [ ] Write unit tests

**Deliverables**:

- Working API endpoint
- Documentation
- Test suite

---

### Phase 2: Egghead-next Integration (Week 2)

**Tasks**:

- [ ] Create proxy API route: `/api/workshop/checkout`
- [ ] Update `active-sale.tsx` component
- [ ] Add loading/error states
- [ ] Implement email auto-fill logic
- [ ] Add feature flag toggle
- [ ] Test logged-in flow
- [ ] Test logged-out flow
- [ ] Test coupon application

**Deliverables**:

- Working checkout flow (feature-flagged)
- Updated UI components
- Error handling

---

### Phase 3: Testing & Validation (Week 3)

**Tasks**:

- [ ] End-to-end testing in dev
- [ ] Test all discount scenarios
- [ ] Test webhook delivery
- [ ] Verify purchase records created
- [ ] Verify emails sent
- [ ] Test error scenarios
- [ ] Performance testing
- [ ] Security review

**Deliverables**:

- Test report
- Bug fixes
- Performance optimizations

---

### Phase 4: Staging Deployment (Week 4)

**Tasks**:

- [ ] Deploy Course Builder to staging
- [ ] Deploy egghead-next to staging
- [ ] Configure Stripe test mode
- [ ] Configure webhooks
- [ ] End-to-end testing on staging
- [ ] Internal team testing
- [ ] Fix any issues

**Deliverables**:

- Stable staging environment
- Test results
- Documentation updates

---

### Phase 5: Production Rollout (Week 5)

**Tasks**:

- [ ] Deploy Course Builder to production
- [ ] Deploy egghead-next to production (flag off)
- [ ] Configure production Stripe webhooks
- [ ] Test with test accounts in production
- [ ] Enable feature flag for internal users (1 day)
- [ ] Monitor metrics (1 day)
- [ ] Enable feature flag for 10% of users (2 days)
- [ ] Monitor metrics
- [ ] Full rollout

**Deliverables**:

- Production deployment
- Monitoring dashboard
- Runbook for issues

---

### Phase 6: Cleanup (Week 6)

**Tasks**:

- [ ] Remove payment link code (if desired)
- [ ] Remove feature flag
- [ ] Archive old webhook handling
- [ ] Update documentation
- [ ] Team training/handoff

**Deliverables**:

- Cleaned up codebase
- Updated docs
- Team knowledge transfer

---

## 13. Rollback Plan

### If Issues in Phase 5

**Immediate Rollback**:

1. Turn off feature flag → reverts to payment links
2. No data loss (payment links still work)
3. Debug issues offline

**Conditions for Rollback**:

- Error rate > 5%
- Checkout completion rate drops > 20%
- Critical bug discovered
- Performance degradation

### Data Cleanup

**If rollback happens**:

- Purchases already in Course Builder remain
- Future purchases go through payment links
- No webhook duplication (check metadata)

---

## 14. Future Enhancements

### Post-MVP

**Potential improvements**:

1. **Unified User Identity**: Sync egghead-rails ↔ Course Builder users
2. **Direct Course Builder Login**: Users log in to Course Builder for workshop access
3. **Workshop Dashboard**: View purchased workshops in Course Builder
4. **Automatic Email Sync**: Update Course Builder when email changes in egghead
5. **Multi-Workshop Bundles**: Buy multiple workshops in one checkout
6. **Subscriptions**: Recurring workshop memberships
7. **Team Purchases**: Buy multiple seats in one transaction
8. **Gift Purchases**: Buy workshop for someone else

---

## 15. Open Questions

### For Course Builder Team

1. **API Availability**: When can the checkout session API be ready?
2. **Authentication Method**: Preference for API key vs JWT?
3. **CORS Policy**: Specific requirements for cross-origin requests?
4. **Webhook Format**: Any specific metadata requirements?
5. **Rate Limiting**: Should we implement rate limiting on the API?
6. **User Creation**: Should we validate email before creating users?
7. **Organization Assignment**: How should workshop purchasers be assigned to organizations?

### For Egghead Team

1. **User Experience**: Should we require login before checkout?
2. **Fallback Strategy**: Always fall back to payment links on error?
3. **Data Migration**: Do we need to import old purchases?
4. **Access Control**: How do users access workshop content after purchase?
5. **Confirmation Page**: Should we build a custom confirmation page?

---

## 16. Success Criteria

### Technical Metrics

- [ ] 100% of workshop purchases recorded in Course Builder
- [ ] < 1% checkout error rate
- [ ] < 2s API response time (p95)
- [ ] 100% webhook delivery success
- [ ] Zero data inconsistencies

### Business Metrics

- [ ] No decrease in conversion rate
- [ ] Faster checkout time (auto-fill email)
- [ ] Improved purchase tracking
- [ ] Easier reporting (single database)

### User Experience

- [ ] Seamless auto-fill for logged-in users
- [ ] Clear error messages
- [ ] Fast redirect to Stripe
- [ ] Reliable confirmation emails

---

## 17. Resources & References

### Documentation

- [Stripe Checkout Sessions](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Course Builder Architecture](link-to-docs)

### Code References

- Egghead-next Stripe webhook: `src/inngest/utils/stripe-webhook-utils.ts`
- Current active-sale component: `src/components/workshop/claude-code/active-sale.tsx`
- Course Builder purchase flow: `apps/egghead/src/purchase/*` (if exists)

### Related Plans

- [Workshop Database Migration](workshop-event-database-migration-proposal.md)

---

## 18. Conclusion

This plan outlines a clear path to integrate Course Builder's Stripe checkout with egghead-next workshop pages. The recommended approach (Option A: Course Builder API) provides:

✅ **Clean separation of concerns**: Course Builder owns purchases
✅ **Maintainable architecture**: Single source of truth
✅ **Scalable solution**: Easy to extend to other products
✅ **Minimal risk**: Feature-flagged rollout with rollback plan

**Next Steps**:

1. Review this plan with both teams
2. Answer open questions (Section 15)
3. Begin Phase 1: Course Builder API development
4. Coordinate deployment timeline

**Estimated Timeline**: 6 weeks from start to full production rollout

---

**Document Owner**: Engineering Team
**Last Updated**: 2025-09-29
**Status**: Planning / Awaiting Review
