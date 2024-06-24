import {GoStack} from 'react-icons/go'

const resourcesCourses = (S) =>
  S.listItem()
    .title('Resources (Courses)')
    .icon(GoStack)
    .child(
      S.documentList()
        .schemaType('resource')
        .title('Resource')
        .filter('_type == "resource" && type == "course"')
    )

export default resourcesCourses
