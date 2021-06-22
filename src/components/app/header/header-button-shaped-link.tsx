import * as React from 'react'
import Link from 'next/link'
import noop from 'utils/noop'

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
    <div className="hidden lg:block">
      <Link href={url}>
        <a
          onClick={onClick}
          className="inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200"
        >
          {label}
        </a>
      </Link>
    </div>
  )
}
