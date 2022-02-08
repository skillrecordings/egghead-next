import axios from 'axios'
import last from 'lodash/last'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'

const deleteCueNote =
  (context: VideoStateContext, _event: VideoEvent) => async (send: any) => {
    const activeCues = context.activeCues
    const currentCue: any = last(activeCues)
    const cueId = JSON.parse(currentCue.text).id

    await axios
      .delete(`/api/lessons/notes/${context.resource.slug}?id=${cueId}`)
      .catch((e) => {
        console.log(`Failed to delete cue note: ${e.message}`)
      })
      .then(() => {
        send({type: 'CLEAR_CUES'})
      })
  }

export default deleteCueNote
