<template>
  <q-page class="doc-page">
    <div class="doc-page__grid">
      <article ref="contentRef" class="doc-page__main">
        <header class="doc-page__header">
          <div v-if="eyebrow" class="doc-page__eyebrow">{{ eyebrow }}</div>
          <h1 class="doc-page__title">
            {{ title }}
            <span v-if="badge" class="qh-badge qh-badge--new doc-page__badge">{{ badge }}</span>
          </h1>
          <p v-if="lead" class="doc-page__lead">{{ lead }}</p>
        </header>

        <div class="prose">
          <slot />
        </div>

        <footer class="doc-page__footer">
          <a class="doc-page__edit" :href="editUrl" target="_blank" rel="noopener">
            <app-icon name="github" :size="14" /> Edit this page on GitHub
          </a>

          <nav class="doc-page__pager" aria-label="Pagination">
            <router-link v-if="siblings.prev" :to="siblings.prev.path" class="pager-card">
              <span class="pager-card__label"><app-icon name="arrowLeft" :size="14" /> Previous</span>
              <span class="pager-card__title">{{ siblings.prev.title }}</span>
            </router-link>
            <span v-else />
            <router-link v-if="siblings.next" :to="siblings.next.path" class="pager-card pager-card--next">
              <span class="pager-card__label">Next <app-icon name="arrowRight" :size="14" /></span>
              <span class="pager-card__title">{{ siblings.next.title }}</span>
            </router-link>
          </nav>
        </footer>
      </article>

      <aside v-if="toc.length > 1" class="doc-page__toc" aria-label="On this page">
        <div class="toc">
          <div class="toc__label">On this page</div>
          <a
            v-for="item in toc"
            :key="item.id"
            :href="'#' + item.id"
            class="toc__link"
            :class="{ 'toc__link--active': item.id === activeId, 'toc__link--sub': item.level === 3 }"
            @click.prevent="goTo(item.id)"
          >{{ item.text }}</a>
        </div>
      </aside>
    </div>
  </q-page>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMeta } from 'quasar'

import AppIcon from './AppIcon.js'
import { GITHUB_SOURCE, findNavItem, getSiblings } from '../docs/nav.js'

const props = defineProps({
  title: { type: String, required: true },
  lead: String,
  eyebrow: String,
  badge: String,
  source: String // path relative to demo/src, e.g. 'pages/docs/ApiPage.vue'
})

const route = useRoute()
const router = useRouter()
const contentRef = ref(null)
const toc = ref([])
const activeId = ref(null)

useMeta(() => ({
  title: props.title,
  titleTemplate: title => `${title} · QHierarchy`,
  meta: props.lead ? { description: { name: 'description', content: props.lead } } : {}
}))

const siblings = computed(() => getSiblings(route.path))
const eyebrow = computed(() => props.eyebrow || (findNavItem(route.path) || {}).group)
const editUrl = computed(() => `${GITHUB_SOURCE}/${props.source || ''}`)

let observer = null

function collectHeadings () {
  const root = contentRef.value
  if (root === null) return
  const headings = Array.from(root.querySelectorAll('.prose h2[id], .prose h3[id]'))
  toc.value = headings.map(el => ({ id: el.id, text: el.textContent.trim(), level: el.tagName === 'H3' ? 3 : 2 }))

  if (observer !== null) observer.disconnect()
  observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible.length > 0) activeId.value = visible[0].target.id
  }, { rootMargin: '-110px 0px -65% 0px' })
  headings.forEach(el => observer.observe(el))
  if (activeId.value === null && toc.value.length > 0) activeId.value = toc.value[0].id
}

function goTo (id) {
  router.replace({ hash: '#' + id })
  activeId.value = id
}

onMounted(() => nextTick(collectHeadings))
watch(() => route.path, () => nextTick(collectHeadings))
onBeforeUnmount(() => observer !== null && observer.disconnect())
</script>

<style lang="scss">
.doc-page {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 208px;
    gap: 56px;
    max-width: 1120px;
    margin: 0 auto;
    padding: 44px 40px 96px;

    @media (max-width: 1279px) {
      grid-template-columns: minmax(0, 1fr);
      max-width: calc(var(--qh-content-w) + 80px);
    }

    @media (max-width: 599px) {
      padding: 28px 18px 72px;
    }
  }

  &__main {
    min-width: 0;
    max-width: var(--qh-content-w);
  }

  &__header {
    margin-bottom: 2.25rem;
  }

  &__eyebrow {
    margin-bottom: 10px;
    color: var(--qh-text-secondary);
    font-size: 13px;
    font-weight: 500;
  }

  &__title {
    margin: 0;
    color: var(--qh-text);
    font-size: clamp(1.9rem, 3vw, 2.375rem);
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -.03em;
  }

  &__badge {
    vertical-align: middle;
    margin-left: 6px;
  }

  &__lead {
    margin: 14px 0 0;
    color: var(--qh-text-secondary);
    font-size: 1.125rem;
    line-height: 1.6;
  }

  &__footer {
    margin-top: 4rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--qh-border);
  }

  &__edit {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 1.5rem;
    color: var(--qh-text-secondary);
    font-size: 13px;
    text-decoration: none;

    &:hover {
      color: var(--qh-text);
    }
  }

  &__pager {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 599px) {
      grid-template-columns: 1fr;
    }
  }

  &__toc {
    @media (max-width: 1279px) {
      display: none;
    }
  }
}

.pager-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid var(--qh-border);
  border-radius: var(--qh-radius);
  color: var(--qh-text);
  text-decoration: none;
  transition: border-color .15s ease, background-color .15s ease;

  &:hover {
    border-color: var(--qh-border-strong);
    background: var(--qh-bg-subtle);
  }

  &--next {
    align-items: flex-end;
    text-align: right;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--qh-text-secondary);
    font-size: 12.5px;
  }

  &__title {
    font-size: 15px;
    font-weight: 500;
  }
}

.toc {
  position: sticky;
  top: calc(var(--qh-header-h) + var(--qh-tabs-h) + 44px);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 160px);
  overflow-y: auto;

  &__label {
    margin-bottom: 10px;
    color: var(--qh-text);
    font-size: 12.5px;
    font-weight: 600;
  }

  &__link {
    padding: 5px 0 5px 12px;
    border-left: 1px solid var(--qh-border);
    color: var(--qh-text-secondary);
    font-size: 13px;
    line-height: 1.4;
    text-decoration: none;
    transition: color .15s ease, border-color .15s ease;

    &:hover {
      color: var(--qh-text);
    }

    &--sub {
      padding-left: 24px;
    }

    &--active {
      border-left-color: var(--qh-text);
      color: var(--qh-text);
      font-weight: 500;
    }
  }
}
</style>
