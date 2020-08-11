import Head from 'next/head'

import Home from '../content/home.mdx'

export default function Index() {
  return (
    <>
      <Head>
        <title>badass.dev</title>
      </Head>
      <Home />
    </>
  )
}
