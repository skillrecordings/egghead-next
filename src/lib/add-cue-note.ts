import axios from 'axios'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import readingTime from 'reading-time'
import {LessonResource} from 'types'

const addCueNote =
  (context: VideoStateContext, _event: VideoEvent) => async (send: any) => {
    const noteFromCue = {
      text: context?.cueFormElemRef?.current?.input.value,
      startTime: context.currentTime,
      endTime: context.currentTime,
    } as VTTCue

    const {lesson: resource}: any = context.resource as LessonResource

    await axios
      .post(`/api/lessons/notes/${resource.slug}`, {
        text: noteFromCue.text,
        startTime: context.currentTime,
        endTime:
          context.currentTime + readingTime(noteFromCue.text).time / 1000,
        state: context.writingCueNoteVisibility,
        contact_id: context.viewer.contact_id,
        image: context.viewer.avatar_url,
      })
      .catch(() => {
        send('FAIL')
      })
      .then(({data}: any) => {
        // pass cue text with props to get an id right away
        // from response and avoid making another request
        const {start_time: startTime, end_time: endTime, ...noteData} = data
        const cueNoteText = JSON.stringify({startTime, endTime, ...noteData})
        const cue = new VTTCue(
          noteFromCue.startTime,
          noteFromCue.endTime,
          cueNoteText,
        )
        send({type: 'DONE_SUBMITTING_NOTE', cue: cue})

        // reset form
        context.cueFormElemRef?.current?.input.blur()
        context.cueFormElemRef?.current?.reset()
      })
  }

export default addCueNote
