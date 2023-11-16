import Markdown from '@/components/markdown'
import {isEmpty} from 'lodash'
import {useTheme} from 'next-themes'
import React from 'react'

const CoursePodcast = ({
  podcast: {transcript, simplecast_uid: id},
  instructorName,
}: any) => {
  const [isOpen, setOpen] = React.useState(false)
  const {theme} = useTheme()

  if (isEmpty(id)) {
    return null
  } else {
    return (
      <div className="w-full pt-2 pb-3">
        <h3 className="my-2 text-xl font-semibold">
          {`Listen to ${instructorName} tell you about this course:`}{' '}
          {transcript && (
            <span>
              <button onClick={() => setOpen(!isOpen)}>
                {isOpen ? 'Hide Transcript' : 'Show Transcript'}
              </button>
            </span>
          )}
        </h3>
        <iframe
          height="52px"
          width="100%"
          frameBorder="no"
          scrolling="no"
          title="Podcast Player"
          seamless
          src={`https://player.simplecast.com/${id}?dark=${
            theme === 'dark'
          }&color=${theme === 'dark' && '111827'}`}
        />
        {isOpen && transcript && (
          <Markdown className="bb b--black-10 pb3 lh-copy">
            {transcript}
          </Markdown>
        )}
      </div>
    )
  }
}

export default CoursePodcast
