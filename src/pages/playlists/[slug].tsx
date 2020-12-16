import * as React from 'react'
import useSWR from 'swr'
import {loadPlaylist} from 'lib/playlists'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {filter} from 'lodash'
import fetcher from 'utils/fetcher'
import CoursePageLayout from 'components/pages/courses/course-page-layout'

type PlaylistProps = {
  playlist: any
}

const Playlist: FunctionComponent<PlaylistProps> = ({playlist}) => {
  const initialData = playlist
  const {data} = useSWR(playlist.url, fetcher, {initialData})

  const {slug, items} = data

  const lessons = filter(items, {type: 'lesson'})

  return (
    <CoursePageLayout
      lessons={lessons}
      course={data}
      ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
    />
  )
}

export default Playlist

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  params,
}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const playlist = params && (await loadPlaylist(params.slug as string))

  return {
    props: {
      playlist,
    },
  }
}
