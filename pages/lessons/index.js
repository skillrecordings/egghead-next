import Link from 'next/link'
import {getAllLessonIds} from '../../lib/lessons'

export async function getStaticProps() {
  const allLessonData = getAllLessonIds()
  return {
    props: {
      allLessonData,
    },
  }
}

export default function Lessons({allLessonData}) {
  return (
    <div>
      {allLessonData.map(({params}) => {
        return (
          <div key={params.id}>
            <Link href={`/lessons/[id]`} as={`/lessons/${params.id}`}>
              <a>{params.title}</a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
