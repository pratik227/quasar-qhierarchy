/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 *
 * Written as CommonJS on purpose: every Quasar CLI generation can load it.
 * The older CLIs require() it and the ESM-based ones import() it.
 *
 *   @quasar/app-vite      v1, v2, v3
 *   @quasar/app-webpack   v3, v4   (and the legacy @quasar/app v3)
 */

const UI_PACKAGE = 'quasar-ui-qhierarchy'
const AE_PACKAGE = 'quasar-app-extension-qhierarchy'

/**
 * @quasar/app-vite v1/v2 and @quasar/app-webpack v3/v4 expose
 * api.hasVite / api.hasWebpack; @quasar/app-vite v3 dropped them.
 */
function isVite (api) {
  if (api.hasVite === true) return true
  if (api.hasWebpack === true) return false
  return api.hasPackage('@quasar/app-vite') === true
}

function pushUnique (list, entry) {
  if (list.includes(entry) === false) {
    list.push(entry)
  }
}

function extendConf (conf, api) {
  // register our boot file (it installs the QHierarchy component)
  conf.boot = conf.boot || []
  pushUnique(conf.boot, `~${AE_PACKAGE}/src/boot/register.js`)

  if (isVite(api) === false) {
    // webpack: make sure the AE and UI sources get transpiled.
    // @quasar/app-webpack v4 renamed build.transpileDependencies
    // to build.webpackTranspileDependencies
    conf.build = conf.build || {}
    const key = Array.isArray(conf.build.webpackTranspileDependencies) || api.hasPackage('@quasar/app-webpack', '>=4.0.0-0')
      ? 'webpackTranspileDependencies'
      : 'transpileDependencies'

    conf.build[key] = conf.build[key] || []
    conf.build[key].push(
      new RegExp(`${AE_PACKAGE}[\\\\/]src`),
      new RegExp(`${UI_PACKAGE}[\\\\/]src`)
    )
  }
}

function extendViteConf (viteConf) {
  // serve the UI sources as-is (plugin-vue compiles the SFC) instead of
  // pre-bundling them, so they share the app's single Quasar instance
  viteConf.optimizeDeps = viteConf.optimizeDeps || {}
  viteConf.optimizeDeps.exclude = viteConf.optimizeDeps.exclude || []
  pushUnique(viteConf.optimizeDeps.exclude, UI_PACKAGE)
}

module.exports = function (api) {
  api.compatibleWith('quasar', '^2.0.0')

  if (isVite(api) === true) {
    api.compatibleWith('@quasar/app-vite', '^1.0.0 || ^2.0.0 || ^3.0.0')
  }
  else if (api.hasPackage('@quasar/app-webpack') === true) {
    api.compatibleWith('@quasar/app-webpack', '^3.0.0 || ^4.0.0')
  }
  else {
    api.compatibleWith('@quasar/app', '^3.0.0')
  }

  // `quasar describe QHierarchy`
  api.registerDescribeApi('QHierarchy', `~${UI_PACKAGE}/src/components/QHierarchy.json`)

  api.extendQuasarConf(extendConf)

  if (isVite(api) === true && typeof api.extendViteConf === 'function') {
    api.extendViteConf(extendViteConf)
  }
}
