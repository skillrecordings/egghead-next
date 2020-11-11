import * as React from 'react'
import {getTags} from 'lib/tags'
import Link from 'next/link'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'

type TagsProps = {
  tags: any[]
}

const Tags: FunctionComponent<TagsProps> = ({tags}) => {
  return (
    <div className="grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6  grid-cols-2 sm:gap-8 gap-4 w-full mx-auto">
      {tags.map((tag) => {
        return (
          <div className="flex justify-center" key={tag.slug}>
            <Link href={`/learn/${tag.slug}`}>
              <a className="flex flex-col items-center justify-center rounded-lg hover:shadow-sm border border-transparent hover:border-gray-200 sm:p-8 p-5 w-full transition-all ease-in-out duration-150">
                <img alt="" src={tag.image_64_url} className="w-10 h-10 mb-4" />
                <span className="text-lg text-center">{tag.label}</span>
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
