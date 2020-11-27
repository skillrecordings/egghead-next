import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Home from 'components/pages/home'

type HomePageProps = {}

const HomePage: FunctionComponent<HomePageProps> = () => {
  return (
    <>
      <NextSeo />
      <main className="bg-gray-50 -m-5 p-5">
        <div className="max-w-screen-2xl mx-auto">
          <Home />
        </div>
      </main>
    </>
  )
}

export default HomePage
