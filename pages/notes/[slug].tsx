import {loadNotes} from '@lib/notes'
import hydrate from 'next-mdx-remote/hydrate'
import renderToString from 'next-mdx-remote/render-to-string'
import React from 'react'

/*
Proof of Concept:

Some working URLs to try:

http://localhost:3000/notes/add-internationalization-to-react-app-using-react-intl
http://localhost:3000/notes/get-started-with-angular

Some broken URLs:
- img tag not closed
https://github.com/eggheadio/eggheadio-course-notes/tree/master/build-an-app-with-the-AWS-cloud-development-kit
http://localhost:3000/notes/thinking-reactively-with-rxjs

*/

export default function Notes({notesMdx}) {
  const markdownContent = hydrate(notesMdx, {})

  return (
    <div className="prose lg:prose-xl max-w-none">
      <div>{markdownContent}</div>
    </div>
  )
}

export async function getServerSideProps({res, params, req}) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const notes = await loadNotes(params.slug)

  const notesMdx = await renderToString(notes)
  return {
    props: {
      notesMdx,
    },
  }
}
