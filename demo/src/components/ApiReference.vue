<template>
  <div class="api-ref">
    <div class="api-ref__search">
      <app-icon name="search" :size="16" class="qh-muted" />
      <input v-model="query" class="api-ref__input" type="search" placeholder="Filter props, slots, events and methods" aria-label="Filter API">
      <span class="qh-muted api-ref__count">{{ total }} entries</span>
    </div>

    <template v-for="section in sections" :key="section.key">
      <section v-if="section.groups.some(g => g.entries.length)">
        <h2 :id="'api-' + section.key">{{ section.title }}</h2>
        <template v-for="group in section.groups" :key="group.name">
          <h3 v-if="group.name && group.entries.length" :id="'api-' + section.key + '-' + group.name" class="api-ref__group">{{ group.title }}</h3>
          <div v-if="group.entries.length" class="api-ref__list">
            <div v-for="entry in group.entries" :id="entry.id" :key="entry.id" class="api-entry">
              <div class="api-entry__head">
                <a :href="'#' + entry.id" class="api-entry__name">{{ entry.label }}</a>
                <span v-for="t in entry.types" :key="t" class="qh-badge qh-badge--mono">{{ t }}</span>
                <span v-if="entry.default !== undefined" class="api-entry__default">default: <code>{{ entry.default }}</code></span>
              </div>
              <p class="api-entry__desc"><rich-text :text="entry.desc" /></p>
              <div v-if="entry.values" class="api-entry__meta">
                Values: <code v-for="v in entry.values" :key="v">{{ v }}</code>
              </div>
              <div v-if="entry.examples" class="api-entry__meta">
                Example: <code v-for="ex in entry.examples" :key="ex">{{ ex }}</code>
              </div>
              <div v-if="entry.params.length" class="api-entry__params">
                <div class="api-entry__params-label">{{ entry.paramsLabel }}</div>
                <div v-for="param in entry.params" :key="param.name" class="api-param">
                  <code class="api-param__name">{{ param.name }}</code>
                  <span v-for="t in param.types" :key="t" class="qh-badge qh-badge--mono">{{ t }}</span>
                  <span class="api-param__desc"><rich-text :text="param.desc" /></span>
                </div>
              </div>
              <div v-if="entry.returns" class="api-entry__meta">
                Returns <span class="qh-badge qh-badge--mono">{{ entry.returns.type }}</span> {{ entry.returns.desc }}
              </div>
            </div>
          </div>
        </template>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import AppIcon from './AppIcon.js'
import api from 'quasar-ui-qhierarchy/src/components/QHierarchy.json'

// renders `code` spans without v-html
const RichText = props => String(props.text || '')
  .split('`')
  .map((part, i) => (i % 2 === 1 ? h('code', part) : part))
RichText.props = ['text']

const query = ref('')

const categoryTitles = {
  model: 'Model',
  behavior: 'Behavior',
  filter: 'Filtering',
  selection: 'Selection',
  'virtual-scroll': 'Virtual scroll',
  content: 'Content',
  style: 'Style'
}

const toList = value => (value === undefined ? [] : (Array.isArray(value) ? value : [value]))
const slug = str => str.replace(/[^a-z0-9-]/gi, '')

function makeEntry (section, name, def) {
  const params = section === 'slots' ? def.scope : def.params
  return {
    id: `${section}-${slug(name)}`,
    label: section === 'methods' ? `${name}(${Object.keys(def.params || {}).join(', ')})` : name,
    name,
    types: toList(def.type),
    default: def.default,
    desc: def.desc,
    values: def.values,
    examples: def.examples,
    returns: def.returns,
    paramsLabel: section === 'slots' ? 'Scope' : 'Parameters',
    params: Object.entries(params || {}).map(([pName, p]) => ({ name: pName, types: toList(p.type), desc: p.desc }))
  }
}

function matches (entry, q) {
  return q === '' ||
    entry.name.toLowerCase().includes(q) ||
    String(entry.desc).toLowerCase().includes(q)
}

const sections = computed(() => {
  const q = query.value.trim().toLowerCase()

  const propGroups = {}
  for (const [name, def] of Object.entries(api.props)) {
    const cat = def.category || 'general'
    ;(propGroups[cat] = propGroups[cat] || []).push(makeEntry('props', name, def))
  }

  return [
    {
      key: 'props',
      title: 'Props',
      groups: Object.keys(categoryTitles)
        .filter(cat => propGroups[cat] !== undefined)
        .map(cat => ({ name: cat, title: categoryTitles[cat], entries: propGroups[cat].filter(e => matches(e, q)) }))
    },
    ...['slots', 'events', 'methods'].map(key => ({
      key,
      title: key[0].toUpperCase() + key.slice(1),
      groups: [{ name: '', title: '', entries: Object.entries(api[key]).map(([n, d]) => makeEntry(key, n, d)).filter(e => matches(e, q)) }]
    }))
  ]
})

const total = computed(() => sections.value.reduce((sum, s) => sum + s.groups.reduce((n, g) => n + g.entries.length, 0), 0))
</script>

<style lang="scss">
.api-ref {
  &__search {
    position: sticky;
    top: calc(var(--qh-header-h) + var(--qh-tabs-h) + 8px);
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 44px;
    padding: 0 14px;
    border: 1px solid var(--qh-border);
    border-radius: 9999px;
    background: var(--qh-bg-elevated);
    box-shadow: var(--qh-shadow-sm);
  }

  &__input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    color: var(--qh-text);
    font: 400 15px var(--qh-font);
    outline: none;
  }

  &__count {
    font-size: 12.5px;
    white-space: nowrap;
  }

  &__group {
    color: var(--qh-text-secondary) !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    letter-spacing: .02em !important;
    text-transform: uppercase;
  }

  &__list {
    border: 1px solid var(--qh-border);
    border-radius: var(--qh-radius);
    overflow: hidden;
  }
}

.api-entry {
  padding: 16px 18px;
  scroll-margin-top: 130px;

  & + & {
    border-top: 1px solid var(--qh-border);
  }

  &:target {
    background: rgba(43, 127, 255, .06);
  }

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  &__name {
    margin-right: 4px;
    color: var(--qh-text) !important;
    font: 600 14.5px var(--qh-font-mono);
    text-decoration: none !important;
  }

  &__default {
    color: var(--qh-text-muted);
    font-size: 12.5px;
  }

  &__desc {
    margin: 8px 0 0 !important;
    font-size: 14.5px;
    line-height: 1.65;
  }

  &__meta {
    margin-top: 8px;
    color: var(--qh-text-secondary);
    font-size: 13px;

    code {
      margin-right: 6px;
      white-space: normal !important;
    }
  }

  &__params {
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: var(--qh-radius-sm);
    background: var(--qh-bg-subtle);
  }

  &__params-label {
    margin-bottom: 4px;
    color: var(--qh-text-muted);
    font-size: 12px;
    font-weight: 500;
  }
}

.api-param {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;
  padding: 4px 0;
  font-size: 13.5px;
  line-height: 1.55;

  &__desc {
    flex: 1 1 260px;
    color: var(--qh-text-secondary);
  }
}
</style>
