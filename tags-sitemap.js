require('dotenv-flow').config()
const fs = require('fs')
const axios = require('axios')
const {format} = require('date-fns')

const head = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`.trim()
const tail = `\n</urlset>`
const domain = process.env.NEXT_PUBLIC_DEPLOYMENT_URL
const changefreq = 'Monthly'
const lastmod = new Date().toISOString()
const priority = `0.4`

//10000 lines is ~20 MB file
const lineMax = 49999

/**
 * Fetch tags from egghead API
 * Create a tag generator
 * Build sitemap with generator
 */
const go = async () => {
  const tags = await axios.get(`https://app.egghead.io/api/v1/tags?size=300`)
  const tagSlugs = tags.data.map(({slug}) => slug).sort()

  console.log(`Saving tags to ./src/pages/site-directory/tags.json`)
  const stream = fs.createWriteStream(`./src/pages/site-directory/tags.json`)
  stream.write(JSON.stringify(tags.data))
  stream.end()

  try {
    if (tagSlugs.length) {
      const tagGenerator = generateTagPath(tagSlugs)
      buildSitemap(tagGenerator)
    }
  } catch (error) {
    console.log(error)
  }
}
go()

/**
 * Single-tag search pages only. Multi-tag paths (angular-and-react) now
 * 307 to /q?tags=... (search-query-canonicalization), so listing them put
 * ~800k redirecting URLs in the sitemap.
 */
function* makeInts(length) {
  for (let int = 0; int < length; int++) {
    yield [int]
  }
}

/**
 * Use the tag slugs to generate paths, i.e. angular-and-react-and-vue
 */
function* generateTagPath(tagSlugs) {
  let length = tagSlugs.length

  for (let intArray of makeInts(length)) {
    let tags = []

    intArray.forEach((int) => {
      tags.push(tagSlugs[int])
    })

    yield tags.join('-and-').trim()
    tags = null
  }
}

let fileNumber = 0
/**
 * Create a sitemap files containing
 * 10000 lines of URLs each
 *
 * Each time 10000 lines is reached:
 * - Write the current sitemap file
 * - Pass the tagGenerator to the next sitemap file
 *
 */
const buildSitemap = async (tagGenerator) => {
  lineCount = 0
  console.log(`tags-sitemap-${fileNumber}.xml`)
  let stream = fs.createWriteStream(`./public/tags-sitemap-${fileNumber}.xml`)

  let result = head
  let end = false
  while (lineCount < lineMax) {
    const {value, done} = tagGenerator.next()
    end = done
    if (end) break
    result += `<url><loc>${domain}/q/${value}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority><lastmod>${lastmod}</lastmod></url>`

    lineCount++
  }

  result += tail
  const callback = () => {
    stream.end()
    stream = null
    result = null
    fileNumber++
    if (!end) {
      buildSitemap(tagGenerator)
    }
  }
  /**
   * The "result" is a _HUGE_ string containing 10000 entries.
   * This is much faster than doing 10000 stream.writes
   */

  stream.write(result, 'utf8', callback)
}
