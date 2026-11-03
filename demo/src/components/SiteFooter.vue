<template>
  <footer class="site-footer">
    <div class="site-footer__grid">
      <div class="site-footer__brand">
        <div class="site-footer__name">QHierarchy</div>
        <p class="qh-secondary">A fast tree grid for Quasar and Vue 3.</p>
      </div>
      <div v-for="col in columns" :key="col.title" class="site-footer__col">
        <div class="site-footer__title">{{ col.title }}</div>
        <template v-for="link in col.links" :key="link.title">
          <a v-if="link.href" :href="link.href" target="_blank" rel="noopener">{{ link.title }}</a>
          <router-link v-else :to="link.to">{{ link.title }}</router-link>
        </template>
      </div>
    </div>
    <div class="site-footer__bottom">
      <span>CC-BY / MIT License · Copyright © 2020 – {{ year }} Pratik Patel</span>
      <a href="https://www.netlify.com" target="_blank" rel="noopener">Deploys by Netlify</a>
    </div>
  </footer>
</template>

<script setup>
import { GITHUB_URL, SPONSOR_URL } from '../docs/nav.js'

const year = new Date().getFullYear()

const columns = [
  { title: 'Docs', links: [{ title: 'Introduction', to: '/docs' }, { title: 'Installation', to: '/docs/installation' }, { title: 'API', to: '/docs/api' }, { title: 'Migrating to v2', to: '/docs/migration' }] },
  { title: 'Examples', links: [{ title: 'Virtual scroll', to: '/examples/virtual-scroll' }, { title: 'Selection', to: '/examples/selection' }, { title: 'Lazy loading', to: '/examples/lazy-loading' }, { title: 'All examples', to: '/examples/basic' }] },
  { title: 'Community', links: [{ title: 'GitHub', href: GITHUB_URL }, { title: 'Issues', href: GITHUB_URL + '/issues' }, { title: 'Sponsor', href: SPONSOR_URL }, { title: 'Twitter', href: 'https://twitter.com/pratikPatel_227' }] }
]
</script>

<style lang="scss">
.site-footer {
  max-width: 1080px;
  margin: 96px auto 0;
  padding: 48px 24px 40px;
  border-top: 1px solid var(--qh-border);
  font-size: 14px;

  &__grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 32px;

    @media (max-width: 767px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__name {
    font-weight: 600;
    letter-spacing: -.02em;
  }

  &__title {
    margin-bottom: 10px;
    color: var(--qh-text);
    font-weight: 500;
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: 8px;

    a {
      color: var(--qh-text-secondary);
      text-decoration: none;

      &:hover {
        color: var(--qh-text);
      }
    }
  }

  &__bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
    margin-top: 48px;
    color: var(--qh-text-muted);
    font-size: 13px;

    a {
      color: inherit;
    }
  }
}
</style>
