import Link from 'next/link'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadCollection} from '@lib/collections'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Collection({collectionData}) {
  const initialData = collectionData
  const {data} = useSWR(collectionData.url, fetcher, {initialData})
  const {title, description, owner, items} = data
  const {avatar_url} = owner

  console.log(data)

  return (
    <div>
      <h1 className="my-8 text-center sm:text-5xl text-4xl font-bold leading-tight">
        {title}
      </h1>
      <div className="flex items-center justify-center flex-wrap sm:gap-8 gap-5">
        <div className="flex items-center">
          <div className="overflow-hidden rounded-full w-12 h-12">
            <img src={avatar_url} alt={`photo of ${owner.full_name}`} />
          </div>
          <span className="ml-2">{owner.full_name}</span>
        </div>
      </div>
      <div className="prose lg:prose-xl max-w-none my-8">
        <Markdown>{description}</Markdown>
        <h3>Resources in this collection:</h3>
        <ul>
          {items.map((lesson) => {
            return (
              <li key={lesson.slug}>
                <Link href={`/lessons/[id]`} as={lesson.path}>
                  <a>{lesson.title}</a>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export async function getServerSideProps({res, params}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const collectionData = await loadCollection(params.slug)

  return {
    props: {
      collectionData,
    },
  }
}
