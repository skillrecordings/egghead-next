import {GoPin, GoPlay} from 'react-icons/go'

const tips = (S) =>
  S.listItem().title('Tips').icon(GoPlay).child(S.documentTypeList('tip').title('All Tips'))

export default tips
