import QHierarchy from './components/QHierarchy'

import pkg from '../package.json'
const { version } = pkg

function install (app) {
  app.component(QHierarchy.name, QHierarchy)
}

export {
  version,
  QHierarchy,

  install
}
