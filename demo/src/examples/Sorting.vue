<template>
  <div>
    <p class="qh-secondary q-mt-none q-mb-md" style="font-size: 14px">
      Click a header to sort. Sorted by <b>{{ lastSort }}</b>
    </p>
    <q-hierarchy
      :columns="columns"
      :data="data"
      node-key="id"
      :default-expand-level="1"
      flat
      bordered
      class="qh-docs-table"
      @sort_column="col => (lastSort = `${col.label} (${col.sortDirection})`)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { columns as baseColumns, data } from './sample-data.js'

// text, number (size) and date (modified) come from sample-data.js;
// "Type" gets a custom comparator: folders first, then alphabetical
const columns = baseColumns.map(col => col.name !== 'kind'
  ? col
  : {
      ...col,
      sortingType: 'custom',
      sortingFunc: (a, b) =>
        (a.kind === 'Folder' ? 0 : 1) - (b.kind === 'Folder' ? 0 : 1) || a.kind.localeCompare(b.kind)
    })

const lastSort = ref('nothing yet')
</script>
