import { defineConfig } from 'father'

export default defineConfig({
  esm: {},
  umd: {
    name: 'VjsccBackTop',
    output: { filename: `vjscc-back-top.min.` },
    chainWebpack: memo => {
      memo.output.libraryExport('default')
      return memo
    },
  },
})
