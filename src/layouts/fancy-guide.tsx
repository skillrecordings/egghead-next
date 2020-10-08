import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
// import Contributors from '../components/Contributors'

type LayoutProps = {
  frontMatter: any
}

const FancyGuideLayout: FunctionComponent<LayoutProps> = ({
  children,
  frontMatter,
}) => {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
    // contributors,
  } = frontMatter
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
      <div className="md:max-w-4xl mx-auto leading-relaxed ">
        <h1 className="mt-8 font-extrabold mb-8 lg:mb-10 leading-tight text-5xl md:text-6xl">
          {title}
        </h1>
        {/* <Contributors contributors={contributors} /> */}
        <hr className="md:max-w-2xl mx-auto mt-8" />
        {children}
      </div>
    </>
  )
}

export default FancyGuideLayout
