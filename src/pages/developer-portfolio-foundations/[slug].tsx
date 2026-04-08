import * as React from 'react'
import {GetServerSideProps} from 'next'
import {withSSRLogging} from '@/lib/logging'
import mdxComponents from '@/components/mdx'
import {sanityClient} from '@/utils/sanity-client'
import groq from 'groq'
import {serialize} from 'next-mdx-remote/serialize'
import {MDXRemote} from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import {canonicalizeInternalQueryParams} from '@/server/nxtp-query'

const PortfolioFoundationsArticle: React.FC<React.PropsWithChildren<any>> = ({
  source,
  title,
}) => {
  return (
    <article className="max-w-screen-md mx-auto mt-3 lg:mt-14 md:mt-8">
      <header>
        <h1 className="w-full max-w-screen-md mb-8 text-3xl font-extrabold lg:text-6xl md:text-5xl sm:text-4xl lg:mb-10 leading-tighter">
          {title}
        </h1>
      </header>
      <main className="mt-5 prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none">
        <MDXRemote {...source} components={mdxComponents} />
      </main>
    </article>
  )
}

export default PortfolioFoundationsArticle

export const getServerSideProps: GetServerSideProps = withSSRLogging(
  async function ({params, res, query}) {
    if (params?.slug) {
      const canonicalRedirect = canonicalizeInternalQueryParams({
        pathname: `/developer-portfolio-foundations/${params.slug}`,
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
      try {
        const articleQuery = groq`
    *[_type == 'resource' && slug.current == 'portfolio-foundations'][0]{
    "resource": resources[slug.current == '${params.slug}'][0]{
      title,
      "article": content[label == "article"][0].text
    }
  }
  `

        const {resource} = await sanityClient.fetch(articleQuery)

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
