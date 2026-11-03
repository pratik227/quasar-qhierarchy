<template>
  <q-hierarchy
    :columns="columns"
    :data="data"
    node-key="id"
    flat
    bordered
    class="qh-docs-table"
    @lazy-load="onLazyLoad"
  />
</template>

<script setup>
const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'items', label: 'Items', field: 'items', align: 'right' }
]

// `lazy: true` shows an expand toggle even though there are no children yet
const data = [
  { id: 'a', name: 'Fast folder (400 ms)', items: 3, lazy: true },
  { id: 'b', name: 'Slow folder (1.5 s)', items: 5, lazy: true },
  { id: 'c', name: 'Empty folder', items: 0, lazy: true },
  { id: 'd', name: 'Broken folder (fails, retry by expanding again)', items: '?', lazy: true }
]

// stands in for an API call
function fetchChildren (node) {
  const delay = node.id === 'b' ? 1500 : 400
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (node.id === 'd') return reject(new Error('Network error'))
      resolve(Array.from({ length: node.items }, (_, i) => ({
        id: `${node.id}.${i + 1}`,
        name: `${node.name.split(' (')[0]} / item ${i + 1}`,
        items: i === 0 ? 2 : '—',
        lazy: i === 0 // nested lazy level
      })))
    }, delay)
  })
}

async function onLazyLoad ({ node, done, fail }) {
  try {
    done(await fetchChildren(node))
  }
  catch {
    fail()
  }
}
</script>
