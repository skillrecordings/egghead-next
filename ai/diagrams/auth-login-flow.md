# Authentication Login Flow

## Description

Complete user authentication flow including login, token validation, and user session management.

## Key Files

- `src/utils/auth.ts`
- `src/context/viewer-context.tsx`
- `src/machines/auth-token-polling-machine.ts`
- `src/pages/login.tsx`

## Trigger Points

- User navigates to login page
- Authentication token expires
- Protected route access attempt

## Mermaid Diagram

```mermaid
flowchart TD
    A[User Accesses Login Page] --> B{Already Authenticated?}
    B -->|Yes| C[Redirect to Dashboard]
    B -->|No| D[Show Login Form]

    D --> E[User Enters Credentials]
    E --> F[Submit to External Auth Service]
    F --> G{Authentication Success?}

    G -->|No| H[Show Error Message]
    H --> D

    G -->|Yes| I[Receive Auth Token]
    I --> J[Store Token in Cookie]
    J --> K[Start Auth Token Polling Machine]

    K --> L[Fetch User Profile]
    L --> M{Profile Fetch Success?}

    M -->|No| N[Handle Error State]
    M -->|Yes| O[Update Viewer Context]
    O --> P[Initialize Customer.io Tracking]
    P --> Q[Set User Permissions]
    Q --> R[Redirect to Intended Page]

    S[Token Polling Background] --> T{Token Still Valid?}
    T -->|Yes| U[Continue Polling]
    T -->|No| V[Clear Token]
    V --> W[Update Context to Unauthenticated]
    W --> X[Redirect to Login]

    U --> S

    classDef success fill:#d4edda
    classDef error fill:#f8d7da
    classDef process fill:#e3f2fd

    class I,O,R success
    class H,N,X error
    class F,L,P process
```

## Decision Points

1. **Authentication Status Check**: Determines if user needs to login
2. **Credentials Validation**: External auth service validates credentials
3. **Profile Fetch**: Retrieves user profile data
4. **Token Validation**: Continuous polling to check token validity

## Error Paths

- Invalid credentials → Error message → Return to login form
- Profile fetch failure → Error state handling
- Token expiration → Automatic logout and redirect

## External Dependencies

- External authentication service (app.egghead.io)
- Customer.io for user identification
- Cookie storage for token persistence
