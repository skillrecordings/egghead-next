// Card: Simple rectangular container
// When to use: A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.
import React, {FunctionComponent} from 'react'

type CardProps = {
  small?: Boolean
  className?: String
  children: React.ReactNode
  padding?: String
}

const Card: FunctionComponent<CardProps> = ({
  small,
  className,
  children,
  padding,
  ...restProps
}) => {
  const childrenArr = React.Children.toArray(children)
  return (
    <div
      className={`bg-white shadow-sm rounded-lg overflow-hidden ${
        padding ? padding : 'sm:p-5 p-4'
      } ${className ? className : ''}`}
      {...restProps}
    >
      <>{childrenArr[0]}</>
      <>{childrenArr[1]}</>
    </div>
  )
}

export default Card
