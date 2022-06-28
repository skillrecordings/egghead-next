import {renderHook, act} from '@testing-library/react-hooks'
import useFileUploadReducer from '../use-file-upload-reducer'

test('it initializes with no files', () => {
  const {result} = renderHook(() => useFileUploadReducer([]))

  const [state, _dispatch] = result.current

  expect(state).toEqual({files: []})
})

test('it can add a file upload', () => {
  const {result} = renderHook(() => useFileUploadReducer([]))

  const initialState = result.current[0]
  expect(initialState).toEqual({files: []})

  const file: File = {name: 'fake-file.txt'} as File

  const fileUpload = {
    file,
    percent: 0,
    message: 'waiting to upload',
  }

  act(() => {
    const dispatch = result.current[1]
    dispatch({type: 'add', fileUpload})
  })

  const stateWithFile = result.current[0]

  expect(stateWithFile).toEqual({files: [fileUpload]})
})

test('it can update progress of a file upload', () => {
  const {result} = renderHook(() => useFileUploadReducer([]))

  const initialState = result.current[0]
  expect(initialState).toEqual({files: []})

  const file: File = {name: 'fake-file.txt'} as File

  const fileUpload = {
    file,
    percent: 0,
    message: 'waiting to upload',
  }

  act(() => {
    const dispatch = result.current[1]
    dispatch({type: 'add', fileUpload})
  })

  act(() => {
    const dispatch = result.current[1]
    dispatch({type: 'progress', file, percent: 1, message: 'In progress'})
  })

  const stateWithFileProgress = result.current[0]

  expect(stateWithFileProgress).toEqual({
    files: [{file, percent: 1, message: 'In progress'}],
  })
})

test('it ignores progress for an unknown file', () => {
  const {result} = renderHook(() => useFileUploadReducer([]))

  const initialState = result.current[0]
  expect(initialState).toEqual({files: []})

  const unknownFile: File = {name: 'unknown-file.txt'} as File

  // calling progress with an unknown file does nothing
  act(() => {
    const dispatch = result.current[1]
    dispatch({
      type: 'progress',
      file: unknownFile,
      percent: 1,
      message: 'Ignored',
    })
  })

  const newState = result.current[0]

  expect(newState).toEqual({files: []})
})

test('it can add the signedUrl when finalizing', () => {
  const {result} = renderHook(() => useFileUploadReducer([]))

  const initialState = result.current[0]
  expect(initialState).toEqual({files: []})

  const file: File = {name: 'fake-file.txt'} as File

  const fileUpload = {
    file,
    percent: 0,
    message: 'waiting to upload',
  }

  act(() => {
    const dispatch = result.current[1]
    dispatch({type: 'add', fileUpload})
  })

  act(() => {
    const dispatch = result.current[1]
    dispatch({type: 'progress', file, percent: 1, message: 'In progress'})
  })

  const fileUrl = 'http://s3:bucket/video.mp4'

  act(() => {
    const dispatch = result.current[1]
    dispatch({type: 'finalize', file, fileUrl})
  })

  const finalizedState = result.current[0]

  expect(finalizedState).toEqual({
    files: [{file, percent: 1, message: 'In progress', signedUrl: fileUrl}],
  })
})
