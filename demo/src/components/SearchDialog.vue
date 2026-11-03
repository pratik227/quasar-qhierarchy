<template>
  <q-dialog :model-value="modelValue" position="top" class="search-dialog" @update:model-value="emit('update:modelValue', $event)" @show="onShow">
    <div class="search-panel" role="combobox" aria-haspopup="listbox" :aria-expanded="results.length > 0">
      <div class="search-panel__field">
        <app-icon name="search" :size="18" class="qh-muted" />
        <input
          ref="inputRef"
          v-model="query"
          class="search-panel__input"
          type="search"
          placeholder="Search pages, props, slots, events…"
          aria-label="Search"
          aria-controls="search-results"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="go(results[active])"
        >
        <kbd class="qh-kbd">Esc</kbd>
      </div>

      <ul id="search-results" class="search-panel__results" role="listbox">
        <li v-if="results.length === 0" class="search-panel__empty">No results for “{{ query }}”</li>
        <li
          v-for="(item, i) in results"
          :key="item.kind + item.to"
          role="option"
          :aria-selected="i === active"
          class="search-result"
          :class="{ 'search-result--active': i === active }"
          @mouseenter="active = i"
          @click="go(item)"
        >
          <span class="search-result__kind">{{ item.kind }}</span>
          <span class="search-result__text">
            <span class="search-result__title" :class="{ 'qh-mono': item.mono }">{{ item.title }}</span>
            <span class="search-result__desc">{{ item.description }}</span>
          </span>
          <app-icon name="arrowRight" :size="14" class="search-result__arrow" />
        </li>
      </ul>
    </div>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppIcon from './AppIcon.js'
import api from 'quasar-ui-qhierarchy/src/components/QHierarchy.json'
import { flatNav } from '../docs/nav.js'

defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const inputRef = ref(null)
const query = ref('')
const active = ref(0)

const plain = str => String(str || '').replace(/`/g, '')

const index = [
  ...flatNav.map(item => ({ kind: item.group === 'Examples' ? 'Example' : 'Page', title: item.title, description: item.description, to: item.path })),
  ...['props', 'slots', 'events', 'methods'].flatMap(section =>
    Object.entries(api[section] || {}).map(([name, def]) => ({
      kind: section.slice(0, -1).replace(/^./, c => c.toUpperCase()),
      title: section === 'methods' ? name + '()' : name,
      description: plain(def.desc),
      to: `/docs/api#${section}-${name.replace(/[^a-z0-9-]/gi, '')}`,
      mono: true
    }))
  )
]

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q === '') return index.filter(item => item.kind === 'Page' || item.kind === 'Example').slice(0, 8)
  return index
    .map(item => {
      const title = item.title.toLowerCase()
      const score = title.startsWith(q) ? 3 : (title.includes(q) ? 2 : (item.description.toLowerCase().includes(q) ? 1 : 0))
      return { item, score }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(r => r.item)
})

watch(results, () => { active.value = 0 })

function move (delta) {
  const n = results.value.length
  if (n > 0) active.value = (active.value + delta + n) % n
}

function go (item) {
  if (item === undefined) return
  emit('update:modelValue', false)
  router.push(item.to)
}

function onShow () {
  query.value = ''
  inputRef.value?.focus()
}
</script>

<style lang="scss">
.search-dialog .q-dialog__inner--top {
  padding-top: 12vh;
}

.search-panel {
  width: min(640px, calc(100vw - 32px));
  max-width: none !important;
  border: 1px solid var(--qh-border);
  border-radius: var(--qh-radius-lg);
  background: var(--qh-bg-elevated);
  box-shadow: var(--qh-shadow-lg);
  color: var(--qh-text);
  overflow: hidden;

  &__field {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 56px;
    padding: 0 16px;
    border-bottom: 1px solid var(--qh-border);
  }

  &__input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    color: var(--qh-text);
    font: 400 16px var(--qh-font);
    outline: none;

    &::placeholder {
      color: var(--qh-text-muted);
    }

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  &__results {
    max-height: min(420px, 60vh);
    margin: 0;
    padding: 8px;
    overflow-y: auto;
    list-style: none;
  }

  &__empty {
    padding: 24px;
    color: var(--qh-text-muted);
    font-size: 14px;
    text-align: center;
  }
}

.search-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--qh-radius);
  cursor: pointer;

  &--active {
    background: var(--qh-bg-muted);
  }

  &__kind {
    flex: 0 0 64px;
    color: var(--qh-text-muted);
    font-size: 12px;
    font-weight: 500;
  }

  &__text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
  }

  &__desc {
    overflow: hidden;
    color: var(--qh-text-secondary);
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    color: var(--qh-text-muted);
    opacity: 0;
  }

  &--active &__arrow {
    opacity: 1;
  }
}
</style>
