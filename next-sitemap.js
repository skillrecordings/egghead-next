require('dotenv-flow').config()

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: ['/purchase/*', '/discord/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: 'Twitterbot',
        disallow: '',
      },
      {
        userAgent: 'AhrefsSiteAudit',
        allow: ['/'],
        disallow: ['/discord', '/_next', '/purchase'],
      },
      {
        userAgent: '*',
        disallow: ['/'],
      },
    ],
    additionalSitemaps: [
      'https://next.egghead.io/tags-sitemap-0.xml',
      'https://next.egghead.io/tags-sitemap-1.xml',
      'https://next.egghead.io/tags-sitemap-2.xml',
      'https://next.egghead.io/tags-sitemap-3.xml',
      'https://next.egghead.io/tags-sitemap-4.xml',
      'https://next.egghead.io/tags-sitemap-5.xml',
      'https://next.egghead.io/tags-sitemap-6.xml',
    ],
  },
}
