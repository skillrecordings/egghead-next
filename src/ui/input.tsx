import * as React from 'react'
import {cn} from './utils'
import {cva} from 'class-variance-authority'

const defaultInputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, ...props}, ref) => {
    return (
      <input
        data-sr-input=""
        type={type}
        className={cn(defaultInputVariants(), className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export {Input, defaultInputVariants}
