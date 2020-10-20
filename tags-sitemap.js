require('dotenv-flow').config()
const fs = require('fs')
const axios = require('axios')

const head = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`.trim()
const tail = `\n</urlset>`
const domain = process.env.NEXT_PUBLIC_REDIRECT_URI
const changefreq = 'daily'
const lastmod = `2020-10-10`
const priority = `0.5`

//10000 lines is ~20 MB file
const lineMax = 100000

/**
 * Fetch tags from egghead API
 * Create a tag generator
 * Build sitemap with generator
 */
const go = async () => {
  const tags = await axios.get('https://egghead.io/api/v1/tags?size=300')
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
 * Generate all possible combinations of an Array with a given length
 * Visualize how it works: https://twitter.com/johnlindquist/status/1317170257128091648
 */
function* makeInts(length) {
  let int = 0
  while (int < length) {
    yield [int]

    let int2 = 0
    while (int2 < int) {
      yield [int2, int]

      let int3 = 0
      while (int3 < int2) {
        yield [int3, int2, int]

        //A depth of 3 generates 6 sitemaps...
        //A depth of 4 generates 200+ sitemaps...
        //I didn't dare try a depth of 5

        // let int4 = 0
        // while (int4 < int3) {
        //   yield [int4, int3, int2, int]
        //   int4++
        // }

        int3++
      }

      int2++
    }

    int++
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
    result += `
<url>
  <loc>${domain}/s/${value}</loc>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
  <lastmod>${lastmod}</lastmod>
</url>`

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
