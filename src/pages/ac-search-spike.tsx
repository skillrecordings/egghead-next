import * as React from 'react'
import {useAutocomplete} from '../hooks/use-autocomplete'
import {isLink} from '../utils/is-link'
import {
  getAlgoliaResults,
  RequesterDescription,
} from '@algolia/autocomplete-preset-algolia'
import {searchClient} from '../utils/search-client'
import {GetServerSideProps} from 'next'
import {findResultsState} from 'react-instantsearch-dom/server'
import Search from '../components/search'
import {createElement, Fragment} from 'react'

const ALGOLIA_INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'content_production'

const defaultProps = {
  searchClient,
}

export const getServerSideProps: GetServerSideProps = async function ({
  res,
  req,
  params,
}) {
  return {
    props: {
      data: {courses: []},
    },
  }
}

type AutoCompleteSearchItem = {
  slug?: {
    current?: string | undefined
  }
  label: string
  description?: string
  url: string
  icon?: () => JSX.Element
  title?: string
}

type AutocompleteSearchSource = {
  sourceId: string
  getItemUrl: ({item}: {item: AutoCompleteSearchItem}) => string | undefined
  getItems: ({
    query,
  }: {
    query: string
  }) => RequesterDescription<AutoCompleteSearchItem> | AutoCompleteSearchItem[]
  templates: {
    header?: () => JSX.Element
    item?: ({item}: {item: AutoCompleteSearchItem}) => JSX.Element
  }
}

type AutoCompleteProps = {
  placeholder: string
  openOnFocus: boolean
  autoFocus: boolean
  defaultActiveItemId: number
  emptyQuery: (params?: any) => AutocompleteSearchSource[]
  sources: (params?: any) => AutocompleteSearchSource[]
  noResults?: React.FC
  isOpen: boolean
  onToggle: (nextIsOpen: boolean) => void
}

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  const {
    emptyQuery,
    sources,
    noResults: NoResults = ({query}: {query: any}) => (
      <div>
        <div>No results for "{query}".</div>
      </div>
    ),
    isOpen,
    onToggle,
    ...autocompleteProps
  } = props

  const inputRef = React.useRef(null)
  const formRef = React.useRef(null)
  const panelRef = React.useRef(null)

  const {autocomplete, state} = useAutocomplete({
    ...autocompleteProps,
    getSources(params: any) {
      if (!params.query) {
        return emptyQuery(params)
      }

      return sources(params)
    },
  })

  const {query, collections, status} = state

  const hasNoResults = !collections.filter(({items}) => items.length).length
  const isQueryEmpty = !query.length

  console.log({hasNoResults, isQueryEmpty, collections, status})

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className="aa-Autocomplete"
      {...autocomplete.getRootProps({})}
    >
      {' '}
      <form {...autocomplete.getFormProps({inputElement: inputRef.current})}>
        {' '}
        <div>
          <label className="aa-Label" {...autocomplete.getLabelProps({})}>
            {/*{status === 'stalled' ? (*/}
            {/*  <SpinnerIcon className="aa-SpinnerIcon" />*/}
            {/*) : (*/}
            {/*  <SearchIcon />*/}
            {/*)}*/}
            <span className="visually-hidden">Search</span>
          </label>
        </div>
        <div>
          <input
            ref={inputRef}
            {...autocomplete.getInputProps({
              inputElement: inputRef.current,
            })}
          />
        </div>
      </form>
      <div
        ref={panelRef}
        className={['aa-Panel', status === 'stalled' && 'aa-Panel--stalled']
          .filter(Boolean)
          .join(' ')}
        {...autocomplete.getPanelProps({})}
      >
        {!hasNoResults && (
          <div>
            {collections.map((collection, index) => {
              const {source, items} = collection

              return (
                <div
                  key={`source-${index}`}
                  id={`autocomplete-${source.sourceId}`}
                >
                  {source.templates.header?.({
                    state,
                    source,
                    items,
                    createElement,
                    Fragment,
                  })}
                  {items.length > 0 && (
                    <ul {...autocomplete.getListProps()}>
                      {items.map(
                        (item: AutoCompleteSearchItem, index: number) => (
                          <li
                            key={index}
                            {...autocomplete.getItemProps({
                              item,
                              source,
                            })}
                          >
                            {source.templates.item({
                              item,
                              state,
                              createElement,
                              Fragment,
                            })}
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        )}
        {hasNoResults && !isQueryEmpty && <NoResults {...state} />}
      </div>
    </div>
  )
}

const AcSearchSpikePage: React.FC<any> = ({
  data = {courses: []},
  isOpen = true,
  onToggle,
}) => {
  const {courses} = data

  return (
    <AutoComplete
      placeholder="Search for episodes and posts"
      openOnFocus={true}
      autoFocus={true}
      defaultActiveItemId={0}
      isOpen={isOpen}
      onToggle={(nextIsOpen: boolean) => {
        onToggle(nextIsOpen)

        document.body.style.overflow = nextIsOpen ? 'hidden' : ''

        const searchParams = new URLSearchParams(window.location.search)
        const search = searchParams.get('search')

        if (!nextIsOpen && search !== null) {
          window.history.pushState(null, '', window.location.pathname)
        }
      }}
      emptyQuery={() => [
        {
          sourceId: 'popular',
          getItems: () => [
            // ...courses.slice(0, 3),
            {
              label: 'See all courses',
              url: '/q',
            },
          ],
          getItemUrl({item}) {
            return isLink(item) ? item.url : item?.slug?.current
          },
          templates: {
            header: () => <div className="aa-Header">Latest episodes</div>,
            item({item}) {
              if (isLink(item)) {
                return <div>Button Item DISPLAY ITEM</div>
              }

              return <div>NO QUERY COURSE ITEM TODO</div>
            },
          },
        },
      ]}
      sources={() => [
        {
          sourceId: 'courses',
          getItemUrl({item}) {
            return item.url
          },
          getItems({query}) {
            return getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: 'content_production',
                  query,
                  params: {
                    hitsPerPage: 12,
                  },
                },
              ],
            })
          },
          templates: {
            item: ({item}) => {
              console.log(item)
              return <div>{item.title}</div>
            },
          },
        },
      ]}
    />
  )
}

export default AcSearchSpikePage
