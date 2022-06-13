import * as React from 'react'
import ReactS3Uploader from 'react-s3-uploader'
import {getAuthorizationHeader} from 'utils/auth'
import uuid from 'shortid'
import fileExtension from 'file-extension'

const SIGNING_URL = `/api/aws/sign-s3`

const VideoUploader = ({dispatch}: {dispatch: Function}) => {
  const uploaderRef = React.useRef(null)

  return (
    <ReactS3Uploader
      class="hidden"
      ref={uploaderRef}
      multiple
      //if we set this to `false` we can list all the files and
      //call `uploaderRef.current.uploadFile()` when we are ready
      autoUpload={true}
      signingUrl={SIGNING_URL}
      // @ts-ignore
      signingUrlHeaders={getAuthorizationHeader()}
      accept="video/*"
      scrubFilename={(fullFilename) => {
        // filename with no extension
        const filename = fullFilename.replace(/\.[^/.]+$/, '')
        // remove stuff s3 hates
        const scrubbed = `${filename}-${uuid.generate()}`
          .replace(/[^\w\d_\-.]+/gi, '')
          .toLowerCase()
        // rebuild it as a fresh new thing
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

        next(file)
      }}
      onProgress={(percent, message, file) => {
        dispatch({type: 'progress', file, percent, message})
      }}
      onError={(message) => console.log(message)}
      onFinish={(signResult, file) => {
        const fileUrl = signResult.signedUrl.split('?')[0]
        dispatch({type: 'finalize', file, fileUrl})
      }}
    />
  )
}

export default VideoUploader
