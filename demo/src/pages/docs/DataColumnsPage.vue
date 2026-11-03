<template>
  <doc-page
    title="Data & columns"
    lead="Describe your columns once and pass your nodes as they are, nested or flat. QHierarchy never writes to your objects."
    source="pages/docs/DataColumnsPage.vue"
  >
    <h2 id="columns">Columns</h2>
    <p>Columns follow QTable's shape, plus a few tree-specific options:</p>
    <code-block filename="columns.js" lang="js" :code="columnsCode" />

    <div class="doc-table-wrap">
      <table class="doc-table">
        <thead><tr><th>Option</th><th>Description</th></tr></thead>
        <tbody>
          <tr v-for="row in columnOptions" :key="row[0]"><td><code>{{ row[0] }}</code></td><td>{{ row[1] }}</td></tr>
        </tbody>
      </table>
    </div>

    <h2 id="nested-data">Nested data</h2>
    <p>The default: each node can have a <code>children</code> array (rename it with <code>children-key</code>).</p>
    <code-block filename="data.js" lang="js" :code="nestedCode" />

    <h2 id="flat-data">Flat data</h2>
    <p>
      Rows that point to their parent (the usual SQL / REST shape) work directly with <code>parent-key</code>.
      Rows whose parent is missing become roots.
    </p>
    <code-block lang="vue" :code="flatCode" />

    <h2 id="node-key">Node keys</h2>
    <p>
      Without <code>node-key</code>, nodes are identified by object identity, which is fine for static data.
      Set <code>node-key</code> when you use <code>v-model:expanded</code> / <code>v-model:selected</code>,
      or when you reload data from a server, so state survives new object instances.
    </p>

    <h2 id="reactivity">Reactivity</h2>
    <ul>
      <li>Replacing <code>data</code> (a new array) always re-renders.</li>
      <li>Reactive data (<code>ref</code> / <code>reactive</code>) is tracked deeply: push a child or edit a label and the row updates.</li>
      <li>
        For large, static datasets prefer <code>shallowRef</code> or plain arrays: rows can then be memoised and re-render faster.
        If you mutate such data in place, call the <code>refresh()</code> method.
      </li>
    </ul>

    <example-card file="FlatData" title="Flat data example" />
  </doc-page>
</template>

<script setup>
import CodeBlock from '@/components/CodeBlock.vue'
import DocPage from '@/components/DocPage.vue'
import ExampleCard from '@/components/ExampleCard.vue'

const columnOptions = [
  ['name', 'Unique column id; also used by cell-[name] slots and tree-column.'],
  ['label', 'Header text.'],
  ['field', 'Property name, or a function (node) => value.'],
  ['align', "'left' | 'center' | 'right'."],
  ['sortable', 'Click the header to sort; siblings are sorted at every level.'],
  ['sortingType', "'number' | 'date' | 'custom' (with sortingFunc(a, b)). Default: case-insensitive text."],
  ['sort', 'QTable-style comparator (a, b, rowA, rowB) on cell values.'],
  ['filterable', 'Include this column in the default filter (all columns are searched if none is filterable).'],
  ['format', '(value, node) => display value.'],
  ['classes / style', 'Applied to body cells.'],
  ['headerClasses / headerStyle', 'Applied to the header cell.']
]

const columnsCode = `export const columns = [
  { name: 'name', label: 'Name', field: 'name', sortable: true, filterable: true },
  { name: 'size', label: 'Size', field: 'size', align: 'right',
    sortable: true, sortingType: 'number', format: kb => kb + ' KB' },
  { name: 'modified', label: 'Modified', field: row => row.meta.updatedAt,
    sortable: true, sortingType: 'date' }
]
`

const nestedCode = `export const data = [
  {
    id: 'src',
    name: 'src',
    size: 1386,
    children: [
      { id: 'src/App.vue', name: 'App.vue', size: 4 },
      { id: 'src/assets', name: 'assets', size: 620, children: [/* ... */] }
    ]
  }
]
`

const flatCode = `<q-hierarchy
  :columns="columns"
  :data="employees"
  node-key="id"
  parent-key="managerId"
/>

<!-- employees = [
  { id: 1, managerId: null, name: 'Grace' },
  { id: 2, managerId: 1,    name: 'Arjun' },
  { id: 3, managerId: 2,    name: 'Kenji' }
] -->
`
</script>
