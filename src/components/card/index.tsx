import * as React from 'react'
import Image from 'next/image'
import {createNamedContext} from '@reach/utils/context'
import {useId} from '@reach/auto-id'
import type * as Polymorphic from '@reach/utils/polymorphic'
import {CardResource} from 'types'

const CardContext = createNamedContext<InternalCardContextValue>(
  'CardContext',
  {} as InternalCardContextValue,
)

type InternalCardContextValue = {
  cardId: string | undefined
  quiet: boolean
  horizontal: boolean
  resource?: CardResource
}

type CardProps = {
  quiet?: boolean
  horizontal?: boolean
  resource?: CardResource
}

const cardDefaultClasses =
  'bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm rounded-lg overflow-hidden p-5'

const Card = React.forwardRef(function Card(
  {
    children,
    as: Comp = 'div',
    quiet = false,
    horizontal = false,
    className,
    resource,
    ...props
  },
  forwardRef,
) {
  if (!quiet) {
    // className = `${cardDefaultClasses} ${className ? className : ''}`
    className = `${className ? className : ''}`
  }
  const id = useId(props.id)
  const context: InternalCardContextValue = React.useMemo(
    () => ({
      cardId: id,
      quiet,
      horizontal,
      resource,
    }),
    [quiet, id, horizontal, resource],
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

const CardContent = React.forwardRef(function CardContent(
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

const CardHeader = React.forwardRef(function CardHeader(
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

const CardBody = React.forwardRef(function CardBody(
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

type CardAuthorProps = {}

const CardAuthor = React.forwardRef(function CardAuthor(
  {
    children,
    as: Comp = 'div',
    className = 'flex items-center justify-center pt-4',
    ...props
  },
  forwardRef,
) {
  const {resource} = React.useContext(CardContext)
  const instructor = resource?.instructor
  if (!instructor) return null

  return (
    <Comp
      {...props}
      className={className}
      ref={forwardRef}
      data-egghead-card-author=""
    >
      {instructor.image && (
        <div className="w-5 h-5 overflow-hidden rounded-full sm:w-7 sm:h-7">
          <Image
            aria-hidden
            src={instructor.image}
            alt={instructor.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      )}
      <span className="text-left pl-2 dark:text-indigo-100 text-gray-700 sm:text-sm text-[0.65rem] opacity-80 leading-none">
        <span className="sr-only">{resource?.name} by </span>
        {instructor.name}
      </span>
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', CardAuthorProps>

type CardMetaProps = {}

const CardMeta = React.forwardRef(function CardMeta(
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

const CardFooter = React.forwardRef(function CardFooter(
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
  CardAuthorProps,
}

export {
  Card,
  CardPreview,
  CardContent,
  CardHeader,
  CardBody,
  CardMeta,
  CardFooter,
  CardAuthor,
}
