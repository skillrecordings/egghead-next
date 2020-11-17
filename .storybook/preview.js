import '../src/styles/index.css'
import * as nextImage from 'next/image'
import * as nextLink from 'next/link'

// Cheeky way around using next/image in Storybook
Object.defineProperty(nextImage, 'default', {
  configurable: true,
  value: (props) => {
    return <img {...props} />
  },
})
// And the same for next/link
Object.defineProperty(nextLink, 'default', {
  configurable: true,
  value: (props) => {
    // next/link wraps an anchor in an anchor.
    // To please Storybook, pass the children directly.
    return <span {...props}>{props.children}</span>
  },
})

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
}
