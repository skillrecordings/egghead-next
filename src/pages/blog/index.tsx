import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {parse} from 'date-fns'
import friendlyTime from 'friendly-time'

import {find} from 'lodash'

const UpdatedAt: React.FunctionComponent<{date: string}> = ({date}) => (
  <div>{date}</div>
)
const Blog: React.FC = (allArticles: any) => {
  return (
    <div className="mx-auto max-w-screen-lg lg:py-16 py-10">
      <h1 className="md:text-4xl text-2xl text-center font-bold pb-16">
        Articles
      </h1>
      <div className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-8">
        {allArticles.allArticles.map((article: any) => {
          const fullSlug = `/blog/${article.slug.current}`
          return (
            <div key={fullSlug} className="flex flex-col">
              {article.coverImage?.url ? (
                <div className="md:mb-4 mb-2">
                  <Link href={fullSlug}>
                    <a>
                      <Image
                        src={article.coverImage.url}
                        alt={article.coverImage.alt || article.title}
                        width={1280}
                        height={720}
                        quality={100}
                        className="rounded-lg"
                      />
                    </a>
                  </Link>
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 md:mb-4 mb-2">
                  <Link href={fullSlug}>
                    <a>
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-600">
                        <IconPlaceholder />
                      </div>
                    </a>
                  </Link>
                </div>
              )}
              <Link href={fullSlug}>
                <a>
                  <h2 className="md:text-2xl text-xl font-bold leading-tighter">
                    {article.title}
                  </h2>
                </a>
              </Link>

              {article.author && (
                <div className="mt-4 flex items-start text-sm">
                  <div className="items-center flex space-x-3">
                    <Image
                      src={article.author.image}
                      alt={article.author.name}
                      quality={100}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex flex-col w-40">
                      <div className="flex-none leading-tight opacity-90">
                        {article.author.name}
                      </div>
                      {article.publishedAt && (
                        <div className="place-content-end text-gray-500 leading-tight opacity-90">
                          <UpdatedAt
                            date={friendlyTime(new Date(article.publishedAt))}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {article.description && (
                    <div className="opacity-70 text-sm leading-snug  pl-2">
                      {article.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Blog

const IconPlaceholder = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
        fill="currentColor"
      />
    </g>
  </svg>
)

const allArticlesQuery = groq`
*[_type == "post" && publishedAt < now()]|order(publishedAt desc) {
  title,
  slug,
  coverImage,
  description,
  publishedAt,
  "author": authors[0].author-> {
    name, 
   'image': image.url,
   }
}
`

export async function getStaticProps() {
  const allArticles = await sanityClient.fetch(allArticlesQuery)

  return {
    props: {
      allArticles,
    },
  }
}
