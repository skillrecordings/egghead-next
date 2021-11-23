import * as React from 'react'
import {useViewer} from '../context/viewer-context'
import {useEffect} from 'react'
import Pusher from 'pusher-js'
import axios from 'axios'
import {keys} from 'lodash'

export const useCoursePresence = (slug: string) => {
  const [count, setCount] = React.useState<any>()
  const {viewer} = useViewer()

  const contactId = viewer?.contact_id

  useEffect(() => {
    if (!slug) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: '/api/pusher/auth',
    })

    if (contactId) {
      const channelName = `private-${slug}-${contactId}`
      pusher.subscribe(channelName)
    }

    pusher.subscribe(slug)

    async function checkChannels() {
      const channels = await axios.get(`/api/pusher/channels/${slug}`)
      let newCount = keys(channels.data).length
      if (!contactId) newCount++
      setCount(newCount)
    }

    const intervalId = setInterval(checkChannels, 750)

    return () => {
      if (contactId) {
        const channelName = `private-${slug}-${contactId}`
        pusher.unsubscribe(channelName)
      }
      clearInterval(intervalId)
      pusher.unsubscribe(slug)
    }
  }, [contactId, slug])

  return count
}
