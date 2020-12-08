import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'

type LayoutProps = {
  meta: any
}

const DefaultLayout: FunctionComponent<LayoutProps> = ({children, meta}) => {
  const {title, description, titleAppendSiteName = false, url, ogImage} =
    meta || {}
  return (
    <>
      <NextSeo
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
      <main className="prose md:prose-lg max-w-screen-md mx-auto sm:pt-10 pt-4">
        {children}
      </main>
    </>
  )
}

export default DefaultLayout
