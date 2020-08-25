const sitemap = require('nextjs-sitemap-generator')
const fs = require('fs')
const {request} = require('graphql-request')

//TODO: The config file is in TypeScript, so can't import here without using ts-node to run 🤔
const graphQLEndpoint = `https://egghead.io/graphql`
const BUILD_ID = fs.readFileSync('.next/BUILD_ID').toString()

const allCoursesQuery = `query{
  all_courses{    
    slug
  }
}`

//TODO: Discuss "updated_at" for "lastmod"
const allLessonsQuery = `query{
  lessons(per_page: 1000000){
    slug   
    type
  }
}`

const allInstructorsQuery = `query {
  instructors(per_page: 100000){
    slug
  }
}`

const allArticlesQuery = `query {
  articles(per_page: 100000){
    slug
  }
}`

const go = async () => {
  const courseData = await request(graphQLEndpoint, allCoursesQuery)
  const lessonData = await request(graphQLEndpoint, allLessonsQuery)
  const instructorData = await request(graphQLEndpoint, allInstructorsQuery)
  const articleData = await request(graphQLEndpoint, allArticlesQuery)

  const courseSlugs = courseData.all_courses.map(
    (course) => `/courses/${course.slug}`,
  )

  const talkSlugs = lessonData.lessons
    .filter((lesson) => lesson.type === 'talk')
    .map((lesson) => `/talks/${lesson.slug}`)

  const lessonSlugs = lessonData.lessons
    .filter((lesson) => lesson.type === 'lesson')
    .map((lesson) => `/lessons/${lesson.slug}`)

  const instructorSlugs = instructorData.instructors.map(
    (instructor) => `/instructors/${instructor.slug}`,
  )

  const articleSlugs = articleData.articles.map(
    (article) => `/articles/${article.slug}`,
  )

  // TODO: Podcasts (the REST API gives us waaaay too much data, needs GraphQL)
  // TODO: Playlists, needs GraphQL
  // TODO: Tags, needs GraphQL

  // TODO: changeFreq and priority

  const pagesConfig = lessonSlugs.reduce((acc, slug) => {
    acc[slug] = {priority: 'O.5', changefreq: 'daily'}
    return acc
  }, {})

  sitemap({
    baseUrl: 'https://next.egghead.io',
    pagesDirectory: '.next/server/pages',
    extraPaths: [
      ...courseSlugs,
      ...lessonSlugs,
      ...talkSlugs,
      ...instructorSlugs,
      ...articleSlugs,
    ],
    targetDirectory: 'public/',
    ignoredExtensions: ['js', 'map'],
    ignoredPaths: ['[fallback]'],
    pagesConfig,
  })
}

go()
