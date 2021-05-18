import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'

type LayoutProps = {
  meta: any
  noIndex?: boolean
}

const DefaultLayout: FunctionComponent<LayoutProps> = ({
  children,
  meta,
  noIndex = false,
}) => {
  const {title, description, titleAppendSiteName = false, url, ogImage} =
    meta || {}
  return (
    <>
      <NextSeo
        noindex={noIndex}
        title={title}
        description={description}
        titleTemplate={titleAppendSiteName ? undefined : '%s'}
        openGraph={{
          title,
          description,
          url,
          images: ogImage ? [ogImage] : undefined,
        }}
        canonical={url}
      />
      {title && <h1 className="text-2xl leading-tight">{title}</h1>}
      <main className="max-w-screen-md mx-auto sm:pt-10 pt-4 sm:pb-16 pb-8">
        {children}
      </main>
    </>
  )
}

export default DefaultLayout
