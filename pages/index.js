import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>badass.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Welcome to badass.dev!</h1>

        <div className="grid">
          <Link href={`/search`} as={`/search`}>
            <a className="no-underline hover:underline text-blue-500">
              Search for stuff.
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}
