import {GoFileBinary, GoPin, GoPulse, GoVideo} from 'react-icons/go'

const resources = (S) =>
  S.listItem()
    .title('All Resources')
    .icon(GoFileBinary)
    .child(S.documentTypeList('resource').title('All Resources'))

export default resources
