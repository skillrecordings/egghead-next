import lessons from '../data/lessons.json'

export function getLessonData(id) {
  const lesson = lessons.filter((lesson) => {
    return lesson.slug === id
  })[0]
  // Combine the data with the id
  return {
    id,
    ...lesson,
  }
}

export function getAllLessonIds() {
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return lessons.map((lesson) => {
    return {
      params: {
        id: lesson.slug,
        title: lesson.title,
      },
    }
  })
}
