<script>
/**
 * QHierarchy — hierarchical (tree) data inside a Quasar markup table.
 *
 * Performance notes:
 *  - The tree is flattened into the list of *visible* rows once per change
 *    (collapsed branches are never walked), instead of on every render.
 *  - User data is never mutated: expansion, sorting, selection and lazy-load
 *    state live in the component, so reactive data does not trigger
 *    re-render loops.
 *  - Rows have stable keys, so expanding/collapsing inserts/removes DOM rows
 *    instead of re-patching every row below the toggled one.
 *  - Event handling is delegated to the table (one listener, not one per row),
 *    the expand toggle is a plain <button> + inline SVG (no QBtn per row),
 *    and unchanged rows are memoized when rendering plain (non-reactive) data.
 *  - Optional virtual scrolling renders only the rows in the viewport.
 */
import {
  computed,
  defineComponent,
  h,
  isProxy,
  nextTick,
  onMounted,
  onUpdated,
  ref,
  shallowRef,
  toRaw,
  watch
} from 'vue'
import { QCheckbox, QIcon, QVirtualScroll, useQuasar } from 'quasar'

const EMPTY = Object.freeze([])
const EMPTY_SET = new Set()

const separatorValues = ['horizontal', 'vertical', 'cell', 'none']
const selectionValues = ['none', 'single', 'multiple']

// Material Design "add", "remove" and "arrow_upward" paths (Apache 2.0).
// Inline SVG keeps the component independent from any icon font.
const ICON_EXPAND = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'
const ICON_COLLAPSE = 'M19 13H5v-2h14v2z'
const ICON_SORT = 'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z'

const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, label, [role="button"], [contenteditable], .q-btn, .q-checkbox, .q-toggle, .q-radio'

let instanceSeed = 0

function colId (col) {
  return col.name !== undefined ? col.name : col.field
}

function getCellValue (col, node) {
  const field = col.field
  if (typeof field === 'function') return field(node)
  return node[field !== undefined ? field : col.name]
}

function toSortKey (type, value) {
  if (type === 'number') {
    const n = Number.parseFloat(value)
    return Number.isNaN(n) ? -Infinity : n
  }
  if (type === 'date') {
    const t = value instanceof Date ? value.getTime() : new Date(value).getTime()
    return Number.isNaN(t) ? -Infinity : t
  }
  if (value === null || value === undefined) return ''
  return typeof value === 'number' ? value : String(value).toLowerCase()
}

function compareKeys (a, b) {
  if (typeof a !== typeof b) {
    a = String(a)
    b = String(b)
  }
  return a > b ? 1 : (a < b ? -1 : 0)
}

/**
 * Returns a sorted copy of a sibling list (the original array is untouched).
 * Uses decorate-sort-undecorate so each sort key is computed once per node.
 */
function sortNodes (list, col, descending) {
  const dir = descending === true ? -1 : 1

  if (col.sortingType === 'custom' && typeof col.sortingFunc === 'function') {
    return list.slice().sort((a, b) => dir * col.sortingFunc(a, b))
  }

  if (typeof col.sort === 'function') {
    return list.slice().sort((a, b) =>
      dir * col.sort(getCellValue(col, a), getCellValue(col, b), a, b)
    )
  }

  const type = col.sortingType
  const decorated = new Array(list.length)
  for (let i = 0; i < list.length; i++) {
    decorated[i] = { node: list[i], key: toSortKey(type, getCellValue(col, list[i])) }
  }
  decorated.sort((x, y) => dir * compareKeys(x.key, y.key))

  const out = new Array(decorated.length)
  for (let i = 0; i < decorated.length; i++) out[i] = decorated[i].node
  return out
}

function svgIcon (d, cls) {
  return h('svg', { class: cls, viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' }, [
    h('path', { d })
  ])
}

function sameMemo (a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export default defineComponent({
  name: 'QHierarchy',

  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },

    // data model
    nodeKey: [String, Function],
    childrenKey: { type: String, default: 'children' },
    parentKey: String,
    treeColumn: String,

    // style (mirrors QMarkupTable)
    separator: {
      type: String,
      default: 'horizontal',
      validator: v => separatorValues.includes(v)
    },
    dense: Boolean,
    dark: { type: Boolean, default: null },
    flat: Boolean,
    bordered: Boolean,
    square: Boolean,
    wrapCells: Boolean,
    classes: [String, Array, Object],
    indent: { type: [Number, String], default: 30 },
    expandIcon: String,
    collapseIcon: String,

    // expansion
    defaultExpandAll: Boolean,
    defaultExpandLevel: { type: Number, default: 0 },
    expanded: { type: Array, default: undefined },
    expandOnRowClick: Boolean,
    expand_on_row_click: Boolean, // legacy alias

    // filtering
    filter: [String, Number],
    filterMethod: Function,
    filterMinLength: { type: Number, default: 3 },
    filterKeepDescendants: Boolean,

    // selection
    selection: {
      type: String,
      default: 'none',
      validator: v => selectionValues.includes(v)
    },
    selected: { type: Array, default: undefined },
    strictSelection: Boolean,

    // virtual scroll
    virtualScroll: Boolean,
    virtualScrollItemSize: { type: [Number, String], default: '' },
    virtualScrollSliceSize: { type: [Number, String], default: null },
    virtualScrollStickySizeStart: { type: [Number, String], default: '' },
    stickyHeader: Boolean,

    // labels / footer
    noDataLabel: { type: String, default: 'No data available' },
    noResultsLabel: { type: String, default: 'No matching records found' },
    footerText: String,
    footer_text: String, // legacy alias
    footerClass: [String, Array, Object],
    footer_class: [String, Array, Object] // legacy alias
  },

  emits: [
    'sort_column',
    'update:expanded',
    'update:selected',
    'lazy-load',
    'row-click',
    'row-dblclick'
  ],

  setup (props, { slots, emit, expose }) {
    const $q = useQuasar()
    const instanceId = 'qh' + (++instanceSeed) + '_'

    const rootRef = ref(null)
    const vsRef = ref(null)

    /** bumped by refresh() and lazy loading to force a re-flatten */
    const version = ref(0)

    const isDark = computed(() =>
      props.dark === null
        ? ($q !== undefined && $q.dark !== undefined ? $q.dark.isActive === true : false)
        : props.dark
    )

    const expandOnRowClick = computed(() => props.expandOnRowClick === true || props.expand_on_row_click === true)
    const footerText = computed(() => props.footerText !== undefined ? props.footerText : props.footer_text)
    const footerClass = computed(() => props.footerClass !== undefined ? props.footerClass : props.footer_class)
    const indentPx = computed(() => {
      const n = Number(props.indent)
      return Number.isNaN(n) ? 30 : n
    })

    // ------------------------------------------------------------------
    // Data access
    // ------------------------------------------------------------------

    const keyProp = computed(() => props.nodeKey || (props.parentKey ? 'id' : null))

    const keyFn = computed(() => {
      const k = keyProp.value
      if (typeof k === 'function') return k
      if (typeof k === 'string' && k !== '') return node => node[k]
      return node => toRaw(node)
    })

    const lazyState = shallowRef(new Map()) // key -> 'loading' | 'loaded'
    const lazyChildren = shallowRef(new Map()) // key -> children[]

    /** For self-referential (flat) data: parent key -> children[] */
    const flatIndex = computed(() => {
      if (!props.parentKey) return null
      version.value // eslint-disable-line no-unused-expressions

      const key = keyFn.value
      const parentKey = props.parentKey
      const list = props.data || EMPTY
      const keys = new Set()
      for (let i = 0; i < list.length; i++) keys.add(key(list[i]))

      const roots = []
      const childrenMap = new Map()
      for (let i = 0; i < list.length; i++) {
        const node = list[i]
        const p = node[parentKey]
        if (p === null || p === undefined || p === '' || p === key(node) || !keys.has(p)) {
          roots.push(node)
        }
        else {
          let arr = childrenMap.get(p)
          if (arr === undefined) childrenMap.set(p, (arr = []))
          arr.push(node)
        }
      }
      return { roots, childrenMap }
    })

    /**
     * Captures the current access strategy once, so hot loops don't hit
     * computed/props getters for every node.
     */
    function accessors () {
      const key = keyFn.value
      const fi = flatIndex.value
      const lc = lazyChildren.value
      const ck = props.childrenKey
      const hasLazy = lc.size > 0

      const children = fi !== null
        ? node => {
          const k = key(node)
          return fi.childrenMap.get(k) || (hasLazy ? lc.get(k) : undefined) || EMPTY
        }
        : node => {
          const c = node[ck]
          if (Array.isArray(c) && c.length > 0) return c
          return hasLazy ? (lc.get(key(node)) || EMPTY) : EMPTY
        }

      return {
        key,
        children,
        roots: fi !== null ? fi.roots : (props.data || EMPTY),
        lazy: lazyState.value
      }
    }

    const vnodeIds = new WeakMap()
    let vnodeSeed = 0

    function getRowId (node, key) {
      if (typeof key === 'string' || typeof key === 'number') return key
      const raw = toRaw(node)
      let id = vnodeIds.get(raw)
      if (id === undefined) {
        id = instanceId + (++vnodeSeed)
        vnodeIds.set(raw, id)
      }
      return id
    }

    function resolveKey (nodeOrKey) {
      return nodeOrKey !== null && typeof nodeOrKey === 'object'
        ? keyFn.value(nodeOrKey)
        : nodeOrKey
    }

    // ------------------------------------------------------------------
    // Expansion
    // ------------------------------------------------------------------

    const innerExpanded = shallowRef(new Set())
    const isExpandedControlled = computed(() => props.expanded !== undefined)

    const expandedSet = computed(() =>
      isExpandedControlled.value === true
        ? new Set(props.expanded.map(k => toRaw(k)))
        : innerExpanded.value
    )

    function commitExpanded (set) {
      if (isExpandedControlled.value !== true) innerExpanded.value = set
      emit('update:expanded', Array.from(set))
    }

    function collectExpandable (maxLevel) {
      const acc = accessors()
      const set = new Set()
      const stack = [[acc.roots, 0]]
      while (stack.length > 0) {
        const [list, level] = stack.pop()
        if (level >= maxLevel) continue
        for (let i = 0; i < list.length; i++) {
          const kids = acc.children(list[i])
          if (kids.length > 0) {
            set.add(acc.key(list[i]))
            stack.push([kids, level + 1])
          }
        }
      }
      return set
    }

    function defaultExpandedSet () {
      if (props.defaultExpandAll === true) return collectExpandable(Infinity)
      if (props.defaultExpandLevel > 0) return collectExpandable(props.defaultExpandLevel)
      return null
    }

    function applyDefaultExpansion () {
      const set = defaultExpandedSet()
      if (set === null) return
      if (isExpandedControlled.value === true) emit('update:expanded', Array.from(set))
      else innerExpanded.value = set
    }

    // filter mode keeps its own expansion state, so clearing the filter
    // restores the tree exactly as the user left it
    const filterToggles = shallowRef({ info: null, map: new Map() })

    // ------------------------------------------------------------------
    // Filtering
    // ------------------------------------------------------------------

    const filterTerm = computed(() => {
      const f = props.filter
      if (f === null || f === undefined) return ''
      const term = String(f).trim()
      return term.length >= props.filterMinLength ? term : ''
    })

    function makeMatcher (term) {
      const columns = props.columns || EMPTY

      if (typeof props.filterMethod === 'function') {
        const fn = props.filterMethod
        return node => fn(node, term, columns) === true
      }

      const filterable = columns.filter(col => col.filterable === true)
      const searchColumns = filterable.length > 0 ? filterable : columns
      const lower = term.toLowerCase()
      const num = Number.parseFloat(term)

      return node => {
        for (let i = 0; i < searchColumns.length; i++) {
          const col = searchColumns[i]
          const value = getCellValue(col, node)
          if (value === null || value === undefined) continue
          if (col.sortingType === 'number') {
            if (Number.parseFloat(value) === num) return true
          }
          else if (String(value).toLowerCase().indexOf(lower) !== -1) {
            return true
          }
        }
        return false
      }
    }

    /**
     * One post-order pass over the whole tree:
     *  visible -> matching nodes + their ancestors (+ descendants if requested)
     *  expand  -> ancestors of matches (auto-expanded while filtering)
     */
    const filterInfo = computed(() => {
      const term = filterTerm.value
      if (term === '') return null
      version.value // eslint-disable-line no-unused-expressions

      const acc = accessors()
      const match = makeMatcher(term)
      const keepDescendants = props.filterKeepDescendants === true
      const visible = new Set()
      const matched = new Set()
      const expand = new Set()

      // returns bit flags: 1 = something visible, 2 = a direct match below/at
      const walk = (list, ancestorMatched) => {
        let flags = 0
        for (let i = 0; i < list.length; i++) {
          const node = list[i]
          const key = acc.key(node)
          const hit = match(node)
          if (hit === true) matched.add(key)

          const kids = acc.children(node)
          const sub = kids.length > 0
            ? walk(kids, ancestorMatched || (keepDescendants && hit))
            : 0

          if (hit === true || sub !== 0 || ancestorMatched === true) {
            visible.add(key)
            flags |= 1
          }
          if ((sub & 2) !== 0) expand.add(key)
          if (hit === true || (sub & 2) !== 0) flags |= 2
        }
        return flags
      }

      walk(acc.roots, false)
      return { visible, matched, expand }
    })

    // ------------------------------------------------------------------
    // Sorting
    // ------------------------------------------------------------------

    const sortState = shallowRef({ name: null, descending: false })

    const sortColumn = computed(() => {
      const name = sortState.value.name
      if (name === null) return null
      return (props.columns || EMPTY).find(col => colId(col) === name) || null
    })

    const headerColumns = computed(() => {
      const { name, descending } = sortState.value
      return (props.columns || EMPTY).map(col => {
        const sorted = name !== null && colId(col) === name
        return {
          ...col,
          sorted,
          sortDirection: sorted === true ? (descending === true ? 'desc' : 'asc') : 'none'
        }
      })
    })

    function sortBy (col) {
      if (col === null || col === undefined) return
      const id = typeof col === 'object' ? colId(col) : col
      const current = sortState.value
      const descending = current.name === id ? !current.descending : false
      sortState.value = { name: id, descending }

      const original = (props.columns || EMPTY).find(c => colId(c) === id) || col
      emit('sort_column', {
        ...original,
        sorted: true,
        sortDirection: descending === true ? 'desc' : 'asc'
      })
    }

    function clearSort () {
      sortState.value = { name: null, descending: false }
    }

    // ------------------------------------------------------------------
    // Visible rows (the flattened tree)
    // ------------------------------------------------------------------

    const rows = computed(() => {
      version.value // eslint-disable-line no-unused-expressions

      const acc = accessors()
      const info = filterInfo.value
      const expanded = expandedSet.value
      const toggles = filterToggles.value
      const togglesApply = info !== null && toggles.info === info && toggles.map.size > 0
      const sortCol = sortColumn.value
      const descending = sortState.value.descending
      const lazy = acc.lazy

      const out = []
      const seen = new Set()

      const walk = (list, level, parent) => {
        let siblings = list
        if (info !== null) siblings = siblings.filter(node => info.visible.has(acc.key(node)))
        if (sortCol !== null && siblings.length > 1) siblings = sortNodes(siblings, sortCol, descending)

        const size = siblings.length
        for (let i = 0; i < size; i++) {
          const node = siblings[i]
          const key = acc.key(node)
          if (seen.has(key) === true) continue
          seen.add(key)

          const kids = acc.children(node)
          const state = lazy.size > 0 ? lazy.get(key) : undefined
          const hasChildren = kids.length > 0 || (node.lazy === true && state !== 'loaded')

          let isExpanded = false
          if (hasChildren === true) {
            if (info !== null) {
              isExpanded = togglesApply === true && toggles.map.has(key)
                ? toggles.map.get(key)
                : info.expand.has(key)
            }
            else {
              isExpanded = expanded.has(key)
            }
          }

          const row = {
            node,
            key,
            id: getRowId(node, key),
            index: out.length,
            level,
            parent,
            hasChildren,
            expanded: isExpanded,
            loading: state === 'loading',
            matched: info !== null && info.matched.has(key),
            posinset: i + 1,
            setsize: size
          }
          out.push(row)

          if (isExpanded === true && kids.length > 0) walk(kids, level + 1, row)
        }
      }

      walk(acc.roots, 0, null)
      return out
    })

    const rowsById = computed(() => {
      const map = new Map()
      const list = rows.value
      for (let i = 0; i < list.length; i++) map.set(list[i].id, list[i])
      return map
    })

    const rowsByNode = computed(() => {
      const map = new Map()
      const list = rows.value
      for (let i = 0; i < list.length; i++) map.set(toRaw(list[i].node), list[i])
      return map
    })

    function findRow (nodeOrKey) {
      if (nodeOrKey !== null && typeof nodeOrKey === 'object') {
        const row = rowsByNode.value.get(toRaw(nodeOrKey))
        if (row !== undefined) return row
      }
      const key = resolveKey(nodeOrKey)
      return rows.value.find(row => row.key === key)
    }

    // ------------------------------------------------------------------
    // Expand / collapse / lazy load
    // ------------------------------------------------------------------

    function startLazyLoad (node, key) {
      const loading = new Map(lazyState.value)
      loading.set(key, 'loading')
      lazyState.value = loading

      let settled = false
      emit('lazy-load', {
        node,
        key,
        done: children => {
          if (settled === true) return
          settled = true
          const kids = new Map(lazyChildren.value)
          kids.set(key, Array.isArray(children) ? children : [])
          lazyChildren.value = kids
          const state = new Map(lazyState.value)
          state.set(key, 'loaded')
          lazyState.value = state
        },
        fail: () => {
          if (settled === true) return
          settled = true
          const state = new Map(lazyState.value)
          state.delete(key)
          lazyState.value = state
          setExpanded(node, key, false)
        }
      })
    }

    function setExpanded (node, key, value) {
      const info = filterInfo.value
      if (info !== null) {
        const current = filterToggles.value
        const map = new Map(current.info === info ? current.map : undefined)
        map.set(key, value)
        filterToggles.value = { info, map }
      }
      else {
        const current = expandedSet.value
        if (current.has(key) === value) return
        const next = new Set(current)
        if (value === true) next.add(key)
        else next.delete(key)
        commitExpanded(next)
      }

      if (
        value === true &&
        node !== null &&
        node !== undefined &&
        node.lazy === true &&
        lazyState.value.get(key) === undefined &&
        accessors().children(node).length === 0
      ) {
        startLazyLoad(node, key)
      }
    }

    function toggleRow (row) {
      if (row.hasChildren !== true || row.loading === true) return
      setExpanded(row.node, row.key, !row.expanded)
    }

    function toggleNode (nodeOrKey) {
      const row = findRow(nodeOrKey)
      if (row !== undefined) toggleRow(row)
      else {
        const key = resolveKey(nodeOrKey)
        const node = typeof nodeOrKey === 'object' ? nodeOrKey : null
        setExpanded(node, key, !expandedSet.value.has(key))
      }
    }

    function expandNode (nodeOrKey) {
      const row = findRow(nodeOrKey)
      setExpanded(row !== undefined ? row.node : (typeof nodeOrKey === 'object' ? nodeOrKey : null), resolveKey(nodeOrKey), true)
    }

    function collapseNode (nodeOrKey) {
      setExpanded(null, resolveKey(nodeOrKey), false)
    }

    function isExpanded (nodeOrKey) {
      const row = findRow(nodeOrKey)
      if (row !== undefined) return row.expanded
      return expandedSet.value.has(resolveKey(nodeOrKey))
    }

    function expandAll () {
      if (filterInfo.value !== null) {
        filterToggles.value = { info: null, map: new Map() }
        return
      }
      commitExpanded(collectExpandable(Infinity))
    }

    function collapseAll () {
      const info = filterInfo.value
      if (info !== null) {
        const map = new Map()
        info.expand.forEach(key => map.set(key, false))
        filterToggles.value = { info, map }
        return
      }
      commitExpanded(new Set())
    }

    function expandToLevel (level) {
      commitExpanded(collectExpandable(Math.max(0, Number(level) || 0)))
    }

    // ------------------------------------------------------------------
    // Selection
    // ------------------------------------------------------------------

    const innerSelected = shallowRef(new Set())
    const hasSelection = computed(() => props.selection === 'single' || props.selection === 'multiple')
    const isCascade = computed(() => props.selection === 'multiple' && props.strictSelection !== true)

    const selectedSet = computed(() =>
      props.selected !== undefined
        ? new Set(props.selected.map(k => toRaw(k)))
        : innerSelected.value
    )

    function commitSelected (set) {
      if (props.selected === undefined) innerSelected.value = set
      emit('update:selected', Array.from(set))
    }

    /** key -> parent node; needed to normalise ancestors on cascade */
    const parentMap = computed(() => {
      version.value // eslint-disable-line no-unused-expressions
      const acc = accessors()
      const map = new Map()
      const stack = [[acc.roots, null]]
      while (stack.length > 0) {
        const [list, parent] = stack.pop()
        for (let i = 0; i < list.length; i++) {
          const node = list[i]
          const key = acc.key(node)
          if (map.has(key) === true) continue
          map.set(key, parent)
          const kids = acc.children(node)
          if (kids.length > 0) stack.push([kids, node])
        }
      }
      return map
    })

    /**
     * Cascade mode, normalised in one pass over the tree:
     *  effective -> selected keys, where a selected ancestor implies its
     *               descendants and a parent whose children are all
     *               selected counts as selected
     *  partial   -> nodes with some (but not all) selected descendants
     */
    const cascadeState = computed(() => {
      const selected = selectedSet.value
      if (isCascade.value !== true || selected.size === 0) {
        return { effective: selected, partial: EMPTY_SET }
      }
      version.value // eslint-disable-line no-unused-expressions

      const acc = accessors()
      const effective = new Set()
      const partial = new Set()

      // returns 2 = fully selected, 1 = partially, 0 = none
      const walk = (list, ancestorSelected) => {
        let all = list.length > 0
        let any = false
        for (let i = 0; i < list.length; i++) {
          const node = list[i]
          const key = acc.key(node)
          const own = ancestorSelected === true || selected.has(key)
          const kids = acc.children(node)
          let state = own === true ? 2 : 0
          if (kids.length > 0) {
            const sub = walk(kids, own)
            state = sub === 2 ? 2 : (own === true ? 2 : sub)
          }
          if (state === 2) effective.add(key)
          else if (state === 1) partial.add(key)
          if (state !== 2) all = false
          if (state !== 0) any = true
        }
        return all === true ? 2 : (any === true ? 1 : 0)
      }
      walk(acc.roots, false)

      return { effective, partial }
    })

    const partialSet = computed(() => cascadeState.value.partial)
    const effectiveSelected = computed(() => cascadeState.value.effective)

    /** true | false | null (indeterminate) */
    function selectionState (key) {
      if (effectiveSelected.value.has(key) === true) return true
      return partialSet.value.has(key) === true ? null : false
    }

    function setNodeSelected (node, value) {
      if (hasSelection.value !== true) return
      const acc = accessors()
      const key = acc.key(node)
      const current = effectiveSelected.value

      if (props.selection === 'single') {
        commitSelected(value === true ? new Set([key]) : new Set())
        return
      }

      const next = new Set(current)

      if (isCascade.value !== true) {
        if (value === true) next.add(key)
        else next.delete(key)
        commitSelected(next)
        return
      }

      // cascade down
      const stack = [node]
      while (stack.length > 0) {
        const n = stack.pop()
        if (value === true) next.add(acc.key(n))
        else next.delete(acc.key(n))
        const kids = acc.children(n)
        for (let i = 0; i < kids.length; i++) stack.push(kids[i])
      }

      // normalise ancestors: selected only if every child is selected
      const parents = parentMap.value
      let parent = parents.get(key)
      while (parent !== null && parent !== undefined) {
        const parentKey = acc.key(parent)
        const kids = acc.children(parent)
        let all = kids.length > 0
        for (let i = 0; i < kids.length; i++) {
          if (next.has(acc.key(kids[i])) !== true) {
            all = false
            break
          }
        }
        if (all === true) next.add(parentKey)
        else next.delete(parentKey)
        parent = parents.get(parentKey)
      }

      commitSelected(next)
    }

    function toggleSelection (node) {
      const key = keyFn.value(node)
      const state = selectionState(key)
      setNodeSelected(node, state !== true)
    }

    const allKeys = computed(() => Array.from(parentMap.value.keys()))

    const headerSelectionState = computed(() => {
      const size = effectiveSelected.value.size
      if (size === 0) return false
      return size >= allKeys.value.length ? true : null
    })

    function selectAll () {
      if (props.selection !== 'multiple') return
      commitSelected(new Set(allKeys.value))
    }

    function clearSelection () {
      commitSelected(new Set())
    }

    function getSelectedNodes () {
      const selected = effectiveSelected.value
      const acc = accessors()
      const out = []
      const stack = [acc.roots]
      while (stack.length > 0) {
        const list = stack.pop()
        for (let i = 0; i < list.length; i++) {
          if (selected.has(acc.key(list[i])) === true) out.push(list[i])
          const kids = acc.children(list[i])
          if (kids.length > 0) stack.push(kids)
        }
      }
      return out
    }

    // ------------------------------------------------------------------
    // Legacy slot helpers (kept for backwards compatibility)
    // ------------------------------------------------------------------

    function setPadding (item) {
      const row = rowsByNode.value.get(toRaw(item))
      return `padding-left: ${(row !== undefined ? row.level : 0) * indentPx.value}px;`
    }

    function iconName (item) {
      const row = rowsByNode.value.get(toRaw(item))
      if (row === undefined) return 'done'
      if (row.expanded === true) return 'remove'
      return row.hasChildren === true ? 'add' : 'done'
    }

    // ------------------------------------------------------------------
    // Keyboard navigation (WAI-ARIA treegrid, roving tabindex)
    // ------------------------------------------------------------------

    // intentionally NOT reactive: moving focus must not re-render the table
    let focusId = null

    function getRootEl () {
      if (props.virtualScroll === true) {
        const vs = vsRef.value
        return vs !== null && vs !== undefined ? (vs.$el || null) : null
      }
      return rootRef.value
    }

    function getRowEl (id) {
      const root = getRootEl()
      if (root === null) return null
      const value = String(id)
      const escaped = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(value)
        : value.replace(/["\\]/g, '\\$&')
      return root.querySelector(`tr[data-qh-id="${escaped}"]`)
    }

    function rowFromEvent (evt) {
      const root = getRootEl()
      if (root === null) return null
      const tr = evt.target.closest('tr[data-qh-id]')
      if (tr === null || tr.closest('.q-hierarchy') !== root) return null
      const row = rowsById.value.get(tr.dataset.qhId) ||
        rowsById.value.get(Number(tr.dataset.qhId))
      return row !== undefined ? { tr, row } : null
    }

    function applyRovingTabindex (el) {
      const root = getRootEl()
      if (root !== null) {
        const current = root.querySelectorAll('tr[data-qh-id][tabindex="0"]')
        for (let i = 0; i < current.length; i++) current[i].setAttribute('tabindex', '-1')
      }
      el.setAttribute('tabindex', '0')
    }

    function focusRow (index) {
      const list = rows.value
      if (list.length === 0) return
      const row = list[Math.max(0, Math.min(list.length - 1, index))]
      focusId = row.id

      const el = getRowEl(row.id)
      if (el !== null) {
        applyRovingTabindex(el)
        el.focus()
        return
      }

      if (props.virtualScroll === true && vsRef.value) {
        vsRef.value.scrollTo(row.index)
        nextTick(() => {
          requestAnimationFrame(() => {
            const target = getRowEl(row.id)
            if (target !== null) {
              applyRovingTabindex(target)
              target.focus()
            }
          })
        })
      }
    }

    function onKeydown (evt) {
      const hit = rowFromEvent(evt)
      if (hit === null || evt.target !== hit.tr) return
      const { row } = hit
      const list = rows.value

      switch (evt.key) {
        case 'ArrowDown': focusRow(row.index + 1); break
        case 'ArrowUp': focusRow(row.index - 1); break
        case 'PageDown': focusRow(row.index + 10); break
        case 'PageUp': focusRow(row.index - 10); break
        case 'Home': focusRow(0); break
        case 'End': focusRow(list.length - 1); break
        case 'ArrowRight':
          if (row.hasChildren === true && row.expanded !== true) toggleRow(row)
          else if (row.expanded === true && list[row.index + 1] !== undefined && list[row.index + 1].level > row.level) {
            focusRow(row.index + 1)
          }
          break
        case 'ArrowLeft':
          if (row.expanded === true) toggleRow(row)
          else if (row.parent !== null) focusRow(row.parent.index)
          break
        case 'Enter':
          if (row.hasChildren === true) toggleRow(row)
          else if (hasSelection.value === true) toggleSelection(row.node)
          break
        case ' ':
        case 'Spacebar':
          if (hasSelection.value === true) toggleSelection(row.node)
          else if (row.hasChildren === true) toggleRow(row)
          break
        default:
          return
      }

      evt.preventDefault()
    }

    function onClick (evt) {
      const hit = rowFromEvent(evt)
      if (hit === null) return
      const { tr, row } = hit

      if (evt.target.closest('[data-qh-toggle]') !== null) {
        toggleRow(row)
        return
      }
      if (evt.target.closest('.q-hierarchy__select-cell') !== null) return

      focusId = row.id
      applyRovingTabindex(tr)

      emit('row-click', evt, row.node, row.index)

      const interactive = evt.target.closest(INTERACTIVE_SELECTOR)
      if (interactive !== null && tr.contains(interactive)) return

      if (props.selection === 'single') toggleSelection(row.node)
      if (expandOnRowClick.value === true && slots.body === undefined) toggleRow(row)
    }

    function onDblclick (evt) {
      const hit = rowFromEvent(evt)
      if (hit !== null) emit('row-dblclick', evt, hit.row.node, hit.row.index)
    }

    // ------------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------------

    const visibleColumns = computed(() => props.columns || EMPTY)

    const treeColumnIndex = computed(() => {
      if (props.treeColumn === undefined) return 0
      const index = visibleColumns.value.findIndex(col => col.name === props.treeColumn)
      return index === -1 ? 0 : index
    })

    const colspan = computed(() => visibleColumns.value.length + (hasSelection.value === true ? 1 : 0))

    const itemSize = computed(() => {
      const size = Number(props.virtualScrollItemSize)
      return props.virtualScrollItemSize !== '' && Number.isNaN(size) === false
        ? size
        : (props.dense === true ? 28 : 48)
    })

    const stickySizeStart = computed(() => {
      const size = Number(props.virtualScrollStickySizeStart)
      return props.virtualScrollStickySizeStart !== '' && Number.isNaN(size) === false
        ? size
        : (props.dense === true ? 28 : 48)
    })

    /**
     * Memoization is only safe when nothing outside the row's own memo can
     * change its output: no user slots and plain (non-reactive) data.
     * (slots are not reactive, so this is evaluated on every render)
     */
    function canMemo () {
      if (slots.body !== undefined || isProxy(props.data) === true) return false
      for (const name in slots) {
        if (name === 'cell' || name.startsWith('cell-')) return false
      }
      return true
    }

    /** changes whenever anything that every row depends on changes */
    const renderEpoch = computed(() => ({
      columns: visibleColumns.value,
      treeColumn: treeColumnIndex.value,
      dark: isDark.value,
      dense: props.dense,
      indent: indentPx.value,
      expandIcon: props.expandIcon,
      collapseIcon: props.collapseIcon,
      selection: props.selection,
      version: version.value
    }))

    let memoCache = new Map()
    let nextMemoCache = new Map()

    function renderToggle (row) {
      if (row.hasChildren !== true) {
        return h('span', { class: 'q-hierarchy__toggle-spacer', 'aria-hidden': 'true' })
      }

      let icon
      if (row.loading === true) icon = h('span', { class: 'q-hierarchy__spinner', 'aria-hidden': 'true' })
      else if (row.expanded === true) {
        icon = props.collapseIcon !== undefined
          ? h(QIcon, { name: props.collapseIcon, class: 'q-hierarchy__toggle-icon' })
          : svgIcon(ICON_COLLAPSE, 'q-hierarchy__toggle-icon')
      }
      else {
        icon = props.expandIcon !== undefined
          ? h(QIcon, { name: props.expandIcon, class: 'q-hierarchy__toggle-icon' })
          : svgIcon(ICON_EXPAND, 'q-hierarchy__toggle-icon')
      }

      return h('button', {
        type: 'button',
        class: 'q-hierarchy__toggle' + (row.expanded === true ? ' q-hierarchy__toggle--expanded' : ''),
        tabindex: -1,
        'data-qh-toggle': '',
        'aria-label': row.expanded === true ? 'Collapse row' : 'Expand row'
      }, [icon])
    }

    function cellScope (row, col, value) {
      return {
        item: row.node,
        row,
        col,
        value: typeof col.format === 'function' ? col.format(value, row.node) : value,
        rawValue: value,
        level: row.level,
        expanded: row.expanded,
        hasChildren: row.hasChildren
      }
    }

    function renderCell (row, col, colIndex) {
      const raw = getCellValue(col, row.node)
      const slot = slots['cell-' + col.name] || slots.cell
      const content = slot !== undefined
        ? slot(cellScope(row, col, raw))
        : (typeof col.format === 'function' ? col.format(raw, row.node) : raw)

      const align = 'text-' + (col.align || 'left')

      if (colIndex === treeColumnIndex.value) {
        return h('td', { class: ['q-hierarchy__tree-cell', align, col.classes], style: col.style }, [
          h('div', {
            class: 'q-hierarchy__cell',
            style: row.level > 0 ? { paddingLeft: (row.level * indentPx.value) + 'px' } : undefined
          }, [
            renderToggle(row),
            h('span', { class: 'q-hierarchy__label' }, content)
          ])
        ])
      }

      return h('td', { class: [align, col.classes], style: col.style }, content)
    }

    function renderSelectCell (row, state) {
      return h('td', { class: 'q-hierarchy__select-cell' }, [
        h(QCheckbox, {
          modelValue: state,
          'onUpdate:modelValue': () => setNodeSelected(row.node, state !== true),
          dense: true,
          dark: isDark.value,
          tabindex: -1,
          'aria-label': 'Select row'
        })
      ])
    }

    function bodyScope (row) {
      return {
        item: row.node,
        row,
        key: row.key,
        index: row.index,
        level: row.level,
        expanded: row.expanded,
        hasChildren: row.hasChildren,
        loading: row.loading,
        selected: hasSelection.value === true ? selectionState(row.key) : false,
        columns: visibleColumns.value,
        toggle: toggleNode,
        setPadding,
        iconName,
        select: toggleSelection
      }
    }

    /** values every row of one render pass needs; read once, not per row */
    function createPass (memo) {
      const hasSel = hasSelection.value === true
      const activeFocus = focusId !== null && rowsById.value.has(focusId) === true ? focusId : null
      return {
        epoch: renderEpoch.value,
        memo,
        hasSel,
        selected: hasSel === true ? effectiveSelected.value : EMPTY_SET,
        partial: hasSel === true ? partialSet.value : EMPTY_SET,
        focusId: activeFocus
      }
    }

    function renderRow (row, pass) {
      const selected = pass.hasSel === true
        ? (pass.selected.has(row.key) === true ? true : (pass.partial.has(row.key) === true ? null : false))
        : false
      const focused = pass.focusId === null ? row.index === 0 : pass.focusId === row.id

      let deps
      if (pass.memo === true) {
        deps = [row.node, row.level, row.expanded, row.hasChildren, row.loading, row.matched, row.posinset, row.setsize, selected, focused, pass.epoch]
        const cached = memoCache.get(row.id)
        if (cached !== undefined && sameMemo(cached.memo, deps) === true) {
          nextMemoCache.set(row.id, cached)
          return cached
        }
      }

      const cells = []
      if (pass.hasSel === true) cells.push(renderSelectCell(row, selected))

      if (slots.body !== undefined) {
        const content = slots.body(bodyScope(row))
        if (content !== undefined) cells.push(...content)
      }
      else {
        const cols = visibleColumns.value
        for (let i = 0; i < cols.length; i++) cells.push(renderCell(row, cols[i], i))
      }

      const vnode = h('tr', {
        key: row.id,
        class: 'q-hierarchy__row' +
          (row.hasChildren === true ? ' q-hierarchy__row--parent' : '') +
          (selected === true ? ' selected' : '') +
          (row.matched === true ? ' q-hierarchy__row--match' : ''),
        'data-qh-id': row.id,
        tabindex: focused === true ? 0 : -1,
        'aria-level': row.level + 1,
        'aria-setsize': row.setsize,
        'aria-posinset': row.posinset,
        'aria-expanded': row.hasChildren === true ? (row.expanded === true ? 'true' : 'false') : undefined,
        'aria-selected': pass.hasSel === true ? (selected === true ? 'true' : 'false') : undefined
      }, cells)

      if (pass.memo === true) {
        vnode.memo = deps
        nextMemoCache.set(row.id, vnode)
      }

      return vnode
    }

    function renderHeaderCell (col) {
      const sortable = col.sortable === true
      const sorted = col.sorted === true
      const align = col.align || 'left'
      const children = [col.label !== undefined ? col.label : col.name]

      if (sortable === true) {
        const icon = h(QIcon, {
          class: 'q-table__sort-icon q-table__sort-icon--' + align,
          name: ICON_SORT
        })
        if (align === 'right') children.unshift(icon)
        else children.push(icon)
      }

      return h('th', {
        key: String(colId(col)),
        class: [
          'text-' + align,
          col.headerClasses,
          sortable === true ? 'sortable' : '',
          sorted === true ? 'sorted' : '',
          sorted === true && col.sortDirection === 'desc' ? 'sort-desc' : ''
        ],
        style: col.headerStyle,
        tabindex: sortable === true ? 0 : undefined,
        'aria-sort': sortable === true
          ? (sorted === true ? (col.sortDirection === 'desc' ? 'descending' : 'ascending') : 'none')
          : undefined,
        onClick: sortable === true ? () => sortBy(col) : undefined,
        onKeydown: sortable === true
          ? evt => {
            if (evt.key === 'Enter' || evt.key === ' ') {
              evt.preventDefault()
              sortBy(col)
            }
          }
          : undefined
      }, children)
    }

    function renderHeader () {
      const cells = []

      if (props.selection === 'multiple') {
        cells.push(h('th', { class: 'q-hierarchy__select-cell' }, [
          h(QCheckbox, {
            modelValue: headerSelectionState.value,
            'onUpdate:modelValue': () => {
              if (headerSelectionState.value === true) clearSelection()
              else selectAll()
            },
            dense: true,
            dark: isDark.value,
            'aria-label': 'Select all rows'
          })
        ]))
      }
      else if (props.selection === 'single') {
        cells.push(h('th', { class: 'q-hierarchy__select-cell' }))
      }

      if (slots.header !== undefined) {
        const content = slots.header({ columns: headerColumns.value, sortBy })
        if (content !== undefined) cells.push(...content)
      }
      else {
        const cols = headerColumns.value
        for (let i = 0; i < cols.length; i++) cells.push(renderHeaderCell(cols[i]))
      }

      return h('thead', [h('tr', { class: 'q-hierarchy__header-row' }, cells)])
    }

    function renderNoData () {
      const filtering = filterInfo.value !== null
      const message = filtering === true ? props.noResultsLabel : props.noDataLabel
      const content = slots['no-data'] !== undefined
        ? slots['no-data']({ message, filtering })
        : message
      return h('tr', { key: '__qh_no_data', class: 'q-hierarchy__no-data' }, [
        h('td', { colspan: colspan.value, class: 'text-center' }, content)
      ])
    }

    function hasFooter () {
      return slots.footer !== undefined || Boolean(footerText.value)
    }

    function renderFooterRow () {
      if (slots.footer !== undefined) {
        return h('tr', { key: '__qh_footer', class: 'q-hierarchy__footer-row' }, slots.footer({ columns: visibleColumns.value, rows: rows.value }))
      }
      if (footerText.value) {
        return h('tr', { key: '__qh_footer', class: 'q-hierarchy__footer-row' }, [
          h('td', { colspan: colspan.value, class: footerClass.value }, footerText.value)
        ])
      }
      return null
    }

    const rootClasses = computed(() => [
      'q-hierarchy',
      props.classes,
      {
        'q-hierarchy--sticky-header': props.stickyHeader === true || props.virtualScroll === true,
        'q-hierarchy--virtual': props.virtualScroll === true,
        'q-hierarchy--clickable': expandOnRowClick.value === true || props.selection === 'single'
      }
    ])

    const markupClasses = computed(() =>
      'q-markup-table q-table__container q-table__card' +
      ` q-table--${props.separator}-separator` +
      (isDark.value === true ? ' q-table--dark q-table__card--dark q-dark' : '') +
      (props.dense === true ? ' q-table--dense' : '') +
      (props.flat === true ? ' q-table--flat' : '') +
      (props.bordered === true ? ' q-table--bordered' : '') +
      (props.square === true ? ' q-table--square' : '') +
      (props.wrapCells === true ? '' : ' q-table--no-wrap')
    )

    function renderVirtual () {
      // only the rows in the viewport are rendered, so memoization adds
      // nothing here; drop any cache left over from non-virtual mode
      if (memoCache.size > 0) memoCache = new Map()

      const list = rows.value
      const vsProps = {
        ref: vsRef,
        type: 'table',
        class: rootClasses.value,
        items: list,
        separator: props.separator,
        dense: props.dense,
        dark: isDark.value,
        flat: props.flat,
        bordered: props.bordered,
        square: props.square,
        wrapCells: props.wrapCells,
        virtualScrollItemSize: itemSize.value,
        virtualScrollStickySizeStart: stickySizeStart.value,
        virtualScrollStickySizeEnd: hasFooter() === true ? itemSize.value : 0,
        onClick,
        onDblclick,
        onKeydown
      }
      if (props.virtualScrollSliceSize !== null) vsProps.virtualScrollSliceSize = props.virtualScrollSliceSize

      // QVirtualScroll calls the default slot from its own render, so the
      // pass is created lazily there (it re-renders on scroll on its own)
      let pass = null
      return h(QVirtualScroll, vsProps, {
        before: renderHeader,
        default: scope => {
          if (pass === null) pass = createPass(false)
          return renderRow(scope.item, pass)
        },
        after: () => {
          pass = null
          const out = []
          if (list.length === 0) out.push(h('tbody', { key: '__qh_empty' }, [renderNoData()]))
          const footer = renderFooterRow()
          if (footer !== null) out.push(h('tfoot', { key: '__qh_tfoot', class: 'q-hierarchy__footer' }, [footer]))
          return out
        }
      })
    }

    function renderTable () {
      const list = rows.value
      const pass = createPass(canMemo())

      nextMemoCache = new Map()
      const bodyRows = new Array(list.length)
      for (let i = 0; i < list.length; i++) bodyRows[i] = renderRow(list[i], pass)
      memoCache = nextMemoCache

      if (list.length === 0) bodyRows.push(renderNoData())
      const footer = renderFooterRow()
      if (footer !== null) bodyRows.push(footer)

      return h('div', {
        ref: rootRef,
        class: [markupClasses.value, rootClasses.value],
        onClick,
        onDblclick,
        onKeydown
      }, [
        h('table', {
          class: 'q-table',
          role: 'treegrid',
          'aria-multiselectable': props.selection === 'multiple' ? 'true' : undefined
        }, [
          renderHeader(),
          h('tbody', bodyRows)
        ])
      ])
    }

    // QVirtualScroll renders its own <table>; give it the treegrid role
    function syncVirtualTableRole () {
      if (props.virtualScroll !== true) return
      const root = getRootEl()
      const table = root !== null ? root.querySelector('table') : null
      if (table !== null && table.getAttribute('role') !== 'treegrid') {
        table.setAttribute('role', 'treegrid')
        if (props.selection === 'multiple') table.setAttribute('aria-multiselectable', 'true')
      }
    }

    // ------------------------------------------------------------------
    // Lifecycle
    // ------------------------------------------------------------------

    if (isExpandedControlled.value === true) {
      // don't emit during setup; respect an expanded model the parent already has
      onMounted(() => {
        if (props.expanded.length === 0) applyDefaultExpansion()
      })
    }
    else {
      applyDefaultExpansion()
    }

    watch(() => props.data, () => {
      if (lazyState.value.size > 0) lazyState.value = new Map()
      if (lazyChildren.value.size > 0) lazyChildren.value = new Map()
      applyDefaultExpansion()
    })

    watch(() => [props.defaultExpandAll, props.defaultExpandLevel], applyDefaultExpansion)

    onMounted(syncVirtualTableRole)
    onUpdated(syncVirtualTableRole)

    function refresh () {
      version.value++
    }

    function scrollTo (index, edge) {
      if (props.virtualScroll === true && vsRef.value) vsRef.value.scrollTo(index, edge)
      else {
        const row = rows.value[index]
        const el = row !== undefined ? getRowEl(row.id) : null
        if (el !== null) el.scrollIntoView({ block: 'nearest' })
      }
    }

    expose({
      expandAll,
      collapseAll,
      expandToLevel,
      expandNode,
      collapseNode,
      toggleNode,
      isExpanded,
      selectAll,
      clearSelection,
      getSelectedNodes,
      getVisibleRows: () => rows.value,
      sortBy,
      clearSort,
      refresh,
      scrollTo,
      focusRow,
      // legacy names
      toggle: toggleNode,
      setPadding,
      iconName
    })

    return () => (props.virtualScroll === true ? renderVirtual() : renderTable())
  }
})
</script>

<style>
.q-hierarchy__cell {
  display: flex;
  align-items: center;
  min-width: 0;
}

.q-hierarchy__label {
  min-width: 0;
}

.q-hierarchy__toggle,
.q-hierarchy__toggle-spacer {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  margin-right: 6px;
}

.q-hierarchy__toggle {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: background-color .15s ease;
}

.q-hierarchy__toggle:hover,
.q-hierarchy__toggle:focus-visible {
  background-color: rgba(0, 0, 0, .06);
  outline: none;
}

.q-table--dark .q-hierarchy__toggle:hover,
.q-table--dark .q-hierarchy__toggle:focus-visible {
  background-color: rgba(255, 255, 255, .1);
}

.q-hierarchy__toggle-icon {
  width: 20px;
  height: 20px;
  font-size: 20px;
  fill: currentColor;
}

.q-table--dense .q-hierarchy__toggle,
.q-table--dense .q-hierarchy__toggle-spacer {
  width: 24px;
  height: 24px;
  margin-right: 4px;
}

.q-table--dense .q-hierarchy__toggle-icon {
  width: 18px;
  height: 18px;
  font-size: 18px;
}

.q-hierarchy__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: q-hierarchy-spin .7s linear infinite;
}

@keyframes q-hierarchy-spin {
  to { transform: rotate(360deg); }
}

.q-hierarchy__row:focus {
  outline: none;
}

.q-hierarchy__row:focus-visible {
  outline: 2px solid var(--q-primary, #1976d2);
  outline-offset: -2px;
}

.q-hierarchy--clickable .q-hierarchy__row {
  cursor: pointer;
}

.q-hierarchy th.q-hierarchy__select-cell,
.q-hierarchy td.q-hierarchy__select-cell {
  width: 1px;
  padding-right: 0;
}

.q-hierarchy th.sortable:focus-visible {
  outline: 2px solid var(--q-primary, #1976d2);
  outline-offset: -2px;
}

.q-hierarchy--sticky-header thead tr th {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: var(--q-hierarchy-header-bg, #fff);
}

.q-hierarchy--sticky-header.q-table--dark thead tr th,
.q-hierarchy--sticky-header .q-table--dark thead tr th {
  background-color: var(--q-hierarchy-header-bg-dark, var(--q-dark, #1d1d1d));
}

.q-hierarchy--sticky-header tbody tr {
  scroll-margin-top: 48px;
}

.q-hierarchy--virtual tfoot td {
  height: 48px;
}

.q-hierarchy--virtual.q-table--dense tfoot td {
  height: 28px;
}
</style>
