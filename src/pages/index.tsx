import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Home from 'components/pages/home'

const IndexPage: FunctionComponent = () => {
  return (
    <>
      <NextSeo />
      <main className="bg-gray-50 -m-5 p-5">
        <div className="max-w-screen-xl mx-auto">
          <Home />
        </div>
      </main>
    </>
  )
}

export default IndexPage
