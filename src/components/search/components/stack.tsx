import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import {loadLesson} from 'lib/lessons'
import {loadPlaylist} from 'lib/playlists'

type StackProps = {
  resources: any[]
}

const Stack: FunctionComponent<StackProps> = ({resources}) => {
  let res: any[] = []
  resources.forEach((resource) => {
    if (resource.type === 'lesson') {
      const {data: lesson} = useSWR(resource.slug, loadLesson)
      res.push(lesson)
    }
    if (resource.type === 'course') {
      const {data: course} = useSWR(resource.slug, loadCourse)
      res.push(course)
    }
    if (resource.type === 'playlist') {
      const {data: playlist} = useSWR(resource.slug, loadPlaylist)
      res.push(playlist)
    }
    return null
  })

  return res.length === resources.length ? (
    <ul className="-mb-3">
      {res &&
        res.map((resource) => {
          return resource ? (
            <li key={resource?.slug}>
              <Link href={resource?.path}>
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  {resource && (
                    <Image
                      src={
                        resource?.icon_url ||
                        resource?.square_cover_480_url ||
                        resource?.image_thumb_url
                      }
                      width={24}
                      height={24}
                      alt={resource?.title}
                    />
                  )}
                  <span className="ml-2">{resource?.title}</span>
                </a>
              </Link>
            </li>
          ) : null
        })}
    </ul>
  ) : null
}

export default Stack
