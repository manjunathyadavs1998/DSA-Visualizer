import type { SolutionDef } from "@/engine/types"

export const maximumLengthOfRepeatedSubarray: SolutionDef = {
  code: `// common(i,j) = length of the matching run starting at a[i], b[j]
function common(i, j) {
  if (i === a.length || j === b.length) return 0;
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  memo[key] = a[i] === b[j] ? 1 + common(i + 1, j + 1) : 0;
  return memo[key];
}
function findLength() {
  let best = 0;
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < b.length; j++)
      best = Math.max(best, common(i, j));
  return best;
}`,
  codeJava: `// common(i,j) = length of the matching run starting at a[i], b[j]
int common(int i, int j) {
  if (i == a.length || j == b.length) return 0;
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  memo.put(key, a[i] == b[j] ? 1 + common(i + 1, j + 1) : 0);
  return memo.get(key);
}
int findLength() {
  int best = 0;
  for (int i = 0; i < a.length; i++)
    for (int j = 0; j < b.length; j++)
      best = Math.max(best, common(i, j));
  return best;
}`,
  inputs: [
    { kind: "numbers", name: "a", label: "nums1", default: [1, 2, 3, 2, 1], maxLen: 5 },
    { kind: "numbers", name: "b", label: "nums2", default: [3, 2, 1, 4], maxLen: 5 },
  ],
  entry: (x) => `findLength()  // a=[${(x.a as number[]).join(",")}], b=[${(x.b as number[]).join(",")}]`,
  run({ fn, memo, line, vars, narrate }, args) {
    const a = (args.a as number[]).map((v) => Math.trunc(v))
    const b = (args.b as number[]).map((v) => Math.trunc(v))
    const common = fn(
      "common",
      (i: number, j: number): number => {
        line(2, `common(${i},${j}): ran off either array? (${i === a.length || j === b.length ? "<b>yes — run length 0</b>" : "no"})`)
        if (i === a.length || j === b.length) return 0
        const key = i + "," + j
        line(4, `common(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        line(5, `a[${i}]=${a[i]} vs b[${j}]=${b[j]}: ${a[i] === b[j] ? "<b>match → 1 + the run continuing diagonally</b>" : "<b>mismatch → the run dies here (0, NOT skip!)</b>"}.`)
        memo[key] = a[i] === b[j] ? 1 + common(i + 1, j + 1) : 0
        line(6, `common(${i},${j}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    const findLength = fn(
      "findLength",
      (): number => {
        let best = 0
        for (let i = 0; i < a.length; i++)
          for (let j = 0; j < b.length; j++) {
            line(12, `driver: how long is the common run starting at (a[${i}], b[${j}])?`)
            best = Math.max(best, common(i, j))
            line(12, `best so far = <b>${best}</b>.`)
            vars({ i, j, best })
          }
        line(13, `longest common SUBARRAY (contiguous!) = <b>${best}</b>.`)
        return best
      },
      8,
    )
    narrate("LCS's evil twin: subARRAYS are contiguous, so a mismatch resets to 0 instead of skipping — and the answer is the max cell, not the corner.")
    return findLength()
  },
}
