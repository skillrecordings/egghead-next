import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Home from 'components/pages/home'

const IndexPage: FunctionComponent = () => {
  return (
    <>
      <NextSeo canonical={process.env.NEXT_PUBLIC_DEPLOYMENT_URL} />
      <main className="bg-gray-50 dark:bg-trueGray-900 sm:-my-5 -my-3 -mx-5 p-5">
        <div className="max-w-screen-xl mx-auto">
          <Home />
        </div>
      </main>
      <div className="dark" />
    </>
  )
}

export default IndexPage
