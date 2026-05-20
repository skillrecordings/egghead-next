import * as React from 'react'
import {GetServerSideProps} from 'next'
import {withSSRLogging} from '@/lib/logging'
import mdxComponents from '@/components/mdx'
import {serialize} from 'next-mdx-remote/serialize'
import {MDXRemote} from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import {canonicalizeInternalQueryParams} from '@/server/nxtp-query'
import standalonePageData from '@/data/standalone-page-data.json'

type InlineArticle = {
  slug: string
  title: string
  article?: string
}

const OnlinePresenceArticle: React.FC<React.PropsWithChildren<any>> = ({
  source,
  title,
}) => {
  return (
    <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3">
      <header>
        <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
          {title}
        </h1>
      </header>
      <main className="prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:prose-lg lg:prose-xl mt-5 max-w-none">
        <MDXRemote {...source} components={mdxComponents} />
      </main>
    </article>
  )
}

export default OnlinePresenceArticle

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async function ({params, res, query}) {
    if (params?.slug) {
      const canonicalRedirect = canonicalizeInternalQueryParams({
        pathname: `/own-your-online-presence/${params.slug}`,
        query,
        omitKeys: ['slug'],
      })

      if (canonicalRedirect) {
        return {
          redirect: {
            destination: canonicalRedirect.destination,
            permanent: false,
          },
        }
      }
      const articles =
        standalonePageData.onlinePresenceArticles as InlineArticle[]
      const resource = articles.find((article) => article.slug === params.slug)

      if (!resource?.article) {
        res.statusCode = 404
        res.end()
        return {props: {}}
      }

      try {
        const source = await serialize(resource.article, {
          blockJS: false,
          blockDangerousJS: true,
          mdxOptions: {
            useDynamicImport: true,
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeHighlight],
          },
        })

        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
        return {
          props: {source, title: resource.title},
        }
      } catch (e) {
        console.error(e)
        res.statusCode = 404
        res.end()
        return {props: {}}
      }
    }

    res.statusCode = 404
    res.end()
    return {props: {}}
  },
)
