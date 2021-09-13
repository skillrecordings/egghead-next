import * as React from 'react'
import Link from 'next/link'
import noop from 'utils/noop'
import {PrimaryButton} from 'components/buttons/index'

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
    <PrimaryButton
      className="hidden lg:block"
      url={url}
      onClick={onClick}
      label={label}
    />
  )
}
