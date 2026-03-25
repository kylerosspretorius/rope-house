import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

const projectId = '9fa2kqd4'
const dataset = 'production'

export default defineConfig({
  name: 'rope-house',
  title: 'Rope House',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema,
})
