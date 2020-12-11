import * as React from 'react'
import {useRouter} from 'next/router'
import configuredAhoy from 'utils/ahoy'

export const Ahoy = function () {
  const router = useRouter()
  React.useEffect(() => {
    function onRouteChange(url: string) {
      if (window.ahoy) window.ahoy.trackView()
    }

    configuredAhoy().then((ahoy) => {
      if (ahoy) {
        window.ahoy = ahoy
        window.ahoy.trackView()
      }
    })

    router.events.on('routeChangeComplete', onRouteChange)
    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [])
  return null
}
