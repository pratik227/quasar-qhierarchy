# QHierarchy: Quasar App Extension

[![npm](https://img.shields.io/npm/v/quasar-ui-qhierarchy.svg?label=quasar-ui-qhierarchy)](https://www.npmjs.com/package/quasar-ui-qhierarchy)
[![npm](https://img.shields.io/npm/v/quasar-app-extension-qhierarchy.svg?label=quasar-app-extension-qhierarchy)](https://www.npmjs.com/package/quasar-app-extension-qhierarchy)

**A fast tree grid for [Quasar](https://quasar.dev) and Vue 3.** Hierarchical data shown as table rows, with
virtual scrolling, tri-state selection, lazy loading, sorting, filtering and full keyboard support.

📖 **Docs & live examples:** https://next-quasar-qhierarchy.netlify.app/

## Features

- **Virtual scrolling** (`virtual-scroll`): 100,000+ rows, only the visible ones are rendered
- **Selection** (`selection="single" | "multiple"`, `v-model:selected`): cascading tri-state checkboxes, or `strict-selection`
- **Lazy loading** (`lazy: true` nodes + `@lazy-load`): load children on demand, with loading and retry
- **Flat or nested data**: nested `children`, or self-referential `id` / `parentId` rows via `parent-key`
- **Sorting** at every level: text, `number`, `date` or custom comparators
- **Filtering** that keeps ancestors visible and auto-expands them
- **Controlled expansion**: `v-model:expanded`, `expandAll()`, `collapseAll()`, `expandToLevel()`…
- **Keyboard & accessibility**: WAI-ARIA treegrid, arrow keys, Home/End, Space/Enter
- **Slots** for rows (`body`), cells (`cell-[name]`), `header`, `footer` and `no-data`
- **Never mutates your data or columns**

## Install

### Quasar CLI (app extension)

```bash
quasar ext add qhierarchy
```

Works with `@quasar/app-vite` v1–v3 and `@quasar/app-webpack` v3–v4. `quasar describe QHierarchy` prints the API.

### Vue plugin

```bash
npm install quasar-ui-qhierarchy
```

```js
import QHierarchyPlugin from 'quasar-ui-qhierarchy'
import 'quasar-ui-qhierarchy/dist/index.css'

app.use(QHierarchyPlugin)
```

### UMD

```html
<link href="https://cdn.jsdelivr.net/npm/quasar-ui-qhierarchy/dist/index.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/quasar-ui-qhierarchy/dist/index.umd.min.js"></script>
<!-- app.use(qhierarchy) -->
```

## Usage

```vue
<template>
  <q-hierarchy
    :columns="columns"
    :data="data"
    node-key="id"
    selection="multiple"
    v-model:selected="selected"
  />
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'label', label: 'Label', field: 'label', align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', sortable: true, filterable: true },
  { name: 'size', label: 'Size', field: 'size', align: 'right', sortable: true, sortingType: 'number' }
]

const data = [
  {
    id: 1,
    label: 'Node 1',
    description: 'Node 1 description',
    size: 12,
    children: [
      { id: 2, label: 'Node 1.1', description: 'Node 1.1 description', size: 4 },
      { id: 3, label: 'Node 1.2', description: 'Node 1.2 description', size: 8 }
    ]
  }
]

const selected = ref([])
</script>
```

Upgrading from v1? See the [migration guide](https://next-quasar-qhierarchy.netlify.app/docs/migration).

## Repository

| Folder | Package |
| --- | --- |
| [`ui/`](ui) | `quasar-ui-qhierarchy`: the component (Vue plugin, ESM / CJS / UMD builds) |
| [`app-extension/`](app-extension) | `quasar-app-extension-qhierarchy`: the Quasar CLI app extension |
| [`demo/`](demo) | Docs site and playground (Quasar CLI + Vite), renders the local `ui/` sources |

```bash
# docs / playground (Node 22.22+)
cd demo && npm install && npm run dev

# build the UI package into ui/dist
cd ui && npm install && npm run build
```

## Sponsors

<p align="center">
  <a href="https://github.com/pratik227/static/blob/main/sponsors.svg">
    <img src='https://github.com/pratik227/static/blob/main/sponsors.svg'/>
  </a>
</p>

## Support

If this helped you in any way, you can contribute to this project for long term survival by supporting me:

### [💜 Support my open-source work on GitHub](https://github.com/sponsors/pratik227)

Thank you so much!!!

## License

MIT (c) pratikpatelpp802@gmail.com
