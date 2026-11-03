<template>
  <doc-page
    title="Migrating to v2"
    lead="v2 is a rewrite focused on speed and modern Quasar. Existing props, slots and events keep working; the changes below are the edges worth checking."
    source="pages/docs/MigrationPage.vue"
  >
    <h2 id="compatible">Still works as before</h2>
    <ul>
      <li>Props <code>data</code>, <code>columns</code>, <code>dense</code>, <code>dark</code>, <code>flat</code>, <code>bordered</code>, <code>square</code>, <code>separator</code>, <code>classes</code>, <code>default-expand-all</code>, <code>filter</code>.</li>
      <li>Legacy spellings <code>expand_on_row_click</code>, <code>footer_text</code> and <code>footer_class</code> (new: <code>expand-on-row-click</code>, <code>footer-text</code>, <code>footer-class</code>).</li>
      <li>The <code>body</code> slot with <code>item</code>, <code>toggle</code>, <code>setPadding</code> and <code>iconName</code>; the <code>header</code> slot with <code>columns</code> (<code>sorted</code> / <code>sortDirection</code>) and <code>sortBy</code>; the <code>footer</code> slot.</li>
      <li>The <code>sort_column</code> event.</li>
    </ul>

    <h2 id="changes">Behaviour changes</h2>
    <div class="doc-table-wrap">
      <table class="doc-table">
        <thead><tr><th>v1</th><th>v2</th></tr></thead>
        <tbody>
          <tr v-for="row in changes" :key="row[0]"><td>{{ row[0] }}</td><td>{{ row[1] }}</td></tr>
        </tbody>
      </table>
    </div>

    <doc-callout type="warning" title="Reading internal fields">
      If your slot code read <code>item.level</code>, <code>item.expend</code> or <code>item.leaf</code>, switch to the
      slot props <code>level</code>, <code>expanded</code> and <code>hasChildren</code> (or <code>row</code>).
    </doc-callout>

    <h2 id="app-extension">App extension</h2>
    <p>
      The extension now supports every current Quasar CLI: <code>@quasar/app-vite</code> v1 to v3 and
      <code>@quasar/app-webpack</code> v3 to v4. v1 of the extension failed on <code>@quasar/app-vite</code> v3 and
      <code>@quasar/app-webpack</code> v4. Upgrade both packages together:
    </p>
    <code-block lang="bash" code="quasar ext add qhierarchy" />

    <h2 id="new">New in v2</h2>
    <ul>
      <li v-for="item in added" :key="item[0]"><router-link :to="item[1]">{{ item[0] }}</router-link></li>
    </ul>
  </doc-page>
</template>

<script setup>
import CodeBlock from '@/components/CodeBlock.vue'
import DocCallout from '@/components/DocCallout.vue'
import DocPage from '@/components/DocPage.vue'

const changes = [
  ['Wrote level, leaf, expend, _index, sorted… onto your nodes', 'Never mutates data or columns. State lives in the component and is exposed through slot props.'],
  ['Sorting re-ordered your arrays in place', 'Sorting produces a sorted view; your arrays keep their order.'],
  ['Wrapped the table in a <span>', 'The table container is the root element, so class and style land on it.'],
  ['QBtn toggle; leaf labels not aligned with parents', 'Lightweight toggle button (inline SVG); leaves get a spacer so labels line up. Customise with expand-icon / collapse-icon.'],
  ['Non-tree columns had a 30px left padding', 'Regular cells, aligned with align.'],
  ['Filter with no filterable column matched nothing', 'Searches every column when none is marked filterable.'],
  ['Clicking the toggle with expand_on_row_click toggled twice', 'Toggles once.'],
  ['Empty data rendered an empty body', 'Shows no-data-label (or the no-data slot).'],
  ['Expanded state could not be collapsed with default-expand-all', 'default-expand-all only applies initially and when data is replaced.']
]

const added = [
  ['Virtual scrolling', '/examples/virtual-scroll'],
  ['Tri-state selection with v-model:selected', '/examples/selection'],
  ['Lazy loading', '/examples/lazy-loading'],
  ['Flat (self-referential) data with parent-key', '/examples/flat-data'],
  ['v-model:expanded, expandAll(), collapseAll(), expandToLevel()', '/examples/expansion-api'],
  ['cell-[name] slots and column format', '/examples/cell-slots'],
  ['Number, date and custom sorting at every level', '/examples/sorting'],
  ['Keyboard navigation and ARIA treegrid', '/docs/accessibility'],
  ['quasar describe QHierarchy', '/docs/api']
]
</script>
