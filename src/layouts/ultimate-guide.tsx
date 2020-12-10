import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Contributors from 'components/Contributors'
import Image from 'next/image'
import Link from 'next/link'

type LayoutProps = {
  meta?: {
    title?: string
    description?: string
    titleAppendSiteName?: boolean
    url?: string
    ogImage?: any
    coverImage?: {url: string; alt: string}
    author?: {name: string; image: string; path: string} | undefined
    contributors?: {name: string; type: string; image: string; path: string}[]
  }
}

const UltimateGuideLayout: FunctionComponent<LayoutProps> = ({
  children,
  meta = {},
}) => {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
    coverImage,
    author,
    contributors,
  } = meta

  const defaultOgImage: string | undefined = title
    ? `https://og-image-react-egghead.now.sh/article/${encodeURIComponent(
        title,
      )}`
    : undefined

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
                  url: defaultOgImage,
                  alt: title,
                },
              ],
        }}
        canonical={url}
      />
      <div>
        <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3">
          <header>
            <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-2xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
              {title}
            </h1>
            {author && <Author author={author} />}
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
          <footer>
            {contributors && <Contributors contributors={contributors} />}
          </footer>
        </article>
      </div>
    </>
  )
}

const Author: FunctionComponent<{
  author: {
    name: string
    image?: string
    path?: string
  }
}> = ({author}) => {
  const {name, image, path} = author
  const Profile = () => (
    <>
      {image && (
        <Image
          src={image}
          width={48}
          height={48}
          alt={name}
          className="rounded-full"
        />
      )}
      <div className="leading-tighter">
        <span className="text-xs uppercase">author</span>
        <div className="font-semibold">{name}</div>
      </div>
    </>
  )
  return name ? (
    path ? (
      <Link href={path}>
        <a className="flex items-center space-x-2">
          <Profile />
        </a>
      </Link>
    ) : (
      <div className="flex items-center space-x-2">
        <Profile />
      </div>
    )
  ) : null
}

export default UltimateGuideLayout
