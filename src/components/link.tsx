import React, {FunctionComponent} from 'react'
import {usePathname} from 'next/navigation'
import NextLink from 'next/link'
import {UrlObject} from 'url'

declare type Url = string | UrlObject

type LinkProps = {
  href: Url
  children: React.ReactNode
  activeClassName?: string
  partialMatch?: boolean
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

const Link: FunctionComponent<React.PropsWithChildren<LinkProps>> = ({
  href,
  children,
  activeClassName,
  partialMatch = false,
  className = '',
  onClick,
  ...props
}) => {
  const pathname = usePathname() || ''
  let activeClass = ''

  if (activeClassName) {
    if (partialMatch) {
      if (pathname.includes(`${href}`)) {
        activeClass = activeClassName
      }
    } else {
      if (pathname === href) {
        activeClass = activeClassName
      }
    }
  }

  const combinedClassName = [className, activeClass].filter(Boolean).join(' ')

  return (
    <NextLink
      href={href}
      className={combinedClassName}
      onClick={onClick}
      {...props}
    >
      {children}
    </NextLink>
  )
}

export default Link
