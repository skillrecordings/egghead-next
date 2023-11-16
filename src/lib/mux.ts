const baseUrl = 'https://api.mux.com'

export async function createMuxAsset(newAssetSettings: any) {
  const response = await fetch(`${baseUrl}/video/v1/assets`, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.MUX_ACCESS_TOKEN_ID}:${process.env.MUX_SECRET_KEY}`,
      ).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(newAssetSettings),
  })

  const {data} = await response.json()
  return data
}

export async function getMuxAsset(assetId: string) {
  const {data} = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.MUX_ACCESS_TOKEN_ID}:${process.env.MUX_SECRET_KEY}`,
      ).toString('base64')}`,
      'Content-Type': 'application/json',
    },
  }).then(async (response) => await response.json())
  return data
}

export async function deleteAssetTrack({
  assetId,
  trackId,
}: {
  assetId: string
  trackId: string
}) {
  await fetch(
    `https://api.mux.com/video/v1/assets/${assetId}/tracks/${trackId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.MUX_ACCESS_TOKEN_ID}:${process.env.MUX_SECRET_KEY}`,
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    },
  ).catch((error) => {
    console.error(error)
  })
}

export async function addSrtTrackToAsset({
  assetId,
  videoResourceId,
}: {
  assetId: string
  videoResourceId: string
}) {
  return await fetch(`https://api.mux.com/video/v1/assets/${assetId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.MUX_ACCESS_TOKEN_ID}:${process.env.MUX_SECRET_KEY}`,
      ).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/videos/${videoResourceId}/srt`,
      type: 'text',
      text_type: 'subtitles',
      closed_captions: true,
      language_code: 'en-US',
      name: 'English',
      passthrough: 'English',
    }),
  })
    .then(async (response) => await response.json())
    .catch((error) => {
      console.error(error)
    })
}
