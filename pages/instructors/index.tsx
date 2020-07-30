import useSWR from 'swr'
import {loadInstructors} from '../../lib/instructors'

export default function Instructors({instructorsData}) {
  return <div>{JSON.stringify(instructorsData)}</div>
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
