/** Highlight kinds for array cells. */
export type MarkKind = "window" | "focus" | "good" | "bad" | "done"

/** One entry in the recorded execution trace. The whole UI derives from these. */
export type TraceEvent =
  | { t: "call"; id: number; parent: number | null; label: string; line?: number }
  | { t: "ret"; id: number; value: string }
  | { t: "line"; id: number | null; line: number; msg: string }
  | { t: "mset"; id: number | null; key: string; value: unknown }
  | { t: "mget"; id: number | null; key: string; value: unknown }
  | { t: "vars"; id: number | null; vars: Record<string, string> }
  | { t: "ptr"; name: string; index: number }
  | { t: "mark"; kind: MarkKind; indices: number[] }
  | { t: "aset"; index: number; value: number | string }
  | { t: "gptr"; name: string; r: number; c: number }
  | { t: "gmark"; kind: MarkKind; cells: [number, number][] }
  | { t: "gset"; r: number; c: number; value: number | string }
  | { t: "hset"; name: string; value: unknown }
  | { t: "lnode"; id: number; val: number | string; row: number }
  | { t: "lnext"; id: number; target: number | null; kind: string }
  | { t: "lptr"; name: string; id: number | null }
  | { t: "lmark"; kind: MarkKind; ids: number[] }
  | { t: "narrate"; msg: string }

export interface TracerApi {
  /** Wrap a recursive function so calls/returns are auto-traced.
   *  `sigLine` = 0-based line of the function signature in `code` (highlighted on call). */
  fn: <A extends unknown[], R>(name: string, impl: (...args: A) => R, sigLine?: number) => (...args: A) => R
  /** Auto-traced memo table; reads that hit and all writes become events. */
  memo: Record<string, unknown>
  /** Highlight a 0-based code line with a dry-run commentary step. */
  line: (n: number, msg: string) => void
  /** Update the current stack frame's local variables (shown in the Call Stack). */
  vars: (v: Record<string, unknown>) => void
  /** Move a named pointer on the array view. Pass -1 to hide it. */
  ptr: (name: string, index: number) => void
  /** Highlight array cells; replaces the previous highlight of the same kind. */
  mark: (kind: MarkKind, indices: number[]) => void
  /** Mutate one cell of the displayed array. */
  aset: (index: number, value: number | string) => void
  /** Grid: move a named 2D pointer. r = -1 → column-header pointer; c = -1 → row-header pointer. */
  gptr: (name: string, r: number, c: number) => void
  /** Grid: highlight cells; replaces the previous highlight of the same kind. */
  gmark: (kind: MarkKind, cells: [number, number][]) => void
  /** Grid: mutate one cell of the displayed grid. */
  gset: (r: number, c: number, value: number | string) => void
  /** Snapshot a heap-resident object (list/array/map) for the Heap Memory panel.
   *  Call after every mutation; the value is deep-copied at this instant. */
  heap: (name: string, value: unknown) => void
  /** Linked list: create a node (or update its value). `row` places multi-list problems
   *  on separate lines (0 = first list). Ids are any unique non-negative numbers. */
  lnode: (id: number, val: number | string, row?: number) => void
  /** Linked list: set a node's outgoing link. Re-setting an existing link animates as a
   *  hot "rewire" arrow. `kind` defaults to "next"; others ("random", "child") draw dashed. */
  lnext: (id: number, target: number | null, kind?: string) => void
  /** Linked list: move a named pointer badge onto a node (null = the ∅ slot, -1 = hide). */
  lptr: (name: string, id: number | null) => void
  /** Linked list: highlight nodes; replaces the previous highlight of the same kind. */
  lmark: (kind: MarkKind, ids: number[]) => void
  /** Optional extra commentary at the current point in the run. */
  narrate: (msg: string) => void
}

/** A user-editable input for a solution. */
export type InputSpec =
  | { kind: "number"; name: string; label: string; default: number; min: number; max: number }
  | { kind: "numbers"; name: string; label: string; default: number[]; maxLen: number }
  | { kind: "string"; name: string; label: string; default: string; maxLen: number }

export type Args = Record<string, unknown>

export interface SolutionDef {
  /** Display code (what the learner reads — clean, uninstrumented). */
  code: string
  /** Java version of the display code — MUST be line-for-line aligned with `code`
   *  so the line highlighting maps to both languages. */
  codeJava?: string
  /** Editable inputs shown above the visualization. */
  inputs: InputSpec[]
  /** "tree" (default) shows the recursion tree; "array"/"grid"/"list" show pointer views. */
  view?: "tree" | "array" | "grid" | "list"
  /** For view "array": the initial array to display (strings become char cells). */
  array?: (args: Args) => (number | string)[]
  /** For view "grid": the initial 2D matrix to display. */
  grid?: (args: Args) => (number | string)[][]
  /** Human label of the initial call for the given inputs. */
  entry: (args: Args) => string
  /** Execute the solution against the tracer; return the final answer. */
  run: (t: TracerApi, args: Args) => unknown
}

export interface Problem {
  slug: string
  title: string
  neetcodeCategory: string
  pattern: "recursion" | "dp"
  difficulty: "Easy" | "Medium" | "Hard"
  leetcodeUrl: string
  summary: string
  solution: SolutionDef
  /** Time complexity, e.g. "O(2ⁿ)" (shown in the metrics panel). */
  time?: string
  /** Auxiliary/stack space complexity, e.g. "O(n)". */
  space?: string
}

export interface TraceResult {
  events: TraceEvent[]
  result: unknown
  truncated: boolean
}

export interface TreeNode {
  id: number
  parent: number | null
  label: string
  children: TreeNode[]
  depth: number
  x: number
}

export type NodeState = {
  state: "active" | "waiting" | "done"
  value?: string
  memoHit?: boolean
}

export interface DerivedState {
  stack: { id: number; label: string; vars?: Record<string, string> }[]
  node: Record<number, NodeState>
  msg: string
  calls: number
  memo: Record<string, unknown>
  lastSet: string | null
  lastHit: string | null
  /** 0-based line of `code` to highlight, or null. */
  line: number | null
  /** Array view state. */
  arr: (number | string)[]
  ptrs: Record<string, number>
  marks: Record<string, number[]>
  /** Grid view state. */
  grid: (number | string)[][]
  gptrs: Record<string, [number, number]>
  gmarks: Record<string, [number, number][]>
  /** Heap memory panel: named objects and which of them changed this step. */
  heap: Record<string, unknown>
  lastHeap: string[]
  /** Linked-list view state. */
  lnodes: { id: number; val: number | string; row: number }[]
  llinks: Record<string, Record<number, number | null>>
  lptrs: Record<string, number | null>
  lmarks: Record<string, number[]>
  /** "kind:id" of links rewired in this step — drawn hot. */
  lastRewired: string[]
}
