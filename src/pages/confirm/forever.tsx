import * as React from 'react'
import {useRouter} from 'next/router'
import {ConfirmLifetimeMembership} from '@/components/pages/confirm/membership/index'

import {trpc} from '@/app/_trpc/client'

const ConfirmLifetimeMembershipPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const {query} = useRouter()

  const session_id = query.session_id as string
  const {data} = trpc.stripe.checkoutSessionById.useQuery({
    checkoutSessionId: session_id,
  })

  const isPaid = data && data?.session?.payment_status === 'paid'

  if (!session_id || !isPaid) return null

  return (
    <div className="-m-5 dark:bg-gray-900 bg-gray-50 min-h-screen">
      <div className="max-w-screen-sm mx-auto p-5 w-full flex flex-col items-center justify-start sm:py-16 py-8">
        <ConfirmLifetimeMembership session_id={session_id} />
      </div>
    </div>
  )
}

export default ConfirmLifetimeMembershipPage
