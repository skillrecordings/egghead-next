import React from 'react'
import {CheckIcon} from '@heroicons/react/solid'

const benefitsList = [
  {text: 'high quality product development'},
  {text: 'consistent shared knowledge and understanding of tools'},
  {text: 'alignment on best practices'},
  {text: 'similar basis for understanding around "how we got here"'},
]

const GridBenefitsList = () => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-4">
      {benefitsList.map((x) => {
        return (
          <div
            key={x.text}
            className="flex items-center space-x-2 p-2 rounded-md dark:bg-gray-800 bg-gray-50"
          >
            <span>
              <CheckIcon className="h-6 w-6 text-amber-500 ml-2" />
            </span>
            <span>{x.text}</span>
          </div>
        )
      })}
    </div>
  )
}

export default GridBenefitsList
