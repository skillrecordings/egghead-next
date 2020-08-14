const withSvgr = require('next-svgr')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})
module.exports = withSvgr(
  withMDX({
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'tsx', 'ts'],
  }),
)
