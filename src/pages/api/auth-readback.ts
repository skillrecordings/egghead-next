import type {NextApiRequest, NextApiResponse} from 'next'
import {logEvent} from '@/utils/structured-log'

// Sign-in diagnostics: booleans, a step name and a coarse browser family only.
const STEPS = ['set', 'refresh_ok', 'refresh_null', 'cleared']

function browserFamily(ua = '') {
  if (/edg\//i.test(ua)) return 'edge'
  if (/firefox|fxios/i.test(ua)) return 'firefox'
  if (/chrome|crios|chromium/i.test(ua)) return 'chrome'
  if (/safari/i.test(ua)) return 'safari'
  return 'other'
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  let body: any = req.body
  try {
    if (typeof body === 'string') body = JSON.parse(body)
  } catch {
    body = null
  }
  const {step, cookieReadOk, localStorageOk, fromRedirect} = body || {}
  const bools = [cookieReadOk, localStorageOk, fromRedirect]
  if (!STEPS.includes(step) || bools.some((b) => typeof b !== 'boolean')) {
    return res.status(400).end()
  }
  const ok = cookieReadOk && step !== 'refresh_null' && step !== 'cleared'
  logEvent(ok ? 'info' : 'warn', 'auth.session.cookie_readback', {
    step,
    cookieReadOk,
    localStorageOk,
    fromRedirect,
    browserFamily: browserFamily(req.headers['user-agent']),
  })
  return res.status(204).end()
}
