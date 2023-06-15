/* eslint-disable import/no-anonymous-default-export */
import {MdLocalMovies} from 'react-icons/md'

export default {
  name: 'muxAsset',
  type: 'object',
  icon: MdLocalMovies,
  title: 'Mux Asset',
  fields: [
    {
      name: 'muxPlaybackId',
      title: 'Mux Playback ID',
      description: 'Hashed ID of a video on mux',
      type: 'string',
    },
    {
      name: 'muxAssetId',
      title: 'Mux Asset ID',
      description: 'ID that references the asset in Mux.',
      type: 'string',
    },
  ],
}
