require('dotenv-flow').config()

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: false,
  exclude: [],
}
