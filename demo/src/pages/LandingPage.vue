<template>
  <q-page class="landing">
    <!-- Hero -->
    <section class="hero">
      <router-link to="/docs/migration" class="hero__eyebrow">
        <span class="qh-badge qh-badge--new">v2</span>
        Virtual scroll, selection, lazy loading and more
        <app-icon name="arrowRight" :size="14" />
      </router-link>

      <h1 class="hero__title">Hierarchical data,<br>rendered fast.</h1>
      <p class="hero__lead">
        QHierarchy is a tree grid for Quasar: nested rows inside a familiar table, with
        virtual scrolling, tri-state selection, lazy loading and full keyboard support. Free and MIT licensed.
      </p>

      <div class="hero__actions">
        <router-link to="/docs" class="qh-btn qh-btn--primary">Get started</router-link>
        <router-link to="/examples/basic" class="qh-btn qh-btn--outline">Browse examples</router-link>
      </div>

      <button type="button" class="install-chip" :aria-label="'Copy ' + installCmd" @click="copyInstall">
        <span class="qh-muted">$</span>
        <span class="qh-mono">{{ installCmd }}</span>
        <app-icon :name="copied ? 'check' : 'copy'" :size="15" class="qh-muted" />
      </button>
    </section>

    <!-- Live demo -->
    <section class="showcase">
      <div class="showcase__glow" aria-hidden="true" />
      <div class="window">
        <div class="window__bar">
          <span class="window__dots" aria-hidden="true"><i /><i /><i /></span>
          <input v-model="search" class="qh-input window__search" type="search" placeholder="Filter files…" aria-label="Filter files">
          <q-space />
          <span class="qh-secondary window__meta gt-xs">{{ selected.length }} selected</span>
          <button type="button" class="qh-btn qh-btn--ghost qh-btn--sm gt-xs" @click="tree.expandAll()">Expand all</button>
          <button type="button" class="qh-btn qh-btn--ghost qh-btn--sm gt-xs" @click="tree.collapseAll()">Collapse</button>
        </div>
        <q-hierarchy
          ref="tree"
          v-model:selected="selected"
          :columns="columns"
          :data="data"
          node-key="id"
          selection="multiple"
          :filter="search"
          :filter-min-length="1"
          :default-expand-level="2"
          flat
          class="qh-docs-table window__table"
        />
      </div>
      <p class="showcase__hint qh-muted">
        Try it: click the toggles, check a folder, type in the filter, or focus a row and use
        <kbd class="qh-kbd">↑</kbd> <kbd class="qh-kbd">↓</kbd> <kbd class="qh-kbd">←</kbd> <kbd class="qh-kbd">→</kbd> <kbd class="qh-kbd">Space</kbd>
      </p>
    </section>

    <!-- Stats -->
    <section class="stats">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <div class="stat__value">{{ stat.value }}</div>
        <div class="stat__label">{{ stat.label }}</div>
      </div>
    </section>

    <!-- Features -->
    <section class="section">
      <div class="section__head">
        <h2 class="section__title">Tree-grid features, without the enterprise license</h2>
        <p class="section__lead">Commercial tree grids sell these as premium features. In QHierarchy they're props.</p>
      </div>
      <div class="features">
        <router-link v-for="feature in features" :key="feature.title" :to="feature.to" class="qh-card qh-card--link feature">
          <span class="qh-icon-tile"><app-icon :name="feature.icon" /></span>
          <h3 class="feature__title">{{ feature.title }}</h3>
          <p class="feature__text">{{ feature.text }}</p>
          <code class="feature__code">{{ feature.code }}</code>
        </router-link>
      </div>
    </section>

    <!-- Code -->
    <section class="section split">
      <div class="split__text">
        <h2 class="section__title">Up and running in a minute</h2>
        <p class="section__lead">
          Add the app extension, describe your columns and pass your data. Nested
          <code>children</code> or a flat <code>parentId</code> list both work, and your objects are never mutated.
        </p>
        <ul class="checklist">
          <li><app-icon name="check" :size="16" /> Quasar CLI with Vite or webpack, every current version</li>
          <li><app-icon name="check" :size="16" /> Vue plugin and UMD builds for any Vue 3 app</li>
          <li><app-icon name="check" :size="16" /> Slots for rows, cells, header, footer and empty state</li>
        </ul>
        <router-link to="/docs/installation" class="qh-btn qh-btn--outline q-mt-md">Installation guide <app-icon name="arrowRight" :size="15" /></router-link>
      </div>
      <code-block class="split__code" :files="snippet" />
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>Ship your next tree grid today</h2>
      <p>Open source, MIT licensed, and built for Quasar.</p>
      <div class="hero__actions">
        <router-link to="/docs" class="qh-btn cta__primary">Read the docs</router-link>
        <a :href="GITHUB_URL" target="_blank" rel="noopener" class="qh-btn cta__secondary"><app-icon name="github" :size="16" /> Star on GitHub</a>
      </div>
    </section>

    <site-footer />
  </q-page>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useMeta } from 'quasar'

import AppIcon from '@/components/AppIcon.js'
import CodeBlock from '@/components/CodeBlock.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { GITHUB_URL } from '../docs/nav.js'
import { columns, data } from '../examples/sample-data.js'

useMeta({ title: 'QHierarchy · a fast tree grid for Quasar' })

const tree = useTemplateRef('tree')
const search = ref('')
const selected = ref(['src/components/QHierarchy.vue'])
const copied = ref(false)
const installCmd = 'quasar ext add qhierarchy'

async function copyInstall () {
  try {
    await navigator.clipboard.writeText(installCmd)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1600)
  }
  catch { /* clipboard blocked */ }
}

const stats = [
  { value: '100k+', label: 'rows with virtual scroll' },
  { value: '0', label: 'mutations of your data' },
  { value: 'WAI-ARIA', label: 'treegrid keyboard model' },
  { value: 'MIT', label: 'licensed, free forever' }
]

const features = [
  { icon: 'bolt', title: 'Virtual scrolling', text: 'Only the rows in view hit the DOM, so 100,000 nodes scroll smoothly.', code: 'virtual-scroll', to: '/examples/virtual-scroll' },
  { icon: 'checkSquare', title: 'Tri-state selection', text: 'Cascading checkboxes with indeterminate parents, or strict and single modes.', code: 'selection="multiple"', to: '/examples/selection' },
  { icon: 'download', title: 'Lazy loading', text: 'Fetch children the first time a node opens, with loading and retry built in.', code: '@lazy-load', to: '/examples/lazy-loading' },
  { icon: 'keyboard', title: 'Keyboard & ARIA', text: 'A real treegrid: arrow keys, Home and End, Space and Enter, with screen reader semantics.', code: 'role="treegrid"', to: '/docs/accessibility' },
  { icon: 'table', title: 'Flat or nested data', text: 'Pass nested children, or a flat id / parentId list straight from your API.', code: 'parent-key="parentId"', to: '/examples/flat-data' },
  { icon: 'filter', title: 'Filter that keeps context', text: 'Matches keep their ancestors and auto-expand, and clearing the filter restores your tree.', code: ':filter="term"', to: '/examples/filter' }
]

const snippet = [
  {
    label: 'FileTree.vue',
    lang: 'vue',
    code: `<template>
  <q-hierarchy
    :columns="columns"
    :data="files"
    node-key="id"
    selection="multiple"
    v-model:selected="selected"
    virtual-scroll
    style="height: 480px"
  />
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'size', label: 'Size', field: 'size', sortingType: 'number' }
]

const files = [
  { id: 1, name: 'src', size: 1386, children: [
    { id: 2, name: 'App.vue', size: 4 }
  ] }
]

const selected = ref([])
<\/script>
`
  },
  {
    label: 'Terminal',
    lang: 'bash',
    code: 'quasar ext add qhierarchy\n'
  }
]
</script>

<style lang="scss">
.landing {
  overflow: hidden;
}

.hero {
  max-width: 920px;
  margin: 0 auto;
  padding: 88px 24px 40px;
  text-align: center;

  @media (max-width: 599px) {
    padding-top: 56px;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px 4px 4px;
    border: 1px solid var(--qh-border);
    border-radius: 9999px;
    background: var(--qh-bg-elevated);
    color: var(--qh-text-secondary);
    font-size: 13px;
    text-decoration: none;
    transition: border-color .15s ease;

    &:hover {
      border-color: var(--qh-border-strong);
      color: var(--qh-text);
    }
  }

  &__title {
    margin: 28px 0 0;
    color: var(--qh-text);
    font-size: clamp(2.6rem, 7vw, 4.75rem);
    font-weight: 600;
    line-height: 1.02;
    letter-spacing: -.045em;
  }

  &__lead {
    max-width: 640px;
    margin: 24px auto 0;
    color: var(--qh-text-secondary);
    font-size: clamp(1.05rem, 1.6vw, 1.2rem);
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 32px;
  }
}

.install-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  padding: 8px 14px;
  border: 1px dashed var(--qh-border-strong);
  border-radius: 9999px;
  background: transparent;
  color: var(--qh-text);
  font-size: 13.5px;
  cursor: pointer;

  &:hover {
    background: var(--qh-bg-subtle);
  }
}

.showcase {
  position: relative;
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 24px 0;

  @media (max-width: 599px) {
    padding: 16px 10px 0;
  }

  &__glow {
    position: absolute;
    inset: -10% -5% 20%;
    z-index: 0;
    background:
      radial-gradient(40% 50% at 25% 40%, var(--qh-glow-1), transparent 70%),
      radial-gradient(40% 50% at 75% 60%, var(--qh-glow-2), transparent 70%);
    filter: blur(20px);
    pointer-events: none;
  }

  &__hint {
    position: relative;
    margin: 18px 0 0;
    font-size: 13px;
    text-align: center;
  }
}

.window {
  position: relative;
  z-index: 1;
  border: 1px solid var(--qh-border);
  border-radius: var(--qh-radius-xl);
  background: var(--qh-bg-elevated);
  box-shadow: var(--qh-shadow-lg);
  overflow: hidden;

  &__bar {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 56px;
    padding: 0 14px;
    border-bottom: 1px solid var(--qh-border);
  }

  &__dots {
    display: inline-flex;
    gap: 6px;

    i {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--qh-border-strong);
    }
  }

  &__search {
    max-width: 260px;
    height: 34px;
    margin-left: 8px;
  }

  &__meta {
    font-size: 13px;
  }

  &__table.q-markup-table {
    border: 0;
    border-radius: 0;
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1080px;
  margin: 72px auto 0;
  padding: 0 24px;

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 28px;
  }
}

.stat {
  padding: 4px 20px;
  border-left: 1px solid var(--qh-border);

  &__value {
    color: var(--qh-text);
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: -.03em;
  }

  &__label {
    margin-top: 2px;
    color: var(--qh-text-secondary);
    font-size: 14px;
  }
}

.section {
  max-width: 1080px;
  margin: 112px auto 0;
  padding: 0 24px;

  &__head {
    max-width: 640px;
    margin-bottom: 36px;
  }

  &__title {
    margin: 0;
    color: var(--qh-text);
    font-size: clamp(1.75rem, 3.2vw, 2.5rem);
    font-weight: 600;
    line-height: 1.12;
    letter-spacing: -.035em;
  }

  &__lead {
    margin: 14px 0 0;
    color: var(--qh-text-secondary);
    font-size: 1.075rem;
    line-height: 1.6;

    code {
      padding: .1em .35em;
      border: 1px solid var(--qh-border);
      border-radius: var(--qh-radius-sm);
      background: var(--qh-bg-muted);
      font-size: .86em;
    }
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 599px) {
    grid-template-columns: 1fr;
  }
}

.feature {
  padding: 22px;

  &__title {
    margin: 18px 0 6px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -.015em;
  }

  &__text {
    margin: 0 0 16px;
    color: var(--qh-text-secondary);
    font-size: 14.5px;
    line-height: 1.6;
  }

  &__code {
    color: var(--qh-text-muted);
    font-size: 12.5px;
  }
}

.split {
  display: grid;
  grid-template-columns: 5fr 6fr;
  gap: 48px;
  align-items: center;

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }

  &__code {
    margin: 0 !important;
    box-shadow: var(--qh-shadow);
  }
}

.checklist {
  margin: 24px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    color: var(--qh-text-body);
    font-size: 15px;
  }

  .app-icon {
    color: var(--qh-text);
  }
}

.cta {
  max-width: 1080px;
  margin: 112px auto 0;
  padding: 64px 24px;
  border-radius: var(--qh-radius-xl);
  background: var(--qh-bg-inverse);
  color: var(--qh-text-inverse);
  text-align: center;

  @media (max-width: 1127px) {
    margin-left: 24px;
    margin-right: 24px;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.75rem, 3.2vw, 2.5rem);
    font-weight: 600;
    letter-spacing: -.035em;
    line-height: 1.15;
  }

  p {
    margin: 12px 0 0;
    opacity: .7;
    font-size: 1.05rem;
  }

  &__primary {
    background: var(--qh-text-inverse);
    color: var(--qh-bg-inverse);

    &:hover {
      opacity: .88;
    }
  }

  &__secondary {
    border-color: color-mix(in srgb, var(--qh-text-inverse) 30%, transparent);
    background: transparent;
    color: var(--qh-text-inverse);

    &:hover {
      background: color-mix(in srgb, var(--qh-text-inverse) 10%, transparent);
    }
  }
}
</style>
