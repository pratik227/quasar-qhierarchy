<template>
  <div>
    <div class="example-toolbar">
      <div class="segmented">
        <button v-for="size in sizes" :key="size" type="button" :class="{ active: target === size }" @click="generate(size)">
          {{ size.toLocaleString() }} nodes
        </button>
      </div>
      <button type="button" class="qh-btn qh-btn--outline qh-btn--sm" @click="measure(() => tree.expandAll())">Expand all</button>
      <button type="button" class="qh-btn qh-btn--outline qh-btn--sm" @click="measure(() => tree.collapseAll())">Collapse all</button>
      <input v-model="filter" class="qh-input" style="max-width: 200px; height: 32px" type="search" placeholder="Filter…" aria-label="Filter">
    </div>

    <q-hierarchy
      ref="tree"
      :columns="orgColumns"
      :data="nodes"
      node-key="id"
      :filter="filter"
      virtual-scroll
      dense
      flat
      bordered
      class="qh-docs-table"
      style="height: 440px"
    />

    <p class="qh-secondary q-mt-md q-mb-none qh-tabular" style="font-size: 13px">
      {{ count.toLocaleString() }} nodes ·
      {{ visibleRows.toLocaleString() }} visible rows ·
      last update {{ lastMs }}
    </p>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, shallowRef, useTemplateRef } from 'vue'
import { makeOrgTree, orgColumns } from './big-data.js'

const sizes = [1000, 10000, 100000]
const tree = useTemplateRef('tree')
const target = ref(10000)
// shallowRef: the component never needs deep reactivity on the nodes
const nodes = shallowRef([])
const count = ref(0)
const filter = ref('')
const visibleRows = ref(0)
const lastMs = ref('—')

function measure (fn) {
  const start = performance.now()
  fn()
  nextTick(() => requestAnimationFrame(() => {
    lastMs.value = Math.round(performance.now() - start) + ' ms'
    visibleRows.value = tree.value.getVisibleRows().length
  }))
}

function generate (size) {
  target.value = size
  const result = makeOrgTree(size)
  count.value = result.count
  measure(() => { nodes.value = result.nodes })
}

onMounted(() => generate(target.value))
</script>
