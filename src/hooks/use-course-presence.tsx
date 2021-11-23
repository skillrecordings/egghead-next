import * as React from 'react'
import {useViewer} from '../context/viewer-context'
import {useEffect} from 'react'
import Pusher from 'pusher-js'
import axios from 'axios'
import {keys} from 'lodash'

export const useCoursePresence = (slug: string) => {
  const [learners, setLearners] = React.useState<any[]>([])
  const {viewer} = useViewer()

  const contactId = viewer?.contact_id

  useEffect(() => {
    if (!slug) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: '/api/pusher/auth',
    })

    const channelName = `private-${slug}${contactId ? `@@${contactId}` : ''}`

    if (contactId) {
      pusher.subscribe(channelName)
    }

    async function checkChannels() {
      const channels = await axios.get(`/api/pusher/channels/${slug}`)
      setLearners(channels.data)
    }

    const intervalId = setInterval(checkChannels, 60000)

    checkChannels()

    return () => {
      if (contactId) {
        pusher.unsubscribe(channelName)
      }
      clearInterval(intervalId)
    }
  }, [contactId, slug])

  return learners
}
