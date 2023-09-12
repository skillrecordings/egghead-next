import React, {FunctionComponent} from 'react'
import {usePathname} from 'next/navigation'
import NextLink from 'next/link'
import {UrlObject} from 'url'

declare type Url = string | UrlObject

type LinkProps = {
  href: Url
  children: React.ReactElement
  activeClassName?: string
  partialMatch?: boolean
}

const Link: FunctionComponent<React.PropsWithChildren<LinkProps>> = ({
  href,
  children,
  activeClassName,
  partialMatch = false,
  ...props
}) => {
  const pathname = usePathname() || ''
  let className = children?.props?.className || ''
  if (partialMatch) {
    if (pathname.includes(`${href}`)) {
      className = `${className} ${activeClassName}`
    }
  } else {
    if (pathname === href) {
      className = `${className} ${activeClassName}`
    }
  }

  return (
    <NextLink href={href} {...props} legacyBehavior>
      {React.cloneElement(children, {className})}
    </NextLink>
  )
}

export default Link
