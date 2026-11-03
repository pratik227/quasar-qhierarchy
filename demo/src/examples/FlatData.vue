<template>
  <q-hierarchy
    :columns="columns"
    :data="rows"
    node-key="id"
    parent-key="managerId"
    default-expand-all
    flat
    bordered
    class="qh-docs-table"
  />
</template>

<script setup>
const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'title', label: 'Title', field: 'title', align: 'left' },
  { name: 'location', label: 'Location', field: 'location', align: 'left' }
]

// exactly what a SQL query or REST endpoint usually returns:
// one flat list, every row pointing at its parent
const rows = [
  { id: 1, managerId: null, name: 'Grace Okafor', title: 'CEO', location: 'London' },
  { id: 2, managerId: 1, name: 'Arjun Mehta', title: 'CTO', location: 'Bengaluru' },
  { id: 3, managerId: 1, name: 'Lena Weber', title: 'COO', location: 'Berlin' },
  { id: 4, managerId: 2, name: 'Kenji Tanaka', title: 'Head of Platform', location: 'Tokyo' },
  { id: 5, managerId: 2, name: 'Mia Rossi', title: 'Head of Design', location: 'Milan' },
  { id: 6, managerId: 4, name: 'Omar Haddad', title: 'Staff Engineer', location: 'Dubai' },
  { id: 7, managerId: 4, name: 'Zoe Larsen', title: 'Engineer', location: 'Oslo' },
  { id: 8, managerId: 3, name: 'Mateo Silva', title: 'Operations Lead', location: 'Lisbon' },
  { id: 9, managerId: 5, name: 'Priya Shah', title: 'Product Designer', location: 'Toronto' }
]
</script>
