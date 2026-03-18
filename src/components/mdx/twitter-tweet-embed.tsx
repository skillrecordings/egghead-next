/**
 * React 19-safe Twitter/X tweet embed.
 *
 * react-twitter-embed v3 uses string refs (this.refs.*) which were removed
 * in React 19, causing a hard throw at render time. This component replaces
 * it with a useRef + useEffect approach that loads Twitter's widget script
 * dynamically and calls window.twttr.widgets.createTweet directly.
 *
 * Loaded client-side only (returns null during SSR) to avoid hydration
 * mismatches from Twitter's script injection.
 */
import * as React from 'react'

type Props = {
  tweetId: string
  options?: Record<string, unknown>
  onLoad?: (element: HTMLElement) => void
}

const TWITTER_WIDGET_URL = 'https://platform.twitter.com/widgets.js'

function loadTwitterScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve()

    const w = window as any
    if (w.twttr?.widgets) return resolve()

    const existing = document.querySelector(
      `script[src="${TWITTER_WIDGET_URL}"]`,
    )
    if (existing) {
      // Script already injected — wait for it
      existing.addEventListener('load', () => resolve())
      return
    }

    const script = document.createElement('script')
    script.src = TWITTER_WIDGET_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      console.error(
        JSON.stringify({
          event: 'twitter_embed.script_error',
          tweetId: undefined,
          ok: false,
          error: 'Failed to load Twitter widget script',
        }),
      )
      resolve() // resolve anyway so we don't hang
    }
    document.head.appendChild(script)
  })
}

export function TwitterTweetEmbed({tweetId, options, onLoad}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  // Avoid SSR — render nothing server-side
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isMounted || !containerRef.current) return

    let cancelled = false

    loadTwitterScript().then(() => {
      if (cancelled || !containerRef.current) return

      const w = window as any
      if (!w.twttr?.widgets?.createTweet) {
        console.error(
          JSON.stringify({
            event: 'twitter_embed.widget_unavailable',
            tweetId,
            ok: false,
            error: 'window.twttr.widgets.createTweet not available',
          }),
        )
        return
      }

      // Clear any previous embed attempt
      containerRef.current.innerHTML = ''

      w.twttr.widgets
        .createTweet(tweetId, containerRef.current, options ?? {})
        .then((el: HTMLElement | undefined) => {
          if (cancelled) return
          if (!el) {
            console.error(
              JSON.stringify({
                event: 'twitter_embed.create_failed',
                tweetId,
                ok: false,
                error:
                  'createTweet resolved with undefined (tweet may be deleted or private)',
              }),
            )
            return
          }
          console.log(
            JSON.stringify({
              event: 'twitter_embed.loaded',
              tweetId,
              ok: true,
            }),
          )
          onLoad?.(el)
        })
        .catch((err: unknown) => {
          if (cancelled) return
          console.error(
            JSON.stringify({
              event: 'twitter_embed.create_error',
              tweetId,
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            }),
          )
        })
    })

    return () => {
      cancelled = true
    }
  }, [isMounted, tweetId, options, onLoad])

  if (!isMounted) return null

  return (
    <div ref={containerRef} data-tweet-id={tweetId} className="twitter-embed" />
  )
}

export default TwitterTweetEmbed
