<template>
  <doc-page
    title="Installation"
    lead="Use the Quasar CLI app extension, or install the UI package as a Vue plugin. A UMD build is available for script tags."
    source="pages/docs/InstallationPage.vue"
  >
    <h2 id="quasar-cli">Quasar CLI (app extension)</h2>
    <p>The recommended way. From your Quasar project folder:</p>
    <code-block lang="bash" code="quasar ext add qhierarchy" />
    <p>
      The extension registers a boot file that installs <code>&lt;q-hierarchy&gt;</code> globally, and
      <code>quasar describe QHierarchy</code> prints the full API in your terminal.
    </p>

    <div class="doc-table-wrap">
      <table class="doc-table">
        <thead><tr><th>Quasar CLI</th><th>Supported versions</th></tr></thead>
        <tbody>
          <tr><td><code>@quasar/app-vite</code></td><td>v1, v2, v3</td></tr>
          <tr><td><code>@quasar/app-webpack</code></td><td>v3, v4 (and the legacy <code>@quasar/app</code> v3)</td></tr>
          <tr><td><code>quasar</code></td><td>v2</td></tr>
        </tbody>
      </table>
    </div>

    <p>To remove it:</p>
    <code-block lang="bash" code="quasar ext remove qhierarchy" />

    <h2 id="vue-plugin">Vue plugin</h2>
    <p>For Vite / Vue CLI projects using Quasar as a plugin, install the UI package:</p>
    <code-block :files="npmFiles" />
    <p>Register it globally:</p>
    <code-block filename="main.js" lang="js" :code="pluginCode" />
    <p>Or import the component where you need it:</p>
    <code-block filename="MyPage.vue" lang="vue" :code="componentCode" />

    <doc-callout type="note">
      The pre-built files in <code>dist/</code> keep <code>vue</code> and <code>quasar</code> external and ship their
      styles in <code>dist/index.css</code>. If your bundler compiles <code>.vue</code> files, importing
      <code>quasar-ui-qhierarchy/src/vue-plugin.js</code> instead needs no CSS import.
    </doc-callout>

    <h2 id="umd">UMD / CDN</h2>
    <p>Add the tags after Quasar's. The global is <code>window.qhierarchy</code>:</p>
    <code-block filename="index.html" lang="html" :code="umdCode" />
  </doc-page>
</template>

<script setup>
import CodeBlock from '@/components/CodeBlock.vue'
import DocCallout from '@/components/DocCallout.vue'
import DocPage from '@/components/DocPage.vue'

const npmFiles = [
  { label: 'npm', lang: 'bash', code: 'npm install quasar-ui-qhierarchy' },
  { label: 'pnpm', lang: 'bash', code: 'pnpm add quasar-ui-qhierarchy' },
  { label: 'yarn', lang: 'bash', code: 'yarn add quasar-ui-qhierarchy' }
]

const pluginCode = `import { createApp } from 'vue'
import { Quasar } from 'quasar'
import QHierarchyPlugin from 'quasar-ui-qhierarchy'
import 'quasar-ui-qhierarchy/dist/index.css'

import App from './App.vue'

createApp(App)
  .use(Quasar)
  .use(QHierarchyPlugin)
  .mount('#app')
`

const componentCode = `<template>
  <q-hierarchy :columns="columns" :data="data" />
</template>

<script setup>
import { QHierarchy } from 'quasar-ui-qhierarchy'
import 'quasar-ui-qhierarchy/dist/index.css'
<\/script>
`

const umdCode = `<link href="https://cdn.jsdelivr.net/npm/quasar-ui-qhierarchy/dist/index.css" rel="stylesheet">

<!-- at the end of body, AFTER Vue and Quasar -->
<script src="https://cdn.jsdelivr.net/npm/quasar-ui-qhierarchy/dist/index.umd.min.js"><\/script>
<script>
  const app = Vue.createApp({ /* ... */ })
  app.use(Quasar)
  app.use(qhierarchy)
  app.mount('#q-app')
<\/script>
`
</script>
