import React from 'react'
import {NextSeo} from 'next-seo'

export default function UltimateGuideLayout({
  title,
  description,
  titleAppendSiteName = true,
  url,
  ...frontMatter
}) {
  return ({children: content}) => {
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
            images: frontMatter.ogImage ? [frontMatter.ogImage] : undefined,
          }}
          canonical={url}
        />
        <div className="prose max-w-none">
          <h1>{title}</h1>
          {content}
        </div>
      </>
    )
  }
}
