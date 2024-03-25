'use client'
import React from 'react'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@reach/tabs'
import {filter} from 'lodash'
import Transcript from '@/components/pages/lessons/transcript'
import Comments from '@/components/pages/lessons/comments/comments'
import {useEnhancedTranscript} from '@/hooks/use-enhanced-transcript'

export default function LessonTabs({
  transcript,
  transcript_url,
  lessonSlug,
  comments,
}: {
  transcript?: any
  transcript_url: string
  lessonSlug: string
  comments?: any
}) {
  const [tabIndex, setTabIndex] = React.useState(0)

  const numberOfComments = filter(
    comments,
    (comment: any) => comment.state !== 'hidden',
  ).length

  const enhancedTranscript = useEnhancedTranscript(transcript_url)
  const transcriptAvailable = transcript || enhancedTranscript

  return (
    <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
      <TabList>
        {transcriptAvailable && <Tab>Transcript</Tab>}
        <Tab>
          Comments <span className="text-sm">({numberOfComments})</span>
        </Tab>
      </TabList>
      <TabPanels className="p-5 rounded-lg rounded-tl-none bg-gray-50 dark:bg-gray-1000 sm:p-8">
        {transcriptAvailable && (
          <TabPanel>
            <Transcript
              initialTranscript={transcript}
              enhancedTranscript={enhancedTranscript}
            />
          </TabPanel>
        )}
        <TabPanel>
          <div className="space-y-6 sm:space-y-8 break-[break-word]">
            <Comments slug={lessonSlug} comments={comments} />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
