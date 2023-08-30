import { defineConfig } from 'father'

export default defineConfig({
  esm: {},
  umd: {
    name: 'VjsccModal',
    output: { filename: `vjscc-modal.min.` },
    chainWebpack: memo => {
      memo.output.libraryExport('default')
      return memo
    },
  },
})
