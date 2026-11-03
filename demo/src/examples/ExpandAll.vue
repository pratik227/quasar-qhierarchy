<template>
  <div>
    <div class="example-toolbar">
      <div class="segmented">
        <button type="button" :class="{ active: mode === 'all' }" @click="mode = 'all'">default-expand-all</button>
        <button type="button" :class="{ active: mode === 'level' }" @click="mode = 'level'">default-expand-level="1"</button>
      </div>
    </div>

    <!-- :key re-creates the table so the default applies again -->
    <q-hierarchy
      :key="mode"
      :columns="columns"
      :data="data"
      node-key="id"
      :default-expand-all="mode === 'all'"
      :default-expand-level="mode === 'level' ? 1 : 0"
      dense
      flat
      bordered
      class="qh-docs-table"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { columns, data } from './sample-data.js'

const mode = ref('all')
</script>
