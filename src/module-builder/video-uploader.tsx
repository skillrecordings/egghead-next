'use client'

import * as React from 'react'
import {useFileChange} from './use-file-change'
import {uploadToS3} from './upload-file'
import {Button, Input, Label} from '@/ui'

const VideoUploader = () => {
  const {fileError, fileContents, fileType, fileDispatch, handleFileChange} =
    useFileChange()
  const [s3FileUrl, setS3FileUrl] = React.useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (fileType && fileContents) {
        const filePath = await uploadToS3({
          fileType,
          fileContents,
          onUploadProgress: (progressEvent) => {
            console.log(
              'progressEvent',
              progressEvent.total
                ? progressEvent.loaded / progressEvent.total
                : 0,
            )
          },
        })

        fileDispatch({type: 'RESET_FILE_STATE'})
        setS3FileUrl(filePath)
      }
    } catch (err) {
      console.log('error is', err)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="video">Upload a video</Label>
        <Input
          type="file"
          accept="video/*"
          id="video"
          name="video"
          onChange={handleFileChange}
        />
        <Button disabled={!fileContents} type="submit">
          Upload to s3
        </Button>
      </form>
      {fileError && <>{fileError}</>}
      <span className="inline-block h-96 w-96">{s3FileUrl}</span>
    </>
  )
}

export default VideoUploader
