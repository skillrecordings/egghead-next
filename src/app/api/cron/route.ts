import {withAppApiLogging} from '@/lib/logging'

async function _GET() {
  await fetch(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/inngest`, {
    method: 'PUT',
  })
  return new Response(null, {
    status: 200,
  })
}
export const GET = withAppApiLogging(_GET)
