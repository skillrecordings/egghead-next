import React from 'react'
import {NextSeo} from 'next-seo'

export default function Layout({
  title,
  description,
  titleAppendSiteName = true,
  url,
  ...frontMatter
}) {
  return ({children: content}) => {
    // React hooks, for example `useState` or `useEffect`, go here.

    console.log()
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
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
          <h1>{frontMatter.title}</h1>
          {content}
        </div>
      </>
    )
  }
}
