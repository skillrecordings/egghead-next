import * as React from 'react'
import {VideoResource} from 'types'
import {first, get} from 'lodash'
import axios from 'utils/configured-axios'
import {track} from 'utils/analytics'
import specialLessons from './special-lessons'
import {CIOSubscriber} from 'hooks/use-cio'

import OverlayWrapper from 'components/pages/lessons/overlay/wrapper'

import RateCourseOverlay from 'components/pages/lessons/overlay/rate-course-overlay'
import RecommendNextStepOverlay from 'components/pages/lessons/overlay/recommend-next-step-overlay'
import GoProCtaOverlay from 'components/pages/lessons/overlay/go-pro-cta-overlay'
import WatchFullCourseCtaOverlay from 'components/pages/lessons/overlay/watch-full-course-cta-overlay'
import WatchNextLessonCtaOverlay from 'components/pages/lessons/overlay/watch-next-lesson-cta-overlay'
import EmailCaptureCtaOverlay from 'components/pages/lessons/overlay/email-capture-cta-overlay'

type OverlaysProps = {
  lessonSend: Function
  lessonState: {matches: Function}
  lesson: VideoResource
  nextLesson: any
  viewer: object
  videoService: {send: Function}
  lessonView: {collection_progress: {rate_url: string}}
  subscriber?: CIOSubscriber
  cioIdentify: Function
}

const Overlays: React.FC<OverlaysProps> = ({
  lessonSend,
  lessonState,
  lesson,
  nextLesson,
  viewer,
  videoService,
  lessonView,
  subscriber,
  cioIdentify,
}) => {
  const {slug, tags = []} = lesson
  const primaryTag = get(first(tags), 'name', 'javascript')

  let overlayToRender = null

  if (lessonState.matches('joining')) {
    overlayToRender = (
      <EmailCaptureCtaOverlay lesson={lesson} technology={primaryTag} />
    )
  } else if (lessonState.matches('subscribing')) {
    overlayToRender = (
      <GoProCtaOverlay
        lesson={lesson}
        viewLesson={() => {
          lessonSend({
            type: 'LOAD',
            lesson: lesson,
            viewer,
          })
          // TODO: Make sure this is working as expected
          videoService.send({
            type: 'LOAD_RESOURCE',
            resource: lesson,
          })
        }}
      />
    )
  } else if (lessonState.matches('pitchingCourse')) {
    overlayToRender = (
      <WatchFullCourseCtaOverlay
        lesson={lesson}
        onClickRewatch={() => {
          lessonSend('VIEW')
          videoService.send({type: 'PLAY'})
        }}
      />
    )
  } else if (lessonState.matches('showingNext')) {
    overlayToRender = (
      <WatchNextLessonCtaOverlay
        lesson={lesson}
        nextLesson={nextLesson}
        ctaContent={specialLessons[lesson.slug]}
        onClickRewatch={() => {
          lessonSend('VIEW')
          videoService.send({type: 'PLAY'})
        }}
      />
    )
  } else if (lessonState.matches('rating')) {
    overlayToRender = (
      <RateCourseOverlay
        course={lesson.collection}
        onRated={(review) => {
          axios
            .post(lessonView.collection_progress.rate_url, review)
            .then(() => {
              const comment = get(review, 'comment.comment')
              const prompt = get(review, 'comment.context.prompt')

              if (review) {
                // TODO: the `course: slug` is referencing the lesson slug.
                // Is that an error or is the naming just a little
                // confusing?
                track('rated course', {
                  course: slug,
                  rating: review.rating,
                  ...(comment && {comment}),
                  ...(!!prompt && {prompt}),
                })
                if (subscriber) {
                  const currentScore =
                    Number(subscriber.attributes?.learner_score) || 0
                  cioIdentify(subscriber.id, {
                    learner_score: currentScore + 20,
                  })
                }
              }
            })
            .finally(() => {
              setTimeout(() => {
                lessonSend('RECOMMEND')
              }, 1500)
            })
        }}
      />
    )
  } else if (lessonState.matches('recommending')) {
    overlayToRender = <RecommendNextStepOverlay lesson={lesson} />
  }

  return (
    <>
      {overlayToRender ? (
        <OverlayWrapper>{overlayToRender}</OverlayWrapper>
      ) : null}
    </>
  )
}

export default Overlays
