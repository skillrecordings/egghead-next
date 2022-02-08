import * as React from 'react'
import ReactS3Uploader from 'react-s3-uploader'
import {useViewer} from '../../context/viewer-context'
import {getAuthorizationHeader} from '../../utils/auth'
import uuid from 'shortid'
import fileExtension from 'file-extension'
import {find} from 'lodash'
import {Formik, useFormik} from 'formik'

// Currently, onFinish callback in the Upload component is creating a clojure with formik.values.lessons.
// So when that state is updated, it's spreading an empty array with each update. Causing only the latest upload to be saved

type FileUpload = {file: File; percent: number; message: string}

// THEORY reducer?
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

type UploadedFile = {
  fileName: string
  signedUrl: string
}

type LessonMetadata = {
  title: string
  fileMetadata: UploadedFile
}

const Upload: React.FC = () => {
  const [state, dispatch] = React.useReducer(fileUploadReducer, {files: []})
  const {viewer} = useViewer()
  const uploaderRef = React.useRef(null)
  // const [fileUrls, setFileUrls] = React.useState<UploadedFile[]>([])

  const initialValues: {lessons: LessonMetadata[]} = {lessons: []}

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values, actions) => {},
  })

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
          // setFileUrls([...fileUrls, {fileName: file.name, signedUrl: fileUrl}])
          console.log('WITHIN onFinish', formik.values.lessons)
          formik.setFieldValue('lessons', [
            ...formik.values.lessons,
            {
              title: file.name,
              fileMetadata: {fileName: file.name, signedUrl: fileUrl},
            },
          ])
        }}
      />{' '}
      {formik.values.lessons.map((lesson) => (
        <div>
          {lesson.title} - {lesson.fileMetadata.signedUrl}
        </div>
      ))}
    </div>
  ) : null
}

export default Upload
