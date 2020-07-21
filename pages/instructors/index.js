import { getInstructors } from "../../lib/instructors"
import Link from "next/link"

export function getStaticProps() {
  const instructors = getInstructors([
    "id",
    "slug",
    "full_name",
    "website",
    "path",
    "avatar_480_url",
  ])

  return {
    props: {
      instructors,
    },
  }
}

export default function Instructors({ instructors }) {
  return (
    <ul className="list-disc">
      {instructors.map(instructor => {
        return (
          <li key={instructor.id}>
            <Link
              href={`/instructors/[slug]`}
              as={instructor.path}
            >
              <a className="no-underline hover:underline text-blue-500">
                {instructor.full_name}
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
