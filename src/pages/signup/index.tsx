import * as React from 'react'
import Header from '@/components/pages/landing/header'
import Article from '@/components/pages/landing/article/index.mdx'
import Browse from '@/components/pages/landing/browse'

const SignupPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Article />
        <Browse />
      </main>
    </>
  )
}

export default SignupPage
