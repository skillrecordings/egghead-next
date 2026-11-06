import * as React from 'react'
import Script from 'next/script'

export const SHIELD_SHIBA_WIDGET_URL =
  'https://www.postshiba.com/shield/v1/widget.js'

const SITE_KEY = process.env.NEXT_PUBLIC_SHIELD_SHIBA_SITE_KEY

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'shield-shiba': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {sitekey?: string}
    }
  }
}

// The widget sits inside a form, checks the email the visitor typed, and holds
// the form's submit until the visitor passes; then it submits the form again.
// Without a site key it renders nothing and every form submits as before.
export function useShieldShiba() {
  const [widget, setWidget] = React.useState<HTMLElement | null>(null)
  const token = React.useRef('')

  React.useEffect(() => {
    if (!widget) return

    const onVerified = (event: Event) => {
      token.current =
        (event as CustomEvent<{token?: string}>).detail?.token ?? ''
    }

    widget.addEventListener('shield-shiba:verified', onVerified)
    return () => widget.removeEventListener('shield-shiba:verified', onVerified)
  }, [widget])

  return {
    enabled: Boolean(SITE_KEY),
    widgetRef: setWidget,
    // A token redeems once, so each submit takes it.
    takeToken: () => {
      const taken = token.current
      token.current = ''
      return taken
    },
  }
}

export function ShieldShibaWidget({
  widgetRef,
}: {
  widgetRef: (element: HTMLElement | null) => void
}) {
  if (!SITE_KEY) return null

  return (
    <>
      <Script src={SHIELD_SHIBA_WIDGET_URL} strategy="afterInteractive" />
      <shield-shiba ref={widgetRef} sitekey={SITE_KEY} />
    </>
  )
}

export const signupPage = () =>
  `${window.location.origin}${window.location.pathname}`
