import React from 'react'
import {FormField} from '@sanity/base/components'
import {TextInput, Box, Flex, Card, Text} from '@sanity/ui'
import sanityClient from '@sanity/client'

import {withDocument} from 'part:@sanity/form-builder'
import {FormBuilderInput} from '@sanity/form-builder/lib/FormBuilderInput'
import Fieldset from 'part:@sanity/components/fieldsets/default'

// Use a select field to select a lesson and push it to the array
// Array helper methods from Sanity?
// use the withDocument hook to get the document and the lessons
// maybe use a textInput and dropdown instead of a select.

const client = sanityClient({
  projectId: 'sb1i5dlc',
  dataset: 'production',
  apiVersion: '2022-07-21',
})

const CourseLessonSelector = React.forwardRef((props, ref) => {
  const {
    compareValue,
    focusPath,
    markers,
    onBlur,
    onChange,
    onFocus,
    readOnly,
    presence,
    type,
    value,
    document,
  } = props

  const [sectionLessons, setSectionLessons] = React.useState()
  const [documentLessons, setDocumentLessons] = React.useState()
  const [results, setResults] = React.useState()

  const fetchDocumentLessons = client.fetch(
    `*[_id == $id][0] {
        lessons[]->{_id, title}
      }`,
    {id: document._id},
  )

  React.useEffect(() => {
    const getLessons = async () => {
      return Promise.resolve(fetchDocumentLessons)
    }

    getLessons()
      .then((lessons) => {
        setDocumentLessons(lessons.lessons)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [fetchDocumentLessons])

  const onChangeHandler = (event) => {
    const {value} = event.target
    const filteredLessons = documentLessons.filter((lesson) => {
      return lesson.title.toLowerCase().includes(value.toLowerCase())
    })

    if (value.length > 0) {
      setResults(filteredLessons)
    } else {
      setResults(null)
    }
  }

  return (
    <FormField
      description={type.description}
      title={type.title}
      __unstable_presence={presence}
      __unstable_markers={markers}
    >
      <TextInput
        value={value}
        readOnly={readOnly}
        onChange={onChangeHandler}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {results && (
        <Box>
          {results.map((result) => {
            return (
              <Card border>
                <Text>{result.title}</Text>
              </Card>
            )
          })}
        </Box>
      )}
    </FormField>
  )
})

export default withDocument(CourseLessonSelector)
