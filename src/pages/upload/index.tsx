import * as React from 'react'
import ReactS3Uploader from 'react-s3-uploader'
import {useViewer} from '../../context/viewer-context'
import {getAuthorizationHeader} from '../../utils/auth'
import uuid from 'shortid'
import fileExtension from 'file-extension'
import {find} from 'lodash'
import {sanityClient as client} from 'utils/sanity-client'

type FileUpload = {file: File; percent: number; message: string}

const fileUploadReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'add':
      return {...state, files: [...state.files, action.fileUpload]}
    case 'progress':
      const upload = find<FileUpload>(
        state.files,
        (fileUpload) => fileUpload.file === action.file,
      )
      if (upload) {
        upload.percent = action.percent
        upload.message = action.message
      }

      return {...state, files: [...state.files]}
    case 'signed':
      return {...state, urls: [...state.urls, action.url]}
    default:
      throw new Error()
  }
}

const handleSubmit = (e: any, form: any, urls: any) => {
  e.preventDefault()

  const re = /[^/\\&?]+\.\w{3,4}(?=([?&].*$|$))/
  console.log(urls[0].match(re)[0])

  const lessons = urls.map((url: any) => {
    return {
      _type: 'resource',
      _key: url,
      type: 'video',
      title: url.match(re)[0],
      rawMediaUrl: url,
    }
  })

  const document = {
    _type: 'resource',
    title: form.collectionTitle,
    type: 'course',
    new: true,
    resources: lessons,
  }

  client.create(document)
}

const Upload: React.FC = () => {
  const [state, dispatch] = React.useReducer(fileUploadReducer, {
    files: [],
    urls: [],
  })
  const {viewer} = useViewer()
  const uploaderRef = React.useRef(null)

  const [form, setForm] = React.useState({collectionTitle: ''})
  const {collectionTitle} = form

  return viewer?.s3_signing_url ? (
    <div>
      <ReactS3Uploader
        ref={uploaderRef}
        multiple
        //if we set this to `false` we can list all the files and
        //call `uploaderRef.current.uploadFile()` when we are ready
        autoUpload={true}
        signingUrl={viewer.s3_signing_url}
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
          dispatch({type: 'signed', url: fileUrl})
        }}
      />{' '}
      <form onSubmit={(e) => handleSubmit(e, form, state.urls)}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            onChange={(e) =>
              setForm({...form, collectionTitle: e.target.value})
            }
            value={collectionTitle}
            type="text"
            name="title"
            className="text-gray-700"
          />
        </div>
        {state.files.map((file: any) => {
          return (
            <div key={file.name}>
              {file.file.name} {file.percent} {file.message}
            </div>
          )
        })}
        <div>
          <input type="submit" name="submit" />
        </div>
      </form>
    </div>
  ) : null
}

export default Upload
