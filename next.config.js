const withSvgr = require('next-svgr')
const withBundleAnalyzer = require('@next/bundle-analyzer')
const withPlugins = require('next-compose-plugins')
const checkEnv = require('@47ng/check-env').default
const withImages = require('next-images')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

checkEnv({
  required: ['NEXT_PUBLIC_DEPLOYMENT_URL'],
})

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactMode: 'concurrent',
  },
  images: {
    domains: ['d2eip9sf3oo6c2.cloudfront.net', 'image.simplecastcdn.com'],
  },
  async redirects() {
    return [
      {
        source: '/instructors/:instructor',
        destination: '/s/content-by-:instructor',
        permanent: true,
      },
      {
        source: '/podcasts',
        destination: '/s?type=podcast',
        permanent: true,
      },
      {
        source: '/talks',
        destination: '/s?type=talk',
        permanent: true,
      },
      {
        source: '/courses',
        destination: '/s?type=course',
        permanent: true,
      },
      {source: '/lessons', destination: '/s?type=lesson', permanent: true},
      {source: '/search', destination: '/s', permanent: true},
      {source: '/instructors', destination: '/s', permanent: true},
      {source: '/browse', destination: '/s', permanent: true},
      {source: '/browse/:context', destination: '/s', permanent: true},
      {
        source: '/browse/:context/:tag',
        destination: '/s/:tag',
        permanent: true,
      },
      {
        source: '/courses/:title/:all*',
        destination: 'https://app.egghead.io/courses/:title/:all*',
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
        source: '/api/:all*',
        destination: 'https://app.egghead.io/api/:all*',
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
      rehypePlugins: [require('mdx-prism')],
    }),
  ],
  nextConfig,
)
