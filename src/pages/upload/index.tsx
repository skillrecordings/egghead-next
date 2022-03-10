import * as React from 'react'
import ReactS3Uploader from 'react-s3-uploader'
import {useViewer} from '../../context/viewer-context'
import {getAuthorizationHeader} from '../../utils/auth'
import uuid from 'shortid'
import fileExtension from 'file-extension'
import {find} from 'lodash'

type FileUpload = {file: File; percent: number; message: string}

const fileUploadReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'add':
      return {files: [...state.files, action.fileUpload]}
    case 'progress':
      const upload = find<FileUpload>(
        state.files,
        (fileUpload) => fileUpload.file === action.file,
      )
      if (upload) {
        upload.percent = action.percent
        upload.message = action.message
      }

      return {files: [...state.files]}
    default:
      throw new Error()
  }
}

const Upload: React.FC = () => {
  const [state, dispatch] = React.useReducer(fileUploadReducer, {files: []})
  const {viewer} = useViewer()
  const uploaderRef = React.useRef(null)

  return viewer?.s3_signing_url ? (
    <div>
      <ReactS3Uploader
        ref={uploaderRef}
        multiple
        //if we set this to `false` we can list all the files and
        //call `uploaderRef.current.uploadFile()` when we are ready
        autoUpload={true}
        signingUrl={`/api/aws/sign-s3`}
        // @ts-ignore
        signingUrlHeaders={getAuthorizationHeader()}
        accept="video/*"
        scrubFilename={(fullFilename) => {
          //filename with no extension
          const filename = fullFilename.replace(/\.[^/.]+$/, '')
          //remove stuff s3 hates
          const scrubbed = `${filename}-${uuid.generate()}`
            .replace(/[^\w\d_\-.]+/gi, '')
            .toLowerCase()
          //rebuild it as a fresh new thing
          return `${scrubbed}.${fileExtension(fullFilename)}`
        }}
        preprocess={(file, next) => {
          dispatch({
            type: 'add',
            fileUpload: {
              file,
              percent: 0,
              message: 'waiting to upload',
            },
          })

          console.log('preprocess', file)
          next(file)
        }}
        onProgress={(percent, message, file) => {
          dispatch({type: 'progress', file, percent, message})
        }}
        onError={(message) => console.log(message)}
        onFinish={(signResult, file) => {
          const fileUrl = signResult.signedUrl.split('?')[0]
          console.log(fileUrl, signResult.publicUrl, file)
        }}
      />{' '}
      {state.files.map((file) => {
        return (
          <div key={file.name}>
            {file.file.name} {file.percent} {file.message}
          </div>
        )
      })}
    </div>
  ) : null
}

export default Upload
