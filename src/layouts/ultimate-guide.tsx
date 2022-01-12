import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Contributors from 'components/contributors'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'

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
    state?: string
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
    state,
  } = meta

  const defaultOgImage: string | undefined = title
    ? `https://og-image-react-egghead.now.sh/article/${encodeURIComponent(
        title,
      )}`
    : undefined

  const router = useRouter()

  const editUrl = `https://github.com/eggheadio/egghead-next/edit/main/src/pages${router.pathname}/index.mdx`
  const EditLink: FunctionComponent<{className: string}> = ({className}) => (
    <div>
      <a
        href={editUrl}
        className={`flex items-center space-x-1 font-medium ${className}`}
      >
        {/* prettier-ignore */}
        <svg className="text-blue-500" width={18} height={18} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 0 1 2-2h4a1 1 0 0 1 0 2H4v10h10v-4a1 1 0 1 1 2 0v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" fill="currentColor"/></g></svg>
        <span>Edit this article on GitHub</span>
      </a>
    </div>
  )

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
      <div className="container">
        <article className="max-w-screen-md mx-auto mt-8 lg:mt-20 md:mt-14">
          <header>
            {state && <State state={state} />}
            <h1 className="w-full max-w-screen-md mb-8 text-3xl font-extrabold lg:text-6xl md:text-5xl sm:text-4xl lg:mb-10 leading-tighter">
              {title}
            </h1>
            {author && <Author author={author} />}
            {coverImage?.url && (
              <div className="mt-4">
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt || title}
                  width={1280}
                  height={720}
                  quality={100}
                  className="rounded-lg"
                />
              </div>
            )}
          </header>

          <main className="mt-5 prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:prose-lg lg:prose-xl max-w-none">
            <div>{children}</div>
          </main>
          <footer className="flex flex-col-reverse items-center justify-between py-10 mt-8 text-center border-t border-gray-200 sm:flex-row sm:items-start sm:text-left">
            {contributors && <Contributors contributors={contributors} />}
            <EditLink className="mb-16 sm:mb-0" />
          </footer>
        </article>
      </div>
    </>
  )
}

const State: FunctionComponent<{state: string}> = ({state}) => {
  switch (state) {
    case 'draft':
      return (
        <div className="inline-block px-3 py-1 mb-2 text-sm font-semibold bg-yellow-100 rounded-lg dark:text-gray-900">
          {state}
        </div>
      )
    case 'notes':
      return (
        <div className="inline-block px-3 py-1 mb-2 text-sm font-semibold bg-green-100 rounded-lg dark:text-gray-900">
          {state}
        </div>
      )
    default:
      return null
  }
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
        <a className="inline-flex items-center space-x-2">
          <Profile />
        </a>
      </Link>
    ) : (
      <div className="inline-flex items-center space-x-2">
        <Profile />
      </div>
    )
  ) : null
}

export default UltimateGuideLayout
