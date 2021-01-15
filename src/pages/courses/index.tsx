import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {loadAllCourses} from 'lib/courses'

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
              <Link href={course.path}>
                <a>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={course.image_thumb_url}
                      width={32}
                      height={32}
                    />
                    <div>{course.title}</div>
                  </div>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CourseIndex
