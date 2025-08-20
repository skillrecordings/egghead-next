# Stripe Node.js SDK Upgrade Analysis

**Current Version:** 9.8.0  
**Latest Version:** 18.0.0  
**Analysis Date:** 2025-08-18

## Executive Summary

The codebase is currently using Stripe Node.js SDK version 9.8.0 and needs to be upgraded to version 18.0.0. This represents a significant version jump (9 major versions) with several breaking changes that will require code modifications.

**Impact Level: MEDIUM-HIGH** - Multiple breaking changes affect the codebase, but most are manageable with targeted updates.

## Critical Breaking Changes Affecting This Codebase

### 1. ⚠️ HIGH IMPACT: `retrieveUpcoming` Method Deprecation

**Files Affected:**

- `src/pages/api/stripe/billing/session.ts:53`
- `src/server/routers/subscription-detail.ts:56`

**Issue:** The `stripe.invoices.retrieveUpcoming()` method has been removed in v14.0.0+ and replaced with `stripe.invoices.listUpcomingLines()`.

**Current Code:**

```typescript
upcomingInvoice = await stripe.invoices.retrieveUpcoming({
  customer: customer_id,
})
```

**Required Fix:**

```typescript
// Replace with listUpcomingLines for line items, or use retrieve with different parameters
const upcomingLines = await stripe.invoices.listUpcomingLines({
  customer: customer_id,
})
```

### 2. ⚠️ MEDIUM IMPACT: Webhook Construction Changes

**Files Affected:**

- `src/pages/api/stripe/webhook.ts:226`

**Issue:** In v18.0.0, `Stripe.webhooks` and `Stripe().webhooks` are now plain objects, not functions.

**Current Code:**

```typescript
let event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET,
)
```

**Status:** This specific usage pattern should continue to work, but verify after upgrade.

### 3. 🟡 LOW IMPACT: Type Definitions Updates

**Files Affected:** All files using Stripe TypeScript types

**Issue:** Many type definitions have been updated, renamed, or removed across versions.

**Examples from codebase:**

- `Stripe.Customer | Stripe.DeletedCustomer` patterns (multiple files)
- `Stripe.Charge.BillingDetails` (invoice components)
- `Stripe.BillingPortal.Session` (billing session files)

## Detailed Version-by-Version Breaking Changes

### v18.0.0 (Latest) - API Version 2025-03-31.basil

- **Removed Resources:** `SubscriptionItemUsageRecordSummary`, `SubscriptionItemUsageRecord`
- **Removed Methods:** `listUpcomingLines`, `retrieveUpcoming` on Invoice ⚠️ **AFFECTS CODEBASE**
- **Removed Methods:** `createUsageRecord`, `listUsageRecordSummaries` on SubscriptionItems
- **Field Changes:** `invoice` removed from `Charge` and `PaymentIntent`
- **Webhook Changes:** `Stripe.webhooks` now plain object, not function ⚠️ **VERIFY NEEDED**

### v17.0.0 - API Version 2024-09-30.acacia

- **Renamed:** `usage_threshold_config` to `usage_threshold` on Billing Alerts
- **Removed:** `filter` on Billing Alert parameters
- **Removed:** `customer_consent_collected` on Terminal Reader parameters

### v16.0.0 - API Version 2024-06-20

- **Removed:** `PlatformTaxFee` resource
- **Renamed:** `volume_decimal` to `quantity_decimal` on Issuing Authorization fuel details
- **Changed:** `Capabilities.Requirements.disabled_reason` is now an enum

### v15.0.0 - API Version 2024-04-10

- **Removed:** `pending_invoice_items_behavior` on Subscription creation
- **Deprecated:** `approve` and `decline` methods on Issuing Authorization
- **Deprecated:** `persistent_token` property on ConfirmationToken Link objects

### v14.0.0 - API Version 2023-10-16 ⚠️ **MAJOR IMPACT**

- **Removed:** `del` method on Subscriptions (use `cancel` instead)
- **Removed:** `retrieveUpcoming` method on Invoice ⚠️ **AFFECTS CODEBASE**
- **Removed:** Many deprecated fields and parameters
- **Removed:** Various deprecated enum values and object properties

### v13.0.0 - API Version 2023-08-16

- **Changed:** Default retry behavior from 0 to 1 retry attempt
- **Impact:** May affect error handling patterns

### v12.0.0 - API Version 2022-11-15

- **Removed:** `Stripe.default` and `Stripe.Stripe` exports
- **Impact:** Import statement changes may be needed

### v11.0.0 - API Version 2022-11-15 ⚠️ **INFRASTRUCTURE IMPACT**

- **Dropped Support:** Node.js 8 and 10 (requires Node.js 12+)
- **Changed:** `StripeSignatureVerificationError` structure
- **Removed:** `Orders` and `SKU` resources
- **Removed:** Many deprecated configuration methods
- **Removed:** `charges` field on PaymentIntent (use `latest_charge`)

### v10.0.0 - API Version 2022-08-01

- **Removed:** Various legacy resources and methods
- **Removed:** Deprecated webhook events
- **Renamed:** `InvoiceRetrieveUpcomingParams` to `InvoiceListUpcomingLinesParams`

## Files Using Stripe SDK

### Core Stripe Integration Files

- `src/utils/stripe.ts` - Main Stripe client configuration
- `src/utils/stripe-customer.ts` - Customer utilities
- `src/server/routers/stripe.ts` - tRPC Stripe router
- `src/adapters/stripe-adapter.ts` - Stripe adapter pattern

### API Routes

- `src/pages/api/stripe/webhook.ts` - Webhook handler ⚠️ **NEEDS REVIEW**
- `src/pages/api/stripe/billing/session.ts` - Billing portal ⚠️ **NEEDS UPDATE**
- `src/pages/api/stripe/checkout/session.ts` - Checkout sessions
- `src/pages/api/stripe/transaction.ts` - Transaction retrieval

### Background Jobs (Inngest)

- `src/inngest/functions/stripe-webhook-handlers.ts` - Webhook processing
- `src/inngest/functions/lifetime-purchase.ts` - Lifetime purchase handling
- `src/inngest/utils/stripe-webhook-utils.ts` - Webhook utilities
- `src/inngest/utils/stripe-helpers.ts` - General helpers

### UI Components

- Multiple invoice and billing components using Stripe types
- Workshop invoice pages using Stripe charge data
- Pricing components referencing Stripe pricing

## Recommended Upgrade Strategy

### Phase 1: Pre-Upgrade Preparation

1. **Create comprehensive test suite** for all Stripe integrations
2. **Document current API usage patterns** in detail
3. **Set up staging environment** with Stripe test mode
4. **Review webhook endpoint handling** thoroughly

### Phase 2: Incremental Upgrade

1. **Upgrade to v11.0.0 first** (major Node.js compatibility changes)
2. **Test all functionality** in staging environment
3. **Upgrade to v14.0.0** (handles major API removals)
4. **Fix `retrieveUpcoming` method calls** ⚠️ **CRITICAL**
5. **Test webhook handling** ⚠️ **CRITICAL**
6. **Upgrade to v18.0.0** (latest version)

### Phase 3: Code Updates Required

#### 1. Fix Invoice Upcoming Calls (Critical)

```typescript
// In src/pages/api/stripe/billing/session.ts and src/server/routers/subscription-detail.ts
// BEFORE (v9.8.0):
const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
  customer: customer_id,
})

// AFTER (v18.0.0):
// Option 1: Use listUpcomingLines for line items
const upcomingLines = await stripe.invoices.listUpcomingLines({
  customer: customer_id,
})

// Option 2: Use retrieve with proper parameters for invoice preview
const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
  customer: customer_id,
  // Add required parameters based on new API
})
```

#### 2. Verify Webhook Handling

```typescript
// In src/pages/api/stripe/webhook.ts
// Verify this still works after upgrade:
let event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET,
)
```

#### 3. Update Type Definitions

- Review all `Stripe.*` type imports
- Update deprecated type references
- Test TypeScript compilation

### Phase 4: Testing Checklist

#### Critical Functionality Tests

- [ ] Webhook processing (all event types)
- [ ] Billing portal session creation
- [ ] Checkout session handling
- [ ] Subscription management
- [ ] Invoice processing
- [ ] Customer management
- [ ] Payment processing
- [ ] Error handling and retries

#### Integration Tests

- [ ] Workshop purchases
- [ ] Lifetime purchases
- [ ] Subscription changes
- [ ] Failed payment handling
- [ ] Refund processing

## Risk Assessment

### HIGH RISK

- **Webhook Processing**: Changes to webhook construction could break payment processing
- **Invoice Retrieval**: `retrieveUpcoming` removal affects billing functionality
- **Background Jobs**: Inngest functions heavily use Stripe SDK

### MEDIUM RISK

- **Type Safety**: TypeScript compilation may reveal breaking changes
- **Error Handling**: Changes to error structures and retry logic
- **API Responses**: Field removals may affect data processing

### LOW RISK

- **UI Components**: Most use data passed from API routes
- **Static Configurations**: Minimal impact on UI-only code

## Cost Considerations

### Development Time Estimate

- **Phase 1 (Preparation):** 1-2 days
- **Phase 2 (Incremental Upgrade):** 2-3 days
- **Phase 3 (Code Updates):** 3-4 days
- **Phase 4 (Testing):** 2-3 days
- **Total:** 8-12 development days

### Production Risks

- **Revenue Impact**: Payment processing interruptions
- **Customer Impact**: Billing portal and subscription management
- **Support Load**: Potential increase in payment-related support tickets

## Conclusion

The upgrade from Stripe Node.js SDK 9.8.0 to 18.0.0 is necessary but requires careful planning and execution. The most critical changes affect invoice retrieval methods used in billing functionality and potentially webhook processing.

**Recommendation:** Proceed with the upgrade using the phased approach outlined above, with particular attention to testing the `retrieveUpcoming` method replacements and webhook functionality in a staging environment before production deployment.

**Next Steps:**

1. Schedule upgrade work in a dedicated sprint
2. Set up comprehensive monitoring for Stripe-related errors
3. Prepare rollback plan in case of critical issues
4. Consider gradual feature flag rollout for production deployment
