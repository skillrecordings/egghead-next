import * as React from 'react'

export default function Custom404() {
  const [appVersionOfPath, setAppVersionOfPath] = React.useState<any>()

  React.useEffect(() => {
    setAppVersionOfPath(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/${(
        window.location.pathname + window.location.search
      ).substr(1)}`,
    )
  }, [])

  return (
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
  )
}
