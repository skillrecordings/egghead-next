import {parseMdxNotesFile, eggheadLogo} from '../github-load-notes'

// this had to use an async/await because the mdx compiler
// is set up to be async and return a promise
test('properly parses a markdown text string', async () => {
  const markdownNotes = `<TimeStamp start="0:44" end="0:50">

This is a **note**.

</TimeStamp>
`
  const parsedNotes = parseMdxNotesFile(markdownNotes)

  await expect(parsedNotes).resolves.toEqual([
    {
      end: 50,
      start: 44,
      text: 'This is a **note**.',
      type: 'staff',
      image: eggheadLogo,
    },
  ])
})

test('properly parses markdown codeblock and text in the same timestamp', async () => {
  const markdownNotes = `
<TimeStamp start="0:44" end="0:50">

This is a **note**.

\`\`\`js
This is a code block!
\`\`\`

</TimeStamp>
`

  const parsedNotes = await parseMdxNotesFile(markdownNotes)
  await expect(parsedNotes).toEqual([
    {
      end: 50,
      start: 44,
      text: `This is a **note**.
 \`\`\`js
This is a code block!
\`\`\``,
      type: 'staff',
      image: eggheadLogo,
    },
  ])
})
