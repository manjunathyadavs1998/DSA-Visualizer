import { Tracer } from './tracer';
import type { BinNode, HeapEntry, Problem, TraceStep } from '@/types/trace';

/* ------------------------------------------------------------------ */
/* 1. FACTORIAL                                                        */
/* ------------------------------------------------------------------ */

function genFactorial(n: number): TraceStep[] {
  const t = new Tracer();
  const note: HeapEntry = {
    id: 'note',
    kind: 'note',
    label: 'HEAP',
    note: 'No heap allocations in this algorithm — every value lives inside stack frames (parameter n, plus the return value handed back to the caller).',
  };
  t.setHeap([note]);
  let cid = 0;

  const rec = (k: number, parent: string | null, depth: number): number => {
    const id = `f${cid++}`;
    t.enter(id, `factorial(${k})`, parent, depth, [{ k: 'n', v: String(k) }], 0,
      `CALL factorial(${k}) — push frame #${depth + 1} onto the stack`);
    t.event(1, `factorial(${k}): test n <= 1 → ${k <= 1 ? 'TRUE' : 'FALSE'}`);
    if (k <= 1) {
      t.event(2, `BASE CASE reached — recursion stops here and returns 1`);
      t.exit(id, '1', 2, `factorial(${k}) = 1 — pop frame, return 1 to caller`);
      return 1;
    }
    t.event(4, `factorial(${k}): must wait — needs factorial(${k - 1}) before it can multiply`);
    const sub = rec(k - 1, id, depth + 1);
    t.setLocals(id, [{ k: 'n', v: String(k) }, { k: `factorial(${k - 1})`, v: String(sub) }]);
    t.event(4, `factorial(${k}): child returned ${sub} → compute ${k} × ${sub} = ${k * sub}`);
    t.exit(id, String(k * sub), 4, `factorial(${k}) = ${k * sub} — pop frame, return to caller`);
    return k * sub;
  };

  rec(n, null, 0);
  t.event(-1, `DONE — factorial(${n}) = ${rec0(n)}. Stack is empty, tree fully resolved.`);
  return t.steps;
}

function rec0(n: number): number {
  return n <= 1 ? 1 : n * rec0(n - 1);
}

/* ------------------------------------------------------------------ */
/* 2. FIBONACCI                                                        */
/* ------------------------------------------------------------------ */

function genFib(n: number): TraceStep[] {
  const t = new Tracer();
  t.setHeap([{
    id: 'note',
    kind: 'note',
    label: 'HEAP',
    note: 'Naive recursion recomputes the same subproblems over and over — watch identical nodes appear in the tree. That wasted work is exactly why the call count explodes.',
  }]);
  let cid = 0;

  const rec = (k: number, parent: string | null, depth: number): number => {
    const id = `f${cid++}`;
    t.enter(id, `fib(${k})`, parent, depth, [{ k: 'n', v: String(k) }], 0,
      `CALL fib(${k}) — push frame #${depth + 1}`);
    t.event(1, `fib(${k}): test n <= 1 → ${k <= 1 ? 'TRUE' : 'FALSE'}`);
    if (k <= 1) {
      t.event(2, `BASE CASE — fib(${k}) = ${k} by definition`);
      t.exit(id, String(k), 2, `fib(${k}) = ${k} — pop frame`);
      return k;
    }
    t.event(4, `fib(${k}): first compute left = fib(${k - 1})`);
    const left = rec(k - 1, id, depth + 1);
    t.setLocals(id, [{ k: 'n', v: String(k) }, { k: 'left', v: String(left) }]);
    t.event(4, `fib(${k}): left = ${left} — now the right branch`);
    t.event(5, `fib(${k}): compute right = fib(${k - 2})`);
    const right = rec(k - 2, id, depth + 1);
    t.setLocals(id, [{ k: 'n', v: String(k) }, { k: 'left', v: String(left) }, { k: 'right', v: String(right) }]);
    t.event(6, `fib(${k}): left + right = ${left} + ${right} = ${left + right}`);
    t.exit(id, String(left + right), 6, `fib(${k}) = ${left + right} — pop frame`);
    return left + right;
  };

  const ans = rec(n, null, 0);
  t.event(-1, `DONE — fib(${n}) = ${ans}. Count the duplicate subtrees: that is the O(2ⁿ) cost.`);
  return t.steps;
}

/* ------------------------------------------------------------------ */
/* 3. BINARY SEARCH                                                    */
/* ------------------------------------------------------------------ */

const BS_ARRAY = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const BS_TARGETS = [23, 72, 2, 91, 60];

function bsHeap(lo: number, hi: number, mid: number | null): HeapEntry[] {
  const faded: number[] = [];
  BS_ARRAY.forEach((_, i) => {
    if (i < lo || i > hi) faded.push(i);
  });
  return [{
    id: 'arr',
    kind: 'array',
    label: 'a[] — sorted array in heap memory',
    values: BS_ARRAY,
    highlight: mid !== null ? [mid] : [],
    faded,
    pointers: [
      { index: lo, name: 'lo' },
      { index: hi, name: 'hi' },
      ...(mid !== null ? [{ index: mid, name: 'mid' }] : []),
    ],
  }];
}

function genBinarySearch(ti: number): TraceStep[] {
  const target = BS_TARGETS[Math.min(Math.max(ti, 0), BS_TARGETS.length - 1)];
  const t = new Tracer();
  t.setHeap(bsHeap(0, BS_ARRAY.length - 1, null));
  let cid = 0;

  const rec = (lo: number, hi: number, parent: string | null, depth: number): number => {
    const id = `b${cid++}`;
    t.setHeap(bsHeap(lo, hi, null));
    t.enter(id, `search(${lo}..${hi})`, parent, depth,
      [{ k: 'lo', v: String(lo) }, { k: 'hi', v: String(hi) }, { k: 'target', v: String(target) }], 0,
      `CALL binarySearch(a, ${lo}, ${hi}, ${target}) — search window [${lo}..${hi}]`);
    t.event(1, `test lo > hi → ${lo} > ${hi} ? ${lo > hi ? 'TRUE — window is empty' : 'FALSE'}`);
    if (lo > hi) {
      t.event(2, `BASE CASE — window empty, ${target} is not in the array`);
      t.exit(id, '-1', 2, `return -1 (not found) — pop frame`);
      return -1;
    }
    const mid = (lo + hi) >> 1;
    t.setLocals(id, [{ k: 'lo', v: String(lo) }, { k: 'hi', v: String(hi) }, { k: 'mid', v: String(mid) }, { k: 'target', v: String(target) }]);
    t.setHeap(bsHeap(lo, hi, mid));
    t.event(4, `mid = (${lo} + ${hi}) / 2 = ${mid} → a[${mid}] = ${BS_ARRAY[mid]}`);
    t.event(5, `compare a[mid] = ${BS_ARRAY[mid]} with target ${target}`);
    if (BS_ARRAY[mid] === target) {
      t.event(6, `FOUND — a[${mid}] == ${target}, return index ${mid}`);
      t.exit(id, String(mid), 6, `return ${mid} — answer propagates up the whole chain`);
      return mid;
    }
    if (BS_ARRAY[mid] < target) {
      t.event(9, `${BS_ARRAY[mid]} < ${target} → discard left half, search [${mid + 1}..${hi}]`);
      const r = rec(mid + 1, hi, id, depth + 1);
      t.setHeap(bsHeap(lo, hi, mid));
      t.event(9, `child returned ${r} — pass it straight up`);
      t.exit(id, String(r), 9, `search(${lo}..${hi}) returns ${r} — pop frame`);
      return r;
    }
    t.event(11, `${BS_ARRAY[mid]} > ${target} → discard right half, search [${lo}..${mid - 1}]`);
    const r = rec(lo, mid - 1, id, depth + 1);
    t.setHeap(bsHeap(lo, hi, mid));
    t.event(11, `child returned ${r} — pass it straight up`);
    t.exit(id, String(r), 11, `search(${lo}..${hi}) returns ${r} — pop frame`);
    return r;
  };

  const ans = rec(0, BS_ARRAY.length - 1, null, 0);
  t.event(-1, ans === -1
    ? `DONE — ${target} not found (returned -1). Only ${Math.ceil(Math.log2(BS_ARRAY.length + 1))} probes for 10 elements.`
    : `DONE — ${target} found at index ${ans}. Halving the window each call is why this is O(log n).`);
  return t.steps;
}

/* ------------------------------------------------------------------ */
/* 4. MERGE SORT                                                       */
/* ------------------------------------------------------------------ */

const MS_START = [38, 27, 43, 3, 9, 82, 10];

function genMergeSort(input: number[]): TraceStep[] {
  const t = new Tracer();
  const arr = input.length >= 2 ? [...input] : [...MS_START];
  const main = (highlight: number[] = [], lo?: number, hi?: number): HeapEntry => {
    const faded: number[] = [];
    if (lo !== undefined && hi !== undefined) {
      arr.forEach((_, i) => {
        if (i < lo || i > hi) faded.push(i);
      });
    }
    return { id: 'arr', kind: 'array', label: 'a[] — the array being sorted (heap)', values: [...arr], highlight, faded };
  };
  t.setHeap([main()]);
  let cid = 0;

  const rec = (lo: number, hi: number, parent: string | null, depth: number): void => {
    const id = `m${cid++}`;
    t.setHeap([main([], lo, hi)]);
    t.enter(id, `sort(${lo}..${hi})`, parent, depth, [{ k: 'lo', v: String(lo) }, { k: 'hi', v: String(hi) }], 0,
      `CALL mergeSort(a, ${lo}, ${hi}) — segment [${arr.slice(lo, hi + 1).join(', ')}]`);
    t.event(1, `test lo >= hi → ${lo} >= ${hi} ? ${lo >= hi ? 'TRUE' : 'FALSE'}`);
    if (lo >= hi) {
      t.setHeap([main([lo])]);
      t.event(2, `BASE CASE — a single element [${arr[lo]}] is already sorted`);
      t.exit(id, `[${arr[lo]}]`, 2, `sort(${lo}..${hi}) done — pop frame`);
      return;
    }
    const mid = (lo + hi) >> 1;
    t.setLocals(id, [{ k: 'lo', v: String(lo) }, { k: 'mid', v: String(mid) }, { k: 'hi', v: String(hi) }]);
    t.event(4, `mid = ${mid} — split [${lo}..${hi}] into [${lo}..${mid}] and [${mid + 1}..${hi}]`);
    t.event(5, `sort the LEFT half first`);
    rec(lo, mid, id, depth + 1);
    t.setHeap([main([], lo, hi)]);
    t.event(6, `left half sorted [${arr.slice(lo, mid + 1).join(', ')}] — now the RIGHT half`);
    rec(mid + 1, hi, id, depth + 1);
    t.event(7, `MERGE [${lo}..${mid}] + [${mid + 1}..${hi}] — walk both halves with two pointers`);

    const L = arr.slice(lo, mid + 1);
    const R = arr.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;
    while (i < L.length && j < R.length) {
      t.setHeap([
        main([k], lo, hi),
        { id: 'L', kind: 'array', label: `L[] — copy of a[${lo}..${mid}]`, values: [...L], highlight: [i] },
        { id: 'R', kind: 'array', label: `R[] — copy of a[${mid + 1}..${hi}]`, values: [...R], highlight: [j] },
      ]);
      const pickL = L[i] <= R[j];
      t.event(7, `compare L[${i}]=${L[i]} vs R[${j}]=${R[j]} → take ${pickL ? L[i] : R[j]} into a[${k}]`);
      arr[k] = pickL ? L[i++] : R[j++];
      t.setHeap([
        main([k], lo, hi),
        { id: 'L', kind: 'array', label: `L[] — copy of a[${lo}..${mid}]`, values: [...L], highlight: i < L.length ? [i] : [] },
        { id: 'R', kind: 'array', label: `R[] — copy of a[${mid + 1}..${hi}]`, values: [...R], highlight: j < R.length ? [j] : [] },
      ]);
      t.event(7, `a[${k}] = ${arr[k]} — segment is now [${arr.slice(lo, k + 1).join(', ')}…]`);
      k++;
    }
    while (i < L.length) {
      arr[k] = L[i++];
      t.setHeap([main([k], lo, hi), { id: 'L', kind: 'array', label: 'L[] — draining leftovers', values: [...L], highlight: i - 1 >= 0 ? [i - 1] : [] }]);
      t.event(7, `R exhausted — copy leftover L: a[${k}] = ${arr[k]}`);
      k++;
    }
    while (j < R.length) {
      arr[k] = R[j++];
      t.setHeap([main([k], lo, hi), { id: 'R', kind: 'array', label: 'R[] — draining leftovers', values: [...R], highlight: j - 1 >= 0 ? [j - 1] : [] }]);
      t.event(7, `L exhausted — copy leftover R: a[${k}] = ${arr[k]}`);
      k++;
    }
    t.setHeap([main(arr.slice(lo, hi + 1).map((_, x) => lo + x), lo, hi)]);
    t.event(7, `merged segment [${lo}..${hi}] = [${arr.slice(lo, hi + 1).join(', ')}]`);
    t.exit(id, `[${arr.slice(lo, hi + 1).join(' ')}]`, 7, `sort(${lo}..${hi}) done — pop frame`);
  };

  rec(0, arr.length - 1, null, 0);
  t.setHeap([main(arr.map((_, x) => x))]);
  t.event(-1, `DONE — sorted array [${arr.join(', ')}]. Every level merges n elements total, and there are log n levels → O(n log n).`);
  return t.steps;
}

/* ------------------------------------------------------------------ */
/* 5. TOWER OF HANOI                                                   */
/* ------------------------------------------------------------------ */

function genHanoi(n: number): TraceStep[] {
  const t = new Tracer();
  const pegs: number[][] = [[], [], []];
  for (let d = n; d >= 1; d--) pegs[0].push(d);
  const names = ['A', 'B', 'C'];
  const heapOf = (): HeapEntry[] => [{
    id: 'pegs',
    kind: 'towers',
    label: 'PEGS — rods in memory',
    towers: pegs.map((p) => [...p]),
    pegNames: [...names],
  }];
  t.setHeap(heapOf());
  let cid = 0;
  let moves = 0;

  const rec = (k: number, from: number, to: number, aux: number, parent: string | null, depth: number): void => {
    const id = `h${cid++}`;
    t.enter(id, `hanoi(${k}, ${names[from]}→${names[to]})`, parent, depth,
      [{ k: 'n', v: String(k) }, { k: 'from', v: names[from] }, { k: 'to', v: names[to] }, { k: 'aux', v: names[aux] }], 0,
      `CALL hanoi(${k}, ${names[from]}, ${names[to]}, ${names[aux]}) — move ${k} disk${k > 1 ? 's' : ''} from ${names[from]} to ${names[to]}`);
    t.event(1, `test n == 1 → ${k === 1 ? 'TRUE' : 'FALSE'}`);
    if (k === 1) {
      const d = pegs[from].pop()!;
      pegs[to].push(d);
      moves++;
      t.setHeap(heapOf());
      t.event(2, `MOVE disk ${d}: ${names[from]} → ${names[to]} (move #${moves})`);
      t.exit(id, '', 3, `hanoi(1) complete — pop frame`);
      return;
    }
    t.event(5, `Step 1: move top ${k - 1} disks off the big disk → ${names[from]} to ${names[aux]}`);
    rec(k - 1, from, aux, to, id, depth + 1);
    t.event(6, `Step 2: the big disk ${k} is free — move it ${names[from]} → ${names[to]}`);
    const d = pegs[from].pop()!;
    pegs[to].push(d);
    moves++;
    t.setHeap(heapOf());
    t.event(6, `MOVE disk ${d}: ${names[from]} → ${names[to]} (move #${moves})`);
    t.event(7, `Step 3: move the ${k - 1} parked disks ${names[aux]} → ${names[to]} onto disk ${k}`);
    rec(k - 1, aux, to, from, id, depth + 1);
    t.exit(id, '', 7, `hanoi(${k}, ${names[from]}→${names[to]}) complete — pop frame`);
  };

  rec(n, 0, 2, 1, null, 0);
  t.event(-1, `DONE — ${moves} moves for ${n} disks. That is exactly 2^${n} − 1 = ${Math.pow(2, n) - 1}.`);
  return t.steps;
}

/* ------------------------------------------------------------------ */
/* 6. MAX DEPTH OF BINARY TREE                                         */
/* ------------------------------------------------------------------ */

const TREE_NODES: BinNode[] = [
  { id: 'n3', label: '3', x: 110, y: 24, parentId: null },
  { id: 'n9', label: '9', x: 58, y: 74, parentId: 'n3' },
  { id: 'n20', label: '20', x: 162, y: 74, parentId: 'n3' },
  { id: 'n15', label: '15', x: 128, y: 124, parentId: 'n20' },
  { id: 'n7', label: '7', x: 196, y: 124, parentId: 'n20' },
];

interface TN { v: string; left: TN | null; right: TN | null; id: string }

function buildTree(): TN {
  const n9: TN = { v: '9', left: null, right: null, id: 'n9' };
  const n15: TN = { v: '15', left: null, right: null, id: 'n15' };
  const n7: TN = { v: '7', left: null, right: null, id: 'n7' };
  const n20: TN = { v: '20', left: n15, right: n7, id: 'n20' };
  return { v: '3', left: n9, right: n20, id: 'n3' };
}

function genTreeDepth(): TraceStep[] {
  const t = new Tracer();
  const heapOf = (current: string | null): HeapEntry[] => [{
    id: 'tree',
    kind: 'bintree',
    label: 'INPUT TREE — nodes live on the heap, linked by references',
    treeData: { nodes: TREE_NODES, current },
  }];
  t.setHeap(heapOf(null));
  let cid = 0;

  const rec = (node: TN | null, parent: string | null, depth: number): number => {
    const id = `d${cid++}`;
    const label = node ? `depth(${node.v})` : 'depth(null)';
    t.setHeap(heapOf(node ? node.id : null));
    t.enter(id, label, parent, depth, [{ k: 'node', v: node ? node.v : 'null' }], 0,
      node ? `CALL maxDepth(node ${node.v}) — follow the reference into the heap` : `CALL maxDepth(null) — empty reference`);
    t.event(1, `test node == null → ${node === null ? 'TRUE' : 'FALSE'}`);
    if (!node) {
      t.event(2, `BASE CASE — an empty subtree contributes depth 0`);
      t.exit(id, '0', 2, `maxDepth(null) = 0 — pop frame`);
      return 0;
    }
    t.event(4, `depth(${node.v}): explore LEFT subtree first`);
    const l = rec(node.left, id, depth + 1);
    t.setHeap(heapOf(node.id));
    t.setLocals(id, [{ k: 'node', v: node.v }, { k: 'left', v: String(l) }]);
    t.event(5, `depth(${node.v}): left = ${l} — explore RIGHT subtree`);
    const r = rec(node.right, id, depth + 1);
    t.setHeap(heapOf(node.id));
    t.setLocals(id, [{ k: 'node', v: node.v }, { k: 'left', v: String(l) }, { k: 'right', v: String(r) }]);
    t.event(6, `depth(${node.v}): max(${l}, ${r}) + 1 = ${Math.max(l, r) + 1}`);
    t.exit(id, String(Math.max(l, r) + 1), 6, `maxDepth(node ${node.v}) = ${Math.max(l, r) + 1} — pop frame`);
    return Math.max(l, r) + 1;
  };

  const ans = rec(buildTree(), null, 0);
  t.setHeap(heapOf(null));
  t.event(-1, `DONE — the tree has depth ${ans}. Notice how the recursion tree on the left mirrors the shape of the input tree.`);
  return t.steps;
}

/* ------------------------------------------------------------------ */
/* PROBLEM CATALOGUE                                                   */
/* ------------------------------------------------------------------ */

export const PROBLEMS: Problem[] = [
  {
    id: 'factorial',
    num: '01',
    title: 'Factorial',
    tag: 'LINEAR',
    desc: 'The hello-world of recursion. One call per level, one long chain down, then the results multiply back up. Perfect for watching the stack grow and unwind.',
    time: 'O(n)',
    space: 'O(n)',
    recurrence: 'T(n) = T(n−1) + O(1)',
    code: [
      'int factorial(int n) {',
      '    if (n <= 1) {',
      '        return 1;            // base case',
      '    }',
      '    return n * factorial(n - 1);',
      '}',
    ],
    input: { kind: 'number', label: 'n', min: 1, max: 8, def: 5 },
    generate: (v) => genFactorial(v as number),
  },
  {
    id: 'fibonacci',
    num: '02',
    title: 'Fibonacci',
    tag: 'TREE',
    desc: 'Two recursive calls per level create a binary call tree — and massive duplicate work. Watch the same subproblems light up again and again.',
    time: 'O(2ⁿ)',
    space: 'O(n)',
    recurrence: 'T(n) = T(n−1) + T(n−2) + O(1)',
    code: [
      'int fib(int n) {',
      '    if (n <= 1) {',
      '        return n;            // base case',
      '    }',
      '    int left  = fib(n - 1);',
      '    int right = fib(n - 2);',
      '    return left + right;',
      '}',
    ],
    input: { kind: 'number', label: 'n', min: 1, max: 7, def: 5 },
    generate: (v) => genFib(v as number),
  },
  {
    id: 'binary-search',
    num: '03',
    title: 'Binary Search',
    tag: 'DIVIDE',
    desc: 'Each call halves the search window. The recursion tree is a single narrow path — but the array panel shows exactly which slice of memory each call can see.',
    time: 'O(log n)',
    space: 'O(log n)',
    recurrence: 'T(n) = T(n/2) + O(1)',
    code: [
      'int binarySearch(int[] a, int lo, int hi, int target) {',
      '    if (lo > hi) {',
      '        return -1;           // not found',
      '    }',
      '    int mid = (lo + hi) / 2;',
      '    if (a[mid] == target) {',
      '        return mid;          // found',
      '    }',
      '    if (a[mid] < target) {',
      '        return binarySearch(a, mid + 1, hi, target);',
      '    }',
      '    return binarySearch(a, lo, mid - 1, target);',
      '}',
    ],
    input: { kind: 'number', label: 'target', min: 0, max: 4, def: 0, format: (v) => String(BS_TARGETS[Math.min(Math.max(v, 0), 4)]) },
    generate: (v) => genBinarySearch(v as number),
  },
  {
    id: 'merge-sort',
    num: '04',
    title: 'Merge Sort',
    tag: 'DIVIDE',
    desc: 'Split all the way down to single elements, then merge back up in order. The heap panel shows the two-pointer merge copying values into the real array.',
    time: 'O(n log n)',
    space: 'O(n)',
    recurrence: 'T(n) = 2T(n/2) + O(n)',
    code: [
      'void mergeSort(int[] a, int lo, int hi) {',
      '    if (lo >= hi) {',
      '        return;              // single element',
      '    }',
      '    int mid = (lo + hi) / 2;',
      '    mergeSort(a, lo, mid);       // left half',
      '    mergeSort(a, mid + 1, hi);   // right half',
      '    merge(a, lo, mid, hi);       // stitch together',
      '}',
    ],
    input: { kind: 'array', label: 'a[]', def: MS_START, minLen: 2, maxLen: 10, minVal: -99, maxVal: 999 },
    generate: (v) => genMergeSort(v as number[]),
  },
  {
    id: 'hanoi',
    num: '05',
    title: 'Tower of Hanoi',
    tag: 'TREE',
    desc: 'Move n disks by trusting recursion with n−1. Three rods live in memory — watch every disk move land as the call tree grows to 2ⁿ − 1 moves.',
    time: 'O(2ⁿ)',
    space: 'O(n)',
    recurrence: 'T(n) = 2T(n−1) + O(1)',
    code: [
      'void hanoi(int n, char from, char to, char aux) {',
      '    if (n == 1) {',
      '        move(from, to);      // move disk 1',
      '        return;',
      '    }',
      '    hanoi(n - 1, from, aux, to);',
      '    move(from, to);          // move disk n',
      '    hanoi(n - 1, aux, to, from);',
      '}',
    ],
    input: { kind: 'number', label: 'disks', min: 1, max: 5, def: 3 },
    generate: (v) => genHanoi(v as number),
  },
  {
    id: 'tree-depth',
    num: '06',
    title: 'Max Depth of Tree',
    tag: 'DFS',
    desc: 'Recursion that walks a real heap structure. The call tree mirrors the input tree — including the invisible null calls that terminate every branch.',
    time: 'O(n)',
    space: 'O(h)',
    recurrence: 'T(n) = T(L) + T(R) + O(1)',
    code: [
      'int maxDepth(TreeNode node) {',
      '    if (node == null) {',
      '        return 0;            // base case',
      '    }',
      '    int left  = maxDepth(node.left);',
      '    int right = maxDepth(node.right);',
      '    return Math.max(left, right) + 1;',
      '}',
    ],
    input: null,
    generate: () => genTreeDepth(),
  },
];
