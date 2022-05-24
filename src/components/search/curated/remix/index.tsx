import React from 'react'
import {NextSeo} from 'next-seo'
import Image from 'next/image'
import groq from 'groq'

const SearchRemix = ({topic}: any) => {
  const location = 'Remix Topic Page'
  const description = `Build your Developer Portfolio and climb the engineering career ladder with in-depth Remix resources.`
  const title = `In-Depth Remix Resources for ${new Date().getFullYear()}`

  console.log({topic})

  return (
    <div>
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.vercel.app/topic/remix`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 items-start space-y-5 md:space-y-0 -mx-5">
        <Image layout="fill" src={topic.image} />
      </div>
    </div>
  )
}

export const remixPageQuery = groq`
*[_type == 'resource' && slug.current == "remix-landing-page"][0]{
  title,
  description,
  "image": images[label == "remix-glowing-logo"][0].url,
  "courses": resources[slug.current == "featured-courses"][0]{
    "primary": resources[slug.current == "primary-course"][0]{
      byline,
      description,
      'cta': content[0].text,
      meta,
      'title': resources[0]->title,
      'image': resources[0]->image
  },
    "second": resources[slug.current == "second-course"][0]{
      byline,
      description,
      'cta': content[0].text,
      meta,
      'title': resources[0]->title,
      'image': resources[0]->image
    }
  }
}`

export default SearchRemix
