import {getInstructors} from '../../lib/instructors'
import Link from 'next/link'

export default function Instructors({instructors}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {instructors.map((instructor) => {
        return (
          <div key={instructor.slug}>
            <img src={instructor.avatar_480_url} />
            <Link href={`/instructors/[slug]`} as={instructor.path}>
              <a className="no-underline hover:underline text-blue-500">
                {instructor.full_name}
              </a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export function getStaticProps() {
  const instructors = getInstructors([
    'id',
    'slug',
    'full_name',
    'website',
    'path',
    'avatar_480_url',
  ])

  return {
    props: {
      instructors,
    },
  }
}
