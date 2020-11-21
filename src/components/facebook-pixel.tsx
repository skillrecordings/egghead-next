import * as React from 'react'
import {useRouter} from 'next/router'

const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

export const useFacebookPixel = ({pageViewOnLoad = false}) => {
  const [fbq, setFbq] = React.useState()
  React.useEffect(() => {
    if (!FACEBOOK_PIXEL_ID) return
    let fb: any

    import('react-facebook-pixel')
      .then((module) => (fb = module.default))
      .then(() => {
        fb.init(FACEBOOK_PIXEL_ID, {
          autoConfig: true,
          debug: true,
        })
        if (pageViewOnLoad) fb.pageView()
        setFbq(fb)
      })
  }, [])

  return fbq
}

export const FacebookPixel = function () {
  const fbq: any = useFacebookPixel({pageViewOnLoad: true})
  const router = useRouter()

  React.useEffect(() => {
    if (!fbq) return

    function onRouteChange(url: string) {
      fbq.pageView()
    }

    router.events.on('routeChangeComplete', onRouteChange)
    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [])

  return null
}
