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
  const response = await fetch(
    `https://api.mux.com/video/v1/assets/${assetId}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.MUX_ACCESS_TOKEN_ID}:${process.env.MUX_SECRET_KEY}`,
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error(
      `MUX API error (${response.status}):`,
      errorText,
      'Asset ID:',
      assetId,
    )
    throw new Error(`MUX API returned ${response.status}: ${errorText}`)
  }

  const json = await response.json()
  console.log('MUX API response for asset', assetId, ':', json)
  return json.data
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

export async function enableMasterAccess(assetId: string) {
  const response = await fetch(
    `https://api.mux.com/video/v1/assets/${assetId}/master-access`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.MUX_ACCESS_TOKEN_ID}:${process.env.MUX_SECRET_KEY}`,
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        master_access: 'temporary',
      }),
    },
  )

  const {data} = await response.json()
  return data
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
