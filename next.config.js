const withSvgr = require('next-svgr')
const withBundleAnalyzer = require('@next/bundle-analyzer')
const withPlugins = require('next-compose-plugins')
const rehypeShiki = require('rehype-shiki')
const checkEnv = require('@47ng/check-env').default
const withImages = require('next-images')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        rehypeShiki,
        {
          theme: './src/styles/material-theme-dark.json',
          useBackground: false,
        },
      ],
    ],
  },
})

const searchUrlRoot = `/q`

checkEnv({
  required: ['NEXT_PUBLIC_DEPLOYMENT_URL'],
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'd2eip9sf3oo6c2.cloudfront.net',
      'dcv19h61vib2d.cloudfront.net',
      'image.simplecastcdn.com',
      'res.cloudinary.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/instructors/:instructor',
        destination: `${searchUrlRoot}/resources-by-:instructor`,
        permanent: true,
      },
      {
        source: '/podcasts',
        destination: `${searchUrlRoot}?type=podcast`,
        permanent: true,
      },
      {
        source: '/talks',
        destination: `${searchUrlRoot}?type=talk`,
        permanent: true,
      },
      {
        source: '/courses',
        destination: `${searchUrlRoot}?type=course`,
        permanent: true,
      },
      {
        source: '/lessons',
        destination: `${searchUrlRoot}?type=lesson`,
        permanent: true,
      },
      {source: '/search', destination: searchUrlRoot, permanent: true},
      {source: '/instructors', destination: searchUrlRoot, permanent: true},
      {source: '/browse', destination: searchUrlRoot, permanent: true},
      {source: '/browse/:context', destination: searchUrlRoot, permanent: true},
      {
        source: '/browse/:context/:tag',
        destination: `${searchUrlRoot}/:tag`,
        permanent: true,
      },
      {
        source: '/s/:all*',
        destination: 'https://app.egghead.io/s/:all*',
        permanent: true,
      },
      {
        source: '/courses/:title/:rest(.+)',
        destination: 'https://app.egghead.io/courses/:title/:rest',
        permanent: true,
      },
      {
        source: '/lessons/:title/:rest(.+)',
        destination: 'https://app.egghead.io/lessons/:title/:rest',
        permanent: true,
      },
      {
        source: '/podcasts/:title/:rest(.+)',
        destination: 'https://app.egghead.io/podcasts/:title/:rest',
        permanent: true,
      },
      {
        source: '/users/:all*',
        destination: 'https://app.egghead.io/users/:all*',
        permanent: true,
      },
      {
        source: '/admin/:all*',
        destination: 'https://app.egghead.io/admin/:all*',
        permanent: true,
      },
      {
        source: '/gifts/:all*',
        destination: 'https://app.egghead.io/gifts/:all*',
        permanent: true,
      },
      {
        source: '/feed',
        destination: 'https://app.egghead.io/feed',
        permanent: true,
      },
      {
        source: '/lessons/pro_feed',
        destination: 'https://app.egghead.io/lessons/pro_feed',
        permanent: true,
      },
      {
        source: '/lessons/feed',
        destination: 'https://app.egghead.io/lessons/feed',
        permanent: true,
      },
      {
        source: '/courses/:id/course_feed',
        destination: 'https://app.egghead.io/courses/:id/course_feed',
        permanent: true,
      },
      {
        source: '/instructors/:id/feed',
        destination: 'https://app.egghead.io/instructors/:id/feed',
        permanent: true,
      },
      {
        source: '/playlists/:id/playlist_feed',
        destination: 'https://app.egghead.io/playlists/:id/playlist_feed',
        permanent: true,
      },
      {
        source: '/api/v1/:all*',
        destination: 'https://app.egghead.io/api/v1/:all*',
        permanent: true,
      },
      {
        source: '/graphql',
        destination: 'https://app.egghead.io/graphql',
        permanent: true,
      },
    ]
  },
}

module.exports = withPlugins(
  [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === 'true',
    }),
    withSvgr,
    withImages(),
    withMDX({
      pageExtensions: ['ts', 'tsx', 'mdx'],
      remarkPlugins: [
        require('remark-slug'),
        require('remark-footnotes'),
        require('remark-code-titles'),
      ],
      rehypePlugins: [],
    }),
  ],
  nextConfig,
)
