# Egghead-Next Event Flow Diagrams

This directory contains comprehensive documentation of all event flows, data flows, and interaction patterns in the egghead-next codebase.

## Overview

After analyzing the entire codebase (839 TypeScript/JavaScript files), these diagrams document every major flow pattern identified in the application. Each diagram includes:

- Detailed Mermaid flowchart visualization
- Trigger points and conditions
- Key files and functions involved
- Decision points and branches
- Error handling paths
- External dependencies

## Flow Categories

### 1. Authentication & User Management

- **[auth-login-flow.md](./auth-login-flow.md)** - Complete authentication flow including login, token validation, and session management

### 2. Video & Content Processing

- **[video-upload-processing-flow.md](./video-upload-processing-flow.md)** - Video file upload, Mux processing, and transcription pipeline
- **[lesson-playback-flow.md](./lesson-playback-flow.md)** - Video playback, progress tracking, and completion handling
- **[tip-creation-flow.md](./tip-creation-flow.md)** - Tip creation workflow from upload to publication

### 3. Payment & E-commerce

- **[stripe-payment-flow.md](./stripe-payment-flow.md)** - Complete payment processing including webhooks and post-purchase automation
- **[workshop-registration-flow.md](./workshop-registration-flow.md)** - Workshop quote requests, registration, and management

### 4. Learning & Progression

- **[course-progression-flow.md](./course-progression-flow.md)** - Complete learning experience from enrollment to certification
- **[search-functionality-flow.md](./search-functionality-flow.md)** - Search system including query processing, filtering, and results

### 5. Technical Infrastructure

- **[trpc-api-flow.md](./trpc-api-flow.md)** - Type-safe API communication using tRPC
- **[xstate-machine-flow.md](./xstate-machine-flow.md)** - Complex state management using XState machines
- **[inngest-background-jobs-flow.md](./inngest-background-jobs-flow.md)** - Event-driven background job processing

### 6. External Integrations

- **[webhook-processing-flow.md](./webhook-processing-flow.md)** - Webhook handling from Mux, Deepgram, Sanity, and Transloadit
- **[email-automation-flow.md](./email-automation-flow.md)** - Email system including transactional and marketing automation

### 7. User Experience & Interface

- **[form-submission-flow.md](./form-submission-flow.md)** - Form handling, validation, and submission across all form types
- **[user-navigation-flow.md](./user-navigation-flow.md)** - Navigation, routing, and route protection

### 8. Monitoring & Analytics

- **[analytics-tracking-flow.md](./analytics-tracking-flow.md)** - Comprehensive analytics including user behavior and performance monitoring

## Architecture Insights

### Key Patterns Identified

1. **Event-Driven Architecture**

   - Heavy use of Inngest for background job processing
   - Webhook-based integrations with external services
   - Event sourcing patterns for user actions

2. **Type-Safe APIs**

   - tRPC for all client-server communication
   - End-to-end type safety from database to UI
   - Zod schemas for runtime validation

3. **State Management**

   - XState machines for complex UI state
   - React Query for server state management
   - Local storage and cookies for persistence

4. **Real-time Ready**

   - Infrastructure prepared for PartyKit integration
   - WebSocket patterns for live features
   - Progressive enhancement approach

5. **Comprehensive Analytics**
   - Every user interaction tracked
   - Performance monitoring at all layers
   - Business intelligence integration

## External Dependencies

### Core Services

- **Mux**: Video hosting and processing
- **Stripe**: Payment processing
- **Sanity**: Headless CMS
- **Deepgram**: Speech-to-text transcription
- **Customer.io**: Email marketing automation
- **PostHog**: Product analytics
- **Honeycomb**: Performance monitoring
- **Typesense**: Search functionality

### Infrastructure

- **Next.js**: React framework with SSR/SSG
- **Vercel**: Deployment and hosting
- **AWS S3**: File storage
- **Inngest**: Background job processing
- **tRPC**: Type-safe APIs
- **XState**: State machine management

## Flow Interconnections

Many flows are interconnected and trigger each other:

1. **Video Upload** → **Processing** → **Email Notification** → **Analytics Tracking**
2. **User Registration** → **Authentication** → **Course Access** → **Progress Tracking**
3. **Payment** → **Webhook Processing** → **Access Grants** → **Email Automation**
4. **Form Submission** → **Validation** → **Background Jobs** → **User Communication**

## Usage Guidelines

### For Developers

- Use these diagrams to understand system behavior before making changes
- Reference specific files and line numbers provided in each diagram
- Follow established patterns when implementing new features
- Consider error paths and edge cases documented in each flow

### For DevOps/SRE

- Monitor the external dependencies identified in each flow
- Set up alerting for critical paths highlighted in error sections
- Use performance insights for optimization opportunities
- Plan capacity based on background job patterns

### For Product/Business

- Understand user experience flows for feature planning
- Identify optimization opportunities in conversion funnels
- Analyze drop-off points in user journeys
- Plan A/B tests based on decision points in flows

## Maintenance

These diagrams should be updated when:

- New features are added that create new flows
- External integrations change or are added
- State management patterns evolve
- API structures are modified
- Error handling strategies change

## Viewing the Diagrams

All diagrams use Mermaid syntax and can be viewed in:

- GitHub (native Mermaid support)
- VS Code with Mermaid extension
- Mermaid Live Editor (https://mermaid.live)
- Any Markdown viewer with Mermaid support

---

_Generated by comprehensive codebase analysis on 2025-08-28_
