# Stripe SDK Upgrade Plan: v9.8.0 to v18.0.0

**Project:** egghead-next  
**Current Version:** 9.8.0  
**Target Version:** 18.0.0  
**Estimated Timeline:** 8-12 development days  
**Created:** 2025-08-18

## Executive Summary

This document provides a detailed, step-by-step plan to upgrade the Stripe Node.js SDK from version 9.8.0 to 18.0.0 in the egghead-next codebase. The plan includes verification steps using DeepWiki MCP, specific code migrations, and comprehensive testing procedures.

## Critical Findings

1. **API Version Mismatch:** Current codebase uses API version `2020-08-27` (very old) and `2025-08-27` (invalid future date)
2. **Multiple Stripe Initializations:** Found inconsistent Stripe client initialization patterns
3. **Breaking Method Changes:** `retrieveUpcoming()` method used in 2 critical billing files must be replaced

---

## Phase 1: Pre-Upgrade Preparation (Days 1-2)

### Step 1.1: Environment Setup

```bash
# Create a new branch for the upgrade
git checkout -b stripe-upgrade-v18

# Backup current package.json
cp package.json package.json.backup

# Document current Stripe version
npm list stripe
```

### Step 1.2: Create Test Suite

Create comprehensive tests for all Stripe functionality before making changes:

```typescript
// src/__tests__/stripe-integration.test.ts
describe('Stripe Integration Tests', () => {
  describe('Billing Portal', () => {
    test('creates billing portal session', async () => {})
    test('retrieves upcoming invoice', async () => {})
  })

  describe('Webhook Processing', () => {
    test('validates webhook signature', async () => {})
    test('processes checkout.session.completed', async () => {})
  })

  describe('Customer Management', () => {
    test('searches customers by email', async () => {})
    test('retrieves customer with expansions', async () => {})
  })
})
```

### Step 1.3: Document Current API Calls

Run this command to capture all current Stripe API usage:

```bash
# Create API usage inventory
grep -r "stripe\." src/ --include="*.ts" --include="*.tsx" > docs/stripe-api-usage-before.txt
```

### Step 1.4: Set Up Monitoring

```typescript
// Add Stripe API monitoring
// src/utils/stripe-monitor.ts
export const monitorStripeCall = async (
  method: string,
  fn: () => Promise<any>,
) => {
  const start = Date.now()
  try {
    const result = await fn()
    console.log(`[Stripe] ${method} succeeded in ${Date.now() - start}ms`)
    return result
  } catch (error) {
    console.error(`[Stripe] ${method} failed:`, error)
    throw error
  }
}
```

---

## Phase 2: Incremental Upgrade Strategy (Days 3-5)

### Step 2.1: Upgrade to Node.js 18+ (if needed)

```bash
# Check Node version
node --version

# If < 12, upgrade Node first
nvm install 18.17.1
nvm use 18.17.1
```

### Step 2.2: First Major Version Jump (9.8.0 → 11.0.0)

```bash
# Install intermediate version
pnpm add stripe@11.0.0

# Run tests
pnpm test

# Check for TypeScript errors
pnpm build
```

**Key Changes to Address:**

- Node.js 12+ requirement
- `StripeSignatureVerificationError` structure change
- Configuration method removals

### Step 2.3: Second Major Version Jump (11.0.0 → 14.0.0)

```bash
# Install next intermediate version
pnpm add stripe@14.0.0

# Run tests
pnpm test
```

**Critical Change:** `retrieveUpcoming` method removed - DO NOT DEPLOY until fixed

### Step 2.4: Final Upgrade (14.0.0 → 18.0.0)

```bash
# Install latest version
pnpm add stripe@18.0.0

# Run full test suite
pnpm test
```

---

## Phase 3: Code Migration (Days 6-8)

### Step 3.1: Fix Stripe Initialization

**Current Issues:**

1. Outdated API version `2020-08-27`
2. Invalid future API version `2025-08-27`
3. Mixed initialization patterns

**Migration:**

```typescript
// src/utils/stripe.ts
import Stripe from 'stripe'

// BEFORE (BROKEN):
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27', // Very outdated
})

export const stripeSearch = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27', // Invalid future date
})

// AFTER (FIXED):
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil', // Latest API version for v18
  typescript: true,
  maxNetworkRetries: 1, // v13+ default
})

// Remove duplicate stripeSearch, use single instance
export {stripe as stripeSearch}
```

### Step 3.2: Fix retrieveUpcoming() Calls

**File 1: src/pages/api/stripe/billing/session.ts**

```typescript
// BEFORE (line 53):
upcomingInvoice = await stripe.invoices.retrieveUpcoming({
  customer: customer_id,
})

// AFTER:
upcomingInvoice = await stripe.invoices.createPreview({
  customer: customer_id,
})
```

**File 2: src/server/routers/subscription-detail.ts**

```typescript
// BEFORE (line 56):
upcomingInvoice = await stripe.invoices.retrieveUpcoming({
  customer: customer.id,
  subscription: subscription.id,
})

// AFTER:
upcomingInvoice = await stripe.invoices.createPreview({
  customer: customer.id,
  subscription: subscription.id,
})
```

### Step 3.3: Fix Inconsistent Stripe Imports

**Files to Update:**

- `src/pages/api/stripe/billing/session.ts`
- `src/pages/api/stripe/webhook.ts`
- All other files using `require('stripe')`

```typescript
// BEFORE (inconsistent):
const stripe: Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// AFTER (consistent):
import {stripe} from '@/utils/stripe'
```

### Step 3.4: Update Webhook Handling

**File: src/pages/api/stripe/webhook.ts**

```typescript
// Verify webhook construction still works
// BEFORE:
let event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET,
)

// AFTER (should still work, but verify):
let event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!,
)
```

### Step 3.5: Update Type Definitions

```typescript
// Update any deprecated types
// Search and replace across codebase:

// BEFORE:
Stripe.Invoice

// AFTER:
import type {Stripe} from 'stripe'
// Then use: Stripe.Invoice
```

### Step 3.6: Fix Pagination Patterns

If any code uses the removed `page` parameter:

```typescript
// BEFORE:
const customers = await stripe.customers.list({page: 2})

// AFTER:
// Use auto-pagination
for await (const customer of stripe.customers.list()) {
  // Process each customer
}

// Or collect all with limit
const allCustomers = await stripe.customers
  .list()
  .autoPagingToArray({limit: 1000})
```

---

## Phase 4: Testing & Verification (Days 9-10)

### Step 4.1: Unit Test Verification

```bash
# Run all tests
pnpm test

# Run Stripe-specific tests
pnpm test stripe

# Check TypeScript compilation
pnpm build
```

### Step 4.2: Integration Test Checklist

#### Critical Path Testing

- [ ] **Billing Portal Creation**

  - Test: Create billing portal session
  - File: `src/pages/api/stripe/billing/session.ts`
  - Verify: Portal URL generation works

- [ ] **Upcoming Invoice Preview**

  - Test: Retrieve upcoming invoice with new `createPreview()`
  - Files: Both billing session files
  - Verify: Total, amount_due, line_items accessible

- [ ] **Webhook Processing**

  - Test: All webhook event types
  - File: `src/pages/api/stripe/webhook.ts`
  - Events to test:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `invoice.payment_succeeded`
    - `invoice.payment_failed`

- [ ] **Customer Search**

  - Test: Search customers by email
  - File: `src/utils/stripe-customer.ts`
  - Verify: Both search methods work

- [ ] **Workshop Purchases**
  - Test: Claude Code workshop checkout
  - Test: Cursor workshop checkout
  - Verify: Invoice generation

### Step 4.3: Staging Environment Testing

```bash
# Deploy to staging
vercel --env preview

# Test with Stripe Test Mode
export STRIPE_SECRET_KEY=sk_test_...
export STRIPE_WEBHOOK_SECRET=whsec_test_...
```

#### Staging Test Scenarios

1. **New User Purchase Flow**

   - Sign up → Select plan → Complete checkout
   - Verify: Customer created, subscription active

2. **Existing User Billing**

   - Access billing portal
   - View upcoming invoice
   - Update payment method
   - Cancel subscription

3. **Webhook Event Processing**

   - Use Stripe CLI to trigger test events

   ```bash
   stripe trigger checkout.session.completed
   stripe trigger invoice.payment_succeeded
   ```

4. **Error Handling**
   - Test with expired cards
   - Test with insufficient funds
   - Verify error messages and fallbacks

### Step 4.4: Performance Verification

```typescript
// Add performance monitoring
// src/utils/stripe-performance.ts
export const measureStripePerformance = async () => {
  const metrics = {
    customerRetrieve: 0,
    invoicePreview: 0,
    checkoutCreate: 0,
  }

  // Measure each critical operation
  const start = Date.now()
  await stripe.customers.retrieve('cus_test')
  metrics.customerRetrieve = Date.now() - start

  console.table(metrics)
}
```

---

## Phase 5: Production Deployment (Days 11-12)

### Step 5.1: Pre-Deployment Checklist

- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] No console errors in staging
- [ ] Webhook endpoints verified
- [ ] Error monitoring configured
- [ ] Rollback plan documented

### Step 5.2: Gradual Rollout

```typescript
// Implement feature flag for gradual rollout
// src/utils/feature-flags.ts
export const useNewStripeSDK = () => {
  const percentage = parseInt(process.env.NEW_STRIPE_ROLLOUT || '0')
  const userId = getCurrentUserId()
  const hash = simpleHash(userId)
  return hash % 100 < percentage
}
```

### Step 5.3: Deployment Steps

```bash
# 1. Deploy with 10% rollout
NEW_STRIPE_ROLLOUT=10 vercel --prod

# 2. Monitor for 2 hours
# Check error rates, payment success rates

# 3. Increase to 50%
NEW_STRIPE_ROLLOUT=50 vercel --prod

# 4. Monitor for 24 hours

# 5. Full rollout
NEW_STRIPE_ROLLOUT=100 vercel --prod
```

### Step 5.4: Post-Deployment Monitoring

```sql
-- Monitor key metrics (example queries)
-- Payment success rate
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_payments,
  SUM(CASE WHEN status = 'succeeded' THEN 1 ELSE 0 END) as successful,
  AVG(CASE WHEN status = 'succeeded' THEN 1 ELSE 0 END) * 100 as success_rate
FROM payments
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at);

-- Webhook processing times
SELECT
  event_type,
  AVG(processing_time_ms) as avg_time,
  MAX(processing_time_ms) as max_time,
  COUNT(*) as event_count
FROM webhook_events
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY event_type;
```

---

## Rollback Plan

If critical issues occur:

### Immediate Rollback

```bash
# 1. Revert to previous version
git checkout main
pnpm add stripe@9.8.0

# 2. Deploy immediately
vercel --prod --force

# 3. Verify services restored
```

### Code Rollback Points

Keep these git tags for quick rollback:

```bash
git tag stripe-v9.8.0-stable
git tag stripe-v11-checkpoint
git tag stripe-v14-checkpoint
git tag stripe-v18-complete
```

---

## Verification with DeepWiki MCP

Throughout the upgrade, use DeepWiki to verify:

1. **API Method Replacements**

   ```
   Query: "stripe.invoices.createPreview parameters and response"
   ```

2. **Migration Patterns**

   ```
   Query: "Stripe v18 webhook handling best practices"
   ```

3. **Error Handling**
   ```
   Query: "Stripe v18 error types and handling"
   ```

---

## Success Criteria

The upgrade is considered successful when:

1. ✅ All tests pass with v18.0.0
2. ✅ No TypeScript compilation errors
3. ✅ Webhook processing functional
4. ✅ Billing portal accessible
5. ✅ Upcoming invoices display correctly
6. ✅ Payment success rate ≥ pre-upgrade baseline
7. ✅ No increase in error rates
8. ✅ Performance metrics stable or improved

---

## Support Resources

- **Stripe Migration Guide:** https://github.com/stripe/stripe-node/blob/master/CHANGELOG.md
- **DeepWiki Stripe SDK:** Use MCP for real-time migration help
- **Stripe Support:** support@stripe.com (for critical issues)
- **Internal Slack:** #engineering-payments channel

---

## Appendix: Common Migration Patterns

### Pattern 1: Invoice Preview

```typescript
// Old (v9.8.0)
const upcoming = await stripe.invoices.retrieveUpcoming({
  customer: 'cus_123',
})

// New (v18.0.0)
const upcoming = await stripe.invoices.createPreview({
  customer: 'cus_123',
})
```

### Pattern 2: Subscription Cancellation

```typescript
// Old (deprecated del method)
await stripe.subscriptions.del('sub_123')

// New (cancel method)
await stripe.subscriptions.cancel('sub_123')
```

### Pattern 3: Error Handling

```typescript
// Old (v9.8.0)
catch (err) {
  if (err.type === 'StripeSignatureVerificationError') {
    console.log(err.detail.header)
  }
}

// New (v18.0.0)
catch (err) {
  if (err instanceof stripe.errors.StripeSignatureVerificationError) {
    console.log(err.header)
  }
}
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-08-18  
**Next Review:** After Phase 1 completion
