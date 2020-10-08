/** @jsx jsx */
import {jsx} from '@emotion/core'
import {useMachine} from '@xstate/react'
import EggheadPlayer from 'components/EggheadPlayer'
import {useViewer} from 'context/viewer-context'
import {GraphQLClient} from 'graphql-request'
import {loadLesson} from 'lib/lessons'
import {get, isEmpty} from 'lodash'
import playerMachine from 'machines/lesson-player-machine'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import React, {FunctionComponent} from 'react'
import useSWR from 'swr'
import {LessonResource} from 'types'

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/graphql`

const lessonQuery = /* GraphQL */ `
  query getLesson($slug: String!) {
    lesson(slug: $slug) {
      slug
      title
      transcript_url
      subtitles_url
      next_up_url
      summary
      hls_url
      dash_url
      free_forever
      path
      course {
        title
        square_cover_480_url
        slug
      }
      tags {
        name
        http_url
        image_url
      }
      instructor {
        full_name
        avatar_64_url
        slug
        twitter
      }
    }
  }
`

const lessonLoader = (slug: string, token: string) => {
  const authorizationHeader = token && {
    authorization: `Bearer ${token}`,
  }
  const variables = {
    slug: slug,
  }
  const graphQLClient = new GraphQLClient(API_ENDPOINT, {
    headers: {
      ...authorizationHeader,
    },
  })
  return graphQLClient.request(lessonQuery, variables)
}

type LessonProps = {
  initialLesson: LessonResource
}

const Embed: FunctionComponent<LessonProps> = ({initialLesson}) => {
  const router = useRouter()
  const playerRef = React.useRef(null)
  const {authToken, logout} = useViewer()
  const [playerState, send] = useMachine(playerMachine)

  const currentPlayerState = playerState.value

  const {data = {}, error} = useSWR(
    [initialLesson.slug, authToken],
    lessonLoader,
  )

  if (error) logout()

  const lesson = {...initialLesson, ...data.lesson}
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!lesson) return null

  const {hls_url, dash_url} = lesson

  React.useEffect(() => {
    switch (currentPlayerState) {
      case 'loading':
        if (!isEmpty(data.lesson)) {
          send('LOADED')
        }
        break
      case 'loaded':
        if (hls_url || dash_url) {
          send('PLAY')
        } else {
          send('SUBSCRIBE')
        }
        break
      case 'completed':
        send('NEXT')
        break
    }
  }, [currentPlayerState, data.lesson])

  return (
    <div className="absolute w-full h-full top-0 left-0">
      (
      <EggheadPlayer
        ref={playerRef}
        hls_url={hls_url}
        dash_url={dash_url}
        width="100%"
        height="auto"
        pip="true"
        controls
        onPlay={() => send('PLAY')}
        onPause={() => send('PAUSE')}
        onEnded={() => send('COMPLETE')}
        subtitlesUrl={get(lesson, 'subtitles_url')}
      />
      )
    </div>
  )
}

export default Embed

export const getServerSideProps: GetServerSideProps = async function ({
  res,
  params,
}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const initialLesson: LessonResource | undefined =
    params && (await loadLesson(params.slug as string))

  return {
    props: {
      initialLesson,
    },
  }
}
