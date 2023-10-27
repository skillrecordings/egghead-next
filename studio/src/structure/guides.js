import {GoPin} from 'react-icons/go'

const guides = (S) =>
  S.listItem().title('Guides').icon(GoPin).child(S.documentTypeList('guide').title('All Guides'))

export default guides
