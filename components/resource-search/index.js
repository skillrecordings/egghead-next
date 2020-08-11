import React from 'react'
import get from 'lodash/get'
import {track} from 'lib/analytics'
import SearchConfig from 'components/Search/Config'
import NoResults from 'components/Search/components/NoResults'
import Refinement from 'components/Search/components/Refinement'
import {Hits, SearchState} from 'components/InstantSearch'
import AddResourceForm from './components/AddResourceForm'
import {updateCollectionTracklists} from './formService'
import ResourceSearchInput from 'components/ResourceSearchInput'
import {some} from 'lodash'

function ResourceSearch({location, user, collection}) {
  const lastQueryRef = React.useRef(null)
  return (
    <div className="bg-gray">
      <SearchConfig location={location} user={user}>
        {({query, term, topic, onSearchInputChange}) => {
          return (
            <div className="w-100">
              <div className="center pb2 w-100-ns">
                <ResourceSearchInput
                  term={term}
                  topic={topic}
                  onSearchInputChange={onSearchInputChange}
                >
                  <div className={`flex justify-around`}>
                    <Refinement
                      label="Content Type"
                      attribute="type"
                      displayTitle={true}
                    />
                    <Refinement
                      label="Topics"
                      searchable
                      attribute="_tags"
                      limit={10}
                      defaultRefinement={topic}
                    />
                    <Refinement
                      label="Instructors"
                      searchable
                      attribute="instructor_name"
                      limit={10}
                      displayTitle={true}
                    />
                  </div>
                </ResourceSearchInput>
              </div>
              <SearchState
                render={props => {
                  const searching = props.searching || props.isSearchStalled
                  const noHits =
                    get(props, 'searchResults.hits') &&
                    props.searchResults.hits.length === 0
                  return !searching && noHits && <NoResults term={query} />
                }}
              />
              <Hits
                render={props => {
                  const {hits} = props
                  if (
                    query &&
                    query != lastQueryRef.current &&
                    hits.length > 0
                  ) {
                    track('searched', {
                      query,
                      hitCount: hits.length,
                    })
                    lastQueryRef.current = query
                  }

                  return (
                    <AddResourceForm
                      resources={hits.filter(h => {
                        return !some(collection.items, i => i.slug === h.slug)
                      })}
                      onSubmit={values => {
                        updateCollectionTracklists(collection, values).then(
                          ({data}) => {
                            window.location.href = data.edit_url
                          },
                        )
                      }}
                    />
                  )
                }}
              />
            </div>
          )
        }}
      </SearchConfig>
    </div>
  )
}

export default ResourceSearch
