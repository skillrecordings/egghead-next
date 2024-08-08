'use client'
import Markdown from 'react-markdown'

export default function Description({description}: {description: string}) {
  return (
    <Markdown className="font-medium prose prose-lg dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 max-w-none text-gray-1000 dark:text-white">
      {description}
    </Markdown>
  )
}
