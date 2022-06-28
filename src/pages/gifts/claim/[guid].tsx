import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from '../../../utils/auth'
import {getGift} from '../../../lib/gifts'
import Link from 'next/link'
import axios from 'utils/configured-axios'
import {useRouter} from 'next/router'
import {useViewer} from '../../../context/viewer-context'
import {PrimaryButton} from '../../../components/buttons'

// tachyons to tailwind converter https://gist.github.com/knoopx/240cbe3b16a7a2f9e4101238533f87c8

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  query,
}) {
  const {eggheadToken} = getTokenFromCookieHeaders(req.headers.cookie as string)
  const {guid} = query

  const gift = await getGift(guid as string, eggheadToken)

  if (!eggheadToken) {
    return {
      props: {
        error: 'You must be logged in to claim a membership token',
      },
    }
  }

  if (gift.claimed) {
    return {
      props: {
        error: 'This membership token has already been claimed',
      },
    }
  }

  return {
    props: {gift},
  }
}

type Gift = {claim_url: string; claimed: boolean; duration_months: number}
type GiftClaimProps = {error?: string; gift?: Gift}

const GiftClaim: React.FC<GiftClaimProps> = ({error, gift}) => {
  const router = useRouter()
  const {viewer, refreshUser} = useViewer()

  const handleClaimGift = async () => {
    if (!gift) {
      return
    }
    const {claim_url} = gift

    await axios.post(claim_url)

    refreshUser()

    router.push('/')
  }

  return (
    <div className="p-5 prose dark:prose-dark prose-sm ">
      {error ? (
        <>
          <h1>{error}</h1>
          <p>
            <Link href="/login">
              <a>Click here</a>
            </Link>{' '}
            to sign in. Once you are signed in you will need to click your gift
            claim link again.
          </p>
        </>
      ) : (
        <>
          <h1>Claim your membership.</h1>
          {viewer?.is_pro ? (
            <p>
              A gift membership can only be claimed one time. As an existing
              egghead member this gift membership will be applied{' '}
              <em>on top of your existing membership</em>. They stack. You can
              claim 10 gift memberships and have PRO access for 10 years. When
              the gift expires, your existing membership will resume. You will
              not lose any membership time/money.
            </p>
          ) : (
            <p>
              A gift membership can only be claimed one time. Once you've
              claimed this gift nobody else will be able to you. It can't be
              undone! Make sure that <em>{viewer?.email}</em> is the account you
              want the gift applied to.
            </p>
          )}
          <PrimaryButton
            url={'#'}
            label={`Claim Your Membership for ${viewer?.email}`}
            onClick={handleClaimGift}
          />
        </>
      )}
    </div>
  )
}

export default GiftClaim
