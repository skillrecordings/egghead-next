# Stripe Payment Processing Flow

## Description

Complete payment processing pipeline including checkout, webhooks, and post-purchase automation.

## Key Files

- `src/server/routers/stripe.ts`
- `src/inngest/functions/stripe-webhook-handlers.ts`
- `src/inngest/functions/lifetime-purchase.ts`
- `src/components/pricing/pricing-widget/index.tsx`
- `src/app/api/stripe/webhook/route.ts`

## Trigger Points

- User selects pricing plan
- Checkout completion
- Stripe webhook events
- Subscription changes

## Mermaid Diagram

```mermaid
flowchart TD
    A[User Visits Pricing Page] --> B[Load Pricing Data]
    B --> C{PPP Coupon Available?}

    C -->|Yes| D[Show Discounted Prices]
    C -->|No| E[Show Standard Prices]

    D --> F[User Selects Plan]
    E --> F

    F --> G[Create Stripe Checkout Session]
    G --> H{Session Created?}

    H -->|No| I[Show Payment Error]
    H -->|Yes| J[Redirect to Stripe Checkout]

    J --> K[User Enters Payment Info]
    K --> L[Stripe Processes Payment]
    L --> M{Payment Success?}

    M -->|No| N[Show Payment Failed]
    N --> O[Return to Pricing Page]

    M -->|Yes| P[Stripe Sends Webhook]
    P --> Q[Webhook Handler Validates]
    Q --> R{Valid Webhook?}

    R -->|No| S[Log Security Alert]
    R -->|Yes| T[Parse Event Data]

    T --> U{Event Type}
    U -->|checkout.session.completed| V[Handle Checkout Completion]
    U -->|invoice.payment_succeeded| W[Handle Subscription Renewal]
    U -->|customer.subscription.deleted| X[Handle Cancellation]

    V --> Y{Purchase Type?}
    Y -->|Lifetime| Z[Trigger Lifetime Purchase Job]
    Y -->|Subscription| AA[Update Subscription Status]
    Y -->|Workshop| BB[Trigger Workshop Access Job]

    Z --> CC[Grant Lifetime Access]
    CC --> DD[Send Welcome Email]
    DD --> EE[Update Customer.io]
    EE --> FF[Redirect to Success Page]

    AA --> GG[Update User Account]
    GG --> HH[Send Confirmation Email]
    HH --> II[Enable Pro Features]
    II --> FF

    BB --> JJ[Grant Workshop Access]
    JJ --> KK[Send Workshop Details]
    KK --> LL[Calendar Integration]
    LL --> FF

    MM[Webhook Retry Logic] --> NN{Max Attempts?}
    NN -->|No| OO[Exponential Backoff]
    NN -->|Yes| PP[Alert Admin]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef external fill:#fff3cd

    class CC,DD,FF,GG,II success
    class I,N,S,PP error
    class G,L,Q,T,V process
    class J,P,MM external
```

## Decision Points

1. **PPP Eligibility**: Purchasing Power Parity discount availability
2. **Session Creation**: Stripe checkout session initialization
3. **Payment Processing**: Stripe handles payment validation
4. **Webhook Validation**: Security check for authentic webhooks
5. **Purchase Type**: Different flows for different product types
6. **Retry Logic**: Handles webhook delivery failures

## Error Paths

- Session creation failure → Payment error → Return to pricing
- Payment failure → User notification → Retry option
- Invalid webhook → Security logging → No processing
- Processing failure → Automatic retry → Admin alert if persistent

## Async Background Jobs

- `stripe-webhook-handlers`: Main webhook processing orchestrator
- `lifetime-purchase`: Handles lifetime membership setup
- `specific-product-purchase`: Manages workshop and course access
- Email sending jobs for confirmations and receipts

## External Dependencies

- Stripe for payment processing and checkout
- Customer.io for email automation
- Internal user management system
- Workshop scheduling system (for workshop purchases)

## Security Considerations

- Webhook signature verification
- Idempotency key handling
- Sensitive data logging restrictions
- PCI compliance for payment data
