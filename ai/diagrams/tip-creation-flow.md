# Tip Creation and Management Flow

## Description

Complete workflow for creating, uploading, and managing video tips including form submission, video processing, and publication.

## Key Files

- `src/components/tips/tip-uploader.tsx`
- `src/module-builder/create-tip-form.tsx`
- `src/server/routers/tips.ts`
- `src/inngest/functions/tip-video-uploaded.ts`
- `src/pages/tips/new/page.tsx`

## Trigger Points

- User navigates to tip creation page
- Form submission with video
- Video upload completion
- Tip publication

## Mermaid Diagram

```mermaid
flowchart TD
    A[User Navigates to /tips/new] --> B{User Authenticated?}
    B -->|No| C[Redirect to Login]
    B -->|Yes| D{User Has Permissions?}

    D -->|No| E[Show Access Denied]
    D -->|Yes| F[Show Tip Creation Form]

    F --> G[User Fills Form Fields]
    G --> H[User Selects Video File]
    H --> I[File Validation]
    I --> J{Valid File?}

    J -->|No| K[Show Validation Error]
    K --> H
    J -->|Yes| L[Start Video Upload to S3]

    L --> M[Show Upload Progress]
    M --> N{Upload Complete?}

    N -->|No| O[Handle Upload Error]
    O --> P[Allow Retry]
    P --> L

    N -->|Yes| Q[Submit Form Data]
    Q --> R[Create Tip Record via tRPC]
    R --> S{Tip Created?}

    S -->|No| T[Show Creation Error]
    T --> U[Allow Form Retry]
    U --> Q

    S -->|Yes| V[Trigger Video Processing Job]
    V --> W[Create Mux Asset]
    W --> X[Generate Unique Filename]
    X --> Y[Create Sanity Video Resource]
    Y --> Z[Link Video to Tip]

    Z --> AA[Update Tip Status to Processing]
    AA --> BB[Navigate to Edit Page]

    CC[Background Processing] --> DD[Mux Video Processing]
    DD --> EE{Processing Complete?}
    EE -->|No| FF[Continue Processing]
    EE -->|Yes| GG[Update Video Duration]
    GG --> HH[Mark Video as Ready]

    II[Tip Edit Page] --> JJ[Load Tip Data]
    JJ --> KK{Video Ready?}
    KK -->|No| LL[Show Processing Status]
    KK -->|Yes| MM[Show Video Player]
    MM --> NN[Enable Edit Controls]

    NN --> OO[User Can Edit Metadata]
    OO --> PP[Save Changes via tRPC]
    PP --> QQ[Update Database]

    RR[Publish Action] --> SS{All Required Fields?}
    SS -->|No| TT[Show Validation Errors]
    SS -->|Yes| UU[Mark as Published]
    UU --> VV[Add to Public Feed]
    VV --> WW[Send to Search Index]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef async fill:#e1f5fe

    class BB,HH,MM,UU,VV success
    class C,E,K,O,T error
    class L,Q,R,W,Y,Z process
    class CC,DD,V async
```

## Decision Points

1. **Authentication Check**: Only logged-in users can create tips
2. **Permission Validation**: User must have tip creation permissions
3. **File Validation**: Video file type, size, and format checks
4. **Upload Success**: Determines if form processing can continue
5. **Creation Success**: Database record creation validation
6. **Processing Completion**: Video must be ready before publishing
7. **Publication Requirements**: All metadata fields must be complete

## Error Paths

- No authentication → Login redirect → Return to creation
- No permissions → Access denied message
- Invalid file → Validation error → File reselection
- Upload failure → Error message → Retry option
- Creation failure → Form error → Retry submission
- Processing failure → Admin notification → Manual review

## Form State Management

- File upload progress tracking
- Form validation state
- Submit button states
- Error message display
- Success feedback

## Background Processing

- Video upload to S3 storage
- Mux asset creation and processing
- Sanity CMS record creation
- Database relationship establishment
- Search index updates

## tRPC Mutations

- `tips.create` - Initial tip creation
- `tips.update` - Metadata updates
- `tips.publish` - Publishing state change
- `tips.delete` - Tip removal (if permitted)

## External Dependencies

- AWS S3 for video file storage
- Mux for video processing and hosting
- Sanity CMS for video metadata
- Search indexing service (Typesense)
- File type validation libraries
