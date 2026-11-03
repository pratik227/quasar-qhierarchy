// Shared sample data for the examples: a small project file tree.

export function formatSize (kb) {
  if (kb === null || kb === undefined) return '—'
  return kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB'
}

export function formatDate (iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true, filterable: true },
  { name: 'kind', label: 'Type', field: 'kind', align: 'left', sortable: true, filterable: true },
  { name: 'size', label: 'Size', field: 'size', align: 'right', sortable: true, sortingType: 'number', format: formatSize },
  { name: 'modified', label: 'Modified', field: 'modified', align: 'right', sortable: true, sortingType: 'date', format: formatDate }
]

export const data = [
  {
    id: 'src',
    name: 'src',
    kind: 'Folder',
    size: 1386,
    modified: '2026-10-28',
    children: [
      {
        id: 'src/components',
        name: 'components',
        kind: 'Folder',
        size: 742,
        modified: '2026-10-28',
        children: [
          { id: 'src/components/QHierarchy.vue', name: 'QHierarchy.vue', kind: 'Vue component', size: 48, modified: '2026-10-28' },
          { id: 'src/components/QHierarchy.json', name: 'QHierarchy.json', kind: 'JSON', size: 14, modified: '2026-10-21' },
          { id: 'src/components/Toolbar.vue', name: 'Toolbar.vue', kind: 'Vue component', size: 6, modified: '2026-09-14' }
        ]
      },
      {
        id: 'src/assets',
        name: 'assets',
        kind: 'Folder',
        size: 620,
        modified: '2026-08-02',
        children: [
          { id: 'src/assets/logo.svg', name: 'logo.svg', kind: 'SVG image', size: 4, modified: '2026-08-02' },
          { id: 'src/assets/hero.webp', name: 'hero.webp', kind: 'WebP image', size: 612, modified: '2026-07-19' }
        ]
      },
      { id: 'src/index.js', name: 'index.js', kind: 'JavaScript', size: 1, modified: '2026-10-11' },
      { id: 'src/vue-plugin.js', name: 'vue-plugin.js', kind: 'JavaScript', size: 1, modified: '2026-10-11' }
    ]
  },
  {
    id: 'docs',
    name: 'docs',
    kind: 'Folder',
    size: 233,
    modified: '2026-10-30',
    children: [
      { id: 'docs/getting-started.md', name: 'getting-started.md', kind: 'Markdown', size: 12, modified: '2026-10-30' },
      { id: 'docs/api.md', name: 'api.md', kind: 'Markdown', size: 21, modified: '2026-10-29' },
      {
        id: 'docs/images',
        name: 'images',
        kind: 'Folder',
        size: 200,
        modified: '2026-10-02',
        children: [
          { id: 'docs/images/selection.png', name: 'selection.png', kind: 'PNG image', size: 118, modified: '2026-10-02' },
          { id: 'docs/images/virtual-scroll.png', name: 'virtual-scroll.png', kind: 'PNG image', size: 82, modified: '2026-10-01' }
        ]
      }
    ]
  },
  { id: 'package.json', name: 'package.json', kind: 'JSON', size: 2, modified: '2026-10-31' },
  { id: 'README.md', name: 'README.md', kind: 'Markdown', size: 9, modified: '2026-10-31' }
]
