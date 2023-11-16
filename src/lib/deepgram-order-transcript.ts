import {env} from '@/env.mjs'

const deepgramUrl = `https://api.deepgram.com/v1/listen`

export async function orderDeepgramTranscript({
  videoResourceId,
  moduleSlug,
  mediaUrl,
}: {
  videoResourceId: string
  moduleSlug?: string
  mediaUrl: string
}) {
  const utteranceSpiltThreshold = 0.5

  const callbackParams = new URLSearchParams({
    videoResourceId,
    ...(moduleSlug && {moduleSlug}),
  })

  // just weird URL differences between dev and prod
  const callbackBase =
    env.NODE_ENV === 'production' ? env.UPLOADTHING_URL : env.NEXTAUTH_URL

  const deepgramParams = new URLSearchParams({
    model: 'whisper-large',
    punctuate: 'true',
    paragraphs: 'true',
    utterances: 'true',
    utt_split: String(utteranceSpiltThreshold),
    callback: `${callbackBase}/api/deepgram/webhook?${callbackParams.toString()}`,
  })

  const deepgramResponse = await fetch(
    `${deepgramUrl}?${deepgramParams.toString()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
      },
      body: JSON.stringify({
        url: mediaUrl,
      }),
    },
  )

  return {
    deepgram: await deepgramResponse.json(),
    postedUrl: `${deepgramUrl}?${deepgramParams.toString()}`,
  }
}
