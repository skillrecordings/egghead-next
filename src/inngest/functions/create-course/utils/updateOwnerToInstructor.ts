import {createEggAxios} from './createEggAxios'

export const updateOwnerToInstructor = async (
  instructorId: number,
  courseId: number,
) => {
  let eggAxios = createEggAxios()

  let params = new URLSearchParams({
    'playlist[instructor_id]': String(instructorId),
  })

  return await eggAxios.put(`/api/v1/playlists/${courseId}`, params)
}
