import {GoVideo} from 'react-icons/go'

const videos = (S) =>
  S.listItem()
    .title('Videos')
    .icon(GoVideo)
    .child(S.documentTypeList('videoResource').title('All Video Resources'))

export default videos
