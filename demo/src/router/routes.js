// legacy URLs from the v1 docs keep working
const legacyRedirects = {
  '/example-qhierarchy-basic': '/examples/basic',
  '/example-qhierarchy-custom': '/examples/styling',
  '/example-qhierarchy-slot-demo': '/examples/body-slot',
  '/example-qhierarchy-footer-slot-demo': '/examples/footer-slot',
  '/example-qhierarchy-footer-demo': '/examples/footer',
  '/example-qhierarchy-header-slot-demo': '/examples/header-slot',
  '/example-qhierarchy-row-click-demo': '/examples/row-click',
  '/example-qhierarchy-default-expand-all': '/examples/expand-all',
  '/example-qhierarchy-filter-demo': '/examples/filter'
}

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DocsLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/LandingPage.vue'), meta: { landing: true } },

      { path: 'docs', component: () => import('@/pages/docs/IntroductionPage.vue') },
      { path: 'docs/installation', component: () => import('@/pages/docs/InstallationPage.vue') },
      { path: 'docs/data-and-columns', component: () => import('@/pages/docs/DataColumnsPage.vue') },
      { path: 'docs/migration', component: () => import('@/pages/docs/MigrationPage.vue') },
      { path: 'docs/api', component: () => import('@/pages/docs/ApiPage.vue') },
      { path: 'docs/performance', component: () => import('@/pages/docs/PerformancePage.vue') },
      { path: 'docs/accessibility', component: () => import('@/pages/docs/AccessibilityPage.vue') },

      { path: 'examples', redirect: '/examples/basic' },
      { path: 'examples/:slug', component: () => import('@/pages/ExamplePage.vue'), props: true },

      { path: 'sponsor', component: () => import('@/pages/SponsorPage.vue') },

      ...Object.entries(legacyRedirects).map(([path, redirect]) => ({ path: path.slice(1), redirect })),

      { path: ':catchAll(.*)*', component: () => import('@/pages/NotFoundPage.vue') }
    ]
  }
]

export default routes
