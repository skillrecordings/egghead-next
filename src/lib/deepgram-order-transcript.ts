const deepgramUrl = `https://api.deepgram.com/v1/listen`

export async function orderDeepgramTranscript({
  videoResourceId,
  moduleSlug,
  mediaUrl,
  eggheadLessonId,
}: {
  videoResourceId: string
  moduleSlug?: string
  mediaUrl: string
  eggheadLessonId?: string
}) {
  const utteranceSpiltThreshold = 0.5

  const callbackParams = new URLSearchParams({
    videoResourceId,
    ...(moduleSlug && {moduleSlug}),
    ...(eggheadLessonId && {eggheadLessonId}),
  })

  // just weird URL differences between dev and prod
  // replace with ngrok tunnel in dev
  const callbackBase = process.env.NEXT_PUBLIC_DEPLOYMENT_URL

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
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
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
