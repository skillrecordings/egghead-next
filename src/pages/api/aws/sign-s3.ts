import {NextApiRequest, NextApiResponse} from 'next'
import AWS from 'aws-sdk'
import {v4 as uuidv4} from 'uuid'

const options = {
  bucket: process.env.AWS_VIDEO_UPLOAD_BUCKET,
  region: process.env.AWS_VIDEO_UPLOAD_REGION,
  signatureVersion: 'v4',
  ACL: 'public-read',
}

const credentials = {
  accessKeyId: process.env.AWS_VIDEO_UPLOAD_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_VIDEO_UPLOAD_SECRET_ACCESS_KEY || '',
}

AWS.config.credentials = credentials

const s3 = new AWS.S3(options)

const signedUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const {objectName, contentType} = req.query

    const filename = `${uuidv4()}/${objectName}`

    const params = {
      Bucket: options.bucket,
      Key: `rip/${filename}`,
      Expires: 60,
      ContentType: contentType,
      ACL: options.ACL,
    }

    const signedUrl = s3.getSignedUrl('putObject', params)

    if (signedUrl) {
      res.json({
        signedUrl,
        filename,
        objectName,
        publicUrl: signedUrl.split('?').shift(),
      })
    } else {
    }
  }
}

export default signedUrl
