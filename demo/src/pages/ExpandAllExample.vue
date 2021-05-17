<template>
  <q-page>
    <div :class="($q.platform.is.mobile ? '' : 'q-mx-xl')">

      <div class="markdown-nav-bar shadow-10">
        <div class="title">
          <span class="ellipsis">{{ title }}</span>
        </div>
      </div>

      <example-viewer
        title="QHierarchy Default Expand All"
        file="ExpandAll"
      />

      <page-footer></page-footer>

    </div>
  </q-page>
</template>

<script>
import {defineComponent, ref} from 'vue'
import {defineAsyncComponent} from 'vue'


const year = (new Date()).getFullYear()

import {
  mdiCharity
} from '@quasar/extras/mdi-v5'
export default defineComponent({
  name: "ExpandAllExample",
  setup(){
    return{
      title:'QHierarchy Default Expand All',
      year,
      mdiCharity
    }
  },
  components:{
    PageFooter: defineAsyncComponent(() => import('components/PageFooter')),
  }
})
</script>

<style scoped>

</style>
