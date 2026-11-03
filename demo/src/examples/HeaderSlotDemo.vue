<template>
  <q-hierarchy :columns="columns" :data="data" node-key="id" flat bordered class="qh-docs-table">
    <template #header="props">
      <th
        v-for="col in props.columns"
        :key="col.name"
        :class="['text-' + col.align, col.sortable ? 'cursor-pointer' : '']"
        class="text-weight-bold"
        @click="col.sortable && props.sortBy(col)"
      >
        {{ col.label.toUpperCase() }}
        <span v-if="col.sorted" class="q-ml-xs">{{ col.sortDirection === 'asc' ? '↑' : '↓' }}</span>
      </th>
    </template>
  </q-hierarchy>
</template>

<script setup>
import { columns, data } from './sample-data.js'
</script>
