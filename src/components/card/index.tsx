import * as React from 'react'
import {createNamedContext} from '@reach/utils/context'
import {useId} from '@reach/auto-id'
import type * as Polymorphic from '@reach/utils/polymorphic'

const CardContext = createNamedContext<InternalCardContextValue>(
  'CardContext',
  {} as InternalCardContextValue,
)

type InternalCardContextValue = {
  cardId: string | undefined
  quiet: boolean
  horizontal: boolean
}

type CardProps = {
  quiet?: boolean
  horizontal?: boolean
}

const cardDefaultClasses = `bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden sm:p-8 p-5`

const Card = React.forwardRef(function Card(
  {
    children,
    as: Comp = 'div',
    quiet = false,
    horizontal = false,
    className,
    ...props
  },
  forwardRef,
) {
  if (!quiet) {
    className = `${cardDefaultClasses} ${className ? className : ''}`
  }
  const id = useId(props.id)
  const context: InternalCardContextValue = React.useMemo(
    () => ({
      cardId: id,
      quiet,
      horizontal,
    }),
    [quiet, id, horizontal],
  )

  return (
    <CardContext.Provider value={context}>
      <Comp
        className={className}
        {...props}
        ref={forwardRef}
        data-egghead-card=""
      >
        {children}
      </Comp>
    </CardContext.Provider>
  )
}) as Polymorphic.ForwardRefComponent<'div', CardProps>

type CardPreviewProps = {}

const CardPreview = React.forwardRef(function CardPreview(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {horizontal, quiet} = React.useContext(CardContext)

  return (
    <Comp {...props} ref={forwardRef} data-egghead-card-preview="">
      {children}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', CardPreviewProps>

type CardContentProps = {}

const CardContent = React.forwardRef(function CardPreview(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {horizontal, quiet} = React.useContext(CardContext)

  return (
    <Comp {...props} ref={forwardRef} data-egghead-card-content="">
      {children}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', CardContentProps>

type CardHeaderProps = {}

const CardHeader = React.forwardRef(function CardPreview(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {horizontal, quiet} = React.useContext(CardContext)

  return (
    <Comp {...props} ref={forwardRef} data-egghead-card-header="">
      {children}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', CardHeaderProps>

type CardBodyProps = {}

const CardBody = React.forwardRef(function CardPreview(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {horizontal, quiet} = React.useContext(CardContext)

  return (
    <Comp {...props} ref={forwardRef} data-egghead-card-body="">
      {children}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', CardBodyProps>

type CardMetaProps = {}

const CardMeta = React.forwardRef(function CardPreview(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {horizontal, quiet} = React.useContext(CardContext)

  return (
    <Comp {...props} ref={forwardRef} data-egghead-card-meta="">
      {children}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', CardMetaProps>

type CardFooterProps = {}

const CardFooter = React.forwardRef(function CardPreview(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {horizontal, quiet} = React.useContext(CardContext)

  return (
    <Comp {...props} ref={forwardRef} data-egghead-card-footer="">
      {children}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', CardFooterProps>

export type {
  CardProps,
  CardPreviewProps,
  CardContentProps,
  CardHeaderProps,
  CardBodyProps,
  CardMetaProps,
  CardFooterProps,
}

export {
  Card,
  CardPreview,
  CardContent,
  CardHeader,
  CardBody,
  CardMeta,
  CardFooter,
}
