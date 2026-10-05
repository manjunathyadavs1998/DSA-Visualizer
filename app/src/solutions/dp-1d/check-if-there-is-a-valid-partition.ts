import type { SolutionDef } from "@/engine/types"

export const checkIfThereIsAValidPartition: SolutionDef = {
  code: `// cut a valid pair/triple off the front, recurse on the rest
function valid(i) {
  if (i === n) return true;
  if (memo[i] !== undefined) return memo[i];
  let ok = false;
  if (i + 1 < n && a[i] === a[i + 1]) ok = valid(i + 2);
  if (!ok && i + 2 < n && a[i] === a[i + 1] && a[i + 1] === a[i + 2]) ok = valid(i + 3);
  if (!ok && i + 2 < n && a[i + 1] === a[i] + 1 && a[i + 2] === a[i] + 2) ok = valid(i + 3);
  memo[i] = ok;
  return ok;
}`,
  codeJava: `// int[] a; Boolean[] memo
boolean valid(int i) {
  if (i == n) return true;
  if (memo[i] != null) return memo[i];
  boolean ok = false;
  if (i + 1 < n && a[i] == a[i + 1]) ok = valid(i + 2);
  if (!ok && i + 2 < n && a[i] == a[i + 1] && a[i + 1] == a[i + 2]) ok = valid(i + 3);
  if (!ok && i + 2 < n && a[i + 1] == a[i] + 1 && a[i + 2] == a[i] + 2) ok = valid(i + 3);
  memo[i] = ok;
  return ok;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [4, 4, 4, 5, 6], maxLen: 10 }],
  entry: () => `valid(0)`,
  run({ fn, memo, line, vars, narrate }, args) {
    let a = (args.nums as number[]).map(Math.trunc)
    if (a.length < 2) a = [4, 4, 4, 5, 6]
    const n = a.length
    const valid = fn(
      "valid",
      (i: number): boolean => {
        line(2, `valid(${i}): every element consumed? (${i === n ? "<b>yes — the whole array partitioned!</b>" : "no"})`)
        if (i === n) return true
        line(3, `valid(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as boolean
        let ok = false
        line(5, `valid(${i}): equal PAIR [${a[i]}, ${a[i + 1] ?? "—"}]? ${i + 1 < n && a[i] === a[i + 1] ? "<b>yes → try valid(" + (i + 2) + ")</b>" : "no"}`)
        if (i + 1 < n && a[i] === a[i + 1]) ok = valid(i + 2)
        if (!ok) {
          line(6, `valid(${i}): equal TRIPLE [${a.slice(i, i + 3).join(", ")}]? ${i + 2 < n && a[i] === a[i + 1] && a[i + 1] === a[i + 2] ? "<b>yes → try valid(" + (i + 3) + ")</b>" : "no"}`)
          if (i + 2 < n && a[i] === a[i + 1] && a[i + 1] === a[i + 2]) ok = valid(i + 3)
        }
        if (!ok) {
          line(7, `valid(${i}): consecutive run [${a.slice(i, i + 3).join(", ")}] (x, x+1, x+2)? ${i + 2 < n && a[i + 1] === a[i] + 1 && a[i + 2] === a[i] + 2 ? "<b>yes → try valid(" + (i + 3) + ")</b>" : "no"}`)
          if (i + 2 < n && a[i + 1] === a[i] + 1 && a[i + 2] === a[i] + 2) ok = valid(i + 3)
        }
        vars({ i, ok })
        line(8, `valid(${i}) = <b>${ok}</b> → memo[${i}].`)
        memo[i] = ok
        return ok
      },
      1,
    )
    narrate("Only the FIRST chunk matters: if some legal pair/triple starts the array and the rest partitions, we win — classic suffix DP.")
    return valid(0)
  },
}
