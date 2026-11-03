<template>
  <q-layout view="hHh lpR fff">
    <q-header class="site-header">
      <div class="site-header__bar">
        <button v-if="hasSidebar" type="button" class="qh-btn qh-btn--ghost qh-btn--icon lt-md" aria-label="Open navigation" @click="drawer = !drawer">
          <app-icon name="menu" />
        </button>

        <router-link to="/" class="brand" aria-label="QHierarchy home">
          <span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 5h5M8 5v14h5M8 12h5"/><circle cx="17" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="17" cy="19" r="2" fill="currentColor" stroke="none"/></svg>
          </span>
          <span class="brand__name">QHierarchy</span>
          <span class="qh-badge qh-badge--mono gt-xs">v2</span>
        </router-link>

        <button type="button" class="search-trigger" aria-label="Search documentation" @click="searchOpen = true">
          <app-icon name="search" :size="16" />
          <span class="search-trigger__text">Search docs</span>
          <span class="search-trigger__keys gt-xs"><kbd class="qh-kbd">{{ isMac ? '⌘' : 'Ctrl' }}</kbd><kbd class="qh-kbd">K</kbd></span>
        </button>

        <q-space />

        <a class="qh-btn qh-btn--ghost qh-btn--icon" :href="GITHUB_URL" target="_blank" rel="noopener" aria-label="GitHub repository">
          <app-icon name="github" />
        </a>
        <button type="button" class="qh-btn qh-btn--ghost qh-btn--icon" :aria-label="$q.dark.isActive ? 'Switch to light theme' : 'Switch to dark theme'" @click="toggleTheme">
          <app-icon :name="$q.dark.isActive ? 'sun' : 'moon'" />
        </button>
        <a class="qh-btn qh-btn--primary qh-btn--sm gt-xs q-ml-xs" :href="SPONSOR_URL" target="_blank" rel="noopener">
          <app-icon name="heart" :size="15" /> Sponsor
        </a>
      </div>

      <nav class="site-tabs" aria-label="Sections">
        <router-link
          v-for="tab in headerTabs"
          :key="tab.title"
          :to="tab.path"
          class="site-tabs__tab"
          :class="{ 'site-tabs__tab--active': tab.match($route.path) }"
        >{{ tab.title }}</router-link>
      </nav>
    </q-header>

    <q-drawer
      v-if="hasSidebar"
      v-model="drawer"
      show-if-above
      :width="264"
      :breakpoint="1023"
      class="site-sidebar"
    >
      <nav class="sidebar" aria-label="Documentation">
        <div v-for="group in navGroups" :key="group.title" class="sidebar__group">
          <div class="sidebar__label">{{ group.title }}</div>
          <template v-for="item in group.items" :key="item.title">
            <a v-if="item.href" :href="item.href" target="_blank" rel="noopener" class="sidebar__link">
              {{ item.title }} <app-icon name="external" :size="13" class="qh-muted" />
            </a>
            <router-link v-else :to="item.path" class="sidebar__link" :class="{ 'sidebar__link--active': $route.path === item.path }">
              <span>{{ item.title }}</span>
              <span v-if="item.isNew" class="qh-badge qh-badge--new">New</span>
            </router-link>
          </template>
        </div>
      </nav>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <search-dialog v-model="searchOpen" />
  </q-layout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

import AppIcon from '@/components/AppIcon.js'
import SearchDialog from '@/components/SearchDialog.vue'
import { GITHUB_URL, SPONSOR_URL, headerTabs, navGroups } from '../docs/nav.js'
import { saveTheme } from '../boot/theme.js'

const $q = useQuasar()
const route = useRoute()

const drawer = ref(false)
const searchOpen = ref(false)
const isMac = ref(true)

const hasSidebar = computed(() => route.meta.landing !== true)

function toggleTheme () {
  $q.dark.toggle()
  saveTheme($q.dark.isActive)
}

function onKeydown (evt) {
  if ((evt.metaKey || evt.ctrlKey) && evt.key.toLowerCase() === 'k') {
    evt.preventDefault()
    searchOpen.value = !searchOpen.value
  }
  else if (evt.key === '/' && searchOpen.value === false && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) {
    evt.preventDefault()
    searchOpen.value = true
  }
}

onMounted(() => {
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style lang="scss">
.site-header {
  background: color-mix(in srgb, var(--qh-bg) 84%, transparent) !important;
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid var(--qh-border);
  color: var(--qh-text) !important;

  &__bar {
    display: flex;
    align-items: center;
    gap: 6px;
    height: var(--qh-header-h);
    padding: 0 16px 0 20px;

    @media (max-width: 599px) {
      padding: 0 10px;
    }
  }
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-right: 18px;
  color: var(--qh-text);
  text-decoration: none;

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: var(--qh-accent);
    color: var(--qh-accent-contrast);
  }

  &__name {
    font-size: 15.5px;
    font-weight: 600;
    letter-spacing: -.02em;
  }
}

.search-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: min(300px, 40vw);
  height: 36px;
  padding: 0 8px 0 12px;
  border: 1px solid var(--qh-border);
  border-radius: 9999px;
  background: var(--qh-bg-subtle);
  color: var(--qh-text-muted);
  font: 400 14px var(--qh-font);
  cursor: pointer;
  transition: border-color .15s ease, background-color .15s ease;

  &:hover {
    border-color: var(--qh-border-strong);
    background: var(--qh-bg-muted);
  }

  &__text {
    flex: 1;
    text-align: left;
  }

  &__keys {
    display: inline-flex;
    gap: 3px;
  }

  @media (max-width: 599px) {
    width: 40px;
    justify-content: center;
    padding: 0;

    &__text {
      display: none;
    }
  }
}

.site-tabs {
  display: flex;
  gap: 22px;
  height: var(--qh-tabs-h);
  padding: 0 24px;
  overflow-x: auto;
  scrollbar-width: none;

  &__tab {
    display: inline-flex;
    align-items: center;
    height: 100%;
    border-bottom: 2px solid transparent;
    color: var(--qh-text-secondary);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
    transition: color .15s ease, border-color .15s ease;

    &:hover {
      color: var(--qh-text);
    }

    &--active {
      border-bottom-color: var(--qh-text);
      color: var(--qh-text);
    }
  }
}

.site-sidebar .q-drawer {
  background: var(--qh-bg) !important;
  border-right: 1px solid var(--qh-border);
}

body.body--dark .site-sidebar .q-drawer {
  background: var(--qh-bg) !important;
}

.sidebar {
  padding: 24px 14px 48px;

  &__group + &__group {
    margin-top: 22px;
  }

  &__label {
    padding: 0 10px 6px;
    color: var(--qh-text);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -.005em;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding: 6px 10px;
    border-radius: var(--qh-radius-sm);
    color: var(--qh-text-secondary);
    font-size: 14px;
    line-height: 1.4;
    text-decoration: none;
    transition: background-color .12s ease, color .12s ease;

    &:hover {
      background: var(--qh-bg-subtle);
      color: var(--qh-text);
    }

    &--active {
      background: var(--qh-bg-muted);
      color: var(--qh-text);
      font-weight: 500;
    }
  }
}
</style>
