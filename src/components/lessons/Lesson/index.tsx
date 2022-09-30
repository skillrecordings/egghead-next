import * as React from 'react'
import {useMachine} from '@xstate/react'
import {lessonMachine} from 'machines/lesson-machine'
import {loadLesson} from 'lib/lessons'
import {useViewer} from 'context/viewer-context'
import {VideoResource as VideoResourceType} from 'types'
import cookieUtil from 'utils/cookies'
import {VideoProvider} from '@skillrecordings/player'
import {get} from 'lodash'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import {addCueNote, deleteCueNote} from 'lib/notes'
import VideoResource from '../VideoResource'

type VideoResourceTypeWithTalk = VideoResourceType & {
  talk?: boolean
}

const Lesson: React.FC<{initialLesson: VideoResourceTypeWithTalk}> = ({
  initialLesson,
  ...props
}) => {
  const {viewer} = useViewer()
  const [watchCount, setWatchCount] = React.useState<number>(0)
  const [lessonState, send] = useMachine(lessonMachine, {
    context: {
      lesson: initialLesson,
      viewer,
    },
    services: {
      loadLesson: async () => {
        if (cookieUtil.get(`egghead-watch-count`)) {
          setWatchCount(Number(cookieUtil.get(`egghead-watch-count`)))
        } else {
          setWatchCount(
            Number(
              cookieUtil.set(`egghead-watch-count`, 0, {
                expires: 15,
              }),
            ),
          )
        }

        console.debug('loading video with auth')
        const loadedLesson = await loadLesson(initialLesson.slug)
        console.debug('authed video loaded', {video: loadedLesson})

        return {
          ...initialLesson,
          ...loadedLesson,
        }
      },
    },
  })

  return (
    <VideoProvider
      services={{
        addCueNote,
        deleteCueNote,
        loadViewer:
          (_context: VideoStateContext, _event: VideoEvent) => async () => {
            return await viewer
          },
        loadResource:
          (_context: VideoStateContext, event: VideoEvent) => async () => {
            const loadedLesson = get(event, 'resource')
            return {
              ...initialLesson,
              ...loadedLesson,
            }
          },
      }}
    >
      <VideoResource
        state={[lessonState, send]}
        initialLesson={initialLesson}
        watchCount={watchCount}
        setWatchCount={setWatchCount}
        {...props}
      />
    </VideoProvider>
  )
}

export default Lesson
