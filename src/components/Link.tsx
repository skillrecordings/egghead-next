import React, {FunctionComponent} from 'react'
import {useRouter} from 'next/router'
import NextLink from 'next/link'
import {UrlObject} from 'url'

declare type Url = string | UrlObject

type LinkProps = {
  href: Url
  children: React.ReactElement
  activeClassName?: string
}

const Link: FunctionComponent<LinkProps> = ({
  href,
  children,
  activeClassName,
  ...props
}) => {
  const router = useRouter()
  let className = children?.props?.className || ''
  if (router.asPath.includes(`${href}`)) {
    className = `${className} ${activeClassName}`
  }

  return (
    <NextLink href={href} {...props}>
      {React.cloneElement(children, {className})}
    </NextLink>
  )
}

export default Link
