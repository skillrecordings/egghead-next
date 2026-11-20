import {NonRetriableError} from 'inngest'
import {inngest} from '../inngest.server'
import {CUSTOMER_IO_IDENTIFY_EVENT} from '../events/identify-customer-io'
import {drovrSignupsEnabled, postDrovrSignup} from '@/lib/drovr-signup'
import emailIsValid from '@/utils/email-is-valid'
import {logEvent} from '@/utils/structured-log'

const DEFAULT_SIGNUP_PAGE = 'https://egghead.io'

// Runs beside identifyCustomerIo on the same event, so a Customer.io failure
// never holds a drovr signup back, and the reverse.
export const drovrSignup = inngest.createFunction(
  {id: 'drovr-signup', name: 'Post egghead signup to drovr'},
  {event: CUSTOMER_IO_IDENTIFY_EVENT},
  async ({event, step}) => {
    if (!drovrSignupsEnabled()) return {skipped: 'disabled'}

    const {email, screening, page} = event.data

    if (!email || !emailIsValid(email)) return {skipped: 'no-email'}

    // drovr's egghead form refuses a signup without a passing screening, so
    // an unscreened submission stays with Customer.io only.
    if (!screening) {
      logEvent('info', 'drovr_signup.skipped_unscreened', {})
      return {skipped: 'unscreened'}
    }

    if (!event.id) throw new NonRetriableError('Event has no id')

    const submissionId = event.id
    const occurredAt = new Date(event.ts ?? Date.now()).toISOString()

    return step.run('post_drovr_signup', async () => {
      const result = await postDrovrSignup({
        submissionId,
        occurredAt,
        email,
        page: page ?? DEFAULT_SIGNUP_PAGE,
        screening,
      })

      if (result.kind === 'retry') {
        logEvent('warn', 'drovr_signup.retry', {
          http_status: result.httpStatus,
          reason: result.reason,
        })
        throw new Error(`drovr signup will retry: ${result.reason}`)
      }

      if (result.kind === 'refused') {
        logEvent('error', 'drovr_signup.refused', {
          http_status: result.httpStatus,
          problem: result.problem,
        })
        throw new NonRetriableError(
          `drovr refused the signup: ${result.problem ?? result.httpStatus}`,
        )
      }

      logEvent('info', 'drovr_signup.accepted', {status: result.status})
      return result
    })
  },
)
