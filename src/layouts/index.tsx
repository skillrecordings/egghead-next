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
      <div className="container">
        <article className="max-w-screen-md mx-auto mt-10 mb-16 lg:mt-24 md:mt-20">
          {title && (
            <h1 className="w-full max-w-screen-md mb-8 text-3xl font-extrabold lg:text-6xl md:text-5xl sm:text-4xl lg:mb-10 leading-tighter">
              {title}
            </h1>
          )}
          <main className="mt-5 prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:prose-lg lg:prose-xl max-w-none">
            {children}
          </main>
        </article>
      </div>
    </>
  )
}

export default DefaultLayout
