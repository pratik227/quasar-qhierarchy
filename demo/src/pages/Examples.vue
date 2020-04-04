<template>
    <q-page>
    <div class="q-markdown">
      <basic :tag-parts="getTagParts(require('!!raw-loader!../examples/Basic.vue').default)"></basic>
      <custom :tag-parts="getTagParts(require('!!raw-loader!../examples/Custom.vue').default)"></custom>
      <slot-demo :tag-parts="getTagParts(require('!!raw-loader!../examples/SlotDemo.vue').default)"></slot-demo>
      <default-expand-all :tag-parts="getTagParts(require('!!raw-loader!../examples/DefaultExpandAll.vue').default)"></default-expand-all>
    </div>
    </q-page>
</template>

<script>
    import Basic from "../examples/Basic";
    import Custom from "../examples/Custom";
    import SlotDemo from "../examples/SlotDemo";
    import { getTagParts } from '@quasar/quasar-ui-qmarkdown'
    import DefaultExpandAll from "../examples/DefaultExpandAll";


    export default {
        name: "Examples",
        components: {DefaultExpandAll, SlotDemo, Custom, Basic},
        data() {
            return {
                filterString: 'Sub-Value Test',
                separator: 'horizontal',
                classes: '',
                dense: false,
                dark: false,
                bordered: false,
                square: false,
                flat: false,
                columns: [
                    {
                        name: 'name',
                        required: true,
                        label: 'Name',
                        align: 'left',
                        field: 'name',
                        sortable: true,
                        sortDirection: 'asc',
                        sortingIcon: 'arrow_upward',
                    },
                    {
                        name: 'Description', label: 'Description',
                        sortable: true, field: 'description', align: 'right',
                        sortDirection: 'asc',
                        sortingIcon: 'arrow_upward',
                        sorted: false,
                    },
                    {
                        name: 'Account',
                        label: 'Account',
                        sortable: true,
                        field: 'niif_account',
                        sortDirection: 'asc',
                        sortingIcon: 'arrow_upward',
                        align: 'right',
                        sorted: false,
                    },
                    {
                        name: 'action',
                        sortable: false, label: 'Action', field: 'action', align: 'right',
                        sorted: false
                    }
                ],
                data: [
                    {
                        children: [{
                            children: [{
                                children: [
                                    {
                                        children: [
                                            {
                                                children: [],
                                                name: "Sub-Value",
                                                niif_account: "36565",
                                                id: 9,
                                                description: "sub-description"
                                            }
                                        ],
                                        name: "Sub-Value Test",
                                        niif_account: "36585",
                                        id: 8,
                                        description: "sub-description"
                                    }
                                ],
                                // level: 3,
                                name: "Sub-Value",
                                niif_account: "36565",
                                id: 4,
                                description: "sub-description"
                            }],
                            name: "Sub-Value 1",
                            niff_account: "123567",
                            id: 2,
                            description: "sub-description value 1"
                        }],
                        name: "Value 1",
                        niff_account: "",
                        id: 1,
                        description: "description value 1"
                    },
                    {
                        children: [{
                            children: [{
                                children: [
                                    {
                                        children: [
                                            {
                                                children: [],
                                                name: "Sub-Value",
                                                niif_account: "36565",
                                                id: 19,
                                                description: "sub-description"
                                            }
                                        ],
                                        name: "Sub-Value",
                                        niif_account: "36565",
                                        id: 18,
                                        description: "sub-description"
                                    }
                                ],
                                name: "Sub-Value",
                                niif_account: "36565",
                                id: 14,
                                description: "sub-description"
                            }],
                            name: "Sub-Value 1",
                            niff_account: "123567",
                            id: 12,
                            description: "sub-description value 1"
                        }],
                        name: "Value 2",
                        niff_account: "",
                        id: 11,
                        description: "description value 2"
                    }
                ],
            }
        },
        methods: {
            getTagParts
        }
    }
</script>

<style scoped>

</style>
