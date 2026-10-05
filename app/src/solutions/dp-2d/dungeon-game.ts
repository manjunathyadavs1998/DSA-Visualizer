import type { SolutionDef, Args } from "@/engine/types"

// flat list → square dungeon (values clamped to a demo-friendly range)
const toGrid = (raw: unknown): number[][] => {
  const flat = (Array.isArray(raw) ? (raw as number[]) : []).map((v) => Math.max(-99, Math.min(99, Math.trunc(v))))
  const n = Math.max(1, Math.min(3, Math.floor(Math.sqrt(flat.length))))
  if (flat.length < n * n) return [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]
  return Array.from({ length: n }, (_, r) => flat.slice(r * n, r * n + n))
}

export const dungeonGame: SolutionDef = {
  view: "grid",
  grid: (a: Args) => toGrid(a.cells).map((r) => [...r]),
  code: `// need(r,c) = min health to ENTER (r,c) and still reach the princess
function need(r, c) {
  if (r === n || c === n) return INF;
  const key = r + "," + c;
  if (memo[key] !== undefined) return memo[key];
  let next;
  if (r === n - 1 && c === n - 1) next = 1;
  else next = Math.min(need(r + 1, c), need(r, c + 1));
  memo[key] = Math.max(1, next - d[r][c]);
  return memo[key];
}`,
  codeJava: `// int INF = 1_000_000; need(r,c) = min health to ENTER (r,c)
int need(int r, int c) {
  if (r == n || c == n) return INF;
  String key = r + "," + c;
  if (memo.get(key) != null) return memo.get(key);
  int next;
  if (r == n - 1 && c == n - 1) next = 1;
  else next = Math.min(need(r + 1, c), need(r, c + 1));
  memo.put(key, Math.max(1, next - d[r][c]));
  return memo.get(key);
}`,
  inputs: [
    { kind: "numbers", name: "cells", label: "dungeon (flat, 9 = 3×3)", default: [-2, -3, 3, -5, -10, 1, 10, 30, -5], maxLen: 9 },
  ],
  entry: () => `need(0, 0)  // min starting health for the knight`,
  run({ fn, memo, line, gptr, gmark, narrate }, args) {
    const d = toGrid(args.cells)
    const n = d.length
    const INF = 1_000_000
    const need = fn(
      "need",
      (r: number, c: number): number => {
        line(2, `need(${r},${c}): off the dungeon? (${r === n || c === n ? "<b>yes — INF, never go this way</b>" : "no"})`)
        if (r === n || c === n) return INF
        gptr("rc", r, c)
        const key = r + "," + c
        line(4, `need(${r},${c}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        let next: number
        if (r === n - 1 && c === n - 1) {
          line(6, `(${r},${c}) is the <b>princess's cell</b> — the knight must leave it with ≥ 1 HP.`)
          next = 1
          gmark("good", [[r, c]])
        } else {
          line(7, `need the cheaper onward demand: min(need(${r + 1},${c}), need(${r},${c + 1})).`)
          next = Math.min(need(r + 1, c), need(r, c + 1))
        }
        memo[key] = Math.max(1, next - d[r][c])
        line(8, `cell ${d[r][c] >= 0 ? "heals" : "costs"} ${d[r][c]} → need max(1, ${next} − (${d[r][c]})) = <b>${memo[key]}</b> HP entering (${r},${c}).`)
        return memo[key] as number
      },
      1,
    )
    narrate("Forward DP fails here — big potions later can't excuse dying early. So solve BACKWARD: how much health must I carry INTO each cell?")
    return need(0, 0)
  },
}
