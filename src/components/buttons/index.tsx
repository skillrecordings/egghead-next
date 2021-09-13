import * as React from 'react'
import Link from 'next/link'
import noop from 'utils/noop'

type ButtonProps = {
  url: string
  label: string
  className?: string
  quiet?: boolean
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

export const SecondaryButton: React.FC<ButtonProps> = ({
  url,
  className,
  label,
  quiet,
  onClick = noop,
}) => {
  return (
    <Link href={url}>
      <a
        onClick={onClick}
        className={`${className} inline-flex justify-center items-center px-4 py-2 rounded-md  font-normal transition-all   hover:text-gray-800 ease-in-out duration-200 mt-12 ${
          quiet
            ? 'hover:bg-gray-100 text-gray-700'
            : 'hover:bg-gray-50 text-gray-600 border border-gray-100 bg-white shadow-sm hover:shadow'
        }`}
      >
        {label}
      </a>
    </Link>
  )
}
