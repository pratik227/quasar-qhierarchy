<template>
  <q-page class="q-pa-md text-grey-7 shadow-2">
    <q-markdown :src="markdown"/>
    <json-api-viewer
      title="QHierarchy API"
      :json="json"
    />

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn
        fab
        icon="keyboard_arrow_up"
        :class="{ 'text-black bg-grey-4': $q.dark.isActive, 'text-white bg-primary': !$q.dark.isActive }"
      />
    </q-page-scroller>
  </q-page>
</template>

<script>

    import markdown from '../markdown/qhierarchy.md'

    export default {
        name: 'PageIndex',
        data() {
            return {
                markdown: markdown,
                json: {
                    "props": {
                        "dense": {
                            "extends": "dense",
                            "type": "boolean",
                            "desc": "Dense mode; occupies less space",
                            "category": "style"
                        },

                        "dark": {
                            "extends": "dark",
                            "type": "boolean",
                            "desc": "Notify the component that the background is a dark color",
                            "category": "style"

                        },

                        "flat": {
                            "extends": "flat",
                            "type": "boolean",
                            "desc": "Applies a 'flat' design (no default shadow)",
                            "category": "style"
                        },

                        "bordered": {
                            "extends": "bordered",
                            "type": "boolean",
                            "desc": "Applies a default border to the component",
                            "category": "style"
                        },

                        "square": {
                            "extends": "square",
                            "type": "boolean",
                            "desc": "Removes border-radius so borders are squared",
                            "category": "style"
                        },

                        "separator": {
                            "type": "String",
                            "desc": "Use a separator/border between rows, columns or all cells",
                            "default": "horizontal",
                            "values": ["horizontal", "vertical", "cell", "none"],
                            "examples": ["cell"],
                            "category": "content"
                        }
                    },

                    "slots": {
                        "body": {
                            "extends": "default",
                            "desc":"Slot to define how a body row looks like; Suggestion: tr + td"
                        }
                    },
                    "General": {
                        "data": {
                            "type": "Array",
                            "desc":"Rows of data to display",
                            "examples": [":data=\"myData\""],
                        },
                        "columns": {
                            "type": "Array",
                            "desc":"The column definitions (Array of Objects)\n",
                            "examples": [":columns=\"tableColumns\""],
                        }
                    }
                }

            }
        },
    }
</script>

<style>
</style>
