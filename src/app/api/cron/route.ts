import {withAppApiLogging} from '@/lib/logging'
import {refreshAllowlistIfStale} from '@/lib/sanity-allowlist'

async function _GET() {
  await fetch(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/inngest`, {
    method: 'PUT',
  })

  // Keep the lesson allowlist warm so lesson pages can skip Sanity for most
  // legacy content. Course shells no longer read Sanity metadata at runtime.
  // Staleness-gated to avoid hammering Sanity (cron runs every minute).
  await refreshAllowlistIfStale('lesson', {route: '/api/cron'})

  return new Response(null, {
    status: 200,
  })
}
export const GET = withAppApiLogging(_GET)
