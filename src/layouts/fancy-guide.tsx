import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Contributors from '../components/Contributors'

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
      <div>
        <article className="max-w-screen-md mx-auto mb-16">
          <h1 className="font-extrabold sm:mb-12 mb-6 sm:mt-16 mt-8 lg:mb-10 leading-tight md:text-6xl text-4xl">
            {title}
          </h1>

          <main>{children}</main>
          <footer>
            <Contributors contributors={contributors} />
          </footer>
        </article>
      </div>
    </>
  )
}

export default FancyGuideLayout
