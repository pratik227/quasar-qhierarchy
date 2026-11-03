<template>
  <div>
    <div class="example-toolbar">
      <input v-model="filter" class="qh-input" style="max-width: 320px" type="search" placeholder="Search name or type (3+ characters)" aria-label="Search">
      <label class="row items-center q-gutter-x-xs qh-secondary" style="font-size: 13px">
        <input v-model="keepDescendants" type="checkbox"> <span>filter-keep-descendants</span>
      </label>
    </div>

    <q-hierarchy
      :columns="columns"
      :data="data"
      node-key="id"
      :filter="filter"
      :filter-keep-descendants="keepDescendants"
      flat
      bordered
      class="qh-docs-table filter-demo"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { columns, data } from './sample-data.js'

// columns with `filterable: true` (name and type) are searched
const filter = ref('vue')
const keepDescendants = ref(false)
</script>

<style>
/* rows that match get .q-hierarchy__row--match; ancestors shown for context don't */
.filter-demo .q-hierarchy__row:not(.q-hierarchy__row--match) td {
  color: var(--qh-text-muted);
}
</style>
