import * as React from 'react'
import find from 'lodash/find'

// TODO: add `id` for finding instead of `file`
type FileUpload = {
  file: File
  percent: number
  message: string
  signedUrl?: string
}

type FileUploadReducerState = {files: FileUpload[]}

type Action = {
  type: 'add' | 'progress' | 'finalize'
}

type Actions = {
  add: {
    fileUpload: FileUpload
  }
  progress: FileUpload
  finalize: {
    file: FileUpload['file']
    fileUrl: string
  }
}

type ReducerAction = {
  [ActionType in keyof Actions]: {
    type: ActionType
  } & Actions[ActionType]
}[keyof Actions]

const fileUploadReducer = (
  state: FileUploadReducerState,
  action: ReducerAction,
): FileUploadReducerState => {
  let upload = undefined

  switch (action.type) {
    case 'add':
      return {files: [...state.files, action.fileUpload]}
    case 'progress':
      upload = find<FileUpload>(
        state.files,
        (fileUpload) => fileUpload.file === action.file,
      )
      if (upload) {
        upload.percent = action.percent
        upload.message = action.message
        upload.file = action.file
      }

      return {files: [...state.files]}
    case 'finalize':
      upload = find<FileUpload>(
        state.files,
        (fileUpload) => fileUpload.file === action.file,
      )

      if (upload) {
        upload.signedUrl = action.fileUrl
      }

      return {files: [...state.files]}
    default:
      throw new Error()
  }
}

export type DispatchFunction = (arg0: ReducerAction) => void

const useFileUploadReducer = (
  files: FileUpload[],
): [FileUploadReducerState, DispatchFunction] => {
  const [fileUploadState, dispatch] = React.useReducer(fileUploadReducer, {
    files: [],
  })

  return [fileUploadState, dispatch]
}

export default useFileUploadReducer
