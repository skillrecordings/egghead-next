import S from '@sanity/desk-tool/structure-builder'
import {GoBook} from 'react-icons/go'

const pages = S.listItem()
  .title('Pages')
  .icon(GoBook)
  .child(
    S.documentList()
      .schemaType('resource')
      .title('Page')
      .filter('_type == "resource" && type == "landing-page"'),
  )

export default pages
