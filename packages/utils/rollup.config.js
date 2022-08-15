import path from 'path'
import pkg from './package.json'

import clear from 'rollup-plugin-clear'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import ts from 'rollup-plugin-ts'
import { terser } from 'rollup-plugin-terser'

const isProduction = process.env.NODE_ENV === 'production'
const input = path.join(__dirname, 'src/index.ts')
const name = 'VjsccUtils'

function getPlugins(declaration) {
  return [
    clear({
      targets: ['dist']
    }),
    resolve(),
    commonjs(),
    ts({
      transpiler: 'swc',
      tsconfig: {
        declaration
      }
    })
  ]
}

/**
 * @typedef RollupOptions
 * @type {import('rollup').RollupOptions}
 */

/**
 * @returns {RollupOptions}
 */
function createDevConfig() {
  return {
    input,
    output: {
      name,
      file: pkg.main,
      format: 'umd',
      exports: 'auto',
      sourcemap: true
    },
    plugins: getPlugins(true)
  }
}

/**
 * @returns {RollupOptions[]}
 */
function createProdConfig() {
  return [
    {
      input,
      output: {
        name,
        file: pkg.main,
        format: 'umd',
        exports: 'auto',
        sourcemap: true
      },
      plugins: getPlugins(true)
    },
    {
      input,
      output: {
        file: pkg.module,
        format: 'esm',
        exports: 'auto',
        sourcemap: true
      },
      plugins: getPlugins()
    },
    {
      input,
      output: {
        name,
        file: 'dist/iife/vjscc-utils.min.js',
        format: 'iife',
        exports: 'auto',
        sourcemap: true,
        plugins: [terser()]
      },
      plugins: getPlugins()
    }
  ]
}

const config = isProduction ? createProdConfig() : createDevConfig()

export default config
