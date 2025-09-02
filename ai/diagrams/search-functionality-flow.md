# Search Functionality Flow

## Description

Complete search experience including query processing, results display, filtering, and pagination.

## Key Files

- `src/components/search/index.tsx`
- `src/lib/search.ts`
- `src/utils/typesense.ts`
- `src/components/search/search-box.tsx`
- `src/components/search/hits.tsx`

## Trigger Points

- User types in search box
- Filter selection changes
- Pagination navigation
- Search preset selection

## Mermaid Diagram

```mermaid
flowchart TD
    A[User Enters Search Query] --> B[Debounce Input 300ms]
    B --> C{Query Length > 2?}

    C -->|No| D[Clear Results]
    C -->|Yes| E[Build Search Parameters]

    E --> F[Include Active Filters]
    F --> G{User Authenticated?}

    G -->|Yes| H[Include User-Specific Boosts]
    G -->|No| I[Use Anonymous Search Config]

    H --> J[Send Query to Typesense]
    I --> J

    J --> K{Search Success?}

    K -->|No| L[Show Error State]
    K -->|Yes| M[Process Search Results]

    M --> N[Apply Result Formatting]
    N --> O[Extract Facet Counts]
    O --> P[Update Filter Options]
    P --> Q[Render Results Grid]

    Q --> R[Display Hit Count]
    R --> S[Show Pagination Controls]

    T[User Clicks Filter] --> U[Update URL Parameters]
    U --> V[Rebuild Search Query]
    V --> W[Execute Filtered Search]
    W --> M

    X[User Changes Page] --> Y[Update Page Parameter]
    Y --> Z[Calculate Offset]
    Z --> AA[Execute Paginated Search]
    AA --> M

    BB[Search Preset Selected] --> CC[Apply Preset Filters]
    CC --> DD[Execute Curated Search]
    DD --> EE[Show Curated Results Layout]
    EE --> FF[Include CTA Components]

    GG[No Results Found] --> HH{Has Active Filters?}
    HH -->|Yes| II[Suggest Removing Filters]
    HH -->|No| JJ[Show Browse Suggestions]

    KK[Search Analytics] --> LL[Track Query Terms]
    LL --> MM[Track Result Clicks]
    MM --> NN[Track Zero Results]
    NN --> OO[Send to PostHog]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef analytics fill:#f3e5f5

    class Q,R,S,EE success
    class L,GG error
    class E,J,M,N process
    class KK,LL,MM,NN,OO analytics
```

## Decision Points

1. **Query Length**: Minimum 3 characters to prevent excessive API calls
2. **Authentication Status**: Affects search result ranking and personalization
3. **Search Success**: Handles API failures gracefully
4. **Result Count**: Determines pagination display
5. **Active Filters**: Changes search behavior and suggestions
6. **Result Type**: Different layouts for different content types

## Error Paths

- API failure → Error state → Retry option
- Network timeout → Loading state → Automatic retry
- Zero results → Helpful suggestions → Browse alternatives
- Invalid query → Sanitization → Safe search execution

## Search Features

- **Real-time search**: As-you-type with debouncing
- **Faceted search**: Filter by type, difficulty, instructor
- **Personalization**: Boost results based on user preferences
- **Autocomplete**: Query suggestions and recent searches
- **Analytics**: Comprehensive search behavior tracking

## URL State Management

- Query parameters synchronized with search state
- Browser back/forward navigation support
- Shareable search URLs
- Filter state persistence

## Search Index Structure

- Content types: courses, lessons, podcasts, talks, tips
- Searchable fields: title, description, tags, instructor
- Facet fields: type, difficulty, duration, instructor
- Ranking factors: popularity, recency, user engagement

## Performance Optimizations

- Request debouncing to reduce API calls
- Result caching for repeated queries
- Lazy loading of result images
- Virtual scrolling for large result sets

## External Dependencies

- Typesense for search indexing and querying
- PostHog for search analytics
- Image CDN for result thumbnails
- Authentication service for personalization
