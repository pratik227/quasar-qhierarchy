// https://quasar.dev/quasar-cli-vite/quasar-config-file

import { fileURLToPath } from 'node:url'
import { defineConfig } from '#q-app'

// The docs always render the component from the local /ui sources,
// so every change in ../ui is visible here immediately (HMR included).
const uiDir = fileURLToPath(new URL('../ui', import.meta.url))

export default defineConfig((/* ctx */) => ({
  boot: ['theme'],

  css: ['app.scss'],

  // material-icons: only needed by the slot examples (q-btn icon names)
  extras: ['material-icons'],

  build: {
    vueRouterMode: 'history',

    alias: {
      'quasar-ui-qhierarchy': uiDir
    },

    extendViteConf (viteConf) {
      viteConf.resolve = viteConf.resolve || {}
      // ../ui has its own node_modules (for building the package);
      // make sure the docs and the component share one Vue and one Quasar
      viteConf.resolve.dedupe = ['vue', 'quasar', 'vue-router']
    }
  },

  devServer: {
    open: true,
    fs: {
      // allow serving ../ui and the symlinked ../app-extension
      allow: ['..']
    }
  },

  framework: {
    config: {
      dark: 'auto'
    },
    plugins: ['Meta']
  }
}))
