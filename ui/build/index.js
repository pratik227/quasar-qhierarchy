/**
 * Builds quasar-ui-qhierarchy into /dist with Vite (library mode):
 *
 *   dist/index.esm.js      ES module (bundlers)
 *   dist/index.common.js   CommonJS
 *   dist/index.umd.js      UMD (window.qhierarchy)
 *   dist/index.umd.min.js  UMD, minified (CDN)
 *   dist/index.css         component styles
 *
 * `vue` and `quasar` are kept external.
 */
process.env.NODE_ENV = 'production'

const { resolve } = require('node:path')
const { syncAppExt } = require('./script.app-ext.js')
const { name, author, version } = require('../package.json')

const root = resolve(__dirname, '..')
const banner = [
  '/*!',
  ` * ${name} v${version}`,
  ` * (c) ${new Date().getFullYear()} ${author}`,
  ' * Released under the MIT License.',
  ' */'
].join('\n')

const fileNames = {
  es: 'index.esm.js',
  cjs: 'index.common.js',
  umd: 'index.umd.js'
}

function createConfig (vue, { formats, minify, emptyOutDir, fileName }) {
  return {
    configFile: false,
    root,
    logLevel: 'warn',
    plugins: [vue()],
    define: {
      __UI_VERSION__: JSON.stringify(version)
    },
    build: {
      outDir: 'dist',
      emptyOutDir,
      minify,
      sourcemap: false,
      cssCodeSplit: false,
      lib: {
        entry: resolve(root, 'src/index.esm.js'),
        name: 'qhierarchy',
        formats,
        fileName,
        cssFileName: 'index'
      },
      rolldownOptions: {
        external: ['vue', 'quasar'],
        output: {
          exports: 'named',
          banner,
          globals: {
            vue: 'Vue',
            quasar: 'Quasar'
          }
        }
      }
    }
  }
}

async function run () {
  console.log()
  syncAppExt()
  console.log(` 📦 Building ${name} v${version}...\n`)

  const { build } = await import('vite')
  const { default: vue } = await import('@vitejs/plugin-vue')

  await build(createConfig(vue, {
    formats: ['es', 'cjs', 'umd'],
    minify: false,
    emptyOutDir: true,
    fileName: format => fileNames[format]
  }))

  await build(createConfig(vue, {
    formats: ['umd'],
    minify: true,
    emptyOutDir: false,
    fileName: () => 'index.umd.min.js'
  }))

  console.log(' ✅ Built into ui/dist\n')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
