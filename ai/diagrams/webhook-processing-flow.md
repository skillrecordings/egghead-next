# Webhook Processing Flow

## Description

Comprehensive webhook handling from external services including validation, processing, and error handling.

## Key Files

- `src/app/api/mux/webhook/route.ts`
- `src/app/api/deepgram/webhook/route.ts`
- `src/app/api/webhooks/sanity/route.ts`
- `src/app/api/webhooks/transloadit/route.ts`
- `src/inngest/events/*.ts`

## Trigger Points

- External service events (Mux, Deepgram, Sanity, Transloadit)
- Webhook signature validation
- Event processing and routing
- Error handling and retries

## Mermaid Diagram

```mermaid
flowchart TD
    A[External Service Event] --> B[Send Webhook Request]
    B --> C[Next.js API Route]
    C --> D[Extract Headers]
    D --> E[Validate Webhook Signature]
    E --> F{Valid Signature?}

    F -->|No| G[Return 401 Unauthorized]
    F -->|Yes| H[Parse Request Body]

    H --> I{Valid JSON?}
    I -->|No| J[Return 400 Bad Request]
    I -->|Yes| K[Identify Event Type]

    K --> L{Known Event Type?}
    L -->|No| M[Log Unknown Event]
    M --> N[Return 200 OK]

    L -->|Yes| O[Validate Event Schema]
    O --> P{Valid Schema?}
    P -->|No| Q[Log Schema Error]
    Q --> N

    P -->|Yes| R[Process Event]
    R --> S{Service Type}

    S -->|Mux| T[Handle Video Events]
    S -->|Deepgram| U[Handle Transcript Events]
    S -->|Sanity| V[Handle Content Events]
    S -->|Transloadit| W[Handle File Events]

    T --> X[Mux Event Processing]
    X --> Y{Event Subtype}
    Y -->|video.asset.created| Z[Asset Created Handler]
    Y -->|video.asset.ready| AA[Asset Ready Handler]
    Y -->|video.asset.errored| BB[Asset Error Handler]

    Z --> CC[Trigger Inngest Job]
    AA --> DD[Update Video Duration]
    BB --> EE[Log Processing Error]

    U --> FF[Deepgram Event Processing]
    FF --> GG[Extract Transcript Data]
    GG --> HH[Generate SRT Format]
    HH --> II[Trigger transcript-ready Event]

    V --> JJ[Sanity Event Processing]
    JJ --> KK{Event Action}
    KK -->|create| LL[Content Created]
    KK -->|update| MM[Content Updated]
    KK -->|delete| NN[Content Deleted]

    LL --> OO[Invalidate Cache]
    MM --> PP[Update Search Index]
    NN --> QQ[Remove from Index]

    W --> RR[Transloadit Event Processing]
    RR --> SS[Extract File Results]
    SS --> TT[Update File Records]
    TT --> UU[Trigger Processing Complete]

    CC --> VV[Background Job Execution]
    DD --> WW[Database Update]
    II --> XX[Transcript Processing]
    OO --> YY[Cache Invalidation]
    PP --> ZZ[Search Update]
    UU --> AAA[File Processing Complete]

    BBB[Error Handling] --> CCC{Error Type}
    CCC -->|Network| DDD[Log Network Error]
    CCC -->|Processing| EEE[Log Processing Error]
    CCC -->|Database| FFF[Log Database Error]

    DDD --> GGG[Return 500 Error]
    EEE --> HHH[Return 422 Error]
    FFF --> III[Return 503 Error]

    JJJ[Retry Mechanism] --> KKK{Service Retry?}
    KKK -->|Yes| LLL[Exponential Backoff]
    KKK -->|No| MMM[Manual Investigation]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef external fill:#fff3cd

    class N,CC,DD,II,VV,WW,XX success
    class G,J,Q,EE,GGG,HHH,III error
    class H,K,O,R,GG,HH,SS,TT process
    class A,B,LLL external
```

## Webhook Sources

### 1. Mux Webhooks

- **video.asset.created**: Video asset creation confirmation
- **video.asset.ready**: Video processing completion
- **video.asset.errored**: Video processing failure
- **video.upload.asset.created**: Upload completion

### 2. Deepgram Webhooks

- **transcript.completed**: Speech-to-text processing complete
- **transcript.failed**: Transcription processing failure

### 3. Sanity Webhooks

- **create**: New content document created
- **update**: Existing content modified
- **delete**: Content document removed

### 4. Transloadit Webhooks

- **ASSEMBLY_COMPLETED**: File processing pipeline complete
- **ASSEMBLY_FAILED**: File processing pipeline failure

## Security Measures

### Signature Validation

```typescript
// Mux signature validation
const signature = headers.get('mux-signature')
const isValid = verifyMuxSignature(body, signature, secret)

// Deepgram validation
const token = headers.get('authorization')
const isValid = validateDeepgramToken(token)

// Sanity validation
const signature = headers.get('sanity-webhook-signature')
const isValid = verifySanitySignature(body, signature, secret)
```

### Rate Limiting

- Prevent webhook flooding attacks
- Per-service rate limits
- IP-based restrictions for known services

### Data Validation

- JSON schema validation for event payloads
- Required field presence checks
- Data type and format validation

## Error Handling Strategy

### Immediate Response

- Always return HTTP status to sender
- Log errors for debugging
- Never expose internal system details

### Retry Logic

- **Mux**: Built-in retry with exponential backoff
- **Deepgram**: Manual retry for critical failures
- **Sanity**: Cache invalidation can be retried
- **Transloadit**: File processing can be re-triggered

### Failure Recovery

- Dead letter queues for persistent failures
- Manual investigation tools
- Alert system for critical webhooks
- Data consistency checks

## Processing Patterns

### Immediate Processing

- Simple database updates
- Cache invalidation
- Status changes

### Async Processing

- Complex business logic
- External API calls
- File processing
- Email sending

### Event Chaining

- Webhook triggers Inngest job
- Job completion triggers next job
- Multi-step processing workflows

## Monitoring & Alerting

### Success Metrics

- Webhook reception rate
- Processing success rate
- Average processing time
- Event type distribution

### Error Tracking

- Failed webhook count
- Error type categorization
- Service-specific failure rates
- Recovery success rates

### Alerting Rules

- High error rate thresholds
- Critical service failures
- Unusual traffic patterns
- Processing delays
