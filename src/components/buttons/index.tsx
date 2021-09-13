import * as React from 'react'
import Link from 'next/link'
import noop from 'utils/noop'

type ButtonProps = {
  url: string
  label: string
  className?: string
  onClick?: () => void
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  url,
  className,
  label,
  onClick = noop,
}) => {
  return (
    <Link href={url}>
      <a
        onClick={onClick}
        className={`${className} inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium transition-all hover:bg-blue-800 ease-in-out duration-200`}
      >
        {label}
      </a>
    </Link>
  )
}

export const Secondary: React.FC<ButtonProps> = ({
  url,
  className,
  label,
  onClick = noop,
}) => {
  return (
    <Link href={url}>
      <a
        onClick={onClick}
        className={`${className} inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium transition-all hover:bg-blue-800 ease-in-out duration-200`}
      >
        {label}
      </a>
    </Link>
  )
}
