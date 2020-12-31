const withSvgr = require(`next-svgr`)
const withBundleAnalyzer = require(`@next/bundle-analyzer`)
const withPlugins = require(`next-compose-plugins`)
const rehypeShiki = require(`rehype-shiki`)
const checkEnv = require(`@47ng/check-env`).default
const withImages = require(`next-images`)
const withMDX = require(`@next/mdx`)({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: `./src/styles/material-theme-dark.json`,
          useBackground: false,
        },
      ],
    ],
  },
})

const searchUrlRoot = `/q`

checkEnv({
  required: [`NEXT_PUBLIC_DEPLOYMENT_URL`, `NEXT_PUBLIC_AUTH_DOMAIN`],
})

const appUrl = process.env.NEXT_PUBLIC_AUTH_DOMAIN

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      `d2eip9sf3oo6c2.cloudfront.net`,
      `dcv19h61vib2d.cloudfront.net`,
      `image.simplecastcdn.com`,
      `res.cloudinary.com`,
    ],
  },
  async redirects() {
    return [
      {
        source: `/instructors/:instructor`,
        destination: `${searchUrlRoot}/resources-by-:instructor`,
        permanent: true,
      },
      {
        source: `/podcasts`,
        destination: `${searchUrlRoot}?type=podcast`,
        permanent: true,
      },
      {
        source: `/talks`,
        destination: `${searchUrlRoot}?type=talk`,
        permanent: true,
      },
      {
        source: `/courses`,
        destination: `${searchUrlRoot}?type=course`,
        permanent: true,
      },
      {
        source: `/lessons`,
        destination: `${searchUrlRoot}?type=lesson`,
        permanent: true,
      },
      {source: `/search`, destination: searchUrlRoot, permanent: true},
      {source: `/instructors`, destination: searchUrlRoot, permanent: true},
      {source: `/browse`, destination: searchUrlRoot, permanent: true},
      {source: `/browse/:context`, destination: searchUrlRoot, permanent: true},
      {
        source: `/browse/:context/:tag`,
        destination: `${searchUrlRoot}/:tag`,
        permanent: true,
      },
      {
        source: `/s/:all*`,
        destination: `${appUrl}/s/:all*`,
        permanent: true,
      },
      {
        source: `/courses/:title/:rest(.+)`,
        destination: `${appUrl}/courses/:title/:rest`,
        permanent: true,
      },
      {
        source: `/lessons/:title/:rest(.+)`,
        destination: `${appUrl}/lessons/:title/:rest`,
        permanent: true,
      },
      {
        source: `/podcasts/:title/:rest(.+)`,
        destination: `${appUrl}/podcasts/:title/:rest`,
        permanent: true,
      },
      {
        source: `/users/:all*`,
        destination: `${appUrl}/users/:all*`,
        permanent: true,
      },
      {
        source: `/admin/:all*`,
        destination: `${appUrl}/admin/:all*`,
        permanent: true,
      },
      {
        source: `/gifts/:all*`,
        destination: `${appUrl}/gifts/:all*`,
        permanent: true,
      },
      {
        source: `/feed`,
        destination: `${appUrl}/feed`,
        permanent: true,
      },
      {
        source: `/lessons/pro_feed`,
        destination: `${appUrl}/lessons/pro_feed`,
        permanent: true,
      },
      {
        source: `/lessons/feed`,
        destination: `${appUrl}/lessons/feed`,
        permanent: true,
      },
      {
        source: `/courses/:id/course_feed`,
        destination: `${appUrl}/courses/:id/course_feed`,
        permanent: true,
      },
      {
        source: `/instructors/:id/feed`,
        destination: `${appUrl}/instructors/:id/feed`,
        permanent: true,
      },
      {
        source: `/playlists/:id/playlist_feed`,
        destination: `${appUrl}/playlists/:id/playlist_feed`,
        permanent: true,
      },
      {
        source: `/api/v1/:all*`,
        destination: `${appUrl}/api/v1/:all*`,
        permanent: true,
      },
      {
        source: `/graphql`,
        destination: `${appUrl}/graphql`,
        permanent: true,
      },
    ]
  },
}

module.exports = withPlugins(
  [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === `true`,
    }),
    withSvgr,
    withImages(),
    withMDX({
      pageExtensions: [`ts`, `tsx`, `mdx`],
      remarkPlugins: [
        require(`remark-slug`),
        require(`remark-footnotes`),
        require(`remark-code-titles`),
      ],
      rehypePlugins: [],
    }),
  ],
  nextConfig,
)
