/**
 * Keeps /app-extension/package.json in sync with the UI package:
 * same version, and a caret dependency on the UI version being built.
 */
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '../..')
const resolvePath = file => path.resolve(root, file)

function writeJson (file, json) {
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf-8')
}

module.exports.syncAppExt = function (both = true) {
  const appExtFile = resolvePath('app-extension/package.json')
  const uiFile = resolvePath('ui/package.json')

  if (!fs.existsSync(appExtFile) || !fs.existsSync(uiFile)) {
    return
  }

  const { name, version } = JSON.parse(fs.readFileSync(uiFile, 'utf-8'))
  const appExtJson = JSON.parse(fs.readFileSync(appExtFile, 'utf-8'))
  let finished = false

  if (both === true) {
    appExtJson.version = version
  }

  for (const field of ['dependencies', 'devDependencies']) {
    if (finished === false && appExtJson[field] !== undefined && appExtJson[field][name] !== undefined) {
      appExtJson[field][name] = '^' + version
      finished = true
    }
  }

  if (finished === true) {
    writeJson(appExtFile, appExtJson)
    console.log(` ⭐️ App Extension ${appExtJson.name} synced with UI v${version}.\n`)
    return
  }

  console.error('   App Extension version and dependency NOT synced.\n')
}
