import {createEggAxios} from './createEggAxios'

export const createCourseInRails = async (sanityBody: any) => {
  let {title, topicList, description} = sanityBody

  let eggAxios = createEggAxios()

  let courseParams = {
    'playlist[title]': title ?? '',
    'playlist[topic_list]': topicList.toString() ?? '',
    'playlist[description]': description ?? '',
    'playlist[published]': 'true',
    'playlist[visibility_state]': 'indexed',
    'playlist[state]': 'published',
  }

  let body = new URLSearchParams(courseParams)

  return await eggAxios.post('/api/v1/playlists', body)
}
