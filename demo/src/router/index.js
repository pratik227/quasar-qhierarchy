import { defineRouter } from '#q-app'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'

import routes from './routes.js'

// sticky header (56px) + tabs (44px) + a little breathing room
const HEADER_OFFSET = 116

export default defineRouter(() => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  return createRouter({
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, top: HEADER_OFFSET, behavior: 'smooth' }
      if (to.path === from.path) return false
      return { left: 0, top: 0 }
    },
    routes,

    // Leave this as is and make changes in quasar.config file instead!
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE)
  })
})
