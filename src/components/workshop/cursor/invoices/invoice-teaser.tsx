'use client'

import * as React from 'react'
import NextLink from 'next/link'
import {Slot} from '@radix-ui/react-slot'
import {format} from 'date-fns'

import type {Purchase} from '@/components/workshop/cursor/invoices/types'
import {cn} from '@/ui/utils'

type InvoiceTeaserContextType = {
  purchase: Purchase
}

const InvoiceTeaserContext = React.createContext<
  InvoiceTeaserContextType | undefined
>(undefined)

export const InvoiceTeaserProvider: React.FC<
  InvoiceTeaserContextType & {children: React.ReactNode}
> = ({children, ...props}) => {
  return (
    <InvoiceTeaserContext.Provider value={props}>
      {children}
    </InvoiceTeaserContext.Provider>
  )
}

export const useInvoiceTeaser = () => {
  const context = React.use(InvoiceTeaserContext)
  if (context === undefined) {
    throw new Error(
      'useInvoiceTeaser must be used within an InvoiceTeaserProvider',
    )
  }
  return context
}

type RootProps = InvoiceTeaserContextType & {
  className?: string
  asChild?: boolean
}

const Root: React.FC<React.PropsWithChildren<RootProps>> = ({
  children,
  asChild,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot : 'section'

  return (
    <InvoiceTeaserProvider {...props}>
      <Comp className={cn('', className)}>{children}</Comp>
    </InvoiceTeaserProvider>
  )
}

// title

type TitleProps = {
  asChild?: boolean
  className?: string
}

const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({
  className,
  asChild,
  children,
}) => {
  const Comp = asChild ? Slot : 'p'
  const {purchase} = useInvoiceTeaser()
  return (
    <Comp className={cn('text-balance font-medium', className)}>
      {children || <>{purchase?.product?.name}</>}
    </Comp>
  )
}

// amount

type AmountProps = {
  className?: string
}

const Amount: React.FC<React.PropsWithChildren<AmountProps>> = ({
  className,
  children,
}) => {
  const {purchase} = useInvoiceTeaser()
  return (
    <span className={cn('', className)}>
      {children || (
        <>
          {Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(purchase.totalAmount)}
        </>
      )}
    </span>
  )
}

// date

type DateProps = {
  className?: string
}

const IssueDate: React.FC<React.PropsWithChildren<DateProps>> = ({
  className,
  children,
}) => {
  const {purchase} = useInvoiceTeaser()

  return (
    <time
      dateTime={purchase.createdAt.toString()}
      className={cn('', className)}
    >
      {children || <>{format(new Date(purchase.createdAt), 'MMMM d, y')}</>}
    </time>
  )
}

// metadata

type MetadataProps = {
  className?: string
}

const Metadata: React.FC<React.PropsWithChildren<MetadataProps>> = ({
  className,
  children,
}) => {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <Amount />
      <span>・</span>
      <IssueDate />
    </div>
  )
}

// link

type LinkProps = {
  className?: string
  asChild?: boolean
}

const Link: React.FC<React.PropsWithChildren<LinkProps>> = ({
  className,
  asChild,
  children,
}) => {
  const Comp = asChild ? Slot : NextLink
  const {purchase} = useInvoiceTeaser()

  return (
    <Comp
      href={`/invoices/${purchase.merchantChargeId}`}
      className={cn('', className)}
    >
      {children || <>View →</>}
    </Comp>
  )
}

// full component

const InvoiceTeaserComp: React.FC<InvoiceTeaserContextType> = ({purchase}) => {
  return (
    <Root purchase={purchase}>
      <Title />
      <Amount />
      <IssueDate />
    </Root>
  )
}

export {Root, Title, IssueDate, Amount, Metadata, Link, InvoiceTeaserComp}
