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
    // React hooks, for example `useState` or `useEffect`, go here.

    console.log(frontMatter)
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
        <div className="prose">
          <h1>{title}</h1>
          {content}
        </div>
      </>
    )
  }
}
