// import blog from './src/structure/blog'
// import caseStudies from './src/structure/caseStudies'
import pages from './src/structure/pages'
import guides from './src/structure/guides'
import tips from './src/structure/tips'
import resources from './src/structure/resources'
import courses from './src/structure/courses'
import lessons from './src/structure/lessons'
import blog from './src/structure/blog'
import videos from './src/structure/videos'
import caseStudies from './src/structure/caseStudies'

const hiddenDocTypes = (listItem: any) =>
  ![
    'lesson',
    'section',
    'course',
    'caseStudy',
    'videoResource',
    'guide',
    'tip',
    'resource',
    // 'route',
    // 'essentialQuestion',
    // 'bigIdea',
    // 'post',
    // 'page',
    // 'siteSettings',
    // 'author',
    // 'category',
  ].includes(listItem.getId())

export default (S: any) =>
  S.list()
    .title('egghead.io')
    .items([
      courses(S),
      blog(S),
      guides(S),
      tips(S),
      lessons(S),
      pages(S),
      videos(S),
      caseStudies(S),
      resources(S),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
