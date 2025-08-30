# Workshop Registration and Management Flow

## Description

Complete workshop registration process including quote requests, payment processing, and participant management.

## Key Files

- `src/components/workshop/claude-code/contact-form.tsx`
- `src/app/api/workshop-quote/route.ts`
- `src/inngest/functions/send-workshop-quote-email.ts`
- `src/components/pricing/select-plan-new/index.tsx`

## Trigger Points

- User submits workshop quote form
- Workshop payment completion
- Workshop session scheduling
- Email notifications

## Mermaid Diagram

```mermaid
flowchart TD
    A[User Visits Workshop Page] --> B[View Workshop Details]
    B --> C{Individual or Team?}

    C -->|Individual| D[Show Individual Pricing]
    C -->|Team| E[Show Team Quote Form]

    D --> F[Select Workshop Session]
    F --> G[Proceed to Checkout]
    G --> H[Standard Payment Flow]
    H --> I[Send Confirmation Email]
    I --> J[Add to Workshop Session]

    E --> K[Fill Team Information]
    K --> L[Number of Participants]
    L --> M[Preferred Dates]
    M --> N[Special Requirements]
    N --> O[Submit Quote Request]

    O --> P[Validate Form Data]
    P --> Q{Valid Data?}

    Q -->|No| R[Show Validation Errors]
    R --> K

    Q -->|Yes| S[Trigger Workshop Quote Event]
    S --> T[Generate Quote ID]
    T --> U[Store Request in Database]
    U --> V[Send Quote Request Email]

    V --> W[Sales Team Reviews]
    W --> X[Custom Quote Generation]
    X --> Y[Send Proposal to Client]

    Y --> Z{Client Accepts?}
    Z -->|No| AA[Follow-up or Close]
    Z -->|Yes| BB[Create Custom Checkout]

    BB --> CC[Client Completes Payment]
    CC --> DD[Workshop Access Granted]
    DD --> EE[Schedule Workshop Session]
    EE --> FF[Send Calendar Invites]
    FF --> GG[Create Workshop Materials Access]

    HH[Workshop Day] --> II[Send Reminder Emails]
    II --> JJ[Workshop Delivery]
    JJ --> KK[Post-Workshop Survey]
    KK --> LL[Certificate Generation]
    LL --> MM[Follow-up Resources]

    NN[Error Handling] --> OO{Error Type?}
    OO -->|Email Failure| PP[Retry Email Send]
    OO -->|Payment Issue| QQ[Contact Support]
    OO -->|System Error| RR[Alert Admin]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef external fill:#fff3cd

    class I,J,DD,GG,LL success
    class R,AA,QQ,RR error
    class P,S,U,V,CC process
    class W,X,HH,JJ external
```

## Decision Points

1. **Registration Type**: Individual vs team registration paths
2. **Form Validation**: Required fields and business rules
3. **Quote Acceptance**: Client decision on custom proposal
4. **Payment Completion**: Successful payment processing
5. **Workshop Scheduling**: Date and resource availability

## Error Paths

- Form validation failure → Error display → Form correction
- Email delivery failure → Automatic retry → Manual follow-up
- Payment processing error → Payment retry → Support contact
- Workshop scheduling conflict → Alternative dates → Resolution

## Quote Request Process

- Team size and requirements assessment
- Custom pricing calculation
- Sales team review and approval
- Personalized proposal generation
- Client negotiation and acceptance

## Workshop Delivery Flow

- Pre-workshop preparation and materials
- Participant onboarding and setup
- Live workshop session delivery
- Post-workshop resources and follow-up
- Certificate and completion tracking

## Email Automation

- Quote request confirmation
- Sales team notification
- Payment confirmation
- Workshop reminders and preparation
- Post-workshop follow-up

## External Dependencies

- Email delivery service for notifications
- Calendar integration for scheduling
- Payment processing via Stripe
- Workshop materials hosting
- Certificate generation system

## Data Tracking

- Quote conversion rates
- Workshop completion metrics
- Participant satisfaction scores
- Revenue and pricing analytics
