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
