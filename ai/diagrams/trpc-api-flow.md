# tRPC API Communication Flow

## Description

Type-safe API communication between client and server using tRPC, including query management, caching, and error handling.

## Key Files

- `src/server/routers/_app.ts`
- `src/app/_trpc/client.ts`
- `src/app/_trpc/Provider.tsx`
- `src/server/trpc.ts`
- Various router files in `src/server/routers/`

## Trigger Points

- Component mounts requiring data
- User interactions triggering mutations
- Data invalidation and refetching
- Real-time updates

## Mermaid Diagram

```mermaid
flowchart TD
    A[Component Needs Data] --> B[Call tRPC Hook]
    B --> C{Query or Mutation?}

    C -->|Query| D[useQuery Hook]
    C -->|Mutation| E[useMutation Hook]

    D --> F{Data in Cache?}
    F -->|Yes| G[Return Cached Data]
    F -->|No| H[Make API Request]

    G --> I[Render with Data]
    H --> J[Show Loading State]
    J --> K[tRPC Client Processing]

    K --> L[Add Authentication Headers]
    L --> M[Serialize Request Data]
    M --> N[Send HTTP Request to /api/trpc]

    N --> O[tRPC Server Router]
    O --> P{Valid Route?}

    P -->|No| Q[Return 404 Error]
    P -->|Yes| R[Check Permissions]
    R --> S{Authorized?}

    S -->|No| T[Return 401/403 Error]
    S -->|Yes| U[Validate Input Schema]
    U --> V{Valid Input?}

    V -->|No| W[Return Validation Error]
    V -->|Yes| X[Execute Resolver Function]

    X --> Y{Database Operation?}
    Y -->|Yes| Z[Execute Database Query]
    Y -->|No| AA[Execute Business Logic]

    Z --> BB{Query Success?}
    BB -->|No| CC[Database Error]
    BB -->|Yes| DD[Transform Data]

    AA --> DD
    CC --> EE[Log Error]
    EE --> FF[Return Server Error]

    DD --> GG[Serialize Response]
    GG --> HH[Return Success Response]

    HH --> II[tRPC Client Receives Response]
    II --> JJ{Success Response?}

    JJ -->|No| KK[Handle Error State]
    JJ -->|Yes| LL[Update Cache]
    LL --> MM[Trigger Rerender]
    MM --> I

    KK --> NN[Show Error Message]
    NN --> OO[Retry Option Available]

    E --> PP[Mutation Execution]
    PP --> QQ[Optimistic Updates]
    QQ --> RR[Send Mutation Request]
    RR --> SS[Process Similar to Query]
    SS --> TT{Mutation Success?}

    TT -->|No| UU[Rollback Optimistic Update]
    TT -->|Yes| VV[Invalidate Related Queries]
    VV --> WW[Refetch Affected Data]
    WW --> XX[Update UI]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef cache fill:#e8f5e8

    class G,I,HH,LL,VV,XX success
    class Q,T,W,CC,FF,KK,UU error
    class K,O,X,DD,GG,PP,RR process
    class F,LL,VV cache
```

## Decision Points

1. **Query vs Mutation**: Different handling for read vs write operations
2. **Cache Hit**: Determines if network request is needed
3. **Route Validation**: Ensures requested endpoint exists
4. **Authorization**: Checks user permissions for operation
5. **Input Validation**: Zod schema validation on input data
6. **Database Success**: Handles database operation outcomes
7. **Response Processing**: Success vs error response handling

## Error Paths

- Invalid route → 404 error → Error boundary
- Unauthorized access → 401/403 error → Login redirect
- Validation failure → Client-side error → Form feedback
- Database error → Server error → Retry mechanism
- Network failure → Network error → Offline handling

## Caching Strategy

- **React Query Integration**: Automatic request deduplication
- **Cache Invalidation**: Intelligent cache updates after mutations
- **Background Refetching**: Stale-while-revalidate pattern
- **Optimistic Updates**: Immediate UI feedback for mutations

## Type Safety Features

- **End-to-End Types**: TypeScript types flow from server to client
- **Runtime Validation**: Zod schemas ensure data integrity
- **IDE Support**: Full autocomplete and type checking
- **Compile-time Errors**: Type mismatches caught during build

## Router Organization

- `course.ts` - Course-related operations
- `lesson.ts` - Lesson management
- `tips.ts` - Tip creation and management
- `progress.ts` - Learning progress tracking
- `stripe.ts` - Payment and subscription operations
- `user.ts` - User profile and preferences

## Performance Optimizations

- Request deduplication for identical queries
- Automatic background refetching
- Selective field querying
- Response compression
- Connection pooling for database operations

## External Dependencies

- React Query for client-side state management
- Zod for schema validation
- Database connection pooling
- Authentication service integration
