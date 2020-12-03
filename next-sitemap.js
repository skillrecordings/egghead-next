require('dotenv-flow').config()

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    '/purchase/*',
    '/discord',
    '/discord/callback',
    '/login',
    '/logout',
    '/404',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: 'Twitterbot',
        disallow: '',
      },
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/discord', '/_next', '/purchase'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/tags-sitemap-0.xml`,
      `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/tags-sitemap-1.xml`,
      `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/tags-sitemap-2.xml`,
      `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/tags-sitemap-3.xml`,
      `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/tags-sitemap-4.xml`,
      `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/tags-sitemap-5.xml`,
      `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/tags-sitemap-6.xml`,
      'http://egghead-sitemaps.s3.amazonaws.com/sitemaps/sitemap.xml.gz',
    ],
  },
}
