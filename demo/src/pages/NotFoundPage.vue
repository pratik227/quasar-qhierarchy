<template>
  <q-page class="not-found">
    <div class="not-found__inner">
      <div class="not-found__code qh-mono">404</div>
      <h1>This page doesn't exist</h1>
      <p class="qh-secondary">It may have moved when the docs were redesigned.</p>
      <div class="row q-gutter-sm justify-center">
        <router-link to="/" class="qh-btn qh-btn--primary">Go home</router-link>
        <router-link to="/docs" class="qh-btn qh-btn--outline">Read the docs</router-link>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;

  &__code {
    color: var(--qh-text-muted);
    font-size: 14px;
    letter-spacing: .2em;
  }

  h1 {
    margin: 12px 0 8px;
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: -.03em;
    line-height: 1.2;
  }

  p {
    margin-bottom: 28px;
  }
}
</style>
