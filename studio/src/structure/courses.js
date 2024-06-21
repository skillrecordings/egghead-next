import {GoVideo} from 'react-icons/go'

const courses = (S) =>
  S.listItem()
    .title('Courses')
    .icon(GoVideo)
    .child(S.documentTypeList('course').title('All Courses'))

export default courses
