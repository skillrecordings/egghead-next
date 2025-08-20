# Task: Upgrade Stripe Node.js SDK from v9.8.0 to v18.0.0

## Commit 1: test: add comprehensive Stripe integration test suite

**Description:**
Create a comprehensive test suite to validate all existing Stripe functionality before beginning the upgrade. This will establish a baseline for regression testing during the single-pass upgrade. Tests will cover critical paths in `src/pages/api/stripe/webhook.ts`, `src/pages/api/stripe/billing/session.ts`, `src/server/routers/stripe.ts`, and `src/utils/stripe-customer.ts`. The test suite will be created at `src/__tests__/stripe/` with individual test files for webhook processing, billing portal, customer management, and checkout flows. Mock Stripe responses using `stripe-mock` or manual mocks. Configure test logger at `src/__tests__/stripe/test-logger.ts` to capture Stripe API call logs during tests. These tests must validate current v9.8.0 behavior before the upgrade.

**Verification:**

1. **Automated Test(s):**
   - **Command:** `pnpm test src/__tests__/stripe/billing-portal.test.ts`
   - **Expected Outcome:** `All tests pass, verifying retrieveUpcoming() returns invoice with total, amount_due, and line_items for test customer using v9.8.0 SDK`
2. **Logging Check:**
   - **Action:** `Run tests with LOG_LEVEL=debug pnpm test src/__tests__/stripe/`
   - **Expected Log:** `DEBUG: Stripe API call: invoices.retrieveUpcoming for customer cus_test_123 completed in XXXms`
   - **Toggle Mechanism:** `LOG_LEVEL environment variable (debug|info|warn|error)`

---

## Commit 2: feat: upgrade Stripe SDK to v18.0.0 with all breaking change fixes

**Description:**
Perform single-pass upgrade from v9.8.0 to v18.0.0 in `package.json` using `pnpm add stripe@18.0.0`. Fix all breaking changes in a single commit. Update `src/utils/stripe.ts` to use API version `2025-03-31.basil` and remove duplicate stripeSearch client (consolidate to single export). Replace `stripe.invoices.retrieveUpcoming()` with `stripe.invoices.createPreview()` in `src/pages/api/stripe/billing/session.ts` (line 53) and `src/server/routers/subscription-detail.ts` (line 56). Update all direct Stripe imports in `src/pages/api/stripe/billing/session.ts`, `src/pages/api/stripe/webhook.ts`, and other files to use centralized client from `@/utils/stripe`. Verify webhook handling still works with `stripe.webhooks.constructEvent()` as plain object. Update all TypeScript type imports to use `import type { Stripe } from 'stripe'`. Add structured logging for all Stripe operations with performance metrics.

**Verification:**

1. **Automated Test(s):**
   - **Command:** `pnpm build && pnpm test src/__tests__/stripe/`
   - **Expected Outcome:** `TypeScript compilation succeeds with v18.0.0 types, all tests pass confirming createPreview() works correctly and returns expected invoice data`
2. **Logging Check:**
   - **Action:** `Start dev server with pnpm dev and make test API call to billing session endpoint`
   - **Expected Log:** `INFO: Stripe client initialized with API version: 2025-03-31.basil | INFO: Invoice preview created for customer: cus_123, total: $99.00`
   - **Toggle Mechanism:** `STRIPE_DEBUG=true enables detailed Stripe operation logging`

---

## Commit 3: test: validate webhook processing with Stripe v18.0.0

**Description:**
Add comprehensive webhook validation tests specifically for v18.0.0 changes. Create `src/__tests__/stripe/webhook-v18.test.ts` to test all webhook event types used in `src/pages/api/stripe/webhook.ts` and `src/inngest/functions/stripe-webhook-handlers.ts`. Test events include: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, and `invoice.payment_failed`. Verify that `stripe.webhooks.constructEvent()` works correctly as a plain object method in v18.0.0. Add webhook signature validation tests with invalid signatures to ensure error handling. Create webhook event fixtures in `src/__tests__/stripe/fixtures/webhook-events/` for each event type. Add performance logging to track webhook processing times.

**Verification:**

1. **Automated Test(s):**
   - **Command:** `pnpm test src/__tests__/stripe/webhook-v18.test.ts --coverage`
   - **Expected Outcome:** `All webhook event types process successfully, signature validation works, constructEvent returns valid typed events`
2. **Logging Check:**
   - **Action:** `Trigger test webhook using Stripe CLI: stripe trigger checkout.session.completed --stripe-version 2025-03-31.basil`
   - **Expected Log:** `INFO: Webhook event checkout.session.completed v18 processed in XXXms | DEBUG: Event data validated with signature`
   - **Toggle Mechanism:** `WEBHOOK_DEBUG=true for detailed webhook logs, PERF_MONITORING=true for timing metrics`

---

## Commit 4: feat: add production safety features and monitoring

**Description:**
Implement production safety features for the v18.0.0 upgrade. Add feature flag `STRIPE_V18_VALIDATION_MODE` in `src/lib/feature-flags.ts` to enable extra validation in production. Create monitoring wrapper in `src/utils/stripe-monitor.ts` that tracks all Stripe API calls, response times, and error rates. Add health check endpoint at `src/pages/api/stripe/health.ts` that validates Stripe client initialization and performs a test customer list operation. Implement graceful degradation in `src/utils/stripe-fallback.ts` for critical operations if v18.0.0 encounters issues. Add comprehensive error logging with stack traces for any Stripe API failures. Create dashboard metrics exporter in `src/utils/stripe-metrics.ts` that sends performance data to monitoring service.

**Verification:**

1. **Automated Test(s):**
   - **Command:** `pnpm test src/__tests__/stripe/production-safety.test.ts`
   - **Expected Outcome:** `Health check returns 200 with Stripe version info, monitoring wrapper captures metrics, fallback handler activates on errors`
2. **Logging Check:**
   - **Action:** `Call health check endpoint: curl http://localhost:3000/api/stripe/health`
   - **Expected Log:** `INFO: Stripe health check passed - SDK: v18.0.0, API: 2025-03-31.basil, Test customer list: OK`
   - **Toggle Mechanism:** `STRIPE_MONITORING=true enables metrics collection, STRIPE_V18_VALIDATION_MODE=true adds extra validation logging`

---

## Commit 5: docs: document v18.0.0 upgrade and create rollback procedures

**Description:**
Create comprehensive documentation for the v18.0.0 upgrade. Write migration guide at `docs/stripe-v18-migration-guide.md` documenting all breaking changes addressed, new patterns implemented, and verification steps. Create rollback procedure at `docs/stripe-v18-rollback.md` with exact steps to revert to v9.8.0 if critical issues arise. Update `README.md` with new Stripe SDK version requirement. Document all new environment variables in `.env.example`: `STRIPE_DEBUG`, `STRIPE_MONITORING`, `STRIPE_V18_VALIDATION_MODE`, `WEBHOOK_DEBUG`, `PERF_MONITORING`. Create runbook at `docs/stripe-v18-runbook.md` with common troubleshooting scenarios and solutions. Add inline code comments in all modified files explaining v18.0.0 specific changes. Generate API comparison report showing differences between v9.8.0 and v18.0.0 method calls.

**Verification:**

1. **Automated Test(s):**
   - **Command:** `pnpm test:docs --file docs/stripe-v18-migration-guide.md`
   - **Expected Outcome:** `Documentation validates against schema, all code examples compile, environment variables documented match codebase`
2. **Logging Check:**
   - **Action:** `Run documentation generator: pnpm docs:generate`
   - **Expected Log:** `INFO: Generated Stripe v18 documentation - 5 files created, 0 warnings, migration guide complete`
   - **Toggle Mechanism:** `DOCS_VERBOSE=true for detailed documentation generation logs`
