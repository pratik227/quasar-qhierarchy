<template>
  <doc-page
    title="Keyboard & accessibility"
    lead="QHierarchy implements the WAI-ARIA treegrid pattern: one tab stop, arrow-key navigation and the semantics screen readers need to announce depth and state."
    source="pages/docs/AccessibilityPage.vue"
  >
    <h2 id="keyboard">Keyboard</h2>
    <p>Tab into the table to focus a row, then:</p>
    <div class="doc-table-wrap">
      <table class="doc-table">
        <thead><tr><th>Key</th><th>Action</th></tr></thead>
        <tbody>
          <tr v-for="row in keys" :key="row[1]">
            <td><kbd v-for="k in row[0]" :key="k" class="qh-kbd q-mr-xs">{{ k }}</kbd></td>
            <td>{{ row[1] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>Sortable headers are focusable too: press <kbd class="qh-kbd">Enter</kbd> or <kbd class="qh-kbd">Space</kbd> to sort.</p>

    <h2 id="semantics">Semantics</h2>
    <ul>
      <li>The table has <code>role="treegrid"</code> (plus <code>aria-multiselectable</code> for multiple selection).</li>
      <li>Rows expose <code>aria-level</code>, <code>aria-posinset</code>, <code>aria-setsize</code>, <code>aria-expanded</code> (parents) and <code>aria-selected</code> (with selection).</li>
      <li>Sortable headers expose <code>aria-sort</code>.</li>
      <li>Focus uses a roving <code>tabindex</code>, so moving focus never re-renders the table.</li>
    </ul>

    <example-card file="Selection" title="Try it" description="Click a row, then use the arrow keys and Space." :extra="['sample-data.js']" />
  </doc-page>
</template>

<script setup>
import DocPage from '@/components/DocPage.vue'
import ExampleCard from '@/components/ExampleCard.vue'

const keys = [
  [['↓'], 'Next row'],
  [['↑'], 'Previous row'],
  [['→'], 'Expand; if already expanded, move to the first child'],
  [['←'], 'Collapse; if already collapsed, move to the parent'],
  [['Home'], 'First row'],
  [['End'], 'Last row'],
  [['PgDn'], '10 rows down'],
  [['PgUp'], '10 rows up'],
  [['Enter'], 'Toggle the row (or select a leaf when selection is on)'],
  [['Space'], 'Toggle selection (or the row when selection is off)']
]
</script>
