import '../src/styles/index.css'
import * as nextImage from 'next/image'

// Cheeky way around using next/image in Storybook
Object.defineProperty(nextImage, 'default', {
  configurable: true,
  value: (props) => {
    return <img {...props} />
  },
})

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
}
