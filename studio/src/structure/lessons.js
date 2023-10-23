import {GoBook} from 'react-icons/go'

const lessons = (S) =>
  S.listItem()
    .title('Lessons')
    .icon(GoBook)
    .child(S.documentTypeList('lesson').title('All Lessons'))

export default lessons
