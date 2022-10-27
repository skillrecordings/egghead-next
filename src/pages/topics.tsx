import * as React from 'react'
import {sortBy} from 'lodash'
import Link from 'next/link'
import {FunctionComponent} from 'react'
import {GetStaticProps} from 'next'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import tags from 'pages/site-directory/tags.json'
import {track} from '../utils/analytics'

type TagsProps = {
  tags: any[]
}

const Tags: FunctionComponent<TagsProps> = ({tags}) => {
  const router = useRouter()

  return (
    <>
      <NextSeo
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          site_name: 'egghead',
        }}
      />
      <div className="container grid grid-cols-2 gap-4 pt-5 pb-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 sm:gap-5 sm:pb-16">
        {tags.map((tag) => {
          return (
            <div className="flex justify-center" key={tag.slug}>
              <Link href={`/q/${tag.slug}`}>
                <a
                  onClick={() =>
                    track(`clicked topic`, {
                      location: 'topic page',
                      topic: tag.slug,
                    })
                  }
                  className="flex flex-row items-center justify-start w-full p-4 space-x-2 transition-all duration-150 ease-in-out border border-transparent rounded-lg hover:shadow-sm hover:border-gray-200 sm:p-5"
                >
                  {tag.image_64_url && (
                    <Image
                      quality={100}
                      src={tag.image_64_url}
                      alt={tag.label}
                      width={64}
                      height={64}
                    />
                  )}
                  <span className="font-medium leading-tight">{tag.label}</span>
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Tags

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      tags: sortBy(tags, ['name']),
    },
  }
}
