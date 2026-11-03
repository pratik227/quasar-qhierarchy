<template>
  <div>
    <div class="example-toolbar">
      <div class="segmented">
        <button type="button" :class="{ active: mode === 'multiple' }" @click="setMode('multiple')">multiple</button>
        <button type="button" :class="{ active: mode === 'strict' }" @click="setMode('strict')">multiple + strict</button>
        <button type="button" :class="{ active: mode === 'single' }" @click="setMode('single')">single</button>
      </div>
      <button type="button" class="qh-btn qh-btn--ghost qh-btn--sm" @click="selected = []">Clear</button>
    </div>

    <q-hierarchy
      v-model:selected="selected"
      :columns="columns"
      :data="data"
      node-key="id"
      :selection="mode === 'single' ? 'single' : 'multiple'"
      :strict-selection="mode === 'strict'"
      default-expand-all
      dense
      flat
      bordered
      class="qh-docs-table"
    />

    <p class="qh-secondary q-mt-md q-mb-none" style="font-size: 13px">
      {{ selected.length }} selected<span v-if="selected.length">: <code>{{ selected.join(', ') }}</code></span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { columns, data } from './sample-data.js'

const mode = ref('multiple')
const selected = ref(['src/components'])

function setMode (value) {
  mode.value = value
  selected.value = []
}
</script>
