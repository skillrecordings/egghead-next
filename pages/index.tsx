import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>badass.dev</title>
      </Head>
      <Link href={`/search`} as={`/search`}>
        <a className="text-2xl text-center text-indigo-600">Search for stuff</a>
      </Link>
    </>
  )
}
