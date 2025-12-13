'use client'
import * as React from 'react'
import {FunctionComponent} from 'react'
import ActiveSale from './active-sale'
import UpcomingSale from './upcoming-sale'

const LifetimePricingWidget: FunctionComponent<
  React.PropsWithChildren<{lastCharge?: {amountPaid: number} | null}>
> = ({lastCharge}) => {
  const allowPurchase = 'true'

  return (
    <>
      {allowPurchase === 'true' ? (
        <ActiveSale lastCharge={lastCharge ?? undefined} />
      ) : (
        <UpcomingSale />
      )}
    </>
  )
}

export default LifetimePricingWidget
