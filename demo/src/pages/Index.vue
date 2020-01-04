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
  .page-header {
    position: relative;
    color: #fff;
    text-align: center;
    background-color: #00f;
    background-image: linear-gradient(120deg, #00f, red)
  }


  .project-name {
    font-size: 4.25rem
  }

  .byline {
    left: 0
  }

  btn {
    display: inline-block;
    margin-bottom: 1rem;
    color: hsla(0, 0%, 100%, 0.7);
    background-color: hsla(0, 0%, 100%, 0.08);
    border-color: hsla(0, 0%, 100%, 0.2);
    border-style: solid;
    border-width: 1px;
    border-radius: 0.3rem;
    transition: color 0.2s, background-color 0.2s, border-color 0.2s
  }
</style>
