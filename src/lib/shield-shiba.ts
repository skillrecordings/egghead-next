import {z} from 'zod'

export const SHIELD_SHIBA_VERIFY_URL =
  'https://app.postshiba.com/shield/v1/verify'

const VERIFY_TIMEOUT_MS = 5000

const passedVerification = z.object({
  success: z.literal(true),
  verdict: z.literal('good_boy'),
  hostname: z.string().min(1),
  created_at: z.string().min(1),
})

export type ShieldShibaScreening = {
  provider: 'shieldshiba'
  verdict: string
  hostname: string
  verifiedAt: string
}

// A ShieldShiba token is single-use and lives five minutes, so redeem it
// while the visitor's request is open. Any failure is a failed check.
export async function verifyShieldShiba({
  token,
  email,
  secret = process.env.SHIELD_SHIBA_SECRET,
  fetchImpl = fetch,
}: {
  token?: string
  email: string
  secret?: string
  fetchImpl?: typeof fetch
}): Promise<ShieldShibaScreening | null> {
  if (!secret || !token) return null

  try {
    const response = await fetchImpl(SHIELD_SHIBA_VERIFY_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({secret, token, email}),
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    })

    if (!response.ok) return null

    const passed = passedVerification.safeParse(await response.json())
    if (!passed.success) return null

    const verifiedAt = new Date(passed.data.created_at)
    if (Number.isNaN(verifiedAt.getTime())) return null

    return {
      provider: 'shieldshiba',
      verdict: passed.data.verdict,
      hostname: passed.data.hostname,
      verifiedAt: verifiedAt.toISOString(),
    }
  } catch {
    return null
  }
}
