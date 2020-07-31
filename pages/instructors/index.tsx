import {loadInstructors} from '../../lib/instructors'
import Link from 'next/link'

const InstructorCard = ({instructor}) => {
  return (
    <Link href="/instructors/[slug]" as={`instructors/${instructor.slug}`}>
      <div className="flex flex-col items-center">
        <img
          className="rounded-full"
          src={instructor.avatar_url}
          alt={`Avatar for ${instructor.full_name}`}
        />

        <p>{instructor.full_name}</p>
      </div>
    </Link>
  )
}

export default function Instructors({instructorsData}) {
  return (
    <div className="flex flex-wrap">
      {instructorsData.map((instructor) => (
        <div key={instructor.id}>
          <InstructorCard instructor={instructor}></InstructorCard>
        </div>
      ))}
    </div>
  )
}

export async function getServerSideProps({res, params}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const instructorsData = await loadInstructors()

  return {
    props: {
      instructorsData,
    },
  }
}
