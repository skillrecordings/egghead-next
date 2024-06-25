import {GoMortarBoard} from 'react-icons/go'

const courses = (S) =>
  S.listItem()
    .title('Courses')
    .icon(GoMortarBoard)
    .child(S.documentTypeList('course').title('All Courses'))

export default courses
