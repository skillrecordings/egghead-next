import * as React from 'react'
import ReactS3Uploader from 'react-s3-uploader'
import {ACCESS_TOKEN_KEY, getAuthorizationHeader} from 'utils/auth'
import uuid from 'shortid'
import fileExtension from 'file-extension'
import {find} from 'lodash'
import {GetServerSideProps} from 'next'
import {getAbilityFromToken} from 'server/ability'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const SIGNING_URL = `/api/aws/sign-s3`

type FileUpload = {file: File; percent: number; message: string}

type Instructor = {
  externalId: string
  person: {
    _id: string
    name: string
    image: string
  }
}

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])

  if (ability.can('upload', 'Video')) {
    const instructorQuery = groq`
      *[_type == 'collaborator' && role == 'instructor'][]{
        'person': person-> {
            _id,
            name,
            'image': image.url,
          },
        externalId,
      }`

    const instructors: Instructor[] = await sanityClient.fetch(instructorQuery)

    return {
      props: {
        instructors,
      },
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

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

const Upload: React.FC<{instructors: Instructor[]}> = ({instructors}) => {
  const [state, dispatch] = React.useReducer(fileUploadReducer, {files: []})
  const uploaderRef = React.useRef(null)

  return (
    <div>
      <ReactS3Uploader
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

          next(file)
        }}
        onProgress={(percent, message, file) => {
          dispatch({type: 'progress', file, percent, message})
        }}
        onError={(message) => console.log(message)}
        onFinish={(signResult, file) => {
          const fileUrl = signResult.signedUrl.split('?')[0]
          console.debug(fileUrl, signResult.publicUrl, file)
        }}
      />{' '}
      {state.files.map((file) => {
        return (
          <div key={file.name}>
            {file.file.name} {file.percent} {file.message}
          </div>
        )
      })}
      <h2>Insructor</h2>
      {/* we can use a more featureful select component here that allows for search and displaying an image thumbnail. This is a proof of concept. */}
      <select>
        {instructors.map(
          ({
            externalId,
            person,
          }: {
            externalId: string
            person: {name: string}
          }) => {
            return <option value={externalId}>{person['name']}</option>
          },
        )}
      </select>
    </div>
  )
}

export default Upload
