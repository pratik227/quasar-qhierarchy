// highlight.js core with only the grammars the docs need (~25 kB instead of ~1 MB)
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)

const aliases = { vue: 'xml', html: 'xml', js: 'javascript', sh: 'bash', shell: 'bash' }

export function highlight (code, lang = 'vue') {
  const language = aliases[lang] || lang
  if (hljs.getLanguage(language) === undefined) return escapeHtml(code)
  return hljs.highlight(code, { language, ignoreIllegals: true }).value
}

function escapeHtml (str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
