# Solution Authoring Contract (Recursion Lab)

You are authoring **instrumented, step-by-step visualized solutions** for a DSA
learning dashboard. Each problem is a TypeScript module driven by the trace
engine in `src/engine/`. Read these files FIRST, in this order:

1. `src/engine/types.ts` — the `SolutionDef`, `TracerApi`, `InputSpec`, `Problem` contracts.
2. `src/solutions/sliding-window/minimum-size-subarray-sum.ts` — exemplar for **array-view** problems (pointers, marks, window).
3. `src/solutions/coin-change.ts` — exemplar for **recursion/memo (tree-view)** problems (`fn()` wrapper, `memo` proxy, input sanitation).
4. `src/solutions/grid/flood-fill.ts` — exemplar for **grid-view** problems (only if your batch has grid problems).
5. `src/solutions/linked-list/reverse-linked-list.ts` — exemplar for **linked-list** problems (array view + pointer badges + heap snapshots; there is NO list renderer).
6. `src/solutions/sliding-window/index.ts` — the batch index pattern.

## File layout you must produce

- One file per problem in `src/solutions/<YOUR_DIR>/<slug>.ts`, exporting a
  camelCase `SolutionDef` const.
- `src/solutions/<YOUR_DIR>/index.ts` exporting
  `export const <YOUR_EXPORT>: Problem[] = [...]` where each entry sets:
  `slug`, `title`, `neetcodeCategory` (the topic string you were given),
  `pattern` (`"dp"` if it uses the memo proxy, else `"recursion"`),
  `difficulty` (`"Easy" | "Medium" | "Hard"`, per LeetCode),
  `leetcodeUrl` (LC slug → full URL; non-LC → a Google search URL),
  `summary` (one punchy teaching line),
  `solution`, and **`time` and `space`** complexity strings (e.g. `"O(n log n)"`, `"O(2ⁿ)"`).
- Touch NOTHING outside `src/solutions/<YOUR_DIR>/`.

## Hard rules (every one is load-bearing)

1. **`code` (JS) and `codeJava` MUST be line-for-line aligned** — same line
   count, line k in one is line k in the other. The UI shows **Java**; make the
   Java idiomatic (real types, `Deque`, `int[]`, `Integer.MIN_VALUE`…), the JS
   clean. `line(n, msg)` indices are **0-based** into those lines — every
   `line()` call must point at the line actually being "executed".
2. **Narrate every meaningful step** via `line(n, msg)` with CONCRETE values in
   the message ("sum += nums[3] = 7 → sum = <b>12</b>"), using `<b>` for key
   values. Teach the pattern, not just the mechanics. Target **30–300 narrated
   steps** with default inputs (hard cap: 3000 calls / 400 recursion depth —
   the engine truncates beyond that).
3. **Inputs small and bounded**: `numbers` maxLen ≤ 12, `string` maxLen ≤ 14,
   `number` with tight min/max. **Sanitize inside `run()`** against values that
   diverge (e.g. zero/negative where the algorithm needs positives) — a user
   input must NEVER hang or blow the stack.
4. **Instrumentation by view**:
   - Array problems: `view: "array"`, `array: (a) => ...`, `ptr(name, i)`
     (−1 hides), `mark(kind, [...])` with kinds `window|focus|good|bad|done`
     (focus = current cell, window = active range, good = answer, bad = discard).
   - Grid problems: `view: "grid"`, `grid: (a) => ...`, `gptr/gmark/gset`.
   - Recursion: wrap EVERY recursive function with `fn(name, impl, sigLine)`.
     Iterative algorithms still wrap the main function once with `fn()`.
   - DP/memoization: use the `memo` proxy (keys `"i"` or `"i,j"`) — it renders
     the DP table automatically. Mirror a local plain map into `memo` if you
     need read-heavy logic (reads of existing keys emit events).
   - Auxiliary structures (queues, stacks, maps, results): `heap("name", value)`
     after every mutation. Use names `queue`/`stack` for frontiers and
     `order`/`output`/`visited` for processed items (the UI colors by these).
   - `vars({...})` to show the current frame's locals whenever they change.
5. `entry: (a) => "fnName(args)"` label; result returned from `run()` should be
   the problem's answer (stringify arrays).
6. TypeScript strict mode: no unused vars (prefix `_` if intentional), no `any`
   leaks beyond `args.x as T` casts.

## Self-verification (REQUIRED — iterate until green)

Replace `<DIR>`/`<EXPORT>` and run; fix every FAIL and TRUNC, enrich narration
on FEW (<10 steps), shrink defaults on MANY (>900 steps):

```bash
cat > /tmp/st-<DIR>.ts <<'EOF'
import { <EXPORT> } from '@/solutions/<DIR>';
import { trace, parseArgs, defaultRaw } from '@/engine/tracer';
import { buildTree, stepBoundaries, stateAt } from '@/engine/stateAt';
let fail = 0;
for (const p of <EXPORT>) {
  try {
    const args = parseArgs(p.solution, defaultRaw(p.solution));
    const res = trace(p.solution, args);
    const t = buildTree(res.events);
    const b = stepBoundaries(res.events);
    stateAt(res.events, b.length ? b[b.length - 1] : -1, t.byId, p.solution.array?.(args) ?? [], p.solution.grid?.(args) ?? []);
    const w = [res.truncated ? 'TRUNC' : '', b.length < 10 ? 'FEW' : '', b.length > 900 ? 'MANY' : ''].filter(Boolean).join(',');
    console.log(`${w ? 'WARN' : 'PASS'} ${p.slug} steps=${b.length} result=${JSON.stringify(res.result)?.slice(0, 30)} ${w}`);
    if (!p.time || !p.space) { console.log(`FAIL ${p.slug}: missing time/space`); fail++; }
  } catch (e) { fail++; console.log(`FAIL ${p.slug}: ${(e as Error).message}`); }
}
console.log(fail ? fail + ' FAILURES' : 'ALL PASS');
EOF
npx esbuild /tmp/st-<DIR>.ts --bundle --platform=node --alias:@=./src --outfile=/tmp/st-<DIR>.cjs --log-level=error && node /tmp/st-<DIR>.cjs
```

Then type-check and lint YOUR directory only:

```bash
npx tsc -p tsconfig.app.json --noEmit
npx eslint src/solutions/<DIR>
```

## Final report

List every slug with its step count and difficulty, flag anything you
deviated on, and confirm `ALL PASS` + clean tsc/eslint.
