import {GoStack, GoVideo} from 'react-icons/go'

const courses = (S) =>
  S.listItem()
    .title('Courses')
    .icon(GoStack)
    .child(
      S.documentList()
        .schemaType('resource')
        .title('Resource')
        .filter('_type == "resource" && type == "course"')
    )

export default courses
