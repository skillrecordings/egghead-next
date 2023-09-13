// sanity.cli.js
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    title: 'egghead-next',
    projectId: 'sb1i5dlc',
    dataset: 'production',
  },
})
