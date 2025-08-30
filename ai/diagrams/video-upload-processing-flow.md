# Video Upload and Processing Flow

## Description

Complete pipeline for video file upload, processing, transcription, and content management.

## Key Files

- `src/inngest/functions/video-uploaded.ts`
- `src/inngest/functions/mux/mux-webhooks-handlers.ts`
- `src/inngest/functions/transcript-ready.ts`
- `src/components/upload/video-uploader.tsx`
- `src/lib/mux.ts`

## Trigger Points

- User uploads video file in tip creator
- Course lesson video upload
- Video processing completion webhooks

## Mermaid Diagram

```mermaid
flowchart TD
    A[User Selects Video File] --> B[File Upload to S3]
    B --> C{Upload Success?}

    C -->|No| D[Show Upload Error]
    C -->|Yes| E[Trigger video-uploaded Event]

    E --> F[Create Mux Video Asset]
    F --> G{Mux Asset Created?}

    G -->|No| H[Log Error & Retry]
    G -->|Yes| I[Create Sanity Video Resource]

    I --> J[Update Module Builder Record]
    J --> K[Order Deepgram Transcript]
    K --> L[Mux Processing Background]

    L --> M{Video Processing Complete?}
    M -->|No| N[Continue Processing]
    M -->|Yes| O[Trigger muxVideoAssetReady Event]

    O --> P[Update Video Duration]
    P --> Q[Mark Video as Ready]

    R[Deepgram Webhook] --> S[Trigger transcript-ready Event]
    S --> T[Process Transcript Text]
    T --> U[Generate SRT File]
    U --> V[Add SRT to Mux Asset]
    V --> W[Update Sanity with Transcript]
    W --> X[Sync to Rails Backend]

    Q --> Y[Video Ready for Playback]
    X --> Z[Transcript Available]

    Y --> AA[Enable Video Player]
    Z --> BB[Enable Closed Captions]

    CC[Error in Any Step] --> DD[Inngest Auto Retry]
    DD --> EE{Max Retries Exceeded?}
    EE -->|No| FF[Retry Step]
    EE -->|Yes| GG[Log Permanent Failure]

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd
    classDef external fill:#fff3cd

    class Q,Y,Z,AA,BB success
    class D,H,GG error
    class F,I,J,K,T,U,V,W process
    class L,R external
```

## Decision Points

1. **File Upload Success**: Determines if processing can begin
2. **Mux Asset Creation**: Critical for video processing pipeline
3. **Processing Completion**: Triggers duration update and availability
4. **Transcript Generation**: Enables accessibility features
5. **Retry Logic**: Handles transient failures with exponential backoff

## Error Paths

- Upload failure → User notification → Retry upload
- Mux asset creation failure → Log error → Inngest retry
- Processing failure → Auto retry up to max attempts
- Transcript failure → Video still available but without captions

## External Dependencies

- AWS S3 for file storage
- Mux for video processing and hosting
- Deepgram for speech-to-text transcription
- Sanity CMS for metadata storage
- Rails backend for lesson management

## Async Background Jobs

- `video-uploaded`: Orchestrates initial processing
- `muxVideoAssetCreated`: Confirms asset creation
- `muxVideoAssetReady`: Handles completion
- `transcript-ready`: Processes transcription results
