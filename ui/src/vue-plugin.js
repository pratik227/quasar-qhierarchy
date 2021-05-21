import QHierarchy from './components/QHierarchy'


const version = __UI_VERSION__

function install (app) {
  app.component(QHierarchy.name, QHierarchy)

}

export {
  version,
  QHierarchy,

  install
}
