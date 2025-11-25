import * as React from 'react'
import Image from 'next/legacy/image'
import {CardResource} from '@/types'

const CardContext = React.createContext<InternalCardContextValue>(
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

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    as?: React.ElementType
    className?: string
    children?: React.ReactNode
  } & Record<string, any>
>(function Card(
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
  const generatedId = React.useId()
  const id = props.id || generatedId
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
})

type CardPreviewProps = {
  as?: React.ElementType
  className?: string
  children?: React.ReactNode
} & Record<string, any>

const CardPreview = React.forwardRef<HTMLDivElement, CardPreviewProps>(
  function CardPreview({children, as: Comp = 'div', ...props}, forwardRef) {
    const {horizontal, quiet} = React.useContext(CardContext)

    return (
      <Comp {...props} ref={forwardRef} data-egghead-card-preview="">
        {children}
      </Comp>
    )
  },
)

type CardContentProps = {
  as?: React.ElementType
  className?: string
  children?: React.ReactNode
} & Record<string, any>

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({children, as: Comp = 'div', ...props}, forwardRef) {
    const {horizontal, quiet} = React.useContext(CardContext)

    return (
      <Comp {...props} ref={forwardRef} data-egghead-card-content="">
        {children}
      </Comp>
    )
  },
)

type CardHeaderProps = {
  as?: React.ElementType
  className?: string
  children?: React.ReactNode
} & Record<string, any>

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({children, as: Comp = 'div', ...props}, forwardRef) {
    const {horizontal, quiet} = React.useContext(CardContext)

    return (
      <Comp {...props} ref={forwardRef} data-egghead-card-header="">
        {children}
      </Comp>
    )
  },
)

type CardBodyProps = {
  as?: React.ElementType
  className?: string
  children?: React.ReactNode
} & Record<string, any>

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  function CardBody({children, as: Comp = 'div', ...props}, forwardRef) {
    const {horizontal, quiet} = React.useContext(CardContext)

    return (
      <Comp {...props} ref={forwardRef} data-egghead-card-body="">
        {children}
      </Comp>
    )
  },
)

type CardAuthorProps = {
  dark?: boolean
  as?: React.ElementType
  className?: string
  children?: React.ReactNode
} & Record<string, any>

const CardAuthor = React.forwardRef<HTMLDivElement, CardAuthorProps>(
  function CardAuthor(
    {
      children,
      as: Comp = 'div',
      className = 'flex items-center justify-center pt-2',
      dark = false,
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
          <div className="w-5 h-5 overflow-hidden flex-shrink-0 rounded-full lg:w-7 lg:h-7">
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
        {dark ? (
          <span className="text-left pl-2 text-indigo-100 lg:text-sm text-[0.65rem] opacity-80 leading-none">
            <span className="sr-only">{resource?.name} by </span>
            {instructor.name}
          </span>
        ) : (
          <span className="text-left pl-2 dark:text-indigo-100 text-gray-700 lg:text-sm text-[0.65rem] opacity-80 leading-none">
            <span className="sr-only">{resource?.name} by </span>
            {instructor.name}
          </span>
        )}
      </Comp>
    )
  },
)

type CardMetaProps = {
  as?: React.ElementType
  className?: string
  children?: React.ReactNode
} & Record<string, any>

const CardMeta = React.forwardRef<HTMLDivElement, CardMetaProps>(
  function CardMeta({children, as: Comp = 'div', ...props}, forwardRef) {
    const {horizontal, quiet} = React.useContext(CardContext)

    return (
      <Comp {...props} ref={forwardRef} data-egghead-card-meta="">
        {children}
      </Comp>
    )
  },
)

type CardFooterProps = {
  as?: React.ElementType
  className?: string
  children?: React.ReactNode
} & Record<string, any>

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({children, as: Comp = 'div', ...props}, forwardRef) {
    const {horizontal, quiet} = React.useContext(CardContext)

    return (
      <Comp {...props} ref={forwardRef} data-egghead-card-footer="">
        {children}
      </Comp>
    )
  },
)

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
