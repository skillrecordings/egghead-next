import * as React from 'react'
import noop from 'utils/noop'
import Link from 'next/link'

type HeaderButtonShapedLinkProps = {
  url: string
  label: string
  onClick?: () => void
}

export const HeaderButtonShapedLink: React.FC<HeaderButtonShapedLinkProps> = ({
  url,
  label,
  onClick = noop,
}) => {
  return (
    <div className="flex items-center pl-1">
      <Link href={url}>
        <a
          className="bg-blue-600 text-white sm:px-2 sm:py-1 px-3 py-2 rounded-md tracking-tight hover:bg-blue-700 transition"
          onClick={onClick}
        >
          {label}
        </a>
      </Link>
    </div>
  )
}
