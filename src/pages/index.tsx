import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Home from 'components/pages/home'

const IndexPage: FunctionComponent = () => {
  return (
    <>
      <NextSeo
        canonical={process.env.NEXT_PUBLIC_DEPLOYMENT_URL}
        openGraph={{
          images: [
            {
              url:
                'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1614666923/next.egghead.io/cards/egghead.io-build-a-developer-blog-with-gatsby_2x.png',
            },
          ],
        }}
      />
      <main className="bg-gray-50 dark:bg-gray-900 sm:-my-5 -my-3 -mx-5 p-5">
        <div className="max-w-screen-xl mx-auto">
          <Home />
        </div>
      </main>
    </>
  )
}

export default IndexPage
