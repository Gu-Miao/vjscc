import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import pkg from './package.json' assert { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))
const input = join(__dirname, 'src/index.ts')

export default defineConfig([
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      exports: 'auto',
      sourcemap: true,
    },
    plugins: [nodeResolve(), commonjs(), typescript({ declaration: true, declarationDir: '/' })],
  },
  {
    input,
    output: {
      file: pkg.main,
      format: 'commonjs',
      exports: 'auto',
      sourcemap: true,
    },
    plugins: [nodeResolve(), commonjs(), typescript()],
  },
  {
    input,
    output: {
      name: 'VjsccUtils',
      file: pkg.minified,
      format: 'umd',
      exports: 'auto',
      sourcemap: true,
      plugins: [terser()],
    },
    plugins: [nodeResolve(), commonjs(), typescript()],
  },
])
