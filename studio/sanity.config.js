import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {markdownSchema} from 'sanity-plugin-markdown'
import schemas from './schemas/schema'

export default defineConfig({
  title: 'egghead-next',
  projectId: 'sb1i5dlc',
  dataset: 'production',
  plugins: [deskTool(), markdownSchema(), visionTool()],
  schema: {
    types: schemas,
  },
})
