import { version } from './package.json' assert { type: 'json' }
import { defineConfig } from 'father'

export default defineConfig({
  esm: {},
  umd: {
    name: 'VjsccUtils',
    output: { filename: `vjscc-utils-${version}.min.` },
  },
})
