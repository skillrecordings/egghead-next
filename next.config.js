const withPlugins = require('next-compose-plugins')
const withSvgr = require('next-svgr')
const withMdxEnhanced = require('next-mdx-enhanced')

module.exports = withPlugins([
  withSvgr,
  withMdxEnhanced({
    layoutPath: 'layouts',
    defaultLayout: true,
    fileExtensions: ['mdx'],
    remarkPlugins: [],
    rehypePlugins: [],
    extendFrontMatter: {
      process: (mdxContent, frontMatter) => {},
      phase: 'prebuild|loader|both',
    },
  }),
])
