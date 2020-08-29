import {getTags} from '@lib/tags'
import Link from 'next/link'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'

type TagsProps = {
  tags: any[]
}

const Tags: FunctionComponent<TagsProps> = ({tags}) => {
  return (
    <div className="flex flex-wrap">
      {tags.map((tag) => {
        return (
          <div
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 mb-6"
            key={tag.slug}
          >
            <Link href={`/learn/${tag.slug}`}>
              <a className="no-underline hover:underline text-blue-500">
                <img src={tag.image_64_url} />
                {tag.label}
              </a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Tags

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  res.setHeader('Cache-Control', 's-maxage=500, stale-while-revalidate')

  const tags = await getTags()
  return {
    props: {
      tags,
    },
  }
}
