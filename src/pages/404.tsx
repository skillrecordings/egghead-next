import {useRouter} from 'next/router'

export default function Custom404() {
  const router = useRouter()
  const appVersionOfPath = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}${router.asPath}`

  return (
    <div>
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
