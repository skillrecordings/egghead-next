'use client'
import * as React from 'react'
import {FunctionComponent} from 'react'
import {useSearchParams} from 'next/navigation'
import ActiveSale from './active-sale'
import UpcomingSale from './upcoming-sale'

const LifetimePricingWidget: FunctionComponent<
  React.PropsWithChildren<{lastCharge: {amountPaid: number}}>
> = ({lastCharge}) => {
  const searchParams = useSearchParams()
  const allowPurchase = searchParams?.get('allowPurchase') ?? false

  return (
    <>
      {allowPurchase === 'true' ? (
        <ActiveSale lastCharge={lastCharge} />
      ) : (
        <UpcomingSale />
      )}
    </>
  )
}

export default LifetimePricingWidget
