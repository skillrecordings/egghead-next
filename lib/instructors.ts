import fs from 'fs'
import {compose, curry, map, pick, find, uniqBy} from 'lodash/fp'

const mapProps = compose(map, pick)
const findPick = curry((selector, props, data) =>
  pick(props, find(selector, data)),
)

const instructorsPath = './data/instructors.json'

function readInstructors() {
  const rawdata = fs.readFileSync(instructorsPath)
  return uniqBy('slug', JSON.parse(rawdata.toString()))
}

export function getInstructors(props) {
  const instructors = readInstructors()

  return mapProps(props)(instructors)
}

export function getInstructorSlugs() {
  const instructors = getInstructors(['slug', 'id', 'full_name'])

  return map((instructor: object = {}) => {
    return {
      params: {
        ...instructor,
      },
    }
  })(instructors)
}

export function getInstructor(slug, props) {
  return findPick({slug}, props, readInstructors())
}
