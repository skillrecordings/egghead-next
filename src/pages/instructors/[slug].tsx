import {loadInstructor} from 'lib/instructors'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'

type InstructorProps = {
  instructor: any
}

const Instructor: FunctionComponent<InstructorProps> = ({instructor}) => {
  return (
    <div className="flex flex-col items-center">
      <img
        className="rounded-full"
        src={instructor.avatar_url}
        alt={`Avatar for ${instructor.full_name}`}
      />

      <p>{instructor.full_name}</p>
    </div>
  )
}

export default Instructor

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const instructor = params && (await loadInstructor(params.slug as string))

  return {
    props: {
      instructor,
    },
  }
}
