<template>
  <q-hierarchy :columns="columns" :data="data" dense flat bordered class="qh-docs-table">
    <template #body="props">
      <td>
        <div :style="props.setPadding(props.item)" class="row items-center no-wrap">
          <q-btn
            v-if="props.iconName(props.item) !== 'done'"
            :icon="props.iconName(props.item)"
            flat
            dense
            round
            size="sm"
            @click="props.toggle(props.item)"
          />
          <span :class="props.hasChildren ? 'q-ml-xs text-weight-medium' : 'q-ml-lg'">{{ props.item.name }}</span>
        </div>
      </td>
      <td>
        <q-chip square dense size="sm" :color="props.item.kind === 'Folder' ? 'grey-9' : 'grey-3'" :text-color="props.item.kind === 'Folder' ? 'white' : 'grey-9'">
          {{ props.item.kind }}
        </q-chip>
      </td>
      <td class="text-right">{{ formatSize(props.item.size) }}</td>
      <td class="text-right">{{ formatDate(props.item.modified) }}</td>
    </template>
  </q-hierarchy>
</template>

<script setup>
import { columns, data, formatDate, formatSize } from './sample-data.js'
</script>
