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
