import * as React from 'react'

type GridProps = {
  as?: React.ElementType
  className?: string
  children?: React.ReactNode
} & Record<string, any>

const gridDefaultClasses =
  'grid grid-cols-2 gap-2 md:grid-cols-4 xl:gap-5 sm:gap-3'

const Grid = React.forwardRef<HTMLDivElement, GridProps>(function Grid(
  {children, as: Comp = 'div', className, ...props},
  forwardRef,
) {
  return (
    <Comp
      className={className ? className : gridDefaultClasses}
      ref={forwardRef}
      {...props}
    >
      {children}
    </Comp>
  )
})

export default Grid
