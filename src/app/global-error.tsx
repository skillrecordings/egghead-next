'use client'

import * as React from 'react'

/**
 * App Router fallback for uncaught errors.
 *
 * Without this, App Router routes (`/`, `/lessons/[slug]/embed`) fall back
 * to the Pages Router `500.html`, which is not bundled into their functions
 * and fails with ENOENT on top of the original error.
 */
// The root layout is replaced here, so global CSS is not loaded.
const styles: Record<string, React.CSSProperties> = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '4rem 1.25rem',
    textAlign: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  code: {fontSize: '6rem', fontWeight: 800, margin: '0 0 1rem'},
  title: {fontSize: '1.75rem', fontWeight: 700, margin: '0 0 1rem'},
  body: {fontSize: '1.125rem', maxWidth: '28rem', margin: '0 0 1.5rem'},
  actions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primary: {
    padding: '0.75rem 1.25rem',
    borderRadius: '0.375rem',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 500,
    textDecoration: 'none',
  },
  secondary: {
    padding: '0.75rem 1.25rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    color: 'inherit',
    fontWeight: 500,
    textDecoration: 'none',
  },
}

export default function GlobalError({
  error,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <main style={styles.main}>
          <h1 style={styles.code}>500</h1>
          <h2 style={styles.title}>Well dang, something broke on our end.</h2>
          <p style={styles.body}>
            This isn&apos;t your fault. If you tell us what you were trying to
            view, we can fix it faster.
          </p>
          <div style={styles.actions}>
            <a href="/" style={styles.primary}>
              Go back home
            </a>
            <a
              href="mailto:support@egghead.io?subject=Error Report"
              style={styles.secondary}
            >
              Report the problem
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
