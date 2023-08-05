import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import getDependencies from 'data/courseDependencies'
import {track} from 'utils/analytics'
import {get, isEmpty} from 'lodash'

type Version = string

type CourseDependencies = {
  [TagName: string]: Version
}

type Tag = {
  name: string
  image_url: string
  label: string
}

type TagWithVersion = {
  version?: string
} & Tag

const Tags: React.FC<
  React.PropsWithChildren<{
    tags: Tag[]
    lessonSlug: string
    collectionSlug: string
  }>
> = ({tags, lessonSlug, collectionSlug}) => {
  const courseDependencies = getDependencies(collectionSlug)
  const dependencies = courseDependencies?.dependencies || {}

  const collectionTags: TagWithVersion[] = tags.map((tag: any) => {
    const version = get(dependencies, tag.name)
    return {
      ...tag,
      ...(!!version && {version}),
    }
  })

  return (
    <>
      {!isEmpty(collectionTags) && (
        <div className="flex items-center space-x-4">
          {/* <div className="font-medium">Tech used:</div> */}
          <ul className="grid items-center grid-flow-col-dense gap-5 text-sm">
            {collectionTags.map((tag: TagWithVersion, index: number) => {
              const tagImageUrl = `https://res.cloudinary.com/dg3gyk0gu/image/upload/w_72,h_72/v1683914713/tags/${tag.name}.png`

              return (
                <li key={index} className="inline-flex items-center">
                  <Link href={`/q/${tag.name}`}>
                    <a
                      onClick={() => {
                        track(`clicked view topic`, {
                          lesson: lessonSlug,
                          topic: tag.name,
                        })
                      }}
                      className="inline-flex items-center hover:underline"
                    >
                      <Image
                        src={tagImageUrl}
                        alt={tag.name}
                        width={20}
                        height={20}
                        className="flex-shrink-0"
                      />
                      <span className="ml-1">{tag.label}</span>
                      {tag.version && (
                        <span className="ml-2">
                          <code>{tag.version}</code>
                        </span>
                      )}
                    </a>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}

export default Tags
