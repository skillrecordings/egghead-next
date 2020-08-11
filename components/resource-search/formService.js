import axios from 'axios'
import yup from 'yup'
import pickBy from 'lodash/pickBy'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import get from 'lodash/get'
export const TracklistsSchema = yup.object().shape({
  resources: yup
    .array()
    .of(yup.object())
    .min(1, 'Add one resource to save to the collection.'),
})

export const INITIAL_VALUES = {resources: []}

const createParams = values => {
  const tracklistsAtrributes = {
    tracklists_attributes: values.resources.map(r =>
      pickBy({
        tracklistable_type: r.type,
        tracklistable_id: r.id,
        id: r.tracklist_id,
      }),
    ),
  }

  const playlistAttributes = {
    playlist: tracklistsAtrributes,
  }

  return playlistAttributes
}

export const removeItem = (formik, item) => {
  formik.setFieldValue(
    'resources',
    filter(formik.values.resources, r => r.slug !== item.slug),
  )
}

export const addItem = (formik, item) => {
  formik.setFieldValue('resources', [...formik.values.resources, item])
}

const updateCollection = (url, data) => axios.put(url, data)

export const updateCollectionTracklists = (collection, values) => {
  return updateCollection(collection.url, createParams(values))
}
