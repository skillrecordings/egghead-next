import * as React from 'react'
import {useViewer} from '../context/viewer-context'
import Pusher from 'pusher-js'
import axios from 'axios'

const usePusher = () => {
  // memoize the pusher instance so we aren't making them willy nilly
  return React.useMemo(
    () =>
      new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        authEndpoint: '/api/pusher/auth',
      }),
    [],
  )
}

export const useCoursePresence = (slug: string) => {
  const [learners, setLearners] = React.useState<any[]>([])
  const {viewer} = useViewer()

  const pusher = usePusher()

  const contactId = viewer?.contact_id

  React.useEffect(() => {
    //we only want to subscribe if there is a slug and a logged in user
    if (!slug || !contactId) return

    const channelName = `private-${slug}${contactId ? `@@${contactId}` : ''}`

    pusher.subscribe(channelName)

    return () => {
      if (channelName) pusher.unsubscribe(channelName)
    }
  }, [slug, contactId])

  React.useEffect(() => {
    /*
      here we only care if ia course slug is present because this will fetch the
      list of currently active learners (channels) for display on a 1 minute
      interval after loading initially

      utilizes a serverless API function so doesn't need a pusher instance
    */

    if (!slug) return

    async function checkChannels() {
      // const channels = await axios.get(`/api/pusher/channels/${slug}`)
      // setLearners(channels.data)
    }

    const intervalId = setInterval(checkChannels, 60000)

    checkChannels()

    return () => {
      clearInterval(intervalId)
    }
  }, [slug])

  return learners
}
