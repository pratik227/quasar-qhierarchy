
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/example-qhierarchy-basic', component: () => import('pages/BasicExample') },
      { path: '/example-qhierarchy-custom', component: () => import('pages/CustomExample') },
      { path: '/example-qhierarchy-slot-demo', component: () => import('pages/SlotDemoExample') },
      { path: '/example-qhierarchy-footer-slot-demo', component: () => import('pages/FooterSlotDemoExample.vue') },
      { path: '/example-qhierarchy-footer-demo', component: () => import('pages/FooterDemoExample.vue') },
      { path: '/example-qhierarchy-header-slot-demo', component: () => import('pages/HeaderSlotDemoExample.vue') },
      { path: '/example-qhierarchy-row-click-demo', component: () => import('pages/RowClickDemoExample.vue') },
      { path: '/example-qhierarchy-default-expand-all', component: () => import('pages/ExpandAllExample') },
      { path: '/example-qhierarchy-filter-demo', component: () => import('pages/FilterDemoExample') },
      { path: '/sponsor', component: () => import('pages/Sponsor') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
