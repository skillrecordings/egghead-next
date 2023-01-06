import React from 'react'

const SvgIcon = ({
  className,
  children,
  title,
  height,
  width,
  viewBoxMinWidth = 0,
  viewBoxMinHeight = 0,
  viewBoxWidth = 22,
  viewBoxHeight = 22,
}) => (
  <svg
    className={className}
    height={height}
    width={width}
    viewBox={`${viewBoxMinWidth} ${viewBoxMinHeight} ${viewBoxWidth} ${viewBoxHeight}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={`${title}-title`}
    style={{verticalAlign: 'middle'}}
  >
    <title id={`${title}-title`}>{title}</title>
    {children}
  </svg>
)

export default SvgIcon
