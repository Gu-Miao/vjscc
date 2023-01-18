import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import styles from 'rollup-plugin-styles'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import pkg from './package.json' assert { type: 'json' }

const isProduction = process.env.NODE_ENV === 'production'
const __dirname = dirname(fileURLToPath(import.meta.url))
const input = join(__dirname, 'src/index.ts')
const name = 'VjsccBackTop'

const prodConfig = defineConfig([
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      exports: 'auto',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ declaration: true, declarationDir: '/' }),
      styles({ mode: ['inject', { prepend: true }], minimize: true }),
    ],
  },
  {
    input,
    output: {
      file: pkg.main,
      format: 'commonjs',
      exports: 'auto',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript(),
      styles({ mode: ['inject', { prepend: true }], minimize: true }),
    ],
  },
  {
    input,
    external: '@vjscc/utils',
    output: {
      name,
      file: pkg.minified,
      format: 'umd',
      exports: 'auto',
      sourcemap: true,
      plugins: [terser()],
      globals: {
        '@vjscc/utils': 'VjsccUtils',
      },
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ declaration: true, declarationDir: '/' }),
      styles({ mode: ['inject', { prepend: true }], minimize: true }),
    ],
  },
  {
    input,
    output: {
      name,
      file: pkg.bundle,
      format: 'umd',
      exports: 'auto',
      sourcemap: true,
      plugins: [terser()],
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript(),
      styles({ mode: ['inject', { prepend: true }], minimize: true }),
    ],
  },
])

const devConfig = defineConfig({
  input,
  output: {
    name,
    file: pkg.bundle,
    format: 'umd',
    exports: 'auto',
    sourcemap: true,
    plugins: [terser()],
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    styles({ mode: ['inject', { prepend: true }], minimize: true }),
  ],
})

export default isProduction ? prodConfig : devConfig
