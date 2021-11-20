import S from '@sanity/desk-tool/structure-builder'
import blog from './src/structure/blog'
import caseStudies from './src/structure/caseStudies'
import portfolio from './src/structure/portfolio'
import feature from './src/structure/feature'
import pages from './src/structure/pages'

const hiddenDocTypes = (listItem) =>
  ![
    'route',
    'essentialQuestion',
    'bigIdea',
    'post',
    'page',
    'siteSettings',
    'author',
    'category',
    'caseStudy',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('egghead')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      blog,
      portfolio,
      feature,
      caseStudies,
      pages,
    ])
