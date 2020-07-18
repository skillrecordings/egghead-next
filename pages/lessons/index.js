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
        const {slug, title, path, instructor, primary_tag} = params

        return (
          <div key={slug} className="p-5">
            <Link href={`/lessons/[id]`} as={path}>
              <a className="no-underline hover:underline text-blue-500">
                {title}
              </a>
            </Link>
            <div>by {instructor.full_name}</div>
            {primary_tag && (
              <div>
                <img src={primary_tag.image_32_url} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
