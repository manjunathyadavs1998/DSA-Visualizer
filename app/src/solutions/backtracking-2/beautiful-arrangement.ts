import type { SolutionDef } from "@/engine/types"

export const beautifulArrangement: SolutionDef = {
  code: `// count perms of 1..n where every position divides
function backtrack(pos) {
  if (pos > n) {               // all positions filled
    count++;
    return;
  }
  for (let x = 1; x <= n; x++) {
    if (used[x]) continue;             // x already placed
    if (x % pos !== 0 && pos % x !== 0)
      continue;                        // not divisible either way
    used[x] = true;            // place x at position pos
    backtrack(pos + 1);
    used[x] = false;           // backtrack
  }
}`,
  codeJava: `// count perms of 1..n where every position divides
void backtrack(int pos) {
  if (pos > n) {               // all positions filled
    count++;
    return;
  }
  for (int x = 1; x <= n; x++) {
    if (used[x]) continue;             // x already placed
    if (x % pos != 0 && pos % x != 0)
      continue;                        // not divisible either way
    used[x] = true;            // place x at position pos
    backtrack(pos + 1);
    used[x] = false;           // backtrack
  }
}`,
  inputs: [{ kind: "number", name: "n", label: "n", default: 4, min: 1, max: 5 }],
  entry: () => `backtrack(1)`,
  run({ fn, heap, line, vars, narrate }, args) {
    const n = args.n as number
    const used: boolean[] = new Array(n + 1).fill(false)
    const perm: number[] = []
    let count = 0
    const backtrack = fn(
      "backtrack",
      (pos: number): string => {
        vars({ pos, perm: `[${perm.join(",")}]`, count })
        line(2, `pos = ${pos}: past position ${n}? (${pos > n ? "<b>yes — a full beautiful arrangement!</b>" : "no"})`)
        if (pos > n) {
          line(3, `<b>Leaf!</b> [${perm.join(",")}] works at every position → count = <b>${count + 1}</b>.`)
          count++
          heap("output", { count, lastFound: `[${perm.join(",")}]` })
          return `#${count}`
        }
        for (let x = 1; x <= n; x++) {
          if (used[x]) {
            line(7, `x = ${x} is already placed — skip.`)
            continue
          }
          if (x % pos !== 0 && pos % x !== 0) {
            line(9, `x = ${x} at position ${pos}: ${x} % ${pos} = ${x % pos} and ${pos} % ${x} = ${pos % x} — <b>neither divides</b>, prune the whole subtree.`)
            continue
          }
          line(10, `x = <b>${x}</b> fits position ${pos} (${x % pos === 0 ? `${x} % ${pos} = 0` : `${pos} % ${x} = 0`}) — place it.`)
          used[x] = true
          perm.push(x)
          heap("perm", perm)
          backtrack(pos + 1)
          line(12, `Backtrack: remove ${x} from position ${pos}.`)
          used[x] = false
          perm.pop()
          heap("perm", perm)
        }
        return "✓"
      },
      1,
    )
    narrate(`A permutation search where the divisibility check prunes early: position ${n <= 2 ? n : 3}+ rejects most numbers, so the tree stays far smaller than ${n}! = ${factorial(n)}.`)
    heap("perm", perm)
    heap("output", { count: 0, lastFound: "—" })
    backtrack(1)
    return count
  },
}

function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}
