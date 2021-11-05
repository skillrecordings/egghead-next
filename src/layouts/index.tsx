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
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
  } = meta || {}
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
      <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3 mb-24">
        {title && (
          <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
            {title}
          </h1>
        )}
        <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none">
          {children}
        </main>
      </article>
    </>
  )
}

export default DefaultLayout
