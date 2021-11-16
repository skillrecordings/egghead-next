import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Contributors from '../components/contributors'

type LayoutProps = {
  meta?: {
    title?: string
    description?: string
    titleAppendSiteName?: boolean
    url?: string
    ogImage?: any
    contributors?: {name: string; type: string; image: string; path: string}[]
  }
}

const FancyGuideLayout: FunctionComponent<LayoutProps> = ({
  children,
  meta = {},
}) => {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
    contributors,
  } = meta
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        titleTemplate={titleAppendSiteName ? undefined : '%s'}
        twitter={{
          cardType: ogImage ? 'summary_large_image' : 'summary',
        }}
        openGraph={{
          title,
          description,
          url,
          images: ogImage ? [ogImage] : undefined,
        }}
        canonical={url}
      />
      <div className="container">
        <article className="max-w-screen-md mx-auto mt-5 mb-16">
          <h1 className="mt-8 mb-6 text-4xl font-extrabold leading-tight sm:mb-12 sm:mt-16 lg:mb-10 md:text-6xl">
            {title}
          </h1>

          <main>{children}</main>
          <footer>
            {contributors && <Contributors contributors={contributors} />}
          </footer>
        </article>
      </div>
    </>
  )
}

export default FancyGuideLayout
