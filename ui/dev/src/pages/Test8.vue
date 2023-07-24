<template>
  <q-page class="q-pa-sm">
    <q-hierarchy dense :columns="columns" :data="data" @sort_column="test($event)" :classes="classes" :dark="dark"
                 :expand_on_row_click="true" footer_text="Copyright 2023 @ Pratik Patel" footer_class="text-right">

      <template v-slot:header="props">
        <th v-for="col in props.columns" @click="col.sortable?props.sortBy(col):null" :class="'text-'+col.align">
          {{ col.label }}
          <q-icon v-if="col.sorted" :name="col.sortDirection=='asc'?'arrow_upward':'arrow_downward'"></q-icon>
        </th>
      </template>

      <template v-slot:footer="props">
        <td :colspan="columns.length">Footer Text</td>
      </template>
    </q-hierarchy>
  </q-page>
</template>

<script>
import {defineComponent, ref} from 'vue'

const columns = [
  {
    name: 'label',
    label: 'Label',
    align: 'left',
    field: 'label',
    // (optional) tell QHierarchy you want this column sortable
    sortable: true
  },
  {
    name: 'Description',
    label: 'Description',
    sortable: true,
    field: 'description',
    align: 'center'
  },
  {
    name: 'note',
    label: 'Note',
    sortable: true,
    field: 'note',
    align: 'left'
  }
];
const data = ref([
  {
    label: "Node 1",
    description: "Node 1 description",
    note: "Node 1 note",
    // id: 1,
    children: [
      {
        label: "Node 1.1",
        description: "Node 1.1 description",
        note: "Node 1.1 note",
        // id: 2
      },
      {
        label: "Node 1.2",
        description: "Node 1.2 description",
        note: "Node 1.2 note",
        // id: 3,
        children: [
          {
            label: "Node 1.2.1",
            description: "Node 1.2.1 description",
            note: "Node 1.2.1 note",
            // id: 4
          },
          {
            label: "Node 1.2.2",
            description: "Node 1.2.2 description",
            note: "Node 1.2.2 note",
            // id: 5
          }
        ],
      }
    ],
  },
  {
    label: "Node 2",
    description: "Node 2 description",
    note: "Node 2 note",
    // id: 6,
    children: [
      {
        label: "Node 2.1",
        description: "Node 2.1 description",
        note: "Node 2.1 note",
        // id: 7,
        children: [
          {
            label: "Node 2.1.1",
            description: "Node 2.1.1 description",
            note: "Node 2.1.1 note",
            // id: 8
          },
          {
            label: "Node 2.1.2",
            description: "Node 2.1.2 description",
            note: "Node 2.1.2 note",
            // id: 9
          }
        ],
      },
      {
        label: "Node 2.2",
        description: "Node 2.2 description",
        note: "Node 2.2 note",
        // id: 10
      }
    ],
  }
]);
export default defineComponent({
  name: "Test6",
  setup() {
    return {
      columns,
      data,
      classes: ref('bg-deep-purple-10'),
      dense: ref(false),
      dark: ref(true),
    }
  },
  methods: {
    test(data) {
      console.log(data)
    }
  }
})
</script>
