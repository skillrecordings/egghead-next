import React from 'react'
import {css} from 'emotion'
import map from 'lodash/map'
import some from 'lodash/some'
import filter from 'lodash/filter'
import {Formik, Form} from 'formik'
import noop from 'lib/noop'
import ResourceCard from './ResourceCard'
import {TracklistsSchema, removeItem, addItem} from '../formService'

function AddResourceForm({resources, onSubmit = noop}) {
  return (
    <Formik
      validationSchema={TracklistsSchema}
      initialValues={{resources: []}}
      onSubmit={onSubmit}
      render={formik => {
        return (
          <Form
            className={css({
              marginTop: 20,
            })}
          >
            <button
              type="submit"
              disabled={!formik.isValid}
              className="ph3 pv2 mb3 bg-blue bn white pointer"
              css={{
                height: '3rem',
                borderRadius: '5px',
                ...(!formik.isValid && {cursor: 'not-allowed', opacity: 0.6}),
              }}
            >
              Submit
            </button>
            {map(resources, (item, index) => {
              const itemChecked = some(formik.values.resources, {
                slug: item.slug,
              })

              return (
                <div
                  key={item.slug}
                  className="flex bg-white items-start"
                  css={{
                    padding: '1rem 1.5rem',
                    ':first-of-type': {
                      borderRadius: '5px 5px 0 0',
                    },
                    ':last-of-type': {
                      borderRadius: '0 0 5px 5px',
                    },
                    ':not(:last-of-type)': {
                      boxShadow: 'inset 0 -1px 0 0 #ECEFF1',
                    },
                  }}
                >
                  <input
                    type="checkbox"
                    checked={itemChecked}
                    onChange={() => {
                      if (itemChecked) {
                        removeItem(formik, item)
                      } else {
                        addItem(formik, item)
                      }
                    }}
                    className="mt2 mr4 flex-shrink-0"
                  />
                  <ResourceCard resource={item} />
                </div>
              )
            })}

            <button
              type="submit"
              disabled={!formik.isValid}
              className="ph3 pv2 mv3 bg-blue bn white pointer"
              css={{
                height: '3rem',
                borderRadius: '5px',
                ...(!formik.isValid && {cursor: 'not-allowed', opacity: 0.6}),
              }}
            >
              Submit
            </button>
          </Form>
        )
      }}
    />
  )
}

export default AddResourceForm
