import * as React from 'react'
import {useRouter} from 'next/router'

const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

export const FacebookPixel = function () {
  const router = useRouter()
  React.useEffect(() => {
    if (!FACEBOOK_PIXEL_ID) return
    let fb: any

    function onRouteChange(url: string) {
      fb?.pageView()
    }

    import('react-facebook-pixel')
      .then((module) => (fb = module.default))
      .then(() => {
        fb?.init(FACEBOOK_PIXEL_ID, {
          autoConfig: true,
          debug: true,
        })
        fb?.pageView()
      })

    router.events.on('routeChangeComplete', onRouteChange)
    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [])
  return null
}
