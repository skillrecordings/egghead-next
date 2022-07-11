import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from '../../../utils/auth'
import {getGift} from '../../../lib/gifts'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'utils/configured-axios'
import {useRouter} from 'next/router'
import {useViewer} from '../../../context/viewer-context'
import {PrimaryButton} from '../../../components/buttons'

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  query,
}) {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)
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
}

type Gift = {claim_url: string; claimed: boolean; duration_months: number}
type GiftClaimProps = {error?: {type: string; message: string}; gift?: Gift}

const GiftClaim: React.FC<GiftClaimProps> = ({error, gift}) => {
  const router = useRouter()
  const {viewer, refreshUser} = useViewer()

  const handleClaimGift = async () => {
    if (!gift) {
      return
    }
    let {claim_url} = gift
    await axios.post(claim_url)

    await refreshUser()
  }

  return (
    <div className="container flex justify-center">
      <div className="pb-10 mt-8 prose-sm prose text-center dark:prose-dark md:mt-20">
        {error ? (
          <>
            <h1>{error.message}</h1>
            {error.type === 'login' ? (
              <p>
                <Link href="/login">
                  <a>Click here</a>
                </Link>{' '}
                to sign in. Once you are signed in you will need to click your
                gift claim link again.
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
                A gift membership can only be claimed one time. As an existing
                egghead member this gift membership will be applied{' '}
                <em>
                  <b>on top of your existing membership</b>
                </em>
                . They stack. You can claim 10 gift memberships and have PRO
                access for 10 years. When the gift expires, your existing
                membership will resume. You will not lose any membership
                time/money.
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
            <PrimaryButton
              url={{
                pathname: '/learn/',
                query: {
                  message: 'You have claimed the membership coupon.',
                  type: 'claimed',
                },
              }}
              label={`Claim Your Membership for ${viewer?.email}`}
              onClick={handleClaimGift}
              className="mt-6 no-underline"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default GiftClaim
