import {renderHook, act} from '@testing-library/react-hooks'
import {useTrackComponent} from '../use-track-component'
import {track} from 'utils/analytics'

jest.mock('utils/analytics')

beforeEach(() => {
  jest.clearAllMocks()
})

test('it calls track when it first renders', () => {
  renderHook(useTrackComponent)

  expect(track).toHaveBeenCalledTimes(1)
})

test('it does not get called on subsequent renders', () => {
  const {rerender} = renderHook(useTrackComponent)

  rerender()

  expect(track).toHaveBeenCalledTimes(1)
})
