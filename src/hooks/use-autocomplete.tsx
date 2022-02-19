import {useMemo, useState} from 'react'
import {createAutocomplete} from '@algolia/autocomplete-core'

type SearchState = {
  collections: any[]
  completion: any
  context: any
  isOpen: boolean
  query: string
  activeItemId: any
  status: string
}

export function useAutocomplete(props: any) {
  const [state, setState] = useState<SearchState>(() => ({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    activeItemId: null,
    status: 'idle',
  }))

  console.log({props})

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        ...props,
        onStateChange(params: any) {
          props.onStateChange?.(params)
          setState(params.state)
        },
      }),
    [],
  )

  return {autocomplete, state}
}
