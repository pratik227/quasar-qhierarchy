// No `defineBoot`/`boot` wrapper import on purpose: wrappers are identity
// helpers, and their import path differs between Quasar CLI generations
// ('quasar/wrappers' vs '#q-app'). A plain function works everywhere.
import * as VuePlugin from 'quasar-ui-qhierarchy/src/vue-plugin.js'

export default ({ app }) => {
  app.use(VuePlugin)
}
