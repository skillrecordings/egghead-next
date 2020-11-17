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
    contributors?: string[]
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
        openGraph={{
          title,
          description,
          url,
          images: ogImage ? [ogImage] : undefined,
        }}
        canonical={url}
      />
      <div className="md:max-w-4xl mx-auto leading-relaxed mb-16">
        <h1 className="font-extrabold mb-12 mt-16 lg:mb-10 leading-tight text-5xl md:text-6xl">
          {title}
        </h1>
        {contributors && (
          <>
            <Contributors contributors={contributors} />{' '}
            <hr className="md:max-w-2xl mx-auto mt-8 mb-8" />
          </>
        )}
        {children}
      </div>
    </>
  )
}

export default FancyGuideLayout
