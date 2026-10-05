import type { HeapEntry, LocalVar, RTreeNode, StackFrame, TraceStep } from '@/types/trace';

/**
 * Tracer records every meaningful event of a recursive execution as an
 * immutable snapshot. Stepping the UI = moving an index over `steps`,
 * so backward navigation is free and always consistent.
 */
export class Tracer {
  private frames: StackFrame[] = [];
  private nodes: RTreeNode[] = [];
  private rets = new Map<string, string>();
  private heap: HeapEntry[] = [];
  private calls = 0;
  private maxDepth = 0;
  readonly steps: TraceStep[] = [];

  constructor() {
    this.snapshot(-1, 'Ready. Press NEXT (or →) to start the dry run.');
  }

  setHeap(heap: HeapEntry[]) {
    this.heap = heap;
  }

  private treeWithStatus(): RTreeNode[] {
    const topId = this.frames.length ? this.frames[this.frames.length - 1].id : null;
    const onStack = new Set(this.frames.map((f) => f.id));
    return this.nodes.map((n) => {
      let status: RTreeNode['status'] = 'waiting';
      if (this.rets.has(n.id)) status = 'done';
      else if (n.id === topId) status = 'current';
      else if (onStack.has(n.id)) status = 'active';
      return { ...n, status, ret: this.rets.get(n.id) };
    });
  }

  private cloneHeap(): HeapEntry[] {
    return this.heap.map((h) => ({
      ...h,
      values: h.values ? [...h.values] : undefined,
      highlight: h.highlight ? [...h.highlight] : undefined,
      faded: h.faded ? [...h.faded] : undefined,
      pointers: h.pointers ? h.pointers.map((p) => ({ ...p })) : undefined,
      towers: h.towers ? h.towers.map((t) => [...t]) : undefined,
      pegNames: h.pegNames ? [...h.pegNames] : undefined,
      treeData: h.treeData
        ? { current: h.treeData.current, nodes: h.treeData.nodes.map((n) => ({ ...n })) }
        : undefined,
    }));
  }

  snapshot(line: number, message: string) {
    this.steps.push({
      line,
      message,
      stack: this.frames.map((f) => ({ ...f, locals: f.locals.map((l) => ({ ...l })) })),
      tree: this.treeWithStatus(),
      heap: this.cloneHeap(),
      calls: this.calls,
      depth: this.frames.length,
      maxDepth: this.maxDepth,
    });
  }

  enter(
    id: string,
    label: string,
    parentId: string | null,
    depth: number,
    locals: LocalVar[],
    line: number,
    message: string,
  ) {
    this.calls += 1;
    this.frames.push({ id, name: label, locals, line });
    this.nodes.push({ id, parentId, label, status: 'current', depth });
    this.maxDepth = Math.max(this.maxDepth, this.frames.length);
    this.snapshot(line, message);
  }

  event(line: number, message: string) {
    const top = this.frames[this.frames.length - 1];
    if (top) top.line = line;
    this.snapshot(line, message);
  }

  setLocals(id: string, locals: LocalVar[]) {
    const f = this.frames.find((fr) => fr.id === id);
    if (f) f.locals = locals;
  }

  exit(id: string, ret: string, line: number, message: string) {
    const top = this.frames[this.frames.length - 1];
    if (top) top.line = line;
    this.frames.pop();
    this.rets.set(id, ret);
    this.snapshot(line, message);
  }
}
