import type {ShieldShibaScreening} from '@/lib/shield-shiba'

export const DROVR_EGGHEAD_TENANT = 'org-egghead'
export const DROVR_EGGHEAD_SIGNUP_FORM = 'egghead-signup'

// One observed drovr signup took about seven seconds from submit to the
// confirmation email. A timeout does not prove nothing was sent; the retry
// carries the same submissionId.
const DROVR_SIGNUP_TIMEOUT_MS = 20000

// Dark until the operator sets DROVR_SIGNUPS=1. Customer.io keeps running
// alongside until the switch.
export const drovrSignupsEnabled = () => process.env.DROVR_SIGNUPS === '1'

export type DrovrSignupInput = {
  submissionId: string
  occurredAt: string
  email: string
  page: string
  screening: ShieldShibaScreening
}

export const drovrSignupBody = ({
  submissionId,
  occurredAt,
  email,
  page,
  screening,
}: DrovrSignupInput) => ({
  tenantId: DROVR_EGGHEAD_TENANT,
  formId: DROVR_EGGHEAD_SIGNUP_FORM,
  submissionId,
  occurredAt,
  email,
  source: {page, screening},
})

export type DrovrSignupResult =
  | {kind: 'accepted'; status: string}
  | {kind: 'refused'; httpStatus: number; problem?: string}
  | {kind: 'retry'; httpStatus?: number; reason: string}

const problemTypeOf = (body: unknown) =>
  body && typeof body === 'object' && 'type' in body
    ? String((body as {type: unknown}).type)
    : undefined

// A retry repeats the same submissionId, which drovr treats as the same
// submission, never as a second signup.
export async function postDrovrSignup(
  input: DrovrSignupInput,
  {
    apiUrl = process.env.DROVR_API_URL,
    apiKey = process.env.DROVR_API_KEY,
    fetchImpl = fetch,
  }: {apiUrl?: string; apiKey?: string; fetchImpl?: typeof fetch} = {},
): Promise<DrovrSignupResult> {
  if (!apiUrl || !apiKey) {
    return {kind: 'retry', reason: 'drovr is not configured'}
  }

  let response: Response
  try {
    response = await fetchImpl(new URL('/signups', apiUrl), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drovrSignupBody(input)),
      signal: AbortSignal.timeout(DROVR_SIGNUP_TIMEOUT_MS),
    })
  } catch {
    return {kind: 'retry', reason: 'drovr did not answer'}
  }

  const body: unknown = await response.json().catch(() => undefined)

  if (response.ok) {
    const status =
      body && typeof body === 'object' && 'status' in body
        ? String((body as {status: unknown}).status)
        : 'unknown'
    return {kind: 'accepted', status}
  }

  if (response.status === 429 || response.status >= 500) {
    return {
      kind: 'retry',
      httpStatus: response.status,
      reason: problemTypeOf(body) ?? 'drovr is unavailable',
    }
  }

  return {
    kind: 'refused',
    httpStatus: response.status,
    problem: problemTypeOf(body),
  }
}
