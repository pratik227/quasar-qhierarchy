<template>
  <doc-page
    title="Performance"
    lead="QHierarchy does as little work as possible per interaction: it flattens only the visible branches, never touches your data, and with virtual-scroll it renders only the rows on screen."
    source="pages/docs/PerformancePage.vue"
  >
    <h2 id="how">How it stays fast</h2>
    <div class="doc-table-wrap">
      <table class="doc-table">
        <thead><tr><th>Technique</th><th>Effect</th></tr></thead>
        <tbody>
          <tr v-for="row in techniques" :key="row[0]"><td>{{ row[0] }}</td><td>{{ row[1] }}</td></tr>
        </tbody>
      </table>
    </div>

    <h2 id="benchmark">Live benchmark</h2>
    <p>
      Generates an org-chart tree and measures the time from changing state to the next painted frame, in your browser.
      Without virtual scroll every row is a real DOM row, so compare both modes.
    </p>

    <div class="bench qh-card">
      <div class="example-toolbar">
        <div class="segmented">
          <button v-for="size in sizes" :key="size" type="button" :class="{ active: target === size }" @click="target = size">{{ size.toLocaleString() }}</button>
        </div>
        <div class="segmented">
          <button type="button" :class="{ active: virtual }" @click="virtual = true">virtual-scroll</button>
          <button type="button" :class="{ active: !virtual }" @click="virtual = false">all rows</button>
        </div>
        <button type="button" class="qh-btn qh-btn--primary qh-btn--sm" :disabled="running" @click="run">{{ running ? 'Running…' : 'Run benchmark' }}</button>
      </div>

      <div v-if="results.length" class="doc-table-wrap">
        <table class="doc-table qh-tabular">
          <thead><tr><th>Nodes</th><th>Mode</th><th>Visible rows</th><th>Mount</th><th>Expand all</th><th>Collapse all</th></tr></thead>
          <tbody>
            <tr v-for="(r, i) in results" :key="i">
              <td>{{ r.nodes.toLocaleString() }}</td><td>{{ r.mode }}</td><td>{{ r.rows.toLocaleString() }}</td>
              <td>{{ r.mount }} ms</td><td>{{ r.expand }} ms</td><td>{{ r.collapse }} ms</td>
            </tr>
          </tbody>
        </table>
      </div>

      <q-hierarchy
        v-if="nodes"
        ref="tree"
        :key="runId"
        :columns="orgColumns"
        :data="nodes"
        node-key="id"
        :virtual-scroll="virtual"
        dense
        flat
        bordered
        class="qh-docs-table"
        style="height: 360px; overflow: auto"
      />
    </div>

    <doc-callout type="tip" title="Tips for big trees">
      Use <code>virtual-scroll</code> with a fixed height, pass data through <code>shallowRef</code> (or a plain array),
      and set <code>node-key</code>. For trees that are expensive to fetch, combine <code>lazy</code> nodes with <code>@lazy-load</code>.
    </doc-callout>
  </doc-page>
</template>

<script setup>
import { nextTick, ref, shallowRef, useTemplateRef } from 'vue'
import DocCallout from '@/components/DocCallout.vue'
import DocPage from '@/components/DocPage.vue'
import { makeOrgTree, orgColumns } from '../../examples/big-data.js'

const sizes = [1000, 10000, 100000]
const target = ref(10000)
const virtual = ref(true)
const running = ref(false)
const results = ref([])
const nodes = shallowRef(null)
const runId = ref(0)
const tree = useTemplateRef('tree')

const techniques = [
  ['Visible-rows flattening', 'Collapsed branches are never walked; one pass builds the rows to render.'],
  ['No data mutation', 'Your nodes are never written to, so reactive data does not trigger re-render loops.'],
  ['Stable row keys', 'Expanding inserts rows instead of re-patching every row below.'],
  ['Event delegation', 'One click / keydown listener on the table, not one per row.'],
  ['Lightweight toggle', 'A native button with inline SVG instead of a QBtn component per row.'],
  ['Row memoisation', 'With plain data and no row slots, unchanged rows are reused as-is on re-render.'],
  ['Lazy sorting', 'Only the sibling lists that are visible get sorted, with keys computed once per node.'],
  ['Single-pass filtering', 'One post-order walk finds matches and the ancestors to keep and expand.'],
  ['Virtual scrolling', 'Opt in to render only the rows in view (QVirtualScroll).'],
  ['Roving tabindex', 'Keyboard focus moves through the DOM without re-rendering.']
]

const frame = () => new Promise(resolve => nextTick(() => requestAnimationFrame(() => setTimeout(resolve, 0))))

async function time (fn) {
  const start = performance.now()
  fn()
  await frame()
  return Math.round(performance.now() - start)
}

async function run () {
  running.value = true
  const { nodes: tree0, count } = makeOrgTree(target.value)
  nodes.value = null
  await frame()

  runId.value++
  const mount = await time(() => { nodes.value = tree0 })
  const expand = await time(() => tree.value.expandAll())
  const rows = tree.value.getVisibleRows().length
  const collapse = await time(() => tree.value.collapseAll())

  results.value = [{ nodes: count, mode: virtual.value ? 'virtual' : 'all rows', rows, mount, expand, collapse }, ...results.value].slice(0, 6)
  running.value = false
}
</script>

<style lang="scss">
.bench {
  margin-bottom: 1.5rem;
  padding: 18px;
}
</style>
