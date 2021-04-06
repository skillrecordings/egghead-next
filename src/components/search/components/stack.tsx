import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import {loadLesson} from 'lib/lessons'
import {loadPlaylist} from 'lib/playlists'

type StackResource = {slug: string; type: string}

type StackProps = {
  resources: StackResource[]
}

const StackResourceItem = ({slug, type}: StackResource) => {
  // const loader = loadLesson
  let loader = null
  switch (type) {
    case 'lesson':
      loader = loadLesson
      break
    case 'course':
      loader = loadCourse
      break
    case 'playlist':
      loader = loadPlaylist
      break
    default:
      break
  }

  const {data: resource} = useSWR(slug, loader)
  if (!resource) return null
  return (
    <li key={resource.slug}>
      <Link href={resource.path}>
        <a className="flex items-center font-semibold py-2 hover:underline cursor-pointer leading-tight">
          {resource && (
            <div className="flex-shrink-0 flex items-center">
              <Image
                src={
                  resource.icon_url ||
                  resource.square_cover_480_url ||
                  resource.image_thumb_url
                }
                width={24}
                height={24}
                alt=""
              />
            </div>
          )}
          <span className="ml-2">{resource.title}</span>
        </a>
      </Link>
    </li>
  )
}

const Stack: FunctionComponent<StackProps> = ({resources = []}) => {
  return (
    <ul className="-mb-2">
      {resources.map((resource) => (
        <StackResourceItem
          key={resource.slug}
          slug={resource.slug}
          type={resource.type}
        />
      ))}
    </ul>
  )
}

export default Stack
