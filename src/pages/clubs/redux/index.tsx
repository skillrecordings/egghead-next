import * as React from 'react'
import {sanityClient} from 'utils/sanity-client'
import {reduxClubQuery} from '../../learn/developer-portfolio'
import Markdown from 'react-markdown'
import Image from 'next/image'
import {NextSeo} from 'next-seo'

const reduxClub: React.FC<any> = ({data}) => {
  const defaultOgImage: string = `https://og-image-react-egghead.now.sh/article/${encodeURIComponent(
    `Portfolio Club: ${data.redux.title}`,
  )}?&theme=dark`

  const ogImage = defaultOgImage

  return (
    <>
      <NextSeo
        title={`Portfolio Club: ${data.redux.title}`}
        description={data.redux.summary}
        openGraph={{
          title: data.redux.title,
          description: data.redux.summary,
          images: [
            {
              url: ogImage,
              alt: data.redux.title,
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: 'eggheadio',
          handle: '',
        }}
      />
      <div className="mx-auto mb-20 mt-10">
        <div className="mb-12 lg:mb-20 text-center">
          <Image
            quality={100}
            src={data.redux.image}
            alt={`Tag image of ${data.redux.title} `}
            width={100}
            height={100}
          />
          <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold leading-tighter mt-8">
            {data.redux.title}
          </h1>
          <p className="md:text-lg text-base font-semibold mt-4 text-gray-500">
            Portfolio Club ・ {data.redux.subTitle}
          </p>
        </div>
        <Markdown className="prose dark:prose-dark dark:prose-lg-dark prose-lg">
          {data.redux.description}
        </Markdown>
      </div>
    </>
  )
}

export default reduxClub

export async function getStaticProps() {
  const data = await sanityClient.fetch(reduxClubQuery)

  return {
    props: {
      data,
    },
  }
}
