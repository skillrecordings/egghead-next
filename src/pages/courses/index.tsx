import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {loadAllCourses} from 'lib/courses'
import Markdown from 'react-markdown'
import TagList from '../../components/layouts/tag-list'

export async function getStaticProps() {
  const courses = await loadAllCourses()
  return {
    props: {courses}, // will be passed to the page component as props
  }
}

const CourseIndex: React.FC<{courses: any}> = ({courses = []}) => {
  return (
    <div>
      <ul className="space-y-5">
        {courses.map((course: any) => {
          return (
            <li key={course.slug}>
              <div className="border p-5 max-w-max-content flex space-x-10">
                <Link href={course.path}>
                  <a>
                    <div className="flex-shrink-0 flex">
                      <Image
                        src={course.image_thumb_url}
                        width={128}
                        height={128}
                      />
                    </div>
                  </a>
                </Link>
                <div className="flex flex-col">
                  <Link href={course.path}>
                    <a>
                      <h2 className="text-xl">{course.title}</h2>
                    </a>
                  </Link>
                  <div className="p-2">
                    <TagList tags={course.tags} courseSlug={course.slug} />
                  </div>
                  <Markdown source={course.description} className="prose" />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CourseIndex
