import type {NextApiRequest, NextApiResponse} from 'next'
import {
  drovrApiBaseUrl,
  firstParam,
  parseUnsubscribeChoice,
  submitUnsubscribeChoice,
} from '@/lib/drovr-unsubscribe'
import {logEvent} from '@/utils/structured-log'

// The unsubscribe page's form posts here. One press, one unsubscribe: the
// reader's choice goes to drovr, which owns the stop, then the page shows
// drovr's answer. The token and the masked address are never logged.
export default async function unsubscribe(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  const body = (req.body ?? {}) as Record<string, unknown>
  const token = firstParam(body.t)
  const choice = parseUnsubscribeChoice(body.choice)
  const params = new URLSearchParams({t: token ?? ''})

  if (!choice) {
    return res.redirect(303, `/unsubscribe?${params.toString()}`)
  }

  const result = await submitUnsubscribeChoice(token, choice, {
    baseUrl: drovrApiBaseUrl(),
  })

  logEvent(
    result.status === 'unavailable' ? 'warn' : 'info',
    'unsubscribe_page.submit',
    {
      choice,
      result: result.status,
      ...(result.status === 'unavailable' ? {reason: result.reason} : {}),
    },
  )

  if (result.status === 'ok') {
    params.set('updated', choice)
  } else if (result.status === 'invalid-token') {
    params.set('error', 'invalid')
  } else {
    params.set('choice', choice)
    params.set('error', 'unavailable')
  }

  return res.redirect(303, `/unsubscribe?${params.toString()}`)
}
