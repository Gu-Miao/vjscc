import { version } from './package.json' assert { type: 'json' }
import { defineConfig } from 'father'

export default defineConfig({
  esm: {},
  umd: {
    name: 'VjsccBackTop',
    output: { filename: `vjscc-back-top-${version}.min.` },
  },
})
