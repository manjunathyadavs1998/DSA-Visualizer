import type { DerivedState, TraceEvent, TreeNode } from "./types"
import { fmt } from "./tracer"

/** Indices of narration-bearing events. These are the user-visible playback steps;
 *  silent visual events (ptr/mark/vars/aset/g*) are coalesced into the narrated step
 *  that follows their emission, so narration, code highlight, and visuals stay in sync. */
export function stepBoundaries(events: TraceEvent[]): number[] {
  const NARRATED = new Set(["line", "call", "ret", "mset", "mget", "narrate"])
  const out: number[] = []
  for (let i = 0; i < events.length; i++) if (NARRATED.has(events[i].t)) out.push(i)
  // trailing silent events (final marks/cleanup) fold into one last step
  if (events.length && out[out.length - 1] !== events.length - 1) out.push(events.length - 1)
  return out.length ? out : events.map((_, i) => i)
}

const esc = (s: unknown) => String(s).replace(/</g, "&lt;")

/** Replay events[0..k] into a full UI state. Pure — enables scrub/step-back. */
export function stateAt(
  events: TraceEvent[],
  k: number,
  nodesById: Map<number, TreeNode>,
  initialArr: (number | string)[] = [],
  initialGrid: (number | string)[][] = [],
): DerivedState {
  const st: DerivedState = {
    stack: [], node: {}, msg: "", calls: 0, memo: {}, lastSet: null, lastHit: null, line: null,
    arr: [...initialArr], ptrs: {}, marks: {},
    grid: initialGrid.map((row) => [...row]), gptrs: {}, gmarks: {},
    heap: {}, lastHeap: [],
    lnodes: [], llinks: {}, lptrs: {}, lmarks: {}, lastRewired: [],
  }
  // heap writes are silent events that coalesce into the NEXT narrated step,
  // so "changed this step" is collected between narrated events
  let pendingHeap: string[] = []
  let pendingRewired: string[] = []
  const NARRATED = new Set(["line", "call", "ret", "mset", "mget", "narrate"])
  for (let i = 0; i <= k && i < events.length; i++) {
    const e = events[i]
    st.lastSet = st.lastHit = null
    if (NARRATED.has(e.t)) {
      st.lastHeap = pendingHeap
      pendingHeap = []
      st.lastRewired = pendingRewired
      pendingRewired = []
    }
    if (e.t === "hset") {
      st.heap[e.name] = e.value
      pendingHeap.push(e.name)
    } else if (e.t === "lnode") {
      const nd = st.lnodes.find((n) => n.id === e.id)
      if (nd) {
        nd.val = e.val
        nd.row = e.row
      } else st.lnodes.push({ id: e.id, val: e.val, row: e.row })
    } else if (e.t === "lnext") {
      const links = (st.llinks[e.kind] ??= {})
      // only a CHANGE of an existing link is a "rewire" — initial wiring stays quiet
      if (e.id in links && links[e.id] !== e.target) pendingRewired.push(`${e.kind}:${e.id}`)
      links[e.id] = e.target
    } else if (e.t === "lptr") {
      if (e.id === -1) delete st.lptrs[e.name]
      else st.lptrs[e.name] = e.id
    } else if (e.t === "lmark") {
      st.lmarks[e.kind] = e.ids
    } else if (e.t === "gptr") {
      if (e.r === -2) delete st.gptrs[e.name]
      else st.gptrs[e.name] = [e.r, e.c]
    } else if (e.t === "gmark") {
      st.gmarks[e.kind] = e.cells
    } else if (e.t === "gset") {
      st.grid[e.r][e.c] = e.value
    } else if (e.t === "vars") {
      const f = st.stack.find((f) => f.id === e.id)
      if (f) f.vars = { ...f.vars, ...e.vars }
    } else if (e.t === "ptr") {
      if (e.index < 0) delete st.ptrs[e.name]
      else st.ptrs[e.name] = e.index
    } else if (e.t === "mark") {
      st.marks[e.kind] = e.indices
    } else if (e.t === "aset") {
      st.arr[e.index] = e.value
    } else if (e.t === "line") {
      st.line = e.line
      st.msg = e.msg
    } else if (e.t === "call") {
      if (e.line !== undefined) st.line = e.line
      st.calls++
      if (st.stack.length) st.node[st.stack[st.stack.length - 1].id].state = "waiting"
      st.stack.push({ id: e.id, label: e.label })
      st.node[e.id] = { state: "active" }
      st.msg = `<b>${esc(e.label)}</b> is called — frame pushed onto the stack.`
    } else if (e.t === "ret") {
      const info = st.node[e.id]
      info.state = "done"
      info.value = e.value
      st.stack.pop()
      if (st.stack.length) st.node[st.stack[st.stack.length - 1].id].state = "active"
      const label = nodesById.get(e.id)?.label ?? ""
      st.msg = `${esc(label)} returns <b>${esc(e.value)}</b> — frame popped${info.memoHit ? " (answer straight from the memo — no recursion)" : ""}.`
    } else if (e.t === "mset") {
      st.memo[e.key] = e.value
      st.lastSet = e.key
      st.msg = `Table updated: <b>[${esc(e.key)}] = ${esc(fmt(e.value))}</b>.`
    } else if (e.t === "mget") {
      if (e.id !== null && st.node[e.id]) st.node[e.id].memoHit = true
      st.lastHit = e.key
      st.msg = `<b>Cache hit!</b> memo[${esc(e.key)}] already holds ${esc(fmt(e.value))} — reused instantly, whole subtree skipped.`
    } else if (e.t === "narrate") {
      st.msg = e.msg
    }
  }
  // trailing silent heap writes / rewires (folded into the final step) still highlight
  if (pendingHeap.length) st.lastHeap = pendingHeap
  if (pendingRewired.length) st.lastRewired = pendingRewired
  return st
}

/** Build the (static) call tree with x/depth layout from a full trace. */
export function buildTree(events: TraceEvent[]): { nodes: TreeNode[]; byId: Map<number, TreeNode> } {
  const nodes: TreeNode[] = []
  const byId = new Map<number, TreeNode>()
  for (const e of events) {
    if (e.t !== "call") continue
    const nd: TreeNode = { id: e.id, parent: e.parent, label: e.label, children: [], depth: 0, x: 0 }
    byId.set(e.id, nd)
    nodes.push(nd)
    if (e.parent !== null) {
      const p = byId.get(e.parent)
      if (p) {
        nd.depth = p.depth + 1
        p.children.push(nd)
      }
    }
  }
  let leafX = 0
  const place = (nd: TreeNode) => {
    if (!nd.children.length) {
      nd.x = leafX++
      return
    }
    nd.children.forEach(place)
    nd.x = (nd.children[0].x + nd.children[nd.children.length - 1].x) / 2
  }
  if (nodes.length) place(nodes[0])
  return { nodes, byId }
}
