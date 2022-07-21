import React from 'react'
import {FormField} from '@sanity/base/components'
import {TextInput} from '@sanity/ui'

import {withDocument} from 'part:@sanity/form-builder'
import {FormBuilderInput} from '@sanity/form-builder/lib/FormBuilderInput'
import Fieldset from 'part:@sanity/components/fieldsets/default'

// Use a select field to select a lesson and push it to the array
// Array helper methods from Sanity?
// use the withDocument hook to get the document and the lessons
// maybe use a textInput and dropdown instead of a select.

const CourseLessonSelector = React.forwardRef((props, ref) => {
  const {
    compareValue,
    focusPath,
    markers,
    onBlur,
    onChange,
    onFocus,
    presence,
    type,
    value,
    level,
  } = props

  console.log('TEST', type)

  const fieldNames = type.of[0].fields.map((f) => f.name)

  const childPresence =
    presence.length === 0
      ? presence
      : presence.filter((item) => fieldNames.includes(item.path[0]))

  // If Markers exist, get the markers as an array for the children of this field
  const childMarkers =
    markers.length === 0
      ? markers
      : markers.filter((item) => fieldNames.includes(item.path[0]))

  return (
    <Fieldset
      legend={type.title} // schema title
      description={type.description} // schema description
      markers={childMarkers} // markers built above
      presence={childPresence} // presence built above
    >
      {type.of[0].fields.map((field, i) => {
        return (
          // Delegate to the generic FormBuilderInput. It will resolve and insert the actual input component
          // for the given field type
          <FormBuilderInput
            level={level + 1}
            ref={i === 0 ? ref : null}
            key={field.name}
            type={field.type}
            value={value && value[field.name]}
            path={[field.name]}
            markers={markers}
            focusPath={focusPath}
            readOnly={field.type.readOnly}
            presence={presence}
            onFocus={onFocus}
            onBlur={onBlur}
            compareValue={compareValue}
          />
        )
      })}
    </Fieldset>
  )
})

export default withDocument(CourseLessonSelector)
