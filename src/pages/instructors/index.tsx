import {loadInstructors} from 'lib/instructors'
import Link from 'next/link'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'

type InstructorCardProps = {
  instructor: any
}

const InstructorCard: FunctionComponent<InstructorCardProps> = ({
  instructor,
}) => {
  return (
    <Link href={`instructors/${instructor.slug}`}>
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

type InstructorsProps = {
  instructors: any[]
}

const Instructors: FunctionComponent<InstructorsProps> = ({instructors}) => {
  return (
    <div className="flex flex-wrap">
      {instructors.map((instructor) => (
        <div key={instructor.id}>
          <InstructorCard instructor={instructor}></InstructorCard>
        </div>
      ))}
    </div>
  )
}

export default Instructors

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const instructors = await loadInstructors()

  return {
    props: {
      instructors,
    },
  }
}
