<template>
  <section class="example-card" :id="anchor">
    <header v-if="title || description" class="example-card__head">
      <div>
        <h3 v-if="title" class="example-card__title">{{ title }}</h3>
        <p v-if="description" class="example-card__desc">{{ description }}</p>
      </div>
    </header>

    <div class="example-card__frame">
      <div class="example-card__toolbar">
        <div class="segmented" role="tablist" aria-label="View">
          <button type="button" role="tab" :aria-selected="view === 'preview'" :class="{ active: view === 'preview' }" @click="view = 'preview'">Preview</button>
          <button type="button" role="tab" :aria-selected="view === 'code'" :class="{ active: view === 'code' }" @click="showCode">Code</button>
        </div>
        <a class="example-card__link" :href="githubUrl" target="_blank" rel="noopener">
          <app-icon name="github" :size="14" />
          <span class="gt-xs">View source</span>
        </a>
      </div>

      <div v-show="view === 'preview'" class="example-card__preview">
        <component :is="component" v-if="component" />
        <div v-else class="example-card__loading">Loading example…</div>
      </div>

      <div v-if="view === 'code'" class="example-card__code">
        <code-block v-if="files.length" :files="files" flush max-height="560px" />
        <div v-else class="example-card__loading">Loading source…</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue'
import AppIcon from './AppIcon.js'
import CodeBlock from './CodeBlock.vue'
import { GITHUB_SOURCE } from '../docs/nav.js'

const components = import.meta.glob('../examples/*.vue')
const vueSources = import.meta.glob('../examples/*.vue', { query: '?raw', import: 'default' })
const jsSources = import.meta.glob('../examples/*.js', { query: '?raw', import: 'default' })

const props = defineProps({
  file: { type: String, required: true },
  title: String,
  description: String,
  extra: { type: Array, default: () => [] }
})

const view = ref('preview')
const files = shallowRef([])

const anchor = computed(() => 'example-' + props.file.toLowerCase())
const githubUrl = computed(() => `${GITHUB_SOURCE}/examples/${props.file}.vue`)

const component = computed(() => {
  const loader = components[`../examples/${props.file}.vue`]
  return loader !== undefined ? defineAsyncComponent(loader) : null
})

async function showCode () {
  view.value = 'code'
  if (files.value.length > 0) return

  const main = await vueSources[`../examples/${props.file}.vue`]()
  const extra = await Promise.all(props.extra.map(async name => ({
    label: name,
    lang: 'js',
    code: await jsSources[`../examples/${name}`]()
  })))
  files.value = [{ label: props.file + '.vue', lang: 'vue', code: main }, ...extra]
}
</script>

<style lang="scss">
.example-card {
  margin: 0 0 2.5rem;
  scroll-margin-top: 116px;

  &__title {
    margin: 0 0 .25rem !important;
  }

  &__desc {
    margin: 0 0 1rem !important;
    color: var(--qh-text-secondary);
    font-size: 15px;
  }

  &__frame {
    border: 1px solid var(--qh-border);
    border-radius: var(--qh-radius-lg);
    background: var(--qh-bg-elevated);
    overflow: hidden;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 8px;
    border-bottom: 1px solid var(--qh-border);
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: var(--qh-radius-sm);
    color: var(--qh-text-secondary) !important;
    font-size: 13px !important;
    font-weight: 500;
    text-decoration: none !important;

    &:hover {
      background: var(--qh-bg-muted);
      color: var(--qh-text) !important;
    }
  }

  &__preview {
    padding: 28px;
    background-color: var(--qh-bg-subtle);
    background-image: radial-gradient(var(--qh-border) 1px, transparent 1px);
    background-size: 16px 16px;
    line-height: 1.5;

    @media (max-width: 599px) {
      padding: 14px;
    }
  }

  &__loading {
    padding: 24px;
    color: var(--qh-text-muted);
    font-size: 14px;
  }
}

.segmented {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: 9999px;
  background: var(--qh-bg-muted);

  button {
    height: 28px;
    padding: 0 14px;
    border: 0;
    border-radius: 9999px;
    background: transparent;
    color: var(--qh-text-secondary);
    font: 500 13px var(--qh-font);
    cursor: pointer;
    transition: background-color .15s ease, color .15s ease;

    &:hover {
      color: var(--qh-text);
    }

    &.active {
      background: var(--qh-bg-elevated);
      color: var(--qh-text);
      box-shadow: var(--qh-shadow-sm), 0 0 0 1px var(--qh-border);
    }
  }
}

// controls rendered by examples (search box, button rows)
.example-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
</style>
