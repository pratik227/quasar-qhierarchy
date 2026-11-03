/**
 * Single source of truth for the docs navigation:
 * sidebar, routes, prev/next links and the search palette all read from here.
 */

export const GITHUB_URL = 'https://github.com/pratik227/quasar-qhierarchy'
export const GITHUB_SOURCE = GITHUB_URL + '/blob/next/demo/src'
export const SPONSOR_URL = 'https://github.com/sponsors/pratik227'

export const examples = [
  {
    slug: 'basic',
    file: 'Basic',
    title: 'Basic',
    description: 'Columns plus nested children: the minimal setup.'
  },
  {
    slug: 'sorting',
    file: 'Sorting',
    title: 'Sorting',
    description: 'Sortable columns with text, number, date and custom comparators. Siblings are sorted at every level.',
    extra: ['sample-data.js'],
    isNew: true
  },
  {
    slug: 'expand-all',
    file: 'ExpandAll',
    title: 'Default expansion',
    description: 'Open every node with default-expand-all, or only the first levels with default-expand-level.',
    extra: ['sample-data.js']
  },
  {
    slug: 'expansion-api',
    file: 'Controlled',
    title: 'Controlled expansion',
    description: 'Own the expanded state with v-model:expanded and drive it with expandAll(), collapseAll() and expandToLevel().',
    extra: ['sample-data.js'],
    isNew: true
  },
  {
    slug: 'row-click',
    file: 'RowClickDemo',
    title: 'Row click',
    description: 'Expand and collapse by clicking anywhere on a row, and listen to row-click.',
    extra: ['sample-data.js']
  },
  {
    slug: 'filter',
    file: 'FilterDemo',
    title: 'Filtering',
    description: 'Search across filterable columns. Matches keep their ancestors visible, and those ancestors expand automatically.',
    extra: ['sample-data.js']
  },
  {
    slug: 'selection',
    file: 'Selection',
    title: 'Selection',
    description: 'Single or multiple selection with tri-state checkboxes that cascade to children and roll up to parents.',
    extra: ['sample-data.js'],
    isNew: true
  },
  {
    slug: 'lazy-loading',
    file: 'LazyLoad',
    title: 'Lazy loading',
    description: 'Fetch children on demand the first time a node is expanded.',
    isNew: true
  },
  {
    slug: 'virtual-scroll',
    file: 'VirtualScroll',
    title: 'Virtual scroll',
    description: 'Up to 100,000 rows. Only the rows in view are rendered.',
    extra: ['big-data.js'],
    isNew: true
  },
  {
    slug: 'flat-data',
    file: 'FlatData',
    title: 'Flat data',
    description: 'Self-referential rows (id / parentId) straight from your API or database. No nesting step needed.',
    isNew: true
  },
  {
    slug: 'cell-slots',
    file: 'CellSlot',
    title: 'Cell slots',
    description: 'Customise one column with cell-[name] while the tree column keeps its indentation and toggle.',
    extra: ['sample-data.js'],
    isNew: true
  },
  {
    slug: 'body-slot',
    file: 'SlotDemo',
    title: 'Body slot',
    description: 'Take over the whole row and render every cell yourself.',
    extra: ['sample-data.js']
  },
  {
    slug: 'header-slot',
    file: 'HeaderSlotDemo',
    title: 'Header slot',
    description: 'Render your own header cells and keep sorting wired up.',
    extra: ['sample-data.js']
  },
  {
    slug: 'footer',
    file: 'FooterDemo',
    title: 'Footer text',
    description: 'A single footer row from footer-text and footer-class.',
    extra: ['sample-data.js']
  },
  {
    slug: 'footer-slot',
    file: 'FooterSlotDemo',
    title: 'Footer slot',
    description: 'A custom footer row, with access to the columns and the visible rows.',
    extra: ['sample-data.js']
  },
  {
    slug: 'styling',
    file: 'Custom',
    title: 'Styling',
    description: 'dense, dark, bordered, separator, custom icons and the classes prop.',
    extra: ['sample-data.js']
  }
]

export const navGroups = [
  {
    title: 'Get started',
    items: [
      { title: 'Introduction', path: '/docs', description: 'What QHierarchy is and when to use it.' },
      { title: 'Installation', path: '/docs/installation', description: 'Quasar CLI app extension, Vue plugin or UMD.' },
      { title: 'Data & columns', path: '/docs/data-and-columns', description: 'Nested or flat data, node keys and column definitions.' },
      { title: 'Migrating to v2', path: '/docs/migration', description: 'What changed and how to upgrade.' }
    ]
  },
  {
    title: 'Examples',
    items: examples.map(example => ({
      title: example.title,
      path: '/examples/' + example.slug,
      description: example.description,
      isNew: example.isNew === true
    }))
  },
  {
    title: 'Reference',
    items: [
      { title: 'API', path: '/docs/api', description: 'Props, slots, events and methods.' },
      { title: 'Performance', path: '/docs/performance', description: 'How QHierarchy stays fast, plus a live benchmark.' },
      { title: 'Keyboard & a11y', path: '/docs/accessibility', description: 'WAI-ARIA treegrid semantics and keyboard shortcuts.' }
    ]
  },
  {
    title: 'Community',
    items: [
      { title: 'Sponsor', path: '/sponsor', description: 'Support the project.' },
      { title: 'GitHub', href: GITHUB_URL, description: 'Source, issues and releases.' }
    ]
  }
]

export const headerTabs = [
  { title: 'Overview', path: '/', match: path => path === '/' },
  { title: 'Docs', path: '/docs', match: path => path === '/docs' || (path.startsWith('/docs/') && !path.startsWith('/docs/api')) },
  { title: 'Examples', path: '/examples/basic', match: path => path.startsWith('/examples') },
  { title: 'API', path: '/docs/api', match: path => path.startsWith('/docs/api') }
]

/** internal pages, in reading order (used for prev / next) */
export const flatNav = navGroups.flatMap(group =>
  group.items
    .filter(item => item.path !== undefined)
    .map(item => ({ ...item, group: group.title }))
)

export function findNavItem (path) {
  return flatNav.find(item => item.path === path)
}

export function getSiblings (path) {
  const index = flatNav.findIndex(item => item.path === path)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? flatNav[index - 1] : null,
    next: index < flatNav.length - 1 ? flatNav[index + 1] : null
  }
}
