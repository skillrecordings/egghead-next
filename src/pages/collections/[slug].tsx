import Link from 'next/link'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadCollection} from 'lib/collections'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'

const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

type CollectionProps = {
  collection: any
}

const Collection: FunctionComponent<CollectionProps> = ({collection}) => {
  const initialData = collection
  const {data} = useSWR(collection.url, fetcher, {initialData})
  const {title, description, owner, items} = data
  const {avatar_url} = owner

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
          {items.map((lesson: any) => {
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

export default Collection

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const collection = params && (await loadCollection(params.slug as string))

  return {
    props: {
      collection,
    },
  }
}
