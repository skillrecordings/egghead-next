import * as React from 'react'
import {sanityClient} from 'utils/sanity-client'
import Markdown from 'react-markdown'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import groq from 'groq'

const reduxClub: React.FC<any> = ({redux}) => {
  const defaultOgImage: string = `https://og-image-react-egghead.now.sh/article/${encodeURIComponent(
    `Portfolio Club: ${redux.title}`,
  )}?&theme=dark`

  const ogImage = defaultOgImage

  return (
    <>
      <NextSeo
        title={`Portfolio Club: ${redux.title}`}
        description={redux.summary}
        openGraph={{
          title: redux.title,
          description: redux.summary,
          images: [
            {
              url: ogImage,
              alt: redux.title,
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
            src={redux.image}
            alt={`Tag image of ${redux.title} `}
            width={100}
            height={100}
          />
          <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold leading-tighter mt-8">
            {redux.title}
          </h1>
          <p className="md:text-lg text-base font-semibold mt-4 text-gray-500">
            Portfolio Club ・ {redux.subTitle}
          </p>
        </div>
        <Markdown className="prose dark:prose-dark dark:prose-lg-dark prose-lg">
          {redux.description}
        </Markdown>
      </div>
    </>
  )
}

export default reduxClub

export const reduxClubQuery = groq`*[_type == 'resource' && slug.current == "build-business-oriented-portfolio"][0]{
  "redux": resources[0].resources[slug.current == "redux"][0]{
      title,
      subTitle,
      description,
      "slug": slug.current,
      image,
      summary,
    }
}`

export async function getStaticProps() {
  const {redux} = await sanityClient.fetch(reduxClubQuery)

  return {
    props: {
      redux,
    },
  }
}
