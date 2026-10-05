import type { SolutionDef } from "@/engine/types"

export const editDistance: SolutionDef = {
  code: `// a and b are editable below
function ed(i, j) {
  if (i === a.length) return b.length - j; // insert the rest
  if (j === b.length) return a.length - i; // delete the rest
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (a[i] === b[j])
    memo[key] = ed(i + 1, j + 1);           // free match
  else
    memo[key] = 1 + Math.min(ed(i, j + 1),  // insert b[j]
      ed(i + 1, j),                         // delete a[i]
      ed(i + 1, j + 1));                    // replace a[i]
  return memo[key];
}`,
  codeJava: `// String a, b editable below; Map<String,Integer> memo
int ed(int i, int j) {
  if (i == a.length()) return b.length() - j; // insert rest
  if (j == b.length()) return a.length() - i; // delete rest
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (a.charAt(i) == b.charAt(j))
    memo.put(key, ed(i + 1, j + 1));          // free match
  else
    memo.put(key, 1 + Math.min(ed(i, j + 1),  // insert b[j]
      Math.min(ed(i + 1, j),                  // delete a[i]
      ed(i + 1, j + 1))));                    // replace a[i]
  return memo.get(key);
}`,
  inputs: [
    { kind: "string", name: "a", label: "a", default: "horse", maxLen: 5 },
    { kind: "string", name: "b", label: "b", default: "ros", maxLen: 5 },
  ],
  entry: (a) => `ed(0, 0)  // "${a.a}" → "${a.b}"`,
  run({ fn, memo, line, narrate }, args) {
    const a = args.a as string
    const b = args.b as string
    const ed = fn(
      "ed",
      (i: number, j: number): number => {
        line(2, `ed(${i},${j}): "${a.slice(i)}" → "${b.slice(j)}". Ran out of a? (${i === a.length ? `<b>yes — insert the ${b.length - j} leftover chars of b</b>` : "no"})`)
        if (i === a.length) return b.length - j
        line(3, `Ran out of b? (${j === b.length ? `<b>yes — delete the ${a.length - i} leftover chars of a</b>` : "no"})`)
        if (j === b.length) return a.length - i
        const key = i + "," + j
        line(5, `ed(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        if (a[i] === b[j]) {
          line(7, `'${a[i]}' == '${b[j]}' → <b>free match</b>, walk the diagonal: ed(${i + 1},${j + 1}).`)
          memo[key] = ed(i + 1, j + 1)
        } else {
          line(9, `'${a[i]}' ≠ '${b[j]}' → pay 1 and pick the cheapest fix: <b>insert</b> '${b[j]}', <b>delete</b> '${a[i]}', or <b>replace</b> '${a[i]}'→'${b[j]}'.`)
          memo[key] = 1 + Math.min(ed(i, j + 1), ed(i + 1, j), ed(i + 1, j + 1))
        }
        line(12, `ed(${i},${j}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    narrate("Matching chars walk the diagonal for free; a mismatch costs 1 via insert, delete, or replace.")
    return ed(0, 0)
  },
}
