import * as React from 'react'

const ControlBarDivider: React.FC<
  React.PropsWithChildren<{
    key: string
    order: number
    className: string
  }>
> = ({className}) => <div className={className} />

export default ControlBarDivider
