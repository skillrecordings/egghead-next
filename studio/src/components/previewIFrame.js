import React from 'react'
import S from '@sanity/desk-tool/structure-builder'
import resolveUrl from '../../resolvePreviewUrl'

const env = process.env.NODE_ENV || 'development'

const PreviewIFrame = () =>
  S.view
    .component(({document}) => {
      const {displayed} = document
      if (!displayed) {
        return <p>Nothing to display</p>
      }
      const url = resolveUrl(displayed)
      return (
        <React.Fragment>
          {env !== 'development' && (
            <div style={{padding: '0 0.5em'}}>
              <p>
                This is your{' '}
                <a
                  href="<#<deployments.web.url>#>"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  production site on Netlify
                </a>
                . <a href="/dashboard">Trigger a deploy</a> to see published
                changes.
              </p>
            </div>
          )}
          <iframe
            style={{
              width: '100%',
              height: '100%',
            }}
            frameBorder={'0'}
            src={url}
          />
        </React.Fragment>
      )
    })
    .title('Web preview')

export default PreviewIFrame
