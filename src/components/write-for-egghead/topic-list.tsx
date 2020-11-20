import React from 'react'

const generalTopicList = [
  {headline: 'Vue 3'},
  {headline: 'Svelte'},
  {headline: 'TypeScript'},
  {headline: 'Accessibility'},
  {headline: 'Cloudflare Workers'},
  {headline: 'Observability'},
  {headline: 'Serverless'},
  {headline: 'AWS (most of it!)'},
  {headline: 'Next.js'},
  {headline: 'E-Commerce'},
  {headline: 'React Concurrent Mode Patterns'},
  {headline: 'Zustand'},
  {headline: 'React-Query'},
  {headline: 'Http Caching'},
  {headline: 'Mdx'},
  {headline: 'How to Give a Great Technical Talk'},
  {headline: 'Tailwind'},
  {headline: 'Design Systems'},
  {headline: 'React-Three-Fiber'},
  {headline: '"Advanced Beginner" CSS'},
  {headline: 'Design Patterns'},
  {headline: 'Functional Programming'},
  {headline: 'Open Source Development'},
  {headline: 'Github Actions'},
  {headline: 'VS Code (Tools in General)'},
  {headline: 'Design for Developers'},
  {headline: 'Problem Solving'},
  {headline: 'Debugging'},
  {headline: 'Performance Testing and Tuning'},
  {headline: 'Digital Gardens'},
  {headline: 'Patterns of Learning'},
]

const TopicList = () => {
  return (
    <div className="mb-2">
      <br />

      <div className="flex flex-wrap">
        {generalTopicList.map((x, i) => {
          return (
            <div
              key={x.headline}
              className="py-2 px-4 border border-gray-300 mr-2 mb-2 rounded-md"
            >
              <p>{x.headline}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopicList
