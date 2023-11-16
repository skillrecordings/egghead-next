import {NextRequest} from 'next/server'
import {getMuxOptions, muxRequestHeaders} from '@/lib/get-mux-options'
import {env} from '@/env.mjs'

const baseUrl = 'https://api.mux.com'

/**
 * MUX Direct Upload Endpoint that returns a signed upload URL
 *
 * @param req
 */
export async function POST(req: NextRequest) {
  try {
    const response = await fetch(`${baseUrl}/video/v1/uploads`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.MUX_ACCESS_TOKEN_ID}:${env.MUX_SECRET_KEY}`,
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(getMuxOptions()),
    })
    const json = await response.json()
    return new Response(JSON.stringify(json.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
