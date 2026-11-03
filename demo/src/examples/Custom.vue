<template>
  <div class="q-gutter-y-lg">
    <q-hierarchy
      :columns="columns"
      :data="data"
      node-key="id"
      :default-expand-level="1"
      dense
      dark
      square
      separator="cell"
      expand-icon="chevron_right"
      collapse-icon="expand_more"
      :indent="20"
      classes="bg-grey-10 text-grey-3"
    />

    <q-hierarchy
      :columns="columns"
      :data="data"
      node-key="id"
      :default-expand-level="1"
      flat
      bordered
      separator="none"
      wrap-cells
      classes="custom-hierarchy"
    />
  </div>
</template>

<script setup>
import { columns, data } from './sample-data.js'
</script>

<style>
.custom-hierarchy {
  border-radius: 14px;
  background: linear-gradient(180deg, #fff7ed, #ffffff);
  color: #431407;
}

.body--dark .custom-hierarchy {
  background: linear-gradient(180deg, #2a1608, #151312);
  color: #fed7aa;
}

.custom-hierarchy thead th {
  color: #c2410c;
  font-weight: 600;
}
</style>
