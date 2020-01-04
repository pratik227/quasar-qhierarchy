<template>
  <q-card :class="!$q.dark.isActive?'my-lg q-pa-md q-ma-sm bg-grey-2':'my-lg q-pa-md q-ma-sm bg-grey-8'">
    <q-toolbar>
      <q-ribbon
        position="left"
        color="rgba(0,0,0,.58)"
        background-color="#c0c0c0"
        leaf-color="#a0a0a0"
        leaf-position="bottom"
        decoration="rounded-out"
      >
        <q-toolbar-title
          class="example-title"
          style="padding: 5px 20px;"
        ><span class="ellipsis">Slot Demo</span></q-toolbar-title>
      </q-ribbon>
    </q-toolbar>
    <q-card-section class="q-pb-sm">
      <code-tabs :tagParts="tagParts"></code-tabs>
    </q-card-section>
    <q-card-section>
      <q-hierarchy dense :columns="columns" :data="data" :classes="classes" :dark="dark">
        <template v-slot:body="props">
          <td data-th="Name">
            <div v-bind:style="props.setPadding(props.item)"
                 :class="props.iconName(props.item)!='done'?'q-pl-lg':''">
              <q-btn @click="props.toggle(props.item)" v-if="props.iconName(props.item)!='done'"
                     :icon="props.iconName(props.item)" flat
                     dense>
              </q-btn>
              <span class="q-ml-sm">{{props.item.label}}</span>
            </div>
          </td>
          <td class="text-center">{{props.item.description}}</td>
          <td class="text-left">
            <q-chip color="lime-9" v-if="props.item.note" square size="sm" class="text-white">
              {{props.item.note}}
            </q-chip>
          </td>
        </template>
      </q-hierarchy>
    </q-card-section>
  </q-card>
</template>

<script>
    import CodeTabs from "../components/CodeTabs";


    export default {
        name: "SlotDemo",
        data() {
            return {
                filterString: 'Sub-Value Test',
                classes: 'bg-deep-purple-10',
                dense: false,
                dark: true,
                columns: [
                    {
                        name: 'label',
                        required: true,
                        label: 'Label',
                        align: 'left',
                        field: 'label',
                        // (optional) tell QHierarchy you want this column sortable
                        sortable: true,
                        // If you want different sorting icon
                        filterable: true
                    },
                    {
                        name: 'Description',
                        label: 'Description',
                        sortable: true,
                        field: 'description',
                        align: 'center',
                        filterable: false
                    },
                    {
                        name: 'note',
                        label: 'Note',
                        sortable: true,
                        field: 'note',
                        align: 'left',
                        filterable: false
                    }
                ],
                data: [
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
                ],
            }
        },
        components: {CodeTabs},
        props: {
            tagParts: {
                type: Object,
                default: () => {
                }
            }
        },
    }
</script>
