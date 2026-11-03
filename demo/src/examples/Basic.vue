<template>
  <q-hierarchy
    :columns="columns"
    :data="data"
    flat
    bordered
    class="qh-docs-table"
  />
</template>

<script setup>
const columns = [
  { name: 'label', label: 'Label', field: 'label', align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'left', sortable: true },
  { name: 'note', label: 'Note', field: 'note', align: 'left', sortable: true }
]

const data = [
  {
    label: 'Node 1',
    description: 'Node 1 description',
    note: 'Node 1 note',
    children: [
      { label: 'Node 1.1', description: 'Node 1.1 description', note: 'Node 1.1 note' },
      {
        label: 'Node 1.2',
        description: 'Node 1.2 description',
        note: 'Node 1.2 note',
        children: [
          { label: 'Node 1.2.1', description: 'Node 1.2.1 description', note: 'Node 1.2.1 note' },
          { label: 'Node 1.2.2', description: 'Node 1.2.2 description', note: 'Node 1.2.2 note' }
        ]
      }
    ]
  },
  {
    label: 'Node 2',
    description: 'Node 2 description',
    note: 'Node 2 note',
    children: [
      {
        label: 'Node 2.1',
        description: 'Node 2.1 description',
        note: 'Node 2.1 note',
        children: [
          { label: 'Node 2.1.1', description: 'Node 2.1.1 description', note: 'Node 2.1.1 note' },
          { label: 'Node 2.1.2', description: 'Node 2.1.2 description', note: 'Node 2.1.2 note' }
        ]
      },
      { label: 'Node 2.2', description: 'Node 2.2 description', note: 'Node 2.2 note' }
    ]
  }
]
</script>
