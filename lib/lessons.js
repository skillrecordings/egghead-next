import lessons from '../data/lessons.json'

export function getLessonData(id) {
  let lesson = lessons.filter((lesson) => {
    return lesson.slug === id
  })[0]

  return {
    ...lesson,
    id,
  }
}

export function getAllLessonIds() {
  return lessons.map((lesson) => {
    return {
      params: {
        ...lesson,
        id: lesson.slug,
      },
    }
  })
}
