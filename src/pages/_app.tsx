import * as React from 'react'
import {AppProps, NextWebVitalsMetric} from 'next/app'
import {CacheProvider} from '@emotion/react'
import {MDXProvider} from '@mdx-js/react'
import {ViewerProvider} from 'context/viewer-context'
import {DefaultSeo, SocialProfileJsonLd} from 'next-seo'
import {cache} from '@emotion/css'
import AppLayout from 'components/app/layout'
import mdxComponents from 'components/mdx'
import defaultSeoConfig from 'next-seo.json'
import '@reach/listbox/styles.css'
import '@reach/dialog/styles.css'
import '@reach/tabs/styles.css'
import '../styles/index.css'
import 'focus-visible'
import {ConvertkitProvider} from 'hooks/use-convertkit'
import {FacebookPixel} from 'components/facebook-pixel'
import {Ahoy} from 'components/ahoy'
import {CioProvider} from 'hooks/use-cio'
import {LogRocketProvider} from 'hooks/use-logrocket'
import RouteLoadingIndicator from 'components/route-loading-indicator'
import {useRouter} from 'next/router'
import {ThemeProvider} from 'next-themes'
import {Toaster} from 'react-hot-toast'

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
  }
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.debug(`web vitals`, metric)
}

const App: React.FC<AppProps> = ({Component, pageProps}) => {
  const AppComponent = Component as any

  const router = useRouter()

  const [state, setState] = React.useState({
    isRouteChanging: false,
    loadingKey: 0,
  })

  React.useEffect(() => {
    const handleRouteChangeStart = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }))
    }

    const handleRouteChangeEnd = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }))
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeEnd)
    router.events.on('routeChangeError', handleRouteChangeEnd)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeEnd)
      router.events.off('routeChangeError', handleRouteChangeEnd)
    }
  }, [router.events])

  const getLayout =
    AppComponent.getLayout ||
    ((Page: any) => (
      <AppLayout>
        <Page {...pageProps} />
      </AppLayout>
    ))

  return (
    <>
      <RouteLoadingIndicator isRouteChanging={state.isRouteChanging} />
      <Ahoy />
      <FacebookPixel />
      <DefaultSeo {...defaultSeoConfig} />
      <SocialProfileJsonLd
        type="Organization"
        name="egghead.io"
        url={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`}
        sameAs={['https://twitter.com/eggheadio']}
      />
      <Toaster position="bottom-center" />
      <ThemeProvider attribute="class">
        <ViewerProvider>
          <LogRocketProvider>
            <CioProvider>
              <ConvertkitProvider>
                <MDXProvider components={mdxComponents}>
                  <CacheProvider value={cache}>
                    {getLayout(Component, pageProps)}
                  </CacheProvider>
                </MDXProvider>
              </ConvertkitProvider>
            </CioProvider>
          </LogRocketProvider>
        </ViewerProvider>
      </ThemeProvider>
    </>
  )
}

export default App
