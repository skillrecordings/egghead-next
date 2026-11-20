require('dotenv-flow').config()

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    '/purchase/*',
    '/discord/*',
    '/discord',
    '/_next',
    '/purchase',
    '/404',
    '/ask',
    '/blank',
    '/confirm/membership',
    '/login',
    '/logout',
    '/redirect',
    '/sale',
    '/invoices',
    '/tips',
    '/tips/*',
    '/tipz',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: 'Twitterbot',
        disallow: '',
      },
      {
        userAgent: 'ClaudeBot',
        disallow: ['/q', '/api/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/q', '/api/'],
      },
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/api/',
          '/discord',
          '/purchase',
          '/404',
          '/ask',
          '/blank',
          '/confirm',
          '/login',
          '/logout',
          '/redirect',
          '/sale',
          '/invoices',
          '/tips',
          '/tipz',
        ],
      },
    ],
    additionalSitemaps: [
      'https://egghead-sitemaps.s3.amazonaws.com/sitemaps/sitemap.xml.gz',
      'https://egghead.io/tags-sitemap-0.xml',
    ],
  },
}
