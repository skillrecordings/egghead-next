import S from '@sanity/desk-tool/structure-builder'
import blog from './src/structure/blog'

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
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('egghead')
    .items([...S.documentTypeListItems().filter(hiddenDocTypes), blog])
