import {createEggAxios} from './createEggAxios'

export const addLessonsToCourse = async (
  lessonIds: number[],
  courseId: number,
) => {
  let eggAxios = createEggAxios()

  let createTracklistParams = async (lessonId: number) => {
    await eggAxios.put(
      `/api/v1/playlists/${courseId}/items/add`,
      new URLSearchParams({
        'tracklistable[tracklistable_type]': 'lesson',
        'tracklistable[tracklistable_id]': String(lessonId),
      }),
    )
  }

  for (let lessonId of lessonIds) {
    await createTracklistParams(lessonId)
  }
}
