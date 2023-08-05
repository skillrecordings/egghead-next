import * as React from 'react'
import {useRouter} from 'next/router'
import ConfirmMembership from 'components/pages/confirm/membership/index'

import {trpc} from '../../trpc/trpc.client'

const ConfirmMembershipPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const {query} = useRouter()

  const {session_id} = query
  const {data} = trpc.stripe.checkoutSessionById.useQuery({
    checkoutSessionId: session_id as string,
  })

  if (!session_id) return null

  return (
    <>
      {data?.session?.payment_status === 'paid' && (
        <div className="-m-5 dark:bg-gray-900 bg-gray-50 min-h-screen">
          <div className="max-w-screen-sm mx-auto p-5 w-full flex flex-col items-center justify-start sm:py-16 py-8">
            <ConfirmMembership session_id={session_id as string} />
          </div>
        </div>
      )}
    </>
  )
}

export default ConfirmMembershipPage
