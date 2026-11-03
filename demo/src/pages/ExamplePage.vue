<template>
  <doc-page
    v-if="example"
    :key="example.slug"
    :title="example.title"
    :lead="example.description"
    :badge="example.isNew ? 'New in v2' : undefined"
    :source="`examples/${example.file}.vue`"
  >
    <example-card :file="example.file" :extra="example.extra" />

    <template v-if="example.extra && example.extra.length">
      <p class="qh-secondary" style="font-size: 14px">
        This example imports <code>{{ example.extra.join(', ') }}</code>. Open the <b>Code</b> tab to see it.
      </p>
    </template>

    <h2 id="related">Related</h2>
    <ul>
      <li><router-link to="/docs/api">API reference</router-link>: every prop, slot, event and method</li>
      <li><router-link to="/docs/data-and-columns">Data &amp; columns</router-link>: nested vs flat data, node keys</li>
    </ul>
  </doc-page>
  <not-found-page v-else />
</template>

<script setup>
import { computed } from 'vue'
import DocPage from '@/components/DocPage.vue'
import ExampleCard from '@/components/ExampleCard.vue'
import NotFoundPage from './NotFoundPage.vue'
import { examples } from '../docs/nav.js'

const props = defineProps({ slug: { type: String, required: true } })

const example = computed(() => examples.find(e => e.slug === props.slug))
</script>
