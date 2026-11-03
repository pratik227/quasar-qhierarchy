<template>
  <doc-page
    title="Sponsor"
    lead="QHierarchy is free and open source. Sponsorship keeps it maintained, compatible with new Quasar releases, and moving forward."
    source="pages/SponsorPage.vue"
  >
    <div class="sponsor-card qh-card">
      <img src="https://avatars.githubusercontent.com/u/34883558?v=4" alt="" width="56" height="56" class="sponsor-card__avatar">
      <div>
        <div class="sponsor-card__name">Pratik Patel</div>
        <div class="qh-secondary" style="font-size: 14px">
          <a href="https://github.com/pratik227" target="_blank" rel="noopener">@pratik227</a> ·
          <a href="https://twitter.com/pratikPatel_227" target="_blank" rel="noopener">Twitter</a>
        </div>
      </div>
      <q-space />
      <a :href="SPONSOR_URL" target="_blank" rel="noopener" class="qh-btn qh-btn--primary"><app-icon name="heart" :size="16" /> Sponsor on GitHub</a>
    </div>

    <h2 id="about">About</h2>
    <p>
      I've been drawn to programming since 2013, working with HTML5, CSS3, AngularJS, Vue.js, Elasticsearch and Python,
      and eventually Quasar Framework. After a couple of years building with Quasar I started creating plugins for it,
      such as the QHierarchy app extension.
    </p>
    <p>Other open-source projects:</p>
    <ul>
      <li v-for="p in projects" :key="p.name"><a :href="p.url" target="_blank" rel="noopener">{{ p.name }}</a></li>
    </ul>

    <h2 id="ways">Ways to support</h2>
    <p>Sharing knowledge makes the world a better place. There are many ways to keep free software healthy:</p>
    <ol>
      <li>Financial backing through <a :href="SPONSOR_URL" target="_blank" rel="noopener">GitHub Sponsors</a></li>
      <li>Reporting bugs and requesting features</li>
      <li>Fixing bugs and adding features with a pull request</li>
      <li>Helping others in the community</li>
    </ol>
  </doc-page>
</template>

<script setup>
import AppIcon from '@/components/AppIcon.js'
import DocPage from '@/components/DocPage.vue'
import { SPONSOR_URL } from '../docs/nav.js'

const projects = [
  { name: 'QHierarchy', url: 'https://github.com/pratik227/quasar-qhierarchy' },
  { name: 'QGrid', url: 'https://github.com/pratik227/quasar-qgrid' },
  { name: 'Quasar Admin', url: 'https://github.com/pratik227/quasar-admin' },
  { name: 'Quasar Gaming', url: 'https://github.com/pratik227/quasar-gaming' },
  { name: 'Quasar ECharts', url: 'https://github.com/pratik227/quasar-echarts' }
]
</script>

<style lang="scss">
.sponsor-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;

  &__avatar {
    border-radius: 50%;
  }

  &__name {
    color: var(--qh-text);
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
