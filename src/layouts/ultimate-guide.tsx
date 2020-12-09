import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Contributors from 'components/Contributors'
import Image from 'next/image'
import first from 'lodash/first'

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
    coverImage,
    contributors,
  } = meta

  const author: string | undefined = contributors && first(contributors)

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
          images: ogImage
            ? [ogImage]
            : [
                {
                  url: `https://og-image-react-egghead.now.sh/article/Codemods%20with%20Babel%20Plugins?author=${
                    author ? encodeURIComponent(author) : ''
                  }`,
                },
              ],
        }}
        canonical={url}
      />
      <div>
        <article className="mx-auto max-w-screen-md sm:mt-14 mt-8">
          <header>
            <h1 className="max-w-screen-md w-full font-extrabold mb-8 lg:mb-10 lg:text-6xl md:text-5xl text-4xl leading-tighter">
              {title}
            </h1>
            {contributors && (
              <>
                <Contributors contributors={contributors} />{' '}
                {!coverImage && (
                  <hr className="w-8 border border-blue-600 my-8" />
                )}
              </>
            )}
            {coverImage && (
              <div className="mt-4">
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt || title}
                  width={1280}
                  height={720}
                />
              </div>
            )}
          </header>
          <main className="prose md:prose-lg max-w-none">
            <div>{children}</div>
          </main>
        </article>
      </div>
    </>
  )
}

export default UltimateGuideLayout
