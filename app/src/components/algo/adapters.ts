import type { DerivedState, TreeNode } from '@/engine/types';
import type { RTreeNode, StackFrame } from '@/types/trace';

/** Map the engine's replayed state onto the app's RecursionTree node model.
 *  Only nodes already called at this step are visible, so the tree grows live. */
export function toRTreeNodes(nodes: TreeNode[], st: DerivedState): RTreeNode[] {
  const topId = st.stack.length ? st.stack[st.stack.length - 1].id : null;
  const out: RTreeNode[] = [];
  for (const n of nodes) {
    const info = st.node[n.id];
    if (!info) continue; // not called yet at this step
    const status = n.id === topId ? 'current' : info.state === 'done' ? 'done' : 'active';
    out.push({
      id: String(n.id),
      parentId: n.parent === null ? null : String(n.parent),
      label: n.label,
      status,
      ret:
        info.state === 'done' && info.value !== undefined
          ? (info.memoHit ? '⚡' : '') + info.value
          : undefined,
      depth: n.depth,
    });
  }
  return out;
}

/** Map engine stack frames to the app's StackPanel model.
 *  Only the top frame knows the current line (-1 hides the line note). */
export function toStackFrames(st: DerivedState): StackFrame[] {
  return st.stack.map((f, i) => ({
    id: String(f.id),
    name: f.label,
    locals: Object.entries(f.vars ?? {}).map(([k, v]) => ({ k, v })),
    line: i === st.stack.length - 1 ? (st.line ?? -1) : -1,
  }));
}

/** Narration messages carry light HTML (<b>) — strip for the plain-text ticker. */
export const stripHtml = (s: string) => s.replace(/<[^>]+>/g, '');

/* ------- heuristics that light up the input tree/graph diagrams ------- */

/** The node currently being processed: first numeric argument of the top stack
 *  frame (call labels look like "dfs(4)" / "bfs(0)" / "depth(20)"). */
export function currentArgOf(st: DerivedState): number | null {
  const top = st.stack[st.stack.length - 1];
  if (!top) return null;
  const m = top.label.match(/\((-?\d+)/);
  return m ? Number(m[1]) : null;
}

/** Heap snapshot names whose values mean "processed / finished". */
export const DONE_KEYS = ['order', 'output', 'levelOrder', 'visited', 'returned'];
/** Heap snapshot names whose values mean "waiting in the frontier". */
export const FRONTIER_KEYS = ['queue', 'stack', 'finishStack'];

/** Collect numeric values from the named heap arrays (pairs contribute their
 *  first element — e.g. priority-queue entries like [node, dist]). */
export function heapValues(st: DerivedState, keys: string[]): Set<number> {
  const out = new Set<number>();
  for (const k of keys) {
    const v = st.heap[k];
    if (!Array.isArray(v)) continue;
    for (const x of v) {
      if (typeof x === 'number') out.add(x);
      else if (Array.isArray(x) && typeof x[0] === 'number') out.add(x[0]);
    }
  }
  return out;
}
