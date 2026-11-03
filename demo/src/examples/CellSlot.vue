<template>
  <q-hierarchy
    :columns="columns"
    :data="data"
    node-key="id"
    :default-expand-level="1"
    flat
    bordered
    class="qh-docs-table"
  >
    <!-- the tree column keeps its indentation and toggle -->
    <template #cell-name="{ value, item }">
      <span :class="item.kind === 'Folder' ? 'text-weight-medium' : ''">{{ value }}</span>
    </template>

    <template #cell-kind="{ value }">
      <span class="kind-pill" :class="value === 'Folder' ? 'kind-pill--folder' : ''">{{ value }}</span>
    </template>

    <template #cell-size="{ value, rawValue }">
      <div class="row items-center justify-end no-wrap q-gutter-x-sm">
        <div class="size-bar"><div :style="{ width: Math.min(100, rawValue / 14) + '%' }" /></div>
        <span class="qh-tabular">{{ value }}</span>
      </div>
    </template>
  </q-hierarchy>
</template>

<script setup>
import { columns, data } from './sample-data.js'
</script>

<style>
.kind-pill {
  display: inline-block;
  padding: 1px 8px;
  border: 1px solid var(--qh-border);
  border-radius: 9999px;
  color: var(--qh-text-secondary);
  font-size: 12px;
}

.kind-pill--folder {
  background: var(--qh-bg-muted);
  color: var(--qh-text);
}

.size-bar {
  width: 64px;
  height: 4px;
  border-radius: 2px;
  background: var(--qh-bg-muted);
  overflow: hidden;
}

.size-bar > div {
  height: 100%;
  border-radius: 2px;
  background: var(--qh-text-secondary);
}
</style>
