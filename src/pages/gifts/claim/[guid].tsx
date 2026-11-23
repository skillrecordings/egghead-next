import * as React from 'react'
import {GetServerSideProps} from 'next'
import {withSSRLogging} from '@/lib/logging'
import {getTokenFromCookieHeaders} from '../../../utils/auth'
import {getGift} from '../../../lib/gifts'
import Link from 'next/link'
import Image from 'next/legacy/image'
import axios from '@/utils/configured-axios'
import {useRouter} from 'next/router'
import {useViewer} from '../../../context/viewer-context'
import {logEvent} from '@/utils/structured-log'

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async function ({req, query}) {
    const {eggheadToken} = getTokenFromCookieHeaders(
      req.headers.cookie as string,
    )
    const {guid} = query

    if (!eggheadToken) {
      return {
        props: {
          error: {
            type: 'login',
            message: 'You must be logged in to claim a membership token',
          },
        },
      }
    }

    const gift = await getGift(guid as string, eggheadToken)

    if (gift.claimed) {
      return {
        props: {
          error: {
            type: 'claimed',
            message: 'This membership token has already been claimed',
          },
        },
      }
    }

    return {
      props: {gift},
    }
  },
)

type Gift = {claim_url: string; claimed: boolean; duration_months: number}
type GiftClaimProps = {error?: {type: string; message: string}; gift?: Gift}
type ClaimState =
  | {status: 'idle'}
  | {status: 'claiming'}
  | {status: 'error'; message: string}
  | {status: 'claimed'}
  | {status: 'claimed-refresh-failed'}

const RATE_LIMIT_MESSAGE = 'Too many tries. Wait a minute and try again.'
const GENERIC_CLAIM_ERROR =
  "This gift has expired or can't be claimed. Email support@egghead.io and we'll sort it out."

// Rails sends {errors: [...]} with the claim failure reasons. Older Rails
// sends an empty array, so fall back to the generic message.
const claimErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return GENERIC_CLAIM_ERROR
  }
  if (error.response?.status === 429) {
    return RATE_LIMIT_MESSAGE
  }
  const errors: unknown = (error.response?.data as {errors?: unknown})?.errors
  const first = Array.isArray(errors)
    ? errors.find(
        (message): message is string =>
          typeof message === 'string' && message.trim() !== '',
      )
    : undefined
  return first?.trim() ?? GENERIC_CLAIM_ERROR
}

const GiftClaim: React.FC<React.PropsWithChildren<GiftClaimProps>> = ({
  error,
  gift,
}) => {
  const router = useRouter()
  const {viewer, refreshUser} = useViewer()
  // idle/error -> claiming -> error (retry allowed) or claimed.
  // claimed -> navigate, or claimed-refresh-failed if refresh/navigation
  // fails. Both claimed states are terminal: the gift can't be claimed twice.
  const [claimState, setClaimState] = React.useState<ClaimState>({
    status: 'idle',
  })
  const isClaimed =
    claimState.status === 'claimed' ||
    claimState.status === 'claimed-refresh-failed'

  const handleClaimGift = async () => {
    if (!gift || claimState.status === 'claiming' || isClaimed) {
      return
    }
    setClaimState({status: 'claiming'})

    try {
      await axios.post(gift.claim_url)
    } catch (error: unknown) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined
      logEvent('warn', 'gift.claim.failed', {status: status ?? null})
      setClaimState({status: 'error', message: claimErrorMessage(error)})
      return
    }

    setClaimState({status: 'claimed'})

    try {
      await refreshUser()
      await router.push({
        pathname: '/learn/',
        query: {
          message: 'You have claimed the membership coupon.',
          type: 'claimed',
        },
      })
    } catch (error: unknown) {
      logEvent('warn', 'gift.claim.post_claim_failed', {
        error: error instanceof Error ? error.message : String(error),
      })
      setClaimState({status: 'claimed-refresh-failed'})
    }
  }

  return (
    <div className="container flex justify-center">
      <div className="pb-10 mt-8 prose-sm prose text-center dark:prose-dark md:mt-20">
        {error ? (
          <>
            <h1>{error.message}</h1>
            {error.type === 'login' ? (
              <p>
                <Link href="/login">Click here</Link> to sign in. Once you are
                signed in you will need to click your gift claim link again.
              </p>
            ) : null}
          </>
        ) : (
          <>
            <div className="mx-auto w-28 md:w-40">
              <Image
                src="/images/eggo-membership.png"
                width={480}
                height={560}
              />
            </div>
            <h1 className="mt-6 md:mt-12">Claim your membership.</h1>
            {viewer?.is_pro ? (
              <p>
                A gift membership can't be applied to an account that already
                has an active membership. If you want to use this gift, email
                support@egghead.io and we'll sort it out.
              </p>
            ) : (
              <p>
                A gift membership can only be claimed one time. Once you've
                claimed this gift nobody else will be able to you. It can't be
                undone! Make sure that{' '}
                <em>
                  <b>{viewer?.email}</b>
                </em>{' '}
                is the account you want the gift applied to.
              </p>
            )}
            <button
              type="button"
              disabled={claimState.status === 'claiming' || isClaimed}
              onClick={handleClaimGift}
              className="mt-6 inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium transition-all hover:bg-blue-800 dark:hover:bg-blue-500 ease-in-out duration-200 disabled:opacity-50"
            >
              {claimState.status === 'claiming'
                ? 'Claiming Your Membership...'
                : isClaimed
                ? 'Membership Claimed'
                : `Claim Your Membership for ${viewer?.email}`}
            </button>
            {claimState.status === 'error' && (
              <p role="alert">{claimState.message}</p>
            )}
            {claimState.status === 'claimed-refresh-failed' && (
              <p role="status">
                Your gift is claimed. <a href="/learn/">Refresh the page</a> to
                start watching.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default GiftClaim
