import * as React from 'react'

import {
  AcademicCapIcon,
  VideoCameraIcon,
  TerminalIcon,
  RssIcon,
  PuzzleIcon,
  BookmarkIcon,
  DownloadIcon,
  FastForwardIcon,
  SupportIcon,
  DocumentTextIcon,
} from '@heroicons/react/solid'

const BenefitsList: React.FunctionComponent = () => {
  return (
    <div className="grid grid-cols-1 mx-auto gap-y-8 gap-x-6 md:grid-cols-2">
      {[
        {
          text: '250+ comprehensive courses',
          icon: (
            <AcademicCapIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
        {
          text: 'Practice projects to apply your knowledge',
          icon: (
            <PuzzleIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
        {
          text: '5500+ bite-size video lessons',
          icon: (
            <VideoCameraIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
        {
          text: 'Transcripts and closed captions on every video',
          icon: (
            <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
        {
          text: 'Code examples for every lesson',
          icon: (
            <TerminalIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
        {
          text: 'Speed controls to watch at your own pace',
          icon: (
            <FastForwardIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
        {
          text: 'Downloadable videos to view offline',
          icon: (
            <DownloadIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
        {
          text: 'Priority customer support and assistance',
          icon: (
            <SupportIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
        {
          text: 'RSS feeds for your favourite podcasting app',
          icon: (
            <RssIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
        {
          text: 'Bookmarks to create learning plans and stay organised',
          icon: (
            <BookmarkIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ),
        },
      ].map((item, i) => {
        return (
          <div key={i} className="flex w-full space-x-6 items-center">
            <div className="flex-shrink-0">{item.icon}</div>
            <p className="text-lg font-medium leading-tight text-gray-700 dark:text-white">
              {item.text}
            </p>
          </div>
        )
      })}
    </div>
  )
}
const Benefits: React.FunctionComponent = () => {
  return (
    <section className="px-5 py-20 -mx-5 bg-gray-50 dark:bg-gray-800">
      <div className="container">
        <h4 className="mb-4 text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
          The sweet details
        </h4>
        <h3 className="mb-12 text-2xl font-medium leading-snug dark:text-white">
          What you'll get as an egghead member
        </h3>
        <BenefitsList />
      </div>
    </section>
  )
}

export default Benefits
