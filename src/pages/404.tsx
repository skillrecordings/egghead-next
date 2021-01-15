export default function Custom404() {
  const appVersionOfPath = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}${(
    window.location.pathname + window.location.search
  ).substr(1)}`

  return (
    <div className="prose">
      <h1>404 - Page Not Found</h1>
      <p>
        The page you are looking for may now live at{' '}
        <code>{process.env.NEXT_PUBLIC_AUTH_DOMAIN}</code>. Try visiting{' '}
        <a style={{color: '#1C64F2'}} href={appVersionOfPath}>
          {appVersionOfPath}
        </a>
        .
      </p>
    </div>
  )
}
