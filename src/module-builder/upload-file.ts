import axios from 'axios'
import {getUniqueFilename} from '@/module-builder/get-unique-filename'

const SIGNING_URL = `/api/aws/sign-s3`

export async function uploadToS3({
  fileType,
  fileContents,
  onUploadProgress = () => {},
}: {
  fileType: string
  fileContents: File
  onUploadProgress: (progressEvent: {loaded: number; total?: number}) => void
}) {
  const presignedPostUrl = await getPresignedPostUrl(
    fileType,
    fileContents.name,
  )

  await axios.put(presignedPostUrl.signedUrl, fileContents, {
    headers: {'Content-Type': 'application/octet-stream'},
    onUploadProgress,
  })

  return presignedPostUrl.publicUrl
}

type PresignedPostUrlResponse = {
  signedUrl: string
  publicUrl: string
  filename: string
  objectName: string
}

async function getPresignedPostUrl(fileType: string, fileName: string) {
  const {data: presignedPostUrl} = await axios.get<PresignedPostUrlResponse>(
    `${SIGNING_URL}?contentType=${fileType}&objectName=${getUniqueFilename(
      fileName,
    )}`,
  )

  return presignedPostUrl
}
