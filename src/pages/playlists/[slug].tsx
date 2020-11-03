import Link from 'next/link'
import Markdown from 'react-markdown'
import useSWR from 'swr'
import {loadPlaylist} from 'lib/playlists'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {NextSeo} from 'next-seo'
import removeMarkdown from 'remove-markdown'

const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json())

type PlaylistProps = {
  playlist: any
}

const Playlist: FunctionComponent<PlaylistProps> = ({playlist}) => {
  const initialData = playlist
  const {data} = useSWR(playlist.url, fetcher, {initialData})
  const {title, slug, description, image_thumb_url, lessons, http_url} = data

  return (
    <div>
      <NextSeo
        description={removeMarkdown(description)}
        canonical={http_url}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: http_url,
          description: removeMarkdown(description),
          site_name: 'egghead',
          images: [
            {
              url: `https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`,
            },
          ],
        }}
      />
      <img
        src={image_thumb_url}
        className="mx-auto"
        alt={`illustration for ${title}`}
      />
      <h1 className="my-8 text-center sm:text-5xl text-4xl font-bold">
        {title}
      </h1>

      <div className="prose lg:prose-xl max-w-none my-8">
        <Markdown>{description}</Markdown>
        <h3>Lessons in this course</h3>
        <ul>
          {lessons.map((lesson: any) => {
            return (
              <li key={lesson.slug}>
                <Link href={lesson.path}>
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

export default Playlist

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const playlist = params && (await loadPlaylist(params.slug as string))

  return {
    props: {
      playlist,
    },
  }
}
