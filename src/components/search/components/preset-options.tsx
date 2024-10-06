import {typsenseAdapterConfig} from '@/utils/typesense'
import React from 'react'
import {useInstantSearch} from 'react-instantsearch'
import {typesenseAdapter} from '@/pages/q/[[...all]]'
import {twMerge} from 'tailwind-merge'

const PresetOptions = ({classNames}: {classNames?: string}) => {
  const {refresh} = useInstantSearch()

  return (
    <select
      className={twMerge(
        'border-0 flex items-center flex-shrink-0 space-x-2 flex-nowrap dark:bg-gray-900 bg-white h-full',
        classNames,
      )}
      defaultValue="created_at"
      onChange={(e) => {
        typesenseAdapter.updateConfiguration({
          ...typsenseAdapterConfig,
          additionalSearchParameters: {
            query_by: 'title,description,_tags,instructor_name,contributors',
            preset: e.target.value,
          },
        })

        refresh()
      }}
    >
      <option
        className="border-opacity-0 dark:border-gray-800 border-gray-100"
        value="popular"
      >
        Most Popular
      </option>
      <option
        className="border-opacity-0 dark:border-gray-800 border-gray-100"
        value="rating"
      >
        Highest Rated
      </option>
      <option
        className="border-opacity-0 dark:border-gray-800 border-gray-100"
        value="created_at"
      >
        Recently Added
      </option>
      <option
        className="border-opacity-0 dark:border-gray-800 border-gray-100"
        value="most_watched"
      >
        Most Watched
      </option>
    </select>
  )
}

export default PresetOptions
