import path from 'node:path'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import less from 'rollup-plugin-less'
import ts from 'rollup-plugin-ts'
import { terser } from 'rollup-plugin-terser'
import LessPluginCleanCSS from 'less-plugin-clean-css'

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction
const input = path.join(__dirname, 'src/index.ts')
const name = 'VjsccModal'

function getPlugins(lessConfig = {}, declaration) {
  return [
    resolve(),
    commonjs(),
    less({ output: false, ...lessConfig }),
    ts({
      transpiler: 'babel',
      tsconfig: { declaration }
    })
  ]
}

/** @type {import('rollup').RollupOptions[]} */
const config = [
  isDevelopment && {
    input,
    output: {
      name,
      file: pkg.main,
      format: 'umd',
      exports: 'auto',
      sourcemap: true
    },
    plugins: getPlugins({ insert: true }, true)
  },
  isProduction && {
    input,
    output: {
      name,
      file: pkg.main,
      format: 'umd',
      exports: 'auto',
      sourcemap: true,
      globals: {
        '@vjscc/utils': 'VjsccUtils'
      }
    },
    plugins: getPlugins({ output: 'dist/index.css' }, true),
    external: '@vjscc/utils'
  },
  isProduction && {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      exports: 'auto',
      sourcemap: true,
      globals: {
        '@vjscc/utils': 'VjsccUtils'
      }
    },
    plugins: getPlugins(),
    external: '@vjscc/utils'
  },
  isProduction && {
    input,
    output: {
      name,
      file: 'dist/browser/vjscc-modal.min.js',
      format: 'umd',
      exports: 'auto',
      sourcemap: true,
      plugins: [terser()],
      globals: {
        '@vjscc/utils': 'VjsccUtils'
      }
    },
    plugins: getPlugins({
      output: 'dist/browser/vjscc-modal.min.css',
      plugins: [new LessPluginCleanCSS({ advanced: true })]
    }),
    external: '@vjscc/utils'
  },
  isProduction && {
    input,
    output: {
      name,
      file: 'dist/browser/vjscc-modal.bundle.min.js',
      format: 'umd',
      exports: 'auto',
      sourcemap: true,
      plugins: [terser()]
    },
    plugins: getPlugins()
  }
]

export default config.filter(Boolean)
