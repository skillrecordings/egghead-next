import uuid from 'shortid'
import fileExtension from 'file-extension'

export const getUniqueFilename = (fullFilename: string) => {
  // filename with no extension
  const filename = fullFilename.replace(/\.[^/.]+$/, '')
  // remove stuff s3 hates
  const scrubbed = `${filename}-${uuid.generate()}`
    .replace(/[^\w\d_\-.]+/gi, '')
    .toLowerCase()
  // rebuild it as a fresh new thing
  return `${scrubbed}.${fileExtension(fullFilename)}`
}
