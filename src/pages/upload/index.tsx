import * as React from 'react'
import ReactS3Uploader from 'react-s3-uploader'
import {useViewer} from '../../context/viewer-context'
import {getAuthorizationHeader} from '../../utils/auth'
import uuid from 'shortid'
import fileExtension from 'file-extension'
import {find} from 'lodash'
import {Formik, Form, Field, FormikProps} from 'formik'
import axios from 'axios'

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

type UploadedFile = {
  fileName: string
  signedUrl: string
}

type LessonMetadata = {
  title: string
  fileMetadata: UploadedFile
}

type FormProps = {
  lessons: LessonMetadata[]
}

const UploadWrapper = () => {
  const {viewer} = useViewer()
  const initialValues: FormProps = {lessons: []}

  if (!viewer?.s3_signing_url) return null

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, actions) => {
        const response = await axios.post('api/sanity/lessons/create', {
          lessons: values.lessons,
        })

        console.log({response})
      }}
    >
      {(props) => <Upload {...props} />}
    </Formik>
  )
}

const Upload: React.FC<FormikProps<FormProps>> = (formikProps) => {
  const {values, setFieldValue} = formikProps

  const {viewer} = useViewer()
  const [state, dispatch] = React.useReducer(fileUploadReducer, {files: []})
  const uploaderRef = React.useRef(null)
  const [lessonMetadata, setLessonMetadata] = React.useState<LessonMetadata[]>(
    [],
  )

  React.useEffect(() => {
    setFieldValue('lessons', lessonMetadata)
  }, [lessonMetadata, setFieldValue])

  return (
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
          setLessonMetadata((prevState) => [
            ...prevState,
            {
              title: file.name,
              fileMetadata: {fileName: file.name, signedUrl: fileUrl},
            },
          ])
        }}
      />{' '}
      {state.files.map((file) => {
        if (file.percent < 100) {
          return (
            <div>
              {file.file.name} - {file.message} - {file.percent}
            </div>
          )
        } else {
          return null
        }
      })}
      <Form>
        {values.lessons.map((lesson, i) => (
          <div>
            <Field name={`lessons.${i}.title`} />
            <label htmlFor="URL">URL</label>
            <p>{lesson.fileMetadata.signedUrl}</p>
          </div>
        ))}
        <button type="submit">Save Lessons</button>
      </Form>
    </div>
  )
}

export default UploadWrapper
