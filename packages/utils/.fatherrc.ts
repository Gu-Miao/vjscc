import { defineConfig } from 'father'

export default defineConfig({
  esm: {},
  umd: {
    name: 'VjsccUtils',
    output: { filename: `vjscc-utils.min.` },
  },
})
