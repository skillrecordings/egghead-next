import {NextRequest} from 'next/server'
import {withAppApiLogging} from '@/lib/logging'

async function _POST(req: NextRequest) {
  // todo: check MUX_WEBHOOK_SIGNING_SECRET to verify the request

  const {results}: {results: any} = await req.json()

  if (!results) {
    return new Response(`Bad request`, {status: 400})
  }

  return new Response('ok', {
    status: 200,
  })
}
export const POST = withAppApiLogging(_POST)
