import {withAppApiLogging} from '@/lib/logging'
import {refreshAllowlistIfStale} from '@/lib/sanity-allowlist'

async function _GET() {
  await fetch(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/inngest`, {
    method: 'PUT',
  })

  // Keep allowlists warm so we can skip Sanity for ~95%+ of legacy content.
  // Staleness-gated to avoid hammering Sanity (cron runs every minute).
  await refreshAllowlistIfStale('lesson', {route: '/api/cron'})
  await refreshAllowlistIfStale('course', {route: '/api/cron'})

  return new Response(null, {
    status: 200,
  })
}
export const GET = withAppApiLogging(_GET)
