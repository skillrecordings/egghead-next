'use client'
import * as React from 'react'
import {FunctionComponent} from 'react'
import {useSearchParams} from 'next/navigation'
import ActiveSale from './active-sale'

const WorkshopPricingWidget: FunctionComponent<
  React.PropsWithChildren<{
    lastCharge: {amountPaid: number}
    priceId: string
    title: string
    plan: {
      price: number
      price_discounted: number
    }
    workshopFeatures: string[]
    SaleClosedUi: React.ReactNode
  }>
> = ({lastCharge, priceId, title, plan, workshopFeatures, SaleClosedUi}) => {
  const searchParams = useSearchParams()
  const allowPurchase = searchParams?.get('allowPurchase') ?? false

  return (
    <>
      {allowPurchase === 'true' ? (
        <ActiveSale
          lastCharge={lastCharge}
          priceId={priceId}
          title={title}
          plan={plan}
          workshopFeatures={workshopFeatures}
        />
      ) : (
        SaleClosedUi
      )}
    </>
  )
}

export default WorkshopPricingWidget
