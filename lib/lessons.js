import lessons from '../data/lessons.json'

export async function getLessonData(id) {
  const res = await fetch(`https://egghead.io/api/v1/lessons/${id}`)
  const lesson = await res.json()
  return {
    id,
    ...lesson,
  }
}

export function getAllLessonIds() {
  return lessons.map((lesson) => {
    return {
      params: {
        id: lesson.slug,
        ...lesson,
      },
    }
  })
}
