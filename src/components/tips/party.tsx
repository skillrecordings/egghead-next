'use client'

import {useSocket} from 'hooks/use-socket'
import {trpc} from 'app/_trpc/client'
import {useRouter} from 'next/navigation'

export function Party() {
  const utils = trpc.useUtils()
  const router = useRouter()
  useSocket({
    onMessage: async (messageEvent) => {
      const data = JSON.parse(messageEvent.data)
      const invalidateOn = [
        'videoResource.created',
        'video.asset.ready',
        'transcript.ready',
        'ai.tip.draft.completed',
      ]

      if (invalidateOn.includes(data.name)) {
        await utils.tips.invalidate()
        router.refresh()
      }
    },
  })

  return null
}
