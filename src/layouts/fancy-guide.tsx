import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Contributors from '../components/contributors'
import {useRouter} from 'next/router'

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

const FancyGuideLayout: FunctionComponent<
  React.PropsWithChildren<LayoutProps>
> = ({children, meta = {}}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath

  const {
    title,
    description,
    titleAppendSiteName = false,
    url: urlFromProps,
    ogImage,
    contributors,
  } = meta

  const canonicalUrl = urlFromProps ? urlFromProps : url

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
          url: canonicalUrl,
          images: ogImage ? [ogImage] : undefined,
        }}
        canonical={canonicalUrl}
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
