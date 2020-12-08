import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Contributors from 'components/Contributors'

type LayoutProps = {
  meta: any
}

const UltimateGuideLayout: FunctionComponent<LayoutProps> = ({
  children,
  meta,
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
      <div className="mx-auto max-w-screen-md sm:mt-14 mt-8">
        <h1 className="max-w-screen-md w-full font-extrabold mb-8 lg:mb-10 lg:text-6xl md:text-5xl text-4xl leading-tighter">
          {title}
        </h1>
        {contributors && (
          <>
            <Contributors contributors={contributors} />{' '}
            <hr className="w-8 border border-blue-600 my-8" />
          </>
        )}
        <main className="prose md:prose-lg max-w-none">{children}</main>
      </div>
    </>
  )
}

export default UltimateGuideLayout
