import Link from 'next/link'
import {loadLessons} from '../../lib/lessons'

function LessonCard({lesson}) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full" src={lesson.icon_url} alt={lesson.title}></img>
      <div className="px-6 py-4">
        <Link href={`/lessons/[slug]`} as={`/lessons/${lesson.slug}`}>
          <div className="font-bold text-xl mb-2">
            <a>{lesson.title}</a>
          </div>
        </Link>
        <p className="text-gray-700 text-base truncate">{lesson.description}</p>
      </div>
    </div>
  )
}

export default function Courses({lessons}) {
  return (
    <div className="flex flex-wrap">
      {lessons.map((lesson) => (
        <LessonCard lesson={lesson} key={lesson.slug}></LessonCard>
      ))}
    </div>
  )
}

export async function getServerSideProps({res}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const lessons = await loadLessons()

  return {
    props: {
      lessons,
    },
  }
}
