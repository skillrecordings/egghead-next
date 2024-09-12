import * as React from 'react'
import ModernReactS3Uploader from './modern-react-s3-uploader'
import {getAuthorizationHeader} from '@/utils/auth'
import {nanoid} from 'nanoid'
import fileExtension from 'file-extension'
import {DispatchFunction} from '@/hooks/use-file-upload-reducer'

const SIGNING_URL = `/api/aws/sign-s3`

const VideoUploader = ({
  dispatch,
  multiple,
}: {
  dispatch: DispatchFunction
  multiple?: boolean
}) => {
  const uploaderRef = React.useRef(null)

  return (
    <ModernReactS3Uploader
      className="hidden"
      ref={uploaderRef}
      {...(multiple ? {multiple: true} : {})}
      //if we set this to `false` we can list all the files and
      //call `uploaderRef.current.uploadFile()` when we are ready
      autoUpload={true}
      signingUrl={SIGNING_URL}
      // @ts-ignore
      signingUrlHeaders={getAuthorizationHeader()}
      accept="video/*"
      scrubFilename={(fullFilename: string) => {
        // filename with no extension
        const filename = fullFilename?.replace(/\.[^/.]+$/, '')
        // remove stuff s3 hates
        const scrubbed = `${filename}-${nanoid(7)}`
          .replace(/[^\w\d_\-.]+/gi, '')
          .toLowerCase()
        // rebuild it as a fresh new thing
        return `${scrubbed}.${fileExtension(fullFilename)}`
      }}
      preprocess={(file: File, next: (file: File) => void) => {
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
      onProgress={(percent: number, message: string, file: File) => {
        dispatch({type: 'progress', file, percent, message})
      }}
      onError={(message: string) => console.log(message)}
      onFinish={(signResult: any, file: File) => {
        const fileUrl = signResult.signedUrl.split('?')[0]
        dispatch({type: 'finalize', file, fileUrl})
      }}
    />
  )
}

export default VideoUploader
