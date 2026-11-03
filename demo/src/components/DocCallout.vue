<template>
  <aside class="doc-callout" :class="'doc-callout--' + type">
    <app-icon :name="type === 'warning' ? 'alert' : (type === 'tip' ? 'sparkles' : 'info')" :size="18" class="doc-callout__icon" />
    <div class="doc-callout__body">
      <div v-if="title" class="doc-callout__title">{{ title }}</div>
      <slot />
    </div>
  </aside>
</template>

<script setup>
import AppIcon from './AppIcon.js'

defineProps({
  type: { type: String, default: 'note' }, // note | tip | warning
  title: String
})
</script>

<style lang="scss">
.doc-callout {
  display: flex;
  gap: 12px;
  margin: 0 0 1.5rem;
  padding: 14px 16px;
  border: 1px solid var(--qh-border);
  border-radius: var(--qh-radius);
  background: var(--qh-bg-subtle);
  font-size: 15px;
  line-height: 1.65;

  &__icon {
    flex: 0 0 auto;
    margin-top: 3px;
    color: var(--qh-text-secondary);
  }

  &__title {
    margin-bottom: 2px;
    color: var(--qh-text);
    font-weight: 600;
  }

  &__body > :last-child {
    margin-bottom: 0;
  }

  &--tip .doc-callout__icon {
    color: #2b7fff;
  }

  &--warning {
    border-color: rgba(245, 158, 11, .35);
    background: rgba(245, 158, 11, .07);

    .doc-callout__icon {
      color: #d97706;
    }
  }
}
</style>
