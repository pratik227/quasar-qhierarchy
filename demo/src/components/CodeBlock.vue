<template>
  <div class="code-block" :class="{ 'code-block--flush': flush }">
    <div v-if="hasHeader" class="code-block__header">
      <div class="code-block__tabs" role="tablist">
        <template v-if="tabs.length > 1">
          <button
            v-for="(tab, i) in tabs"
            :key="tab.label"
            type="button"
            role="tab"
            class="code-block__tab"
            :class="{ 'code-block__tab--active': i === active }"
            :aria-selected="i === active"
            @click="active = i"
          >{{ tab.label }}</button>
        </template>
        <span v-else class="code-block__filename">{{ tabs[0].label }}</span>
      </div>
      <button type="button" class="code-block__copy" :aria-label="copied ? 'Copied' : 'Copy code'" @click="copy">
        <app-icon :name="copied ? 'check' : 'copy'" :size="15" />
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>
    <button v-else type="button" class="code-block__copy code-block__copy--floating" :aria-label="copied ? 'Copied' : 'Copy code'" @click="copy">
      <app-icon :name="copied ? 'check' : 'copy'" :size="15" />
    </button>
    <pre class="code-block__pre" :style="maxHeight ? { maxHeight } : undefined"><code v-html="html" /></pre>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.js'
import { highlight } from '../docs/highlight.js'

const props = defineProps({
  code: { type: String, default: '' },
  lang: { type: String, default: 'vue' },
  filename: String,
  // [{ label, code, lang }]
  files: { type: Array, default: undefined },
  maxHeight: String,
  flush: Boolean
})

const active = ref(0)
const copied = ref(false)

const tabs = computed(() =>
  props.files !== undefined && props.files.length > 0
    ? props.files
    : [{ label: props.filename || '', code: props.code, lang: props.lang }]
)

const hasHeader = computed(() => tabs.value.length > 1 || Boolean(tabs.value[0].label))
const current = computed(() => tabs.value[Math.min(active.value, tabs.value.length - 1)])

// our own example sources; highlight.js escapes the text it tokenizes
const html = computed(() => highlight(current.value.code.trimEnd(), current.value.lang || props.lang))

let timer
async function copy () {
  try {
    await navigator.clipboard.writeText(current.value.code.trimEnd())
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 1600)
  }
  catch {
    copied.value = false
  }
}
</script>

<style lang="scss">
.code-block {
  position: relative;
  margin: 0 0 1.5rem;
  border: 1px solid var(--qh-border);
  border-radius: var(--qh-radius);
  background: var(--qh-bg-subtle);
  overflow: hidden;

  &--flush {
    margin: 0;
    border: 0;
    border-radius: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 42px;
    padding: 0 8px 0 4px;
    border-bottom: 1px solid var(--qh-border);
    background: var(--qh-bg-elevated);
  }

  &__tabs {
    display: flex;
    gap: 2px;
    min-width: 0;
    overflow-x: auto;
  }

  &__filename,
  &__tab {
    padding: 6px 10px;
    color: var(--qh-text-secondary);
    font: 500 12.5px/1.2 var(--qh-font-mono);
    white-space: nowrap;
  }

  &__tab {
    border: 0;
    border-radius: var(--qh-radius-sm);
    background: transparent;
    cursor: pointer;

    &:hover {
      color: var(--qh-text);
    }

    &--active {
      background: var(--qh-bg-muted);
      color: var(--qh-text);
    }
  }

  &__copy {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding: 0 10px;
    border: 1px solid transparent;
    border-radius: var(--qh-radius-sm);
    background: transparent;
    color: var(--qh-text-secondary);
    font: 500 12px var(--qh-font);
    cursor: pointer;

    &:hover {
      background: var(--qh-bg-muted);
      color: var(--qh-text);
    }

    &--floating {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 1;
      width: 30px;
      padding: 0;
      justify-content: center;
      border-color: var(--qh-border);
      background: var(--qh-bg-elevated);
      opacity: 0;
      transition: opacity .15s ease;
    }
  }

  &:hover &__copy--floating,
  &__copy--floating:focus-visible {
    opacity: 1;
  }

  &__pre {
    margin: 0;
    padding: 16px 18px;
    overflow: auto;
    color: var(--qh-text);
    font: 400 13px/1.7 var(--qh-font-mono);
    tab-size: 2;
    white-space: pre;

    code {
      font: inherit;
    }
  }
}
</style>
