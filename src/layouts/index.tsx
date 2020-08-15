import React from 'react'

export default function Layout(frontMatter) {
  return ({children: content}) => {
    // React hooks, for example `useState` or `useEffect`, go here.

    console.log(frontMatter)
    return (
      <div className="prose">
        <h1>{frontMatter.title}</h1>
        {content}
      </div>
    )
  }
}
