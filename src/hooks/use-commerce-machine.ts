import * as React from 'react'
import {commerceMachine} from 'machines/commerce-machine'
import {useMachine} from '@xstate/react'

export const useCommerceMachine = () => {
  const memoizedCommerceMachine = React.useMemo(() => {
    return commerceMachine
  }, [])

  return useMachine(memoizedCommerceMachine)
}
