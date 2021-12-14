import * as React from 'react'
import type * as Polymorphic from '@reach/utils/polymorphic'

type GridProps = {}

const gridDefaultClasses =
  'grid grid-cols-2 gap-2 md:grid-cols-4 xl:gap-5 sm:gap-3'

const Grid = React.forwardRef(function Grid(
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
}) as Polymorphic.ForwardRefComponent<'div', GridProps>

export default Grid
