const packageJson = require('../../../package.json')
const fs = require('fs')
const path = require('path')
const {execFileSync} = require('child_process')

const repoRoot = path.join(__dirname, '../../..')

describe('markdown dependency compatibility', () => {
  test('keeps modern remark-gfm for mdx while pinning a react-markdown-safe alias', () => {
    expect(packageJson.dependencies['react-markdown']).toMatch(/^\^?8\./)
    expect(packageJson.dependencies['remark-gfm']).toMatch(/^\^?4\./)
    expect(packageJson.dependencies['remark-gfm-v3']).toBe(
      'npm:remark-gfm@3.0.1',
    )
  })

  test('lockfile resolves both remark-gfm lines we need', () => {
    const lockfile = fs.readFileSync(
      path.join(repoRoot, 'pnpm-lock.yaml'),
      'utf8',
    )

    expect(lockfile).toContain('remark-gfm-v3:')
    expect(lockfile).toContain('specifier: npm:remark-gfm@3.0.1')
    expect(lockfile).toContain('remark-gfm@3.0.1:')
    expect(lockfile).toContain('remark-gfm@4.0.1:')
  })

  test('react-markdown can render gfm tables without the inTable crash', () => {
    const script = `
      import React from 'react'
      import ReactDOMServer from 'react-dom/server'
      import ReactMarkdown from 'react-markdown'
      import remarkGfm from 'remark-gfm-v3'

      const html = ReactDOMServer.renderToString(
        React.createElement(
          ReactMarkdown,
          {remarkPlugins: [remarkGfm]},
          '| a | b |\\n| - | - |\\n| 1 | 2 |',
        ),
      )

      process.stdout.write(html)
    `

    const html = execFileSync(
      process.execPath,
      ['--input-type=module', '--eval', script],
      {
        cwd: repoRoot,
        encoding: 'utf8',
      },
    )

    expect(html).toContain('<table>')
    expect(html).toContain('<td>1</td>')
  })
})
