import Head from 'next/head'

import LearnReactContent from '@content/learn/react/index.mdx'

export default function LearnReact() {
  return (
    <>
      <Head>
        <title>badass.dev</title>
      </Head>
      <div className="prose">
        <LearnReactContent />
      </div>
    </>
  )
}
