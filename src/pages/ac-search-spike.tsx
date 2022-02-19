import * as React from 'react'
import {useAutocomplete} from '../hooks/use-autocomplete'
import {isLink} from '../utils/is-link'
import {
  getAlgoliaResults,
  RequesterDescription,
} from '@algolia/autocomplete-preset-algolia'
import {searchClient} from '../utils/search-client'

type AutoCompleteSearchItem = {
  slug?: {
    current?: string | undefined
  }
  label: string
  description?: string
  url: string
  icon?: () => JSX.Element
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

  return <div>Hello?</div>
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
          sourceId: 'episodes',
          getItemUrl({item}) {
            return item.url
          },
          getItems({query}) {
            return getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName:
                    'netlify_c55763f8-efc8-4ed9-841a-186a011ed84b_main_all',
                  query,
                  params: {
                    hitsPerPage: 12,
                  },
                },
              ],
            })
          },
          templates: {
            item: ({item}) => <div>COURSE ITEM</div>,
          },
        },
      ]}
    />
  )
}

export default AcSearchSpikePage
