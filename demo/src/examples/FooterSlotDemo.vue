<template>
  <q-hierarchy :columns="columns" :data="data" node-key="id" flat bordered class="qh-docs-table">
    <template #footer="{ rows }">
      <td class="text-weight-medium">{{ rows.length }} visible rows</td>
      <td />
      <td class="text-right text-weight-medium qh-tabular">{{ formatSize(total(rows)) }}</td>
      <td />
    </template>
  </q-hierarchy>
</template>

<script setup>
import { columns, data, formatSize } from './sample-data.js'

// only count leaves, so folders aren't added twice
const total = rows => rows.filter(row => !row.hasChildren).reduce((sum, row) => sum + row.node.size, 0)
</script>
