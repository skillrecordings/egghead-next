import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import imageUrlBuilder from '@sanity/image-url'
import mdxComponents from 'components/mdx'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'

function urlFor(source: any): any {
  return imageUrlBuilder(sanityClient).image(source)
}

const Tag = (props: any) => {
  const {
    title = 'Missing title',
    name = 'Missing name',
    categories,
    authorImage,
    body = ``,
  } = props

  const content = hydrate(body, {components: mdxComponents})

  return (
    <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3">
      <header>
        <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
          {title}
        </h1>
        <span>By {name}</span>
        {categories && (
          <ul>
            Posted in
            {categories.map((category: any) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        )}
        {authorImage && (
          <div className="mt-4">
            <img
              className="rounded-lg"
              alt={name}
              src={urlFor(authorImage).width(50).url()}
            />
          </div>
        )}
      </header>
      <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none">
        {content}
      </main>
    </article>
  )
}

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "name": author->name,
  "categories": categories[]->title,
  "authorImage": author->image,
  body
}`

export async function getStaticProps(context: any) {
  const {body, ...post} = await sanityClient.fetch(query, {
    slug: context.params.slug,
  })

  const mdxSource = await renderToString(body, {
    components: mdxComponents,
    mdxOptions: {
      remarkPlugins: [
        require(`remark-slug`),
        require(`remark-footnotes`),
        require(`remark-code-titles`),
      ],
      rehypePlugins: [
        [
          require(`rehype-shiki`),
          {
            theme: `./src/styles/material-theme-dark.json`,
            useBackground: false,
          },
        ],
      ],
    },
  })
  return {
    props: {...post, body: mdxSource},
    revalidate: 1,
  }
}

const allPostsQuery = groq`
  *[_type == "post" && publishedAt < now() && !(_id in path("drafts.**"))]{
    "slug": slug.current
  }
`

export async function getStaticPaths() {
  const allPosts = await sanityClient.fetch(allPostsQuery)

  const paths = allPosts.map((post: {slug: string}) => {
    return {
      params: {
        slug: post.slug,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default Tag
