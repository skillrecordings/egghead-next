'use client'

import {useReducer} from 'react'

const initialFileState = {
  fileError: null,
  fileName: null,
  fileSize: null,
  fileType: null,
  fileContents: null,
}

function bytesToMb(bytes: number) {
  const mb = bytes / 1000000

  return mb
}

export function useFileChange() {
  const [
    {fileError, fileContents, fileName, fileSize, fileType},
    fileDispatch,
  ] = useReducer(fileChangeReducer, initialFileState)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0]

    if (!fileObj) {
      return
    }

    const [type] = fileObj.type.split('/')
    if (!type || type !== 'video') {
      fileDispatch({
        type: 'FILE_CHANGE_FAILURE',
        fileError: 'You can only upload image files.',
      })
      return
    }

    // if (fileObj.size > 10000000000) {
    //   fileDispatch({
    //     type: 'FILE_CHANGE_FAILURE',
    //     fileError: `File is too large, file size is ${bytesToMb(
    //       fileObj.size,
    //     ).toFixed(2)} MB, maximum allowed size - 1 MB.`,
    //   })
    //   return
    // }

    // eslint-disable-next-line no-param-reassign
    // Commenting this out because having the file name in native input field is actually useful
    // event.target.value = ''

    fileDispatch({
      type: 'FILE_CHANGE_SUCCESS',
      fileName: fileObj.name,
      fileSize: fileObj.size,
      fileType: fileObj.type,
      fileContents: fileObj,
    })
  }

  return {
    fileError,
    fileContents,
    fileName,
    fileType,
    fileSize,
    handleFileChange,
    fileDispatch,
  }
}

type FileState = {
  fileError: string | null
  fileName: string | null
  fileSize: number | null
  fileType: string | null
  fileContents: File | null
}

type FileChangeAction =
  | {
      type: 'FILE_CHANGE_SUCCESS'
      fileName: string
      fileSize: number
      fileType: string
      fileContents: File
    }
  | {type: 'FILE_CHANGE_FAILURE'; fileError: string}
  | {type: 'RESET_FILE_STATE'}

export function fileChangeReducer(
  _state: FileState,
  action: FileChangeAction,
): FileState {
  switch (action.type) {
    case 'FILE_CHANGE_SUCCESS': {
      return {
        fileError: null,
        fileName: action.fileName,
        fileSize: action.fileSize,
        fileType: action.fileType,
        fileContents: action.fileContents,
      }
    }
    case 'FILE_CHANGE_FAILURE': {
      return {
        ...initialFileState,
        fileError: action.fileError,
      }
    }
    case 'RESET_FILE_STATE': {
      return initialFileState
    }
    default: {
      throw new Error(`Unsupported action type: ${JSON.stringify(action)}`)
    }
  }
}
