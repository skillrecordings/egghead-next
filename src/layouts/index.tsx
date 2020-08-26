import React from 'react'
import {NextSeo} from 'next-seo'

export default function Layout({children, frontMatter}) {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
  } = frontMatter
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
      <div className="prose max-w-none">
        <h1>{title}</h1>
        {children}
      </div>
    </>
  )
}
