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
    <div className="container">
      <div className="max-w-screen-lg py-16 mx-auto lg:py-20">
        <h1 className="pb-16 text-2xl font-bold text-center md:text-4xl">
          Articles
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
          {allArticles.allArticles.map((article: any) => {
            const fullSlug = `/blog/${article.slug.current}`
            return (
              <div key={fullSlug} className="flex flex-col">
                {article.coverImage?.url ? (
                  <div className="mb-2 md:mb-4">
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
                  <div className="mb-2 aspect-w-16 aspect-h-9 md:mb-4">
                    <Link href={fullSlug}>
                      <a>
                        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-gray-400 bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-600">
                          <IconPlaceholder />
                        </div>
                      </a>
                    </Link>
                  </div>
                )}
                <Link href={fullSlug}>
                  <a>
                    <h2 className="text-xl font-bold md:text-2xl leading-tighter">
                      {article.title}
                    </h2>
                  </a>
                </Link>

                {article.author && (
                  <div className="flex items-start mt-4 text-sm">
                    <div className="flex items-center space-x-3">
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
                          <div className="leading-tight text-gray-500 place-content-end opacity-90">
                            <UpdatedAt
                              date={friendlyTime(new Date(article.publishedAt))}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {article.description && (
                      <div className="pl-2 text-sm leading-snug opacity-70">
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
