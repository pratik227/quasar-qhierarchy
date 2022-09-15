<template>
    <span>
        <q-markup-table :separator="separator" :dense="dense" :dark="dark" :flat="flat" :bordered="bordered"
                        :square="square" :class="classes">
            <thead>
            <tr>
                <th v-for="col in columns" @click="col.sortable?sortBy(col):null" :class="'text-'+col.align">
                    {{ col.label }}
                    <q-icon v-if="col.sorted" :name="col.sortDirection=='asc'?'arrow_upward':'arrow_downward'"></q-icon>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item ,index)  in (arrayTreeObj)" :key="index" v-if="hasDefaultSlot">
                <slot name="body" v-bind:item="item" v-bind:toggle="toggle" v-bind:setPadding="setPadding"
                      v-bind:iconName="iconName">
                </slot>
            </tr>
            <tr v-for="(item ,index)  in (arrayTreeObj)" :key="index" v-if="!hasDefaultSlot">

                <td data-th="Name" v-for="col,col_index in columns" :class="'text-'+col.align">
                    <div v-bind:style="col_index==0?setPadding(item):{'padding-left':'30px'}"
                         :class="iconName(item)!='done'?'q-pl-lg':''">
                        <q-btn @click="col_index==0?toggle(item):{}" v-if="iconName(item)!='done' && col_index==0"
                               :icon="iconName(item)" flat dense>
                        </q-btn>
                        <span class="q-ml-sm">{{ item[col.field] }}</span>
                    </div>
                </td>
            </tr>
            </tbody>
        </q-markup-table>
    </span>
</template>

<script>
import {defineComponent} from 'vue';
import {ref} from 'vue';

export default defineComponent({
  name: "QHierarchy",
  props: ['data', 'columns', 'separator', 'dense', 'dark', 'flat', 'bordered', 'square', 'classes', 'defaultExpandAll', 'filter'],
  setup() {
    return {
      leftDrawerOpen: ref(false),
      isExpanded: ref(true),
      selectedRowID: ref({}),
      itemId: ref(null),
      temp_data: ref([]),
      temp_index: ref(1),
      first_call: ref(false)
    }
  }, watch: {
    selectedIDRow: function (val) {
      if (this.selectedRowID != null) {
        this.$set(this.selectedRowID, "_index", val);
      }
    }
  },
  methods: {
    recursive(obj, newObj, level, itemId, isExpend, first_call) {
      let vm = this;
      obj.forEach(function (o) {
        if (o.children && o.children.length != 0) {
          o.level = level;
          o.leaf = false;
          o.sortDirection = "none";
          o.sorted = ref(false);
          o['_index'] = vm.temp_index;
          vm.temp_index = vm.temp_index + 1;
          if (first_call) {
            o.expend = true
          }
          newObj.push(o);
          if (o._index == itemId) {
            o.expend = isExpend;
          }
          if (o.expend == true) {
            vm.recursive(o.children, newObj, o.level + 1, itemId, isExpend, first_call);
          }
        } else {
          o.level = level;
          o.leaf = ref(true);
          o.sortDirection = "none";
          o.sorted = ref(false);
          o['_index'] = vm.temp_index;
          vm.temp_index = vm.temp_index + 1;
          newObj.push(o);
          return false;
        }
      });
    },
    iconName(item) {
      if (item.expend == true) {
        return "remove";
      }
      if (item.children && item.children.length > 0) {
        return "add";
      }
      return "done";
    },
    toggle(item) {
      let vm = this;
      vm.itemId = item._index;
      item.leaf = ref(false);
      //show  sub items after click on + (more)
      if (
          item.leaf == false &&
          item.expend == undefined &&
          item.children != undefined
      ) {
        if (item.children.length != 0) {
          vm.recursive(item.children, [], item.level + 1, item._index, item.expend, false);
        }
      }
      if (item.expend == true && item.children != undefined) {
        let __subindex = 0;
        item.children.forEach(function (o) {
          o.expend = undefined;
          vm.setUndefined(o)
        });
        item["expend"] = ref(undefined);
        item["leaf"] = ref(false);
        vm.itemId = null;
      }
    },
    setPadding(item) {
      return `padding-left: ${item.level * 30}px;`;
    },
    setUndefined(item) {
      let vm = this;
      if (item.hasOwnProperty('children') && item.children) {
        item.children.forEach(function (o) {
          o.expend = ref(undefined);
          vm.setUndefined(o)
        });
      }
    },
    sortBy(col) {
      if (col.sortDirection === "asc") {
        this.sort_recursive(this.data, col, true);
        col.sortDirection = "desc";
        col.arrow_downward = 'arrow_downward';
      } else {
        this.sort_recursive(this.data, col, false);
        col.sortDirection = "asc";
      }
      col.sorted = true;
      this.$emit('sort_column', col)
      this.resetSorting(col);
    },
    sort_recursive(elements, col, descending) {
      elements.sort(this.sort_by(col, descending));
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].hasOwnProperty('children')) {
          this.sort_recursive(elements[i].children, col, descending);
        }
      }
    },
    sort_by(col, descending) {
      let direction = !descending ? 1 : -1;
      if (col.sortingType === "custom" && typeof col.sortingFunc === "function") {
        return function (a, b) {
          return col.sortingFunc(a, b) * direction;
        };
      }
      let key = function (x) {
        if (!x.hasOwnProperty(col.field)) {
          return ""
        }
        return (x[col.field] === null ? "" : x[col.field].toLowerCase());
      };
      switch (col.sortingType) {
        case "number":
          key = function (x) {
            return parseFloat(x[col.field]);
          };
          break;
        case "date":
          key = function (x) {
            return new Date(x[col.field]);
          };
          break;
      }
      return function (a, b) {
        return a = key(a), b = key(b), direction * ((a > b) - (b > a));
      };
    },
    resetSorting(sortedCol) {
      let arraySize = this.columns.length;
      for (let i = 0; i < arraySize; i++) {
        let col = this.columns[i];
        if (col.field != sortedCol.field) {
          col.sorted = ref(false);
          col.sortDirection = "none";
        }
      }
    },
    filter_data(arr, filterString, expandingProperty, colDefinitions, expand) {
      let filtered = [];
      //only apply filter for strings 3 characters long or more
      if (!filterString || filterString.length < 3) {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (item.visible) {
            filtered.push(item);
          }
        }
      } else {
        let ancestorStack = [];
        let currentLevel = 0;
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          while (currentLevel >= item.level) {
            let throwAway = ancestorStack.pop();
            currentLevel--;
          }
          ancestorStack.push(item);
          currentLevel = item.level;
          if (this.include(item, filterString, expandingProperty, colDefinitions)) {
            for (let ancestorIndex = 0; ancestorIndex < ancestorStack.length; ancestorIndex++) {
              let ancestor = ancestorStack[ancestorIndex];
              if (ancestor.expend) {
                if (expand)
                  ancestor.expend = true;
                filtered.push(ancestor);
              }
            }
            filtered.push(item);
            ancestorStack = [];
          }
        }
      }
      console.log(filtered)
      return filtered;
    },
    include(item, filterString, expandingProperty, colDefinitions) {
      let includeItem = false;
      let filterApplied = false;
      //first check the expandingProperty
      filterApplied = true;
      if (this.checkItem(item, filterString, expandingProperty)) {
        includeItem = true;
      }
      //then check each of the other columns
      let arraySize = colDefinitions.length;
      for (let i = 0; i < arraySize; i++) {
        let col = colDefinitions[i];
        if (col.filterable) {
          filterApplied = true;
          if (this.checkItem(item, filterString, col)) {
            includeItem = true;
          }
        }
      }
      if (filterApplied) {
        return includeItem;
      } else {
        return true;
      }
    },
    checkItem(item, filterString, col) {
      if (col.sortingType === "number") {
        if (item[col.field] != null
            && parseFloat(item[col.field]) === parseFloat(filterString)) {
          return true;
        }
      } else {
        if (item[col.field] != null
            && item[col.field].toLowerCase().indexOf(filterString.toLowerCase()) !== -1) {
          return true;
        }
      }
    }
  },
  computed: {
    arrayTreeObj() {
      let vm = this;
      let newObj = [];
      this.temp_data = [];
      vm.temp_index = 1;
      vm.recursive(vm.data, newObj, 0, vm.itemId, vm.isExpanded, vm.first_call);
      vm.first_call = ref(false);
      if(this.filter && this.filter.length>=3){
        let data = this.filter_data(newObj, this.filter, true, this.columns)
        return data
      }
      return newObj;
    },
    hasDefaultSlot() {
      return this.$slots.hasOwnProperty("body");
    },
  },
  created() {
    if (this.defaultExpandAll) {
      this.first_call = ref(true)
    }
  }
})
</script>

<style scoped>

</style>
