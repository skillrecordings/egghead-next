import * as React from 'react'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {sanityClient} from '@/utils/sanity-client'
import friendlyTime from 'friendly-time'
import {allArticlesQuery} from '@/lib/articles'
import {useRouter} from 'next/router'
import {NextSeo} from 'next-seo'

const UpdatedAt: React.FunctionComponent<
  React.PropsWithChildren<{date: string}>
> = ({date}) => <div>{date}</div>
const Blog: React.FC<React.PropsWithChildren<unknown>> = (allArticles: any) => {
  const router = useRouter()

  return (
    <>
      <NextSeo
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        titleTemplate={'%s | conference talk | egghead.io'}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          site_name: 'egghead',
        }}
      />
      <div className="container">
        <div className="max-w-screen-lg py-16 mx-auto lg:py-20">
          <h1 className="pb-16 text-2xl font-bold text-center md:text-4xl">
            Articles
          </h1>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            {allArticles.allArticles.map((article: any) => {
              const fullSlug = `/blog/${article.slug.current}`
              return (
                <Link href={fullSlug}>
                  <div
                    key={fullSlug}
                    className="flex h-full flex-col justify-between rounded-lg border border-gray-100 px-5 py-8 dark:border-gray-800 md:px-8 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all ease-in-out"
                  >
                    <h2 className="text-balance text-xl sm:text-2xl font-bold">
                      {article.title}
                    </h2>

                    {article.description && (
                      <div className="line-clamp-3 w-full pt-3 text-gray-600 dark:text-gray-400">
                        {article.description}
                      </div>
                    )}
                    <div className="relative z-10 flex sm:w-full flex-row items-center justify-between pt-8">
                      {article.author && (
                        <div className="flex w-full items-center gap-10 text-sm text-gray-700 dark:text-gray-300">
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
                              <span className="font-bold">Written By</span>
                              <div className="flex-none leading-tight opacity-90">
                                {article.author.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col w-40 text-sm m-0">
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                          Published
                        </span>
                        {article.publishedAt && (
                          <div className="leading-tight text-gray-500 dark:text-gray-300 place-content-end opacity-90">
                            <UpdatedAt
                              date={friendlyTime(new Date(article.publishedAt))}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
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

export async function getStaticProps() {
  const allArticles = await sanityClient.fetch(allArticlesQuery)

  return {
    props: {
      allArticles,
    },
  }
}
