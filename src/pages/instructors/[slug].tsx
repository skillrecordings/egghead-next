import {loadInstructor} from '@lib/instructors'
export default function Instructor({instructorData}) {
  return (
    <div className="flex flex-col items-center">
      <img
        className="rounded-full"
        src={instructorData.avatar_url}
        alt={`Avatar for ${instructorData.full_name}`}
      />

      <p>{instructorData.full_name}</p>
    </div>
  )
}

export async function getServerSideProps({res, params}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const instructorData = await loadInstructor(params.slug)

  return {
    props: {
      instructorData,
    },
  }
}
