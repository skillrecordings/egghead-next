import posthog from 'posthog-js'

class PosthogClient {
  static init() {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        // Enable debug mode in development
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        },
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        autocapture: false, // Disable automatic default event capture, as we capture manually
        disable_session_recording: true, // This disables session capture by default. We can still choose to capture sessions manually. See https://posthog.com/docs/session-replay/how-to-control-which-sessions-you-record
      })
    }

    return posthog
  }

  static capture(event: string, params: any) {
    posthog.capture(event, params)
  }
}

export default PosthogClient
