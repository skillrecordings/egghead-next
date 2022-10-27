import * as React from 'react'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'

export default function Custom404() {
  const [appVersionOfPath, setAppVersionOfPath] = React.useState<any>()

  React.useEffect(() => {
    setAppVersionOfPath(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/${(
        window.location.pathname + window.location.search
      ).substr(1)}`,
    )
  }, [])

  const router = useRouter()

  return (
    <>
      <NextSeo
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          site_name: 'egghead',
        }}
      />
      <div className="container flex flex-col items-center justify-center my-24 prose dark:prose-dark">
        <h1>404 - Page Not Found</h1>
        <p>
          The page you are looking for may now live at{' '}
          <code>{process.env.NEXT_PUBLIC_AUTH_DOMAIN}</code>.
        </p>
        <p>
          Try visiting{' '}
          <a
            className="break-all"
            style={{color: '#1C64F2'}}
            href={appVersionOfPath}
          >
            {appVersionOfPath}
          </a>
          .
        </p>
      </div>
    </>
  )
}
