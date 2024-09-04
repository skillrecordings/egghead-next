import React, {forwardRef, useState} from 'react'
import S3Upload from './s3upload'

interface ModernReactS3UploaderProps {
  className?: string
  signingUrl?: string
  getSignedUrl?: (file: File, callback: (signResult: any) => void) => void
  preprocess?: (file: File, next: (file: File) => void) => void
  onSignedUrl?: (signingServerResponse: any) => void
  onProgress?: (percent: number, message: string, file: File) => void
  onFinish?: (signResult: any, file: any) => void
  onError?: (message: string) => void
  signingUrlMethod?: string
  signingUrlHeaders?: Record<string, string> | (() => Record<string, string>)
  signingUrlQueryParams?:
    | Record<string, string>
    | (() => Record<string, string>)
  signingUrlWithCredentials?: boolean
  uploadRequestHeaders?: Record<string, string>
  contentDisposition?: string
  server?: string
  scrubFilename?: (filename: string) => string
  s3path?: string
  inputRef?: React.RefObject<HTMLInputElement>
  autoUpload?: boolean
  [key: string]: any
}

const clearInputFile = (f: HTMLInputElement) => {
  if (f.value) {
    try {
      f.value = '' // for IE11, latest Chrome/Firefox/Opera...
    } catch (err) {}
    if (f.value) {
      // for IE5 ~ IE10
      const form = document.createElement('form')
      const parentNode = f.parentNode
      const ref = f.nextSibling
      form.appendChild(f)
      form.reset()
      parentNode?.insertBefore(f, ref)
    }
  }
}

const ModernReactS3Uploader = forwardRef<
  HTMLInputElement,
  ModernReactS3UploaderProps
>(
  (
    {
      signingUrl,
      className,
      getSignedUrl,
      preprocess = (file, next) => {
        console.log('Pre-process: ', file.name)
        next(file)
      },
      onSignedUrl = (signingServerResponse) => {
        console.log('Signing server response: ', signingServerResponse)
      },
      onProgress = (percent, message, file) => {
        console.log('Upload progress: ', `${percent} % ${message}`)
      },
      onFinish = (signResult) => {
        console.log('Upload finished: ', signResult.publicUrl)
      },
      onError = (message) => {
        console.log('Upload error: ', message)
      },
      signingUrlMethod = 'GET',
      signingUrlHeaders,
      signingUrlQueryParams,
      signingUrlWithCredentials,
      uploadRequestHeaders,
      contentDisposition,
      server = '',
      scrubFilename = (filename) => filename.replace(/[^\w\d_\-\.]+/gi, ''),
      s3path = '',
      autoUpload = true,
      ...props
    },
    ref,
  ) => {
    const [myUploader, setMyUploader] = useState<any>(null)

    const fileRef = typeof ref !== 'function' ? ref : null

    const uploadFile = () => {
      const uploader = new S3Upload({
        fileElement: fileRef?.current,
        signingUrl,
        getSignedUrl,
        preprocess,
        onSignedUrl,
        onProgress,
        onFinishS3Put: onFinish,
        onError,
        signingUrlMethod,
        signingUrlHeaders,
        signingUrlQueryParams,
        signingUrlWithCredentials,
        uploadRequestHeaders,
        contentDisposition,
        server,
        scrubFilename,
        s3path,
      })
      setMyUploader(uploader)
      uploader.uploadFile()
    }

    const abort = () => {
      if (myUploader) {
        myUploader.abortUpload()
      }
    }

    const clear = () => {
      if (fileRef?.current) {
        abort()
        clearInputFile(fileRef.current)
      }
    }

    const inputProps = {
      type: 'file',
      onChange: autoUpload ? uploadFile : undefined,
      ...props,
    }

    return <input className={className} {...inputProps} ref={ref} />
  },
)

export default ModernReactS3Uploader
