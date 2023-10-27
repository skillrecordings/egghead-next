import {GoPaperAirplane} from 'react-icons/go'

const pages = (S) =>
  S.listItem()
    .title('Landing Pages')
    .icon(GoPaperAirplane)
    .child(
      S.documentList()
        .schemaType('resource')
        .title('Page')
        .filter('_type == "resource" && type == "landing-page"')
    )

export default pages
