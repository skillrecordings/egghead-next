import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {isEmpty} from 'lodash'
import {useHits} from 'react-instantsearch'
import {UseHitsProps} from 'react-instantsearch'
import {usePagination} from 'react-instantsearch'
import {useQuery} from '@tanstack/react-query'

import HitComponent, {
  getInstructorImageUrl,
} from '@/components/search/components/hit'
import {useViewer} from '@/context/viewer-context'
import {loadUserCompletedCourses} from '@/lib/users'
import {CardResource} from '@/types'

import {FirstHitCard} from './first-hit-card'

const useUserCompletedCourses = (viewerId: number) => {
  return useQuery(['completeCourses'], async () => {
    if (viewerId) {
      const {completeCourses} = await loadUserCompletedCourses()
      return completeCourses
    }
  })
}

const CustomHits = (props: UseHitsProps) => {
  const {viewer} = useViewer()
  const viewerId = viewer?.id
  const {data: completeCourseData} = useUserCompletedCourses(viewerId)
  const {hits} = useHits(props)

  const {isFirstPage} = usePagination()

  // This is a workaround to prevent the first hit from rendering on the server so we don't get a hydration error. 👃
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [firstHit, ...restHits] = hits

  function truncateDescription(description: string) {
    if (!description) return ''
    const cleanedDescription = description.replace(/\n/g, ' ').trim()
    return `${cleanedDescription.split('.')[0].substring(0, 120)}...`
  }

  function getInstructorName(instructor: any) {
    if (!instructor) return ''

    return (
      instructor.full_name ?? `${instructor.first_name} ${instructor.last_name}`
    )
  }

  const resourceType = firstHit?.type === 'playlist' ? 'course' : firstHit?.type

  const resource = {
    title: firstHit?.title,
    image: firstHit?.primary_tag_image_url ?? firstHit?.image,
    path: firstHit?.path,
    description: truncateDescription(firstHit?.summary),
    instructor: {
      id: firstHit?.instructor?.id,
      name: getInstructorName(firstHit?.instructor),
      image:
        firstHit?.instructor_avatar_url ??
        firstHit?.instructor?.avatar_url ??
        (firstHit?.instructor?.avatar_file_name &&
          getInstructorImageUrl(firstHit?.instructor)),
    },
    name: resourceType,
  }

  const completedCoursesIds =
    !isEmpty(completeCourseData) &&
    completeCourseData.map((course: any) => course.collection.id)
  return (
    <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max gap-3 p-3">
      {isClient && isFirstPage && firstHit && (
        <Link href={resource.path} className="row-span-2 col-span-1">
          <FirstHitCard
            resource={resource as unknown as CardResource}
            className="h-full"
            describe={true}
          />
        </Link>
      )}
      {restHits.map((hit) => {
        return (
          <HitComponent
            key={hit.objectID}
            hit={hit}
            completedCoursesIds={completedCoursesIds}
          />
        )
      })}
    </div>
  )
}

export default CustomHits
