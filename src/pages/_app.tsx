import * as React from 'react'
import {AppProps, NextWebVitalsMetric} from 'next/app'
import {MDXProvider} from '@mdx-js/react'
import {ViewerProvider} from 'context/viewer-context'
import {DefaultSeo, SocialProfileJsonLd} from 'next-seo'
import AppLayout from 'components/app/layout'
import mdxComponents from 'components/mdx'
import defaultSeoConfig from 'next-seo.json'
import '@reach/listbox/styles.css'
import '@reach/dialog/styles.css'
import '@reach/tabs/styles.css'
import '../styles/index.css'
import 'focus-visible'
import {FacebookPixel} from 'components/facebook-pixel'
import {CioProvider} from 'hooks/use-cio'
import {LogRocketProvider} from 'hooks/use-logrocket'
import RouteLoadingIndicator from 'components/route-loading-indicator'
import {useRouter} from 'next/router'
import {ThemeProvider} from 'next-themes'
import {Toaster} from 'react-hot-toast'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {trpc} from 'trpc/trpc.client'

declare global {
  interface Window {
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
    gtag: any
  }
}

const queryClient = new QueryClient()

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
    const storage = window?.sessionStorage
    if (!storage) return
    // Set the previous path as the value of the current path.
    const prevPath = storage.getItem('currentPath') || ''
    storage.setItem('prevPath', prevPath)
    // Set the current path value by looking at the browser's location object.
    storage.setItem('currentPath', window.location.pathname)
  }, [router.asPath])

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
              <QueryClientProvider client={queryClient}>
                <MDXProvider components={mdxComponents}>
                  {getLayout(Component, pageProps)}
                </MDXProvider>
                <div className="print:hidden">
                  <ReactQueryDevtools />
                </div>
              </QueryClientProvider>
            </CioProvider>
          </LogRocketProvider>
        </ViewerProvider>
      </ThemeProvider>
    </>
  )
}

export default trpc.withTRPC(App)
