<template>
  <doc-page
    title="Introduction"
    lead="QHierarchy displays hierarchical data (file systems, org charts, bills of materials, nested categories) as rows in a table, with expand and collapse, sorting, filtering and selection."
    source="pages/docs/IntroductionPage.vue"
  >
    <example-card file="Basic" />

    <h2 id="why">Why QHierarchy</h2>
    <p>
      A tree (QTree) shows one label per node; a table (QTable) shows many columns but no nesting.
      QHierarchy is the tree grid in between: every node is a table row, children are indented under
      their parent, and every column can be sorted, filtered and customised.
    </p>

    <div class="intro-grid">
      <router-link v-for="card in cards" :key="card.to" :to="card.to" class="qh-card qh-card--link intro-card">
        <span class="qh-icon-tile"><app-icon :name="card.icon" /></span>
        <span class="intro-card__title">{{ card.title }}</span>
        <span class="intro-card__text">{{ card.text }}</span>
      </router-link>
    </div>

    <h2 id="features">Features</h2>
    <div class="doc-table-wrap">
      <table class="doc-table">
        <thead><tr><th>Feature</th><th>How</th></tr></thead>
        <tbody>
          <tr v-for="row in features" :key="row[0]">
            <td>{{ row[0] }}</td>
            <td><code>{{ row[1] }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 id="quick-start">Quick start</h2>
    <p>In a Quasar CLI project, install the app extension:</p>
    <code-block lang="bash" code="quasar ext add qhierarchy" />
    <p>Then use <code>&lt;q-hierarchy&gt;</code> anywhere. See <router-link to="/docs/installation">Installation</router-link> for Vue plugin and UMD setups.</p>

    <doc-callout type="tip" title="Upgrading from v1?">
      Your templates keep working. The <router-link to="/docs/migration">migration guide</router-link> lists the few behaviour changes.
    </doc-callout>
  </doc-page>
</template>

<script setup>
import AppIcon from '@/components/AppIcon.js'
import CodeBlock from '@/components/CodeBlock.vue'
import DocCallout from '@/components/DocCallout.vue'
import DocPage from '@/components/DocPage.vue'
import ExampleCard from '@/components/ExampleCard.vue'

const cards = [
  { icon: 'terminal', title: 'Installation', text: 'App extension, Vue plugin or a script tag.', to: '/docs/installation' },
  { icon: 'table', title: 'Data & columns', text: 'Nested or flat data, keys and column options.', to: '/docs/data-and-columns' },
  { icon: 'bolt', title: 'Performance', text: 'How it stays fast at 100,000 rows.', to: '/docs/performance' }
]

const features = [
  ['Nested or flat (id / parentId) data', 'parent-key="parentId"'],
  ['Sorting per level: text, number, date, custom', 'sortable, sortingType'],
  ['Filtering that keeps ancestors', ':filter="term"'],
  ['Single / multiple / tri-state selection', 'selection="multiple"'],
  ['Lazy loading of children', '@lazy-load'],
  ['Virtual scrolling for huge trees', 'virtual-scroll'],
  ['Controlled expansion + methods', 'v-model:expanded, expandAll()'],
  ['Keyboard navigation, WAI-ARIA treegrid', 'built in'],
  ['Slots for rows, cells, header, footer, empty state', '#body, #cell-[name], …']
]
</script>

<style lang="scss">
.intro-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 1.5rem 0 1rem;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.intro-card {
  display: flex !important;
  flex-direction: column;
  gap: 6px;
  padding: 18px;
  text-decoration: none !important;

  &__title {
    margin-top: 10px;
    color: var(--qh-text);
    font-size: 15px;
    font-weight: 600;
  }

  &__text {
    color: var(--qh-text-secondary);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }
}
</style>
