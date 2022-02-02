// ensure the .env(.development) file is loaded into the environment
//
// if you want to run this with values from the `.env.development` file, then
// be sure to set the `NODE_ENV` to `development.
// E.g. `NODE_ENV=development node index-sanity-articles.js`.
require('dotenv-flow').config()

const algoliasearch = require('algoliasearch')
const client = require('@sanity/client')
const groq = require('groq')

const sanityClient = client({
  projectId: 'sb1i5dlc',
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
})

const go = async () => {
  /*
   * Sanity Parts
   */

  /* Only grab the first author for now because we don't have Aloglia configured
   * for more than one author
   *
   * To grab all of the authors, just remove the `0` from `authors[0].author`
   * like so:
   *
   *   'authors': authors[].author-> {
   *     ...
   *   },
   *
   * Also, ignore `categories` for now, they are one of two values (Technical
   * Case Study and Instructor Case Study) and I don't think they will be useful
   * in Algolia.
   *
   * Removing `'body': body,` from the GROQ query for now because it is
   * exceeding Algolia record size limits of 20kb.
   */

  // TODO: notice this is only grabbing the first 3 article at the moment in
  // order to test it out. Eventually those second set of square brackets
  // should be empty so that ALL articles are pulled in.
  let articlesQuery = groq`*[_type == "post" && publishedAt < now() && !(_id in path("drafts.**"))][0..3]{
    'objectID': _id,
    'title': title,
    'published_at': publishedAt,
    'type': 'article',
    'description': description,
    'authors': authors[0].author-> {
      name, 
      'image': image.url,
    },
    '_tags': softwareLibraries[].library-> {
      name
    }.name,
    'slug': slug.current,
    'excerpt': excerpt,
  }`

  let articles = await sanityClient.fetch(articlesQuery)

  articles.forEach((article) => {
    const {objectID, title, slug} = article

    console.log({objectID, title, slug})
  })

  /*
   * Algolia Parts
   */
  const fullTextSearch = {
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APP || '',
    searchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_KEY || '',
  }

  // TODO: Note that this is referencing the `content_staging` Algolia index.
  // Once this is ready for prime-time, it should instead write to
  // `content_production`.
  const ALGOLIA_INDEX_NAME = 'content_staging'
  // process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'content_production'

  const searchClient = algoliasearch(
    fullTextSearch.appId,
    fullTextSearch.searchApiKey,
  )

  const index = searchClient.initIndex(ALGOLIA_INDEX_NAME)

  index
    .saveObjects(articles)
    .then(({objectIDs}) => {
      console.log(objectIDs)
    })
    .catch((e) => console.log(e))
}
go()
