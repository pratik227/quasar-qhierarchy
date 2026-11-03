<template>
  <q-hierarchy
    :columns="columns"
    :data="data"
    node-key="id"
    flat
    bordered
    class="qh-docs-table"
    :footer-text="`${data.length} items at the root`"
    footer-class="text-right qh-secondary"
  />
</template>

<script setup>
import { columns, data } from './sample-data.js'
</script>
