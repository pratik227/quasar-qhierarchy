<template>
  <div>
    <div class="example-toolbar">
      <button type="button" class="qh-btn qh-btn--outline qh-btn--sm" @click="tree.expandAll()">Expand all</button>
      <button type="button" class="qh-btn qh-btn--outline qh-btn--sm" @click="tree.collapseAll()">Collapse all</button>
      <button type="button" class="qh-btn qh-btn--outline qh-btn--sm" @click="tree.expandToLevel(1)">Level 1</button>
      <button type="button" class="qh-btn qh-btn--outline qh-btn--sm" @click="expanded = ['docs', 'docs/images']">Open “docs/images”</button>
    </div>

    <q-hierarchy
      ref="tree"
      v-model:expanded="expanded"
      :columns="columns"
      :data="data"
      node-key="id"
      flat
      bordered
      class="qh-docs-table"
    />

    <p class="qh-secondary q-mt-md q-mb-none" style="font-size: 13px">
      v-model:expanded = <code>{{ JSON.stringify(expanded) }}</code>
    </p>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { columns, data } from './sample-data.js'

const tree = useTemplateRef('tree')
const expanded = ref(['src'])
</script>
