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
      <div className="prose md:prose-xl max-w-2xl w-full mx-auto leading-6">
        <h1 className="mt-8 font-extrabold mb-8 lg:mb-10 leading-tight text-5xl md:text-6xl">
          {title}
        </h1>
        {contributors && (
          <>
            <Contributors contributors={contributors} />{' '}
            <hr className="md:max-w-2xl mx-auto mt-8 mb-8" />
          </>
        )}
        {children}
        {children}
      </div>
    </>
  )
}

export default UltimateGuideLayout
