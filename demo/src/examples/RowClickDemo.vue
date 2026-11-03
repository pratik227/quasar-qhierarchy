<template>
  <div>
    <q-hierarchy
      :columns="columns"
      :data="data"
      node-key="id"
      expand-on-row-click
      flat
      bordered
      class="qh-docs-table"
      @row-click="(evt, node) => (clicked = node.name)"
    />
    <p class="qh-secondary q-mt-md q-mb-none" style="font-size: 13px">
      Last row clicked: <b>{{ clicked || '—' }}</b>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { columns, data } from './sample-data.js'

const clicked = ref('')
</script>
