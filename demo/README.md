# QHierarchy docs & playground

The documentation site (https://next-quasar-qhierarchy.netlify.app/), built with Quasar CLI (`@quasar/app-vite` v3).

It always renders the component from the local `../ui` sources (see `build.alias` in `quasar.config.js`),
and installs the local `../app-extension`, so it doubles as the development playground.

```bash
npm install
npm run dev     # http://localhost:9000
npm run build   # -> dist/spa (history mode; public/_redirects handles SPA fallback on Netlify)
```

Requires Node 22.22+ (see `engines`).

- Pages: `src/pages`, navigation: `src/docs/nav.js`
- Examples shown in the docs: `src/examples` (each file is rendered and its source displayed)
- API reference: generated from `ui/src/components/QHierarchy.json`
